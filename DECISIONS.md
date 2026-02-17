# Design Decisions

## Decision: userId-Based Cart (No Sessions/Cookies)

**Context:** How should we identify which cart belongs to which user? Traditional web apps use sessions and cookies, but this is a backend API.

**Options Considered:**
- Option A: Use `express-session` with cookies for cart management
- Option B: Simple `userId` field passed in request body, mapped to a `Map<string, CartItem[]>` on the server

**Choice:** Option B — userId-based Map

**Why:** passing `userId` in the request body is stateless from the HTTP perspective, and makes API testing straightforward.
The trade-off is that anyone can access any cart by knowing the userId — in a real system, this would be replaced by JWT authentication.

---

## Decision: In-Memory Data Store

**Context:** application needs a data persistence layer to store data. question - whether to use a real database or keep things simple?

**Options Considered:**
- Option A: use db for real persistence
- Option B: in-memory

**Choice:** Option B

**Why:** using a real database would add setup complexity (connection strings, migrations, docker) without adding value for the scope of this exercise. The in-memory approach boots instantly, has zero dependencies, and is easy to reason about. The trade-off is that data doesn't survive server restarts, which is acceptable here. If this were production, the service layer is already abstracted enough to swap in a real database with minimal refactoring.

---

## Decision: Admin-Triggered Coupon Generation

**Context:** when should discount codes be generated? Automatically at checkout, or manually by an admin?

**Options Considered:**
- Option A: auto-generate at checkout — include the coupon code in the checkout response
- Option B: admin API endpoint

**Choice:** Option B

**Why:** while auto-generation provides better UX (the customer sees the reward instantly), admin-triggered generation gives the business control over when and how discounts are issued. This also keeps the checkout flow simple — it only applies existing codes, it doesn't generate new ones. The separation of concerns makes each endpoint easier to test and reason about independently.

---

## Decision: Discount Code Status Flag vs. Deletion

**Context:** after a discount code is used at checkout, should it be deleted from the store or just marked as used?

**Options Considered:**
- Option A: Delete the code after use (simple, saves memory)
- Option B: Keep the code with a `status: 'used' | 'unused'` flag and a `usedAt` timestamp

**Choice:** Option B — Status flag

**Why:** The assignment requires an admin stats endpoint that shows discount codes and total discounts. If we delete used codes, we lose that audit trail. The status flag lets the analytics API answer questions like: "How many codes were generated? How many were used? How many are still unused?" The `usedAt` timestamp adds further insight. The small memory overhead is negligible for the assignment's scale, and the richer data model makes the analytics endpoint much more useful.

---

## Decision: Service Layer for Business Logic

**Context:** where should the core business logic (calculate totals, validate discounts, generate codes) live? Inline in route handlers, or separated into its own layer?

**Options Considered:**
- Option A: Write all logic directly in Express route handlers/controllers (inline approach)
- Option B: Extract logic into a dedicated Service Layer (`cart.service.ts`, `checkout.service.ts`, `discount.service.ts`)

**Choice:** Option B — Service Layer

**Why:** The service layer pattern provides three critical benefits:
1. **Testability** — Unit tests call service functions directly without needing HTTP requests or mocking Express. This makes tests fast, reliable, and focused.
2. **Separation of Concerns** — Controllers only handle request parsing and response formatting. Services own the business rules. This makes each layer easier to change independently.
3. **Reusability** — The checkout logic can be called from any entry point (REST API, CLI tool, future GraphQL layer) without duplication.

The trade-off is slightly more files and indirection, but for a project with non-trivial logic (discount validation, order counting, analytics aggregation), the clarity is worth it.

---

## Decision: Monorepo with Separate `/client` Folder

**Context:** The assignment says "frontend is a plus." How should the React frontend be structured relative to the existing Express backend?

**Options Considered:**
- Option A: Fully integrated — serve React from Express (single `package.json`)
- Option B: Separate `/client` folder with its own `package.json` (monorepo-style)
- Option C: Completely separate repository

**Choice:** Option B — Monorepo with `/client` folder

**Why:** This gives clean separation while keeping everything in one repo for review. The backend and frontend have independent dependencies, dev servers, and build processes. Vite's proxy forwards API calls to Express during development, so CORS "just works." This is the standard pattern used by most production teams and signals understanding of modular architecture. The trade-off is two `npm install` commands, but the structure neatly mirrors how fullstack teams actually operate.

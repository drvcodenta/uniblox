# Uniblox Ecommerce Store

A full-stack ecommerce application with cart, checkout, discount engine, and admin dashboard. Built with **Node.js + TypeScript + Express** (backend) and **React + TypeScript + Tailwind CSS** (frontend).

## Quick Start

```bash
# ── Backend ──
npm install
npm run dev          # Starts Express on http://localhost:3000

# ── Frontend (separate terminal) ──
cd client
npm install
npm run dev          # Starts Vite on http://localhost:5173

# ── Tests ──
npm test             # Runs Jest (from root)
```

## Architecture

```
uniblox/
├── src/                    # Express backend
│   ├── models/
│   │   ├── types.ts        # TypeScript interfaces
│   │   └── db.ts           # In-memory store (seeded products)
│   ├── services/
│   │   ├── cart.service.ts
│   │   ├── checkout.service.ts
│   │   └── discount.service.ts
│   ├── controllers/        # Request/response handlers
│   ├── routes/             # Express route definitions
│   └── tests/              # Jest unit tests
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── components/     # Header, CartPanel, ProductCard, Toast, Confetti
│       ├── pages/          # Shop, Checkout, Admin
│       ├── context/        # StoreContext (cart state)
│       └── lib/            # API client
├── DECISIONS.md
└── README.md
```

## API Endpoints

| Method | Endpoint                   | Description                          |
|--------|----------------------------|--------------------------------------|
| GET    | `/health`                  | Health check                         |
| GET    | `/products`                | List all products                    |
| POST   | `/cart/add`                | Add item to cart                     |
| GET    | `/cart/:userId`            | View user's cart                     |
| POST   | `/checkout`                | Checkout (with optional coupon)      |
| POST   | `/admin/generate-discount` | Generate discount code (if eligible) |
| GET    | `/admin/stats`             | Store analytics                      |

### Example: Add to Cart
```json
POST /cart/add
{ "userId": "guest", "productId": "p1", "quantity": 2 }
```

### Example: Checkout with Discount
```json
POST /checkout
{ "userId": "guest", "discountCode": "A1B2C3D4" }
```

## Seeded Products

| ID  | Name                | Price  |
|-----|---------------------|--------|
| p1  | Wireless Mouse      | $29.99 |
| p2  | Mechanical Keyboard | $79.99 |
| p3  | USB-C Hub           | $49.99 |
| p4  | Monitor Stand       | $34.99 |
| p5  | Webcam HD           | $59.99 |

## Discount System

- Every **5th order** (configurable) enables a discount code generation.
- Admin calls `POST /admin/generate-discount` to issue the code.
- Codes give **10% off** and are **single-use** (tracked with `used/unused` status).

## Frontend Features

- **Monochromatic Design** — strict B&W palette with Inter font
- **Product Grid** — 3-column layout with hover scale + fade-in "Add to Cart"
- **Slide-over Cart** — spring-animated panel from the right
- **Ghost Toasts** — fade-in/out notifications on actions
- **Checkout** — discount code input, nth-order progress, animated totals
- **Monochrome Confetti** — black & gray particles on order success
- **Admin Console** — revenue/items/orders metrics + discount codes table

## Testing

```bash
npm test    # 19 tests across 2 suites
```

- **Discount Service** — nth-order generation, duplicate prevention, validation, single-use
- **Checkout Service** — total calculation, discount application, cart clearing, edge cases

## Tech Stack

| Layer    | Technology                                          |
|----------|-----------------------------------------------------|
| Backend  | Node.js, TypeScript, Express                        |
| Frontend | React, TypeScript, Vite, Tailwind CSS, Framer Motion |
| Testing  | Jest, ts-jest                                       |

# Ecommerce Store

[![watch the newgen ecommerce](https://img.youtube.com/vi/31DUpk-68Ck/0.jpg)](https://www.youtube.com)


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

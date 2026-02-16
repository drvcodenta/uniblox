# Uniblox Ecommerce Store API

A RESTful API for an ecommerce store with cart management, checkout, discount system, and admin analytics. Built with **Node.js**, **TypeScript**, and **Express**.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (with auto-reload)
npm run dev

# Run tests
npm test

# Build for production
npm run build
npm start
```

The server runs on `http://localhost:3000` by default.

## API Endpoints

### Health Check

| Method | Endpoint  | Description         |
|--------|-----------|---------------------|
| GET    | `/health` | Server health check |

### Cart

| Method | Endpoint        | Description        |
|--------|-----------------|---------------------|
| POST   | `/cart/add`     | Add item to cart    |
| GET    | `/cart/:userId` | View user's cart    |

**POST /cart/add**
```json
{
  "userId": "user1",
  "productId": "p1",
  "quantity": 2
}
```

### Checkout

| Method | Endpoint    | Description                            |
|--------|-------------|----------------------------------------|
| POST   | `/checkout` | Process checkout (with optional coupon) |

**POST /checkout**
```json
{
  "userId": "user1",
  "discountCode": "A1B2C3D4"
}
```

### Admin

| Method | Endpoint                    | Description                    |
|--------|-----------------------------|--------------------------------|
| POST   | `/admin/generate-discount`  | Generate discount code (if eligible) |
| GET    | `/admin/stats`              | View store analytics           |

## Available Products (Seeded)

| ID  | Name                | Price    |
|-----|---------------------|----------|
| p1  | Wireless Mouse      | $29.99   |
| p2  | Mechanical Keyboard | $79.99   |
| p3  | USB-C Hub           | $49.99   |
| p4  | Monitor Stand       | $34.99   |
| p5  | Webcam HD           | $59.99   |

> Prices are stored in cents internally (e.g., 2999 = $29.99)

## Discount System

- Every **5th order** (configurable) generates eligibility for a **10% discount** code.
- Admin calls `POST /admin/generate-discount` to check and issue the code.
- Codes are single-use and tracked with `used/unused` status.

## Project Structure

```
src/
├── models/
│   ├── types.ts          # TypeScript interfaces
│   └── db.ts             # In-memory data store
├── services/
│   ├── cart.service.ts    # Cart business logic
│   ├── checkout.service.ts # Checkout & order logic
│   └── discount.service.ts # Discount generation & validation
├── controllers/
│   ├── cart.controller.ts
│   ├── checkout.controller.ts
│   └── admin.controller.ts
├── routes/
│   ├── cart.routes.ts
│   ├── checkout.routes.ts
│   └── admin.routes.ts
├── tests/
│   ├── discount.service.test.ts
│   └── checkout.service.test.ts
├── app.ts                # Express config
└── server.ts             # Entry point
```

## Testing

```bash
npm test
```

Unit tests cover:
- **Discount Service**: Code generation on nth-order, duplicate prevention, validation, single-use enforcement
- **Checkout Service**: Total calculation, discount application, invalid code rejection, cart clearing, order counting

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript (strict mode)
- **Framework**: Express
- **Testing**: Jest + ts-jest
- **ID Generation**: uuid

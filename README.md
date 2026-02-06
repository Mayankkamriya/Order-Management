# FoodDash - Order Management App

## Overview
A food delivery Order Management application built with React + Express + MongoDB. Users can browse a menu, add items to cart, place orders with delivery details, and track order status in real-time.

## Tech Stack
- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Express.js + TypeScript (local dev), Vercel Serverless Functions (production)
- **Database**: MongoDB (via Mongoose)
- **State Management**: React Context (cart), TanStack Query (server state)
- **Routing**: Wouter
- **Validation**: Zod
- **Testing**: Vitest

## Project Architecture
```
client/src/
  App.tsx              - Main app with routing
  lib/cart-context.tsx  - Cart state management (Context API)
  lib/queryClient.ts   - TanStack Query configuration
  components/
    header.tsx         - App header with cart button
    menu-card.tsx      - Menu item card with add-to-cart
    cart-sheet.tsx      - Cart sidebar/sheet
  pages/
    menu.tsx           - Menu listing with search & category filter
    checkout.tsx       - Checkout form with delivery details
    order-tracking.tsx - Real-time order status tracking

server/
  index.ts             - Express server entry point
  db.ts                - MongoDB connection
  models.ts            - Mongoose schemas (MenuItem, Order)
  storage.ts           - Storage interface (MongoStorage)
  routes.ts            - REST API endpoints
  seed.ts              - Menu item seed data (8 items)
  status-simulator.ts  - Simulates real-time order status progression

api/                   - Vercel Serverless Functions (production deployment)
  health.ts            - GET /api/health (health check)
  menu.ts              - GET /api/menu (list all menu items + auto-seed)
  menu/[id].ts         - GET /api/menu/:id (single menu item)
  orders/index.ts      - GET /api/orders, POST /api/orders
  orders/[id]/index.ts - GET /api/orders/:id
  orders/[id]/status.ts - PATCH /api/orders/:id/status

shared/
  schema.ts            - Zod schemas + TypeScript types

tests/
  api.test.ts          - API model CRUD & validation tests
```

## API Endpoints
- `GET /api/health` - Health check (Vercel only)
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get a single menu item
- `POST /api/orders` - Place a new order
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id/status` - Update order status
- `GET /api/orders` - Get all orders

## Environment Variables
- `MONGODB_URI` - MongoDB connection string (required)
- `SESSION_SECRET` - Session secret

## Key Features
- Menu display with search and category filtering
- Cart management (add, remove, quantity updates)
- Checkout with delivery details validation (Zod)
- Real-time order status tracking
- Automatic status progression simulator (server-side, every 15s)
- 8 seeded menu items with generated food images

## Order Status Flow
Orders automatically progress through these stages (via server-side simulator):
1. **Order Received** - Order placed by user
2. **Preparing** - Kitchen is making the food (~15s)
3. **Out for Delivery** - Driver is on the way (~30s)
4. **Delivered** - Order complete (~45s)


## Deployment

### Local
- Run `npm run dev` to start the Express server with Vite dev middleware

### Vercel
- Each file in `api/` is a self-contained serverless function (no external imports from `server/` or `shared/`)
- `vercel.json` configures Vite build output + SPA rewrites
- Set `MONGODB_URI` in Vercel Environment Variables
- Run `npm run build` for production build

## Recent Changes
- 2026-02-06: Initial build - Full MVP with menu, cart, checkout, order tracking, MongoDB integration, tests

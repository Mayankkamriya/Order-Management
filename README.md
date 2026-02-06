# FoodDash - Order Management App

## Overview
A food delivery Order Management application built with React + Express + MongoDB. Users can browse a menu, add items to cart, place orders with delivery details, and track order status in real-time.

## Tech Stack
- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Express.js + TypeScript
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
  seed.ts              - Menu item seed data
  status-simulator.ts  - Simulates real-time order status progression

shared/
  schema.ts            - Zod schemas + TypeScript types

tests/
  api.test.ts          - API & validation tests
```

## API Endpoints
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get a single menu item
- `POST /api/orders` - Place a new order
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id/status` - Update order status
- `GET /api/orders` - Get all orders

## Environment Variables
- `MONGODB_URI` - MongoDB connection string (stored as secret)
- `SESSION_SECRET` - Session secret (stored as secret)

## Key Features
- Menu display with search and category filtering
- Cart management (add, remove, quantity updates)
- Checkout with delivery details validation
- Real-time order status tracking (polling every 5s)
- Simulated status progression (every 15s)
- 8 seeded menu items with generated food images

## Deployment
- `vercel.json` configured for Vercel deployment
- Run `npm run build` for production build

## Recent Changes
- 2026-02-06: Initial build - Full MVP with menu, cart, checkout, order tracking, MongoDB integration, tests

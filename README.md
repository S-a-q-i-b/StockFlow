<<<<<<< HEAD
# StockFlow — Inventory & Sales Management System

StockFlow is a production-style MERN inventory and sales management application for small businesses. It includes role-based authentication, products, categories, customers, POS sales, orders, inventory movements, dashboard analytics, profile/security settings, audit activity, image uploads, CSV exports and deployment configuration.

## Stack

**Frontend:** React 19, Vite, React Router, Tailwind CSS v4, TanStack Query, Axios, React Hook Form, Zod, Recharts, Framer Motion, GSAP, Lucide React, Sonner.

**Backend:** Node.js, Express 5, MongoDB, Mongoose, JWT, HTTP-only cookies, bcryptjs, Multer, express-validator, CORS.

## Project Structure

```text
StockFlow/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── vercel.json
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   └── render.yaml
└── README.md
```

## Features

- Landing page with responsive premium UI
- Centralized initial and route transition loaders
- Light/dark theme
- JWT authentication with HTTP-only cookies
- Admin and Staff roles
- Protected frontend routes and server-side authorization
- Product CRUD, SKU uniqueness, search, filters, pagination and image upload
- Category CRUD with safe deletion rules
- Customer CRUD, order history and spending
- POS cart, discounts, payment methods and stock validation
- Orders, status changes, cancellation and printable invoices
- Inventory stock-in, stock-out and movement history
- Real MongoDB dashboard metrics and charts
- Audit/activity records for important business actions
- Profile editing, profile image upload/removal and password change
- CSV exports for products, orders and inventory
- Production-oriented security headers and CORS configuration
- Vercel frontend and Render backend deployment files

## Local Setup

### 1. Backend

```bash
cd Backend
npm install
copy .env.example .env
npm run dev
```

Set at least:

```env
MONGO_URI=mongodb://127.0.0.1:27017/stockflow
JWT_SECRET=use-a-long-random-secret
CLIENT_URL=http://localhost:5173
```

MongoDB Atlas can be used instead of a local MongoDB instance.

### 2. Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Set:

```env
VITE_API_URL=http://localhost:3000/api
```

## API

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `PUT /api/auth/profile`
- `DELETE /api/auth/profile/image`
- `PUT /api/auth/password`

### Products
- `GET /api/products`
- `POST /api/products`
- `GET /api/products/:id`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Categories
- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

### Customers
- `GET /api/customers`
- `POST /api/customers`
- `GET /api/customers/:id`
- `PUT /api/customers/:id`
- `DELETE /api/customers/:id`

### Orders / Sales
- `GET /api/orders`
- `POST /api/orders`
- `GET /api/orders/:id`
- `PUT /api/orders/:id`
- `GET /api/sales`
- `POST /api/sales`

### Inventory
- `GET /api/inventory`
- `POST /api/inventory/stock-in`
- `POST /api/inventory/stock-out`
- `GET /api/inventory/movements`

### Dashboard / Activities
- `GET /api/dashboard?range=7d|30d|6m|12m`
- `GET /api/activities` (Admin only)

## Roles

**Admin:** full access including user management, product/category/customer deletion, order status management and audit activity.

**Staff:** operational access to products, categories, customers, POS sales and inventory, without Admin-only user/security controls.

## Image Uploads

Images are accepted as JPG, PNG, WEBP or GIF up to 5 MB. Uploaded files are stored in `Backend/uploads`. This folder is git-ignored except for `.gitkeep`. For a multi-instance production deployment, replace local disk uploads with object storage.

## Deployment

### Frontend — Vercel

Deploy the `frontend` directory and configure:

```env
VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api
```

`frontend/vercel.json` is included for SPA route fallback.

### Backend — Render

Deploy `Backend` as a Node web service. Configure `MONGO_URI`, `JWT_SECRET` and `CLIENT_URL` in the service environment. `Backend/render.yaml` is included as a starting point.

### Production Cookies / CORS

The backend uses secure cookie settings when `NODE_ENV=production` and supports a comma-separated `CLIENT_URL` allowlist. Make sure the frontend origin exactly matches the production URL.

## Demo

Create the first account through `/register`; the first registered account is promoted to `Admin`. Later registrations default to `Staff`. Change credentials to your own demo values before publishing a public repository.

## Notes

- Never commit `.env` files or database credentials.
- `Backend/uploads` is local storage for development and single-instance hosting; use persistent/object storage for production.
- Docker was intentionally left out of the final package.
=======
# StockFlow
A full-stack inventory management system built with React, Node.js, Express.js, and MongoDB. Manage products, categories, customers, orders, inventory, and dashboard analytics in one place.
>>>>>>> 3fda7be732e36be4d0fe29e0aa0d7d27af5ea2ce

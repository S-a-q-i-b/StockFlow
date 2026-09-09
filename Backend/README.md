# StockFlow Backend

Express + MongoDB API for StockFlow.

## Run

```bash
npm install
copy .env.example .env
npm run dev
```

The API starts on `PORT` (default `3000`).

## Required environment

- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL`

## Production

Set `NODE_ENV=production`, use a long random JWT secret, point `MONGO_URI` to MongoDB Atlas or another managed MongoDB service, and set `CLIENT_URL` to the deployed frontend URL.

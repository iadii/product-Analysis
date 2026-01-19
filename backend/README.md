# Outfit Recommendation API - Backend

Express + TypeScript + MongoDB backend for the AI-powered outfit recommendation system.

---

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your values

# Seed database
npm run seed

# Start development server
npm run dev
```

---

## Environment Variables

Create `.env` file:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/outfit-recommendation
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here  # Optional - enables AI reasoning
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/products` | List products |
| GET | `/api/products/:id` | Get product |
| POST | `/api/recommendations` | Generate outfits |
| GET | `/api/recommendations/quick/:productId` | Quick recommendations |
| GET | `/api/recommendations/cache/stats` | Cache stats |

---

## Sample Request

```bash
curl -X POST http://localhost:5001/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{"productId": "YOUR_PRODUCT_ID", "filters": {"limit": 5}}'
```

---

## Project Structure

```
src/
├── config/         # Database connection
├── models/         # Mongoose schemas
├── controllers/    # Request handlers
├── routes/         # API routes
├── services/       # Business logic (scoring, AI, cache)
├── middleware/     # Error handling, logging
├── scripts/        # Database seeding
└── types/          # TypeScript interfaces
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with hot reload |
| `npm run build` | Compile TypeScript |
| `npm run seed` | Seed database |
| `npm start` | Run production build |

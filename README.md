# AI-Powered Outfit Recommendation System

An intelligent fashion styling engine that generates complete, cohesive outfit combinations from a single product selection using algorithmic scoring and optional AI enhancement.

---

## 📋 Project Overview

This system simulates how a fashion stylist thinks—analyzing **color harmony**, **style compatibility**, **occasion appropriateness**, and **budget constraints** to recommend complete outfits (top, bottom, footwear, accessories) based on a user-selected base product.

**Key Features:**
- Generate 3-5 complete outfit combinations per request
- Each outfit includes: Top + Bottom + Footwear + Accessories
- Match scoring (0-1) with detailed breakdown
- Optional AI-powered styling explanations via Google Gemini
- Sub-1s response times through intelligent caching

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                       │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐   │
│  │ Product Grid │───▶│ Product Page │───▶│ Outfit Display   │   │
│  └──────────────┘    └──────────────┘    └──────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND (Express + TypeScript)           │
│                                                                  │
│  ┌──────────────┐    ┌───────────────┐    ┌─────────────────┐   │
│  │   Routes     │───▶│  Controllers  │───▶│    Services     │   │
│  └──────────────┘    └───────────────┘    └─────────────────┘   │
│         │                                         │              │
│         │            ┌───────────────┐           │              │
│         └───────────▶│   In-Memory   │◀──────────┘              │
│                      │     Cache     │                          │
│                      └───────────────┘                          │
│                              │                                   │
│  ┌──────────────┐    ┌───────────────┐    ┌─────────────────┐   │
│  │   Models     │◀───│   MongoDB     │    │  Gemini AI API  │   │
│  └──────────────┘    └───────────────┘    └─────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

**Data Flow:**
1. User selects a product → Frontend calls `POST /api/recommendations`
2. Backend checks cache → If hit, return immediately
3. If miss → Query MongoDB for compatible products
4. Run scoring algorithm → Rank and filter outfits
5. Optionally enhance top 3 with AI reasoning
6. Cache results → Return response

---

## 🧠 Recommendation Logic

### Outfit Generation
1. **Query compatible products** by category (need: top, bottom, footwear, accessory)
2. **Filter by constraints**: gender, occasion, season, budget
3. **Generate combinations** using a combinatorial approach
4. **Score each combination** using weighted factors
5. **Return top N** highest-scoring outfits

### Scoring Algorithm

| Factor | Weight | How It's Calculated |
|--------|--------|---------------------|
| **Color Harmony** | 25% | Same color family = 1.0, complementary = 0.8, neutral = 0.6 |
| **Style Match** | 30% | Jaccard similarity of style tags across items |
| **Occasion Fit** | 20% | Overlap between item occasions and filter |
| **Season Relevance** | 15% | Match between seasons and filter/current season |
| **Budget Alignment** | 10% | 1 - (totalPrice / maxBudget), clamped to [0,1] |

**Final Score** = Σ (factor × weight), normalized to 0-1 range.

---

## ⚡ Performance Strategy

**Target:** < 1 second response time

| Technique | Implementation |
|-----------|----------------|
| **In-Memory Cache** | LRU cache with 1-hour TTL, keyed by productId + filters |
| **Database Indexes** | Compound indexes on `category`, `gender`, `inStock` |
| **Query Optimization** | `lean()` queries, projection to fetch only needed fields |
| **Parallel Processing** | Run scoring calculations concurrently |
| **AI Rate Limiting** | Only enhance top 3 outfits to minimize API latency |
| **Early Termination** | Stop generating once limit is reached |

**Typical Response Times:**
- Cached request: **~20-50ms**
- Fresh request (no AI): **~200-400ms**
- Fresh request (with AI): **~500-900ms**

---

## 🤖 AI Usage

### Google Gemini Integration

**Model:** `gemini-1.5-flash`

**Purpose:** Generate natural language explanations for why outfits work well together.

**When Used:**
- Only on the **top 3** highest-scoring outfits
- Only if `GEMINI_API_KEY` is configured

**Sample Prompt:**
```
Briefly describe why this outfit works well together:
Top: Casual White Linen Shirt (white)
Bottom: Navy Chinos (navy)
Footwear: Brown Leather Loafers
Respond in one concise sentence.
```

**Fallback:** If AI is disabled or fails, returns rule-based reasoning like *"A cohesive casual look with harmonious neutral and cool tones."*

---

## 🚀 How to Run

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API key (optional)

### Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MONGODB_URI and optionally GEMINI_API_KEY

# Seed the database
npm run seed

# Start development server
npm run dev
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Access:** `http://localhost:3000`

### Sample API Request

**Endpoint:** `POST /api/recommendations`

```bash
curl -X POST http://localhost:5001/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "6789abc123def456",
    "filters": {
      "occasion": "casual",
      "season": "summer",
      "maxBudget": 10000,
      "limit": 5
    }
  }'
```

**Sample Response:**
```json
{
  "success": true,
  "baseProduct": { "_id": "6789abc123def456", "name": "White Linen Shirt", ... },
  "recommendations": [
    {
      "products": {
        "top": { ... },
        "bottom": { ... },
        "footwear": { ... },
        "accessories": [ ... ]
      },
      "matchScore": 0.87,
      "breakdown": {
        "colorHarmony": 0.9,
        "styleMatch": 0.85,
        "occasionFit": 1.0,
        "seasonRelevance": 0.8,
        "budgetAlignment": 0.75
      },
      "totalPrice": 8500,
      "reasoning": "A refined summer ensemble combining breathable linen with classic navy chinos.",
      "aiPowered": true
    }
  ],
  "responseTimeMs": 342,
  "cached": false
}
```

---

## 📝 Assumptions & Trade-offs

### Assumptions
- Products have pre-defined `style`, `occasion`, and `season` arrays
- Color families (neutral, warm, cool, earth) are assigned during data import
- Users want complete outfits, not individual item recommendations

### Simplifications Made
| Area | Simplification | Ideal Solution |
|------|----------------|----------------|
| **Inventory** | All products assumed `inStock: true` | Real-time inventory sync |
| **Personalization** | No user preference learning | ML model trained on user behavior |
| **Images** | Some products lack images | Image generation or placeholder service |
| **Size Matching** | Not implemented | Size availability per product |

### What I Would Improve
1. **Precomputation Layer** – Generate outfit combinations offline and store in Redis
2. **ML-Based Scoring** – Train a model on stylist-curated outfits instead of rule-based weights
3. **Visual Similarity** – Use computer vision to match patterns and colors from images
4. **A/B Testing** – Track which recommendations users actually purchase
5. **Streaming Responses** – Return outfits progressively as they're generated

---

## 📁 Project Structure

```
culture-circle/
├── backend/
│   ├── src/
│   │   ├── config/         # Database connection
│   │   ├── models/         # Mongoose schemas
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic (scoring, outfit generation, AI)
│   │   ├── middleware/     # Error handling, logging
│   │   ├── scripts/        # Database seeding
│   │   └── types/          # TypeScript interfaces
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js pages
│   │   ├── components/     # React components
│   │   ├── services/       # API client
│   │   └── types/          # TypeScript interfaces
│   └── package.json
└── README.md
```

---

## 🧪 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check, shows AI status |
| GET | `/api/products` | List products (with filters) |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/recommendations` | Generate outfit recommendations |
| GET | `/api/recommendations/quick/:productId` | Quick cached recommendations |
| GET | `/api/recommendations/cache/stats` | Cache statistics |

---

## 📄 License

MIT

# CutMode

CutMode is a premium AI-powered fitness and nutrition tracking app focused on losing fat while preserving muscle. It combines calorie and protein tracking, AI food-photo analysis, workout logging, weight trends, craving management, and rolling 10-day deficit targets.

## Stack

- Next.js 15 App Router, TypeScript, Tailwind CSS
- Next.js API routes for backend endpoints
- PostgreSQL with Prisma ORM
- Clerk authentication
- Cloudinary image storage
- OpenAI Vision API for food-photo analysis
- Recharts for analytics
- Mobile-first responsive UI with dark mode

## Project Structure

```text
app/
  (app)/                 Authenticated product pages
  api/                   Backend API routes
  sign-in/ sign-up/      Clerk auth screens
components/
  charts/                Recharts visualizations
  cravings/              Craving Mode UI
  dashboard/             Deficit and dashboard components
  layout/                App shell, navigation, theme toggle
  meals/                 Meal upload and manual logging
  ui/                    Reusable UI primitives
lib/
  ai/                    OpenAI analysis and coach logic
  auth/                  Clerk user helpers
  data/                  Demo data for first-run UI
  db/                    Prisma client
  nutrition/             Deficit, maintenance, food database logic
prisma/
  schema.prisma          PostgreSQL data model
  seed.ts                Demo user, foods, meals, workouts, weights
types/
  index.ts               Shared app types
```

## Core Calculation Logic

- `1 kg fat = 7700 kcal`
- Default target: `5000 kcal deficit every 10 days`
- Rolling deficit uses:

```text
maintenance calories + workout calories burned - calories consumed
```

CutMode continuously calculates:

- rolling 10-day deficit
- remaining deficit needed
- daily deficit required to stay on target
- projected fat loss
- target weight date estimate
- status indicators like `On Track`, `Protein Low`, and `Great Deficit Day`

The logic lives in `lib/nutrition/calculations.ts`.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Fill in:

```text
DATABASE_URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
OPENAI_API_KEY
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

4. Generate Prisma client and migrate:

```bash
npm run db:generate
npm run db:migrate
```

5. Seed sample data:

```bash
npm run db:seed
```

6. Run locally:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Important API Routes

- `GET /api/meals` and `POST /api/meals`
- `POST /api/meals/analyze`
- `GET /api/foods?q=paneer`
- `GET /api/foods?barcode=...`
- `GET /api/workouts` and `POST /api/workouts`
- `GET /api/weight` and `POST /api/weight`
- `GET /api/cravings` and `POST /api/cravings`
- `POST /api/coach`
- `GET /api/goals` and `PUT /api/goals`
- `GET /api/reports?format=pdf`
- `POST /api/upload`
- `GET /api/notifications` and `PUT /api/notifications`

## AI Meal Analysis

`POST /api/meals/analyze` accepts `multipart/form-data`:

- `image`: food photo
- `context`: optional text like `homemade paneer with two rotis`

The route:

1. Authenticates with Clerk.
2. Sends the image to OpenAI Vision.
3. Estimates calories, protein, carbs, fats, fiber, sodium, portion sizes, and confidence.
4. Uploads the photo to Cloudinary when credentials are present.
5. Saves the meal and item-level estimate to PostgreSQL.

If `OPENAI_API_KEY` is missing, it falls back to the local food database estimator so the route remains testable.

## Deployment

Recommended deployment:

- Vercel for Next.js
- Neon, Supabase Postgres, or Railway for PostgreSQL
- Clerk production instance for auth
- Cloudinary for image storage
- OpenAI project API key for food-photo analysis

Deployment steps:

1. Create production database and set `DATABASE_URL`.
2. Add all `.env.example` variables to the hosting provider.
3. Run `prisma migrate deploy` during deployment.
4. Configure Clerk redirect URLs:
   - `/sign-in`
   - `/sign-up`
   - `/dashboard`
5. Configure Cloudinary upload credentials.
6. Deploy with `npm run build`.

## Safety Philosophy

CutMode prioritizes:

- high protein
- sustainable calorie deficits
- muscle preservation
- realistic food logging
- moderation around cravings
- non-shaming coaching language

It avoids crash dieting, extremely low calorie advice, and recommendations that punish imperfect adherence.

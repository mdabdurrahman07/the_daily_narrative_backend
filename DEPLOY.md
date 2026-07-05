# Deploying The Daily Narrative Backend on Vercel

This project is a TypeScript Express backend with Prisma and PostgreSQL. It can be deployed on Vercel as a serverless API.

## What changed for Vercel

- Added a Vercel entrypoint at [api/index.ts](api/index.ts)
- Added [vercel.json](vercel.json) to route all requests to the API handler
- Updated the app to use environment variables safely in both local and Vercel environments
- Added the required runtime dependencies for serverless hosting

## Important note

Vercel is great for APIs, but this project uses:

- PostgreSQL via Prisma
- Stripe webhooks
- JWT cookies and CORS

That means you must configure your environment variables carefully and use a production database.

## 1. Prepare the project

Install dependencies:

```bash
npm install
```

Generate Prisma client:

```bash
npx prisma generate
```

## 2. Create a production database

You need a PostgreSQL database before deployment.

Good options:

- Neon
- Supabase Postgres
- Railway
- Render Postgres
- Aiven

After creating it, copy the connection string.

## 3. Set environment variables in Vercel

In your Vercel project dashboard, go to Settings > Environment Variables and add these values:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://username:password@host:5432/database_name
APP_URL=https://your-vercel-app-url.vercel.app
BCRYPT_SALT_ROUNDS=10
JWT_ACCESS_SECRET=your-long-random-secret
JWT_REFRESH_SECRET=your-long-random-secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_live_or_test_key
STRIPE_PRICE_ID=price_xxx
STRIPE_WEBHOOK_SECRET_KEY=whsec_xxx
```

### Notes for the variables

- `DATABASE_URL` must be the production database URL.
- `APP_URL` should be your deployed Vercel URL.
- `JWT_*` values should be long random strings.
- `STRIPE_WEBHOOK_SECRET_KEY` is needed only if you want webhook support.

## 4. Deploy to Vercel

### Option A: Deploy from the Vercel dashboard

1. Push your code to GitHub.
2. Open Vercel.
3. Click New Project.
4. Import your GitHub repository.
5. Vercel will detect the project automatically.
6. Click Deploy.

### Option B: Deploy with Vercel CLI

Install the CLI:

```bash
npm i -g vercel
```

Login:

```bash
vercel login
```

Deploy:

```bash
vercel
```

For production:

```bash
vercel --prod
```

## 5. Run Prisma migrations on production

After deploying, you need to apply database migrations.

If your hosting provider supports terminal access, run:

```bash
npx prisma migrate deploy
```

If you are using Vercel, the easiest approach is to run migrations locally before deployment or from a one-time script in your CI pipeline.

## 6. Stripe webhook setup

If your app uses Stripe subscriptions, configure a webhook in Stripe:

1. Go to Stripe Dashboard > Developers > Webhooks.
2. Add an endpoint:

```text
https://your-vercel-app-url.vercel.app/api/v1/tdn/subscription/webhook
```

3. Select events such as:
   - checkout.session.completed
   - customer.subscription.updated
   - customer.subscription.deleted

4. Copy the signing secret into:

```env
STRIPE_WEBHOOK_SECRET_KEY=whsec_...
```

## 7. Common issues

### 1. Prisma cannot connect to the database

Check:

- `DATABASE_URL` is correct
- the database accepts connections from Vercel
- the database is not blocked by firewall rules

### 2. CORS errors

Make sure `APP_URL` matches your production frontend URL.

### 3. JWT auth fails

Verify that the JWT secrets are set in Vercel and are not empty.

### 4. Webhook route not working

Check that the webhook URL matches the route in your app:

```text
/api/v1/tdn/subscription/webhook
```

## 8. Recommended deployment checklist

- [ ] PostgreSQL database created
- [ ] Environment variables added in Vercel
- [ ] Prisma client generated
- [ ] App deployed successfully
- [ ] Prisma migrations applied
- [ ] Stripe webhook configured
- [ ] Frontend URL added to CORS

## 9. Local development vs production

Local:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

## 10. Helpful next step

If you want to make this even more production-ready, you can later add:

- a separate staging environment
- CI/CD deployment on GitHub
- a database migration step in Vercel build hooks
- health check endpoints

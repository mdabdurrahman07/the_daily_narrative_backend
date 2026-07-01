# The Daily Narrative Backend

A TypeScript Express backend for a blogging platform with PostgreSQL, Prisma ORM, JWT authentication, and Stripe subscription checkout.

## Tech Stack

- Node.js
- TypeScript
- Express.js
- Prisma
- PostgreSQL
- JWT authentication
- Stripe
- bcryptjs
- cookie-parser
- cors
- dotenv

## Features

- User registration and login with JWT access/refresh tokens
- User profile fetch and update
- Post CRUD operations
- Comment creation, update, delete, and moderation
- Stripe subscription checkout session creation
- Role-based route protection

## Installation

1. Clone the repo:

```bash
git clone <https://github.com/mdabdurrahman07/the_daily_narrative_backend>
cd the_daily_narrative_backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file at the project root with these variables:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
NODE_ENV=development
PORT=5000
APP_URL=http://localhost:5000
BCRYPT_SALT_ROUNDS=10
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
```

4. Start the app in development mode:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
npm run start
```

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: application environment
- `PORT`: server port
- `APP_URL`: allowed CORS origin and Stripe redirect URL base
- `BCRYPT_SALT_ROUNDS`: bcrypt hashing rounds
- `JWT_ACCESS_SECRET`: access token secret
- `JWT_REFRESH_SECRET`: refresh token secret
- `JWT_ACCESS_EXPIRES_IN`: access token expiry
- `JWT_REFRESH_EXPIRES_IN`: refresh token expiry
- `STRIPE_SECRET_KEY`: Stripe secret API key
- `STRIPE_PRICE_ID`: Stripe price ID for the subscription plan

## API Base Path

All API routes are mounted under:

```text
/api/v1/tdn
```

## Routes

### Root

| Method | Path | Description |
|---|---|---|
| GET | `/` | Welcome message and API status |

### Auth Routes

Base: `/api/v1/tdn/auth/users`

| Method | Path | Description | Body | Auth |
|---|---|---|---|---|
| POST | `/register` | Register a new user | `{ name, email, password, profilePhoto }` | No |
| POST | `/login` | Login user and issue tokens | `{ email, password }` | No |
| GET | `/me` | Get current user profile | N/A | `USER`, `AUTHOR`, `ADMIN` |
| PUT | `/my-profile` | Update current user profile | `{ name?, email?, profilePhoto?, bio? }` | `USER`, `AUTHOR`, `ADMIN` |
| POST | `/refresh-token` | Refresh access token using refresh token cookie | N/A | No |

### Post Routes

Base: `/api/v1/tdn/posts`

| Method | Path | Description | Body / Query | Auth |
|---|---|---|---|---|
| GET | `/` | Get all posts | Query params: `page`, `limit`, `sortBy`, `sortOrder`, `searchTerm`, `title`, `content`, `authorId`, `isFeatured`, `status`, `tags` | No |
| GET | `/stats` | Get post statistics | N/A | `ADMIN` |
| GET | `/my-posts` | Get posts created by current user | N/A | `USER`, `AUTHOR`, `ADMIN` |
| GET | `/:postId` | Get a single post by ID | N/A | No |
| POST | `/` | Create a new post | `{ title, content, thumbnail?, isFeatured?, status?, tags }` | `USER`, `AUTHOR`, `ADMIN` |
| PATCH | `/:postId` | Update a post by ID | `{ title?, content?, thumbnail?, isFeatured?, status?, tags? }` | `USER`, `AUTHOR`, `ADMIN` |
| DELETE | `/:postId` | Delete a post by ID | N/A | `USER`, `AUTHOR`, `ADMIN` |

### Comment Routes

Base: `/api/v1/tdn/comments`

| Method | Path | Description | Body | Auth |
|---|---|---|---|---|
| GET | `/author/:authorId` | Retrieve comments for a specific author | N/A | No |
| GET | `/:commentId` | Retrieve a single comment by ID | N/A | No |
| POST | `/` | Create a comment | `{ content, postId }` | `USER`, `AUTHOR`, `ADMIN` |
| PATCH | `/:commentId` | Update a comment | `{ content?, status? }` | `USER`, `AUTHOR`, `ADMIN` |
| DELETE | `/:commentId` | Delete a comment by ID | N/A | `USER`, `AUTHOR`, `ADMIN` |
| PATCH | `/:commentId/moderate` | Moderate a comment status | `{ status }` | `ADMIN` |

### Subscription Routes

Base: `/api/v1/tdn/subscription`

| Method | Path | Description | Body | Auth |
|---|---|---|---|---|
| POST | `/checkout` | Create Stripe subscription checkout session | N/A | `USER`, `AUTHOR`, `ADMIN` |

## Authentication

- The app uses JWT access and refresh tokens
- `accessToken` and `refreshToken` are stored as HTTP-only cookies
- Protected routes require a valid token and role
- `Authorization: Bearer <token>` can also be used if cookies are not available

## Notes

- The server connects to PostgreSQL via Prisma
- Prisma schema lives under `prisma/schema`
- Migrations are stored in `prisma/migrations`
- The app starts from `src/server.ts` and loads `src/app.ts`
- CORS is enabled for `APP_URL`

## Local Usage

1. Ensure Postgres is running and `DATABASE_URL` is valid
2. Run development server with `npm run dev`
3. Use an API client like Postman or Insomnia
4. Authenticate before calling protected endpoints
5. Use the returned Stripe `payment_url` for subscription checkout

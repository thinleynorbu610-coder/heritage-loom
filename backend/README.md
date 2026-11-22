# Heritage Loom API

## Phase 2: Users and catalog

Run PostgreSQL and Redis with `docker compose up -d`, copy `.env.example` to `.env`, then run `npx prisma migrate dev --name phase-2-catalog` and `npm run dev`.

Implemented endpoints:

- `GET/PATCH /api/v1/users/me`
- Address CRUD under `/api/v1/users/me/addresses`
- Public category list/detail; admin category create/update/soft-delete
- Public product pagination, search, category/price filters and sorting
- Public product detail; admin product create/update/soft-delete

Prices are integer minor units. Product image values are URL strings. Signup always creates a customer; admin access requires an independently provisioned admin user.

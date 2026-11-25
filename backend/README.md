# Heritage Loom Backend

Node.js, Express, TypeScript, MongoDB, and JWT authentication API.

## Run MongoDB

```bash
docker compose up -d mongodb
```

## Configure and install

```bash
copy .env.example .env
npm install
```

Set a secure `JWT_SECRET` in `.env`.

## Run the API

```bash
npm run dev
```

The API runs on `http://localhost:4000`.

### Endpoints

- `GET /health`
- `POST /api/auth/register` — `{ name, email, password }` (creates a regular user)
- `POST /api/auth/login` — `{ email, password }`
- `GET /api/users/me` — requires `Authorization: Bearer <token>`
- `GET /api/role-check/seller` — authenticated seller only
- `GET /api/role-check/admin` — authenticated admin only

Users have one of three roles: `user`, `seller`, or `admin`. Registration always creates a regular user. Seller and admin accounts must be created or promoted by a trusted administrative process; never accept a role from public registration.

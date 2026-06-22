# Test Credentials

## Admin Account (Portfolio Admin Panel)
- URL: `/admin`
- Email: `parasguptasnl@gmail.com`
- Password: `DoRaCaKeS`
- Role: `admin`

## API Endpoints (Auth)
- POST `/api/auth/login` — body `{ email, password }` returns `{ access_token, token_type, email }`
- GET `/api/auth/me` — requires `Authorization: Bearer <token>`

## Notes
- Single admin only (seeded on startup via ADMIN_EMAIL / ADMIN_PASSWORD in `/app/backend/.env`).
- Token sent via `Authorization: Bearer <token>` header. Frontend stores it in `localStorage` under key `portfolio_admin_token`.

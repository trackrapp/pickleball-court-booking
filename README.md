# pickleball-court-booking

A React MVP for pickleball court booking with AWS Cognito authentication, mock court data,
and an Express API with in-memory bookings.

## Local setup

1. Create a local env file from the example:

```bash
cp .env.example .env
```

2. Choose an auth mode in `.env`:

- `AUTH_MODE=demo` for local UI testing without Cognito
- `AUTH_MODE=cognito` to use the real Cognito login flow

3. Fill in these values in `.env`:

- `COGNITO_AUTHORITY`: your Cognito Hosted UI / OIDC authority URL
- `COGNITO_CLIENT_ID`: your Cognito app client ID
- `COGNITO_REDIRECT_URI`: `http://localhost:1234`
- `COGNITO_LOGOUT_URI`: `http://localhost:1234`
- `API_BASE_URL`: `http://localhost:4000`

4. If you use `AUTH_MODE=cognito`, in the Cognito app client configuration allow these callback and sign-out URLs:

- `http://localhost:1234`
- `http://localhost:1234/`

5. Start the backend and frontend in separate terminals:

```bash
npm run server
npm start
```

Then open `http://localhost:1234`.

## Notes

- Bookings are stored in server memory, so restarting `npm run server` clears them.
- `AUTH_MODE=demo` is the fastest way to test the booking flow locally.
- If `AUTH_MODE=cognito` is used and Cognito is misconfigured, the app will show a clear local configuration error instead of relying on hardcoded values.

# MuzoOnlineShop

Muzo Online Shop is a small product management dashboard with a React + Vite frontend and an ASP.NET Core backend API.

## Prerequisites

- Node.js and npm
- .NET SDK 10

## Install Frontend Dependencies

From the project root:

```bash
npm install
```

## Run The Backend API

In one terminal, start the ASP.NET Core API:

```bash
dotnet restore server/MuzoOnline.Api/MuzoOnline.Api.csproj
dotnet run --project server/MuzoOnline.Api/MuzoOnline.Api.csproj
```

The backend is configured to run at:

```text
http://localhost:5079
```

Swagger is available at:

```text
http://localhost:5079/swagger
```

The backend currently uses an in-memory database, so products are reset when the API process restarts.

## Run The Frontend

In a second terminal, start the Vite app:

```bash
npm run dev
```

Open the frontend at the URL Vite prints, usually:

```text
http://localhost:5173
```

The frontend sends API requests to `http://localhost:5079` by default. To use a different backend URL:

```bash
VITE_API_BASE_URL=http://localhost:5079 npm run dev
```

## Login Details

The login form is prefilled in the UI, but the credentials are:

```text
Email: davis@test.com
Password: davis@test
```

After a successful login, the frontend stores the JWT in browser local storage using this key:

```text
muzo.auth.token
```

## Extract The Token After Login

Use the UI login first, then extract the token from the browser.

Option 1: browser DevTools console:

```js
localStorage.getItem("muzo.auth.token")
```

Option 2: browser DevTools Application tab:

1. Open DevTools.
2. Go to `Application`.
3. Open `Local Storage`.
4. Select `http://localhost:5173`.
5. Copy the value for `muzo.auth.token`.

The token expires after about 1 hour. If the seed script returns `401 Unauthorized`, log in again and copy a fresh token.

## Seed Demo Data

Keep the backend API running, then log in through the frontend and copy the JWT token as described above.

Run the seed script from the project root:

```bash
MUZO_API_URL=http://localhost:5079 MUZO_API_TOKEN=your-token npm run seed:demo
```

The script creates demo categories and products through the backend API. It is safe to run more than once: products with existing demo SKUs are skipped.

By default the script plans:

```text
30 categories
200 products
```

## Useful Commands

```bash
npm run lint
npm run build
npm run preview
dotnet build server/MuzoOnline.Api/MuzoOnline.Api.csproj
```

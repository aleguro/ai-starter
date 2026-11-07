# Architecture

System overview, service boundaries, and data flow.

## Services

Introduced by [[app-scaffold]]:

- `apps/rails-app` — Rails 8.1 API-only. MVC with a service-object layer (`odsl`, see [[adr-01-odsl-service-layer]]). Auth via Devise + devise-jwt.
- `apps/react-app` — React 19.2 (Vite). React Query for server state, MUI for UI, zustand (persisted) for the auth token/user.
- `postgres` — one instance, used only by `rails-app`.
- All three run via `docker-compose.yml` ([[adr-03-dockerized-dev-default]]).

## Data flow

Browser → React dev server (`:5173`) → `apiClient.ts` (`fetch`, attaches `Authorization` header from the zustand store) → Rails API (`:3000`, CORS-allowed for `:5173`) → `Users::RegistrationsController` / `Users::SessionsController` (thin) → `Auth::SignupService` / `Auth::LoginService` (`odsl`, business logic) → `User` (ActiveRecord). JWT round-trips via the `Authorization` response/request header, never a cookie — see [[devise-jwt-session-store-false]].

## Key boundaries

- React never calls Postgres directly — only through the Rails API.
- Controllers hold no business logic — only ODSL services do (enforced by convention, not by a lint rule yet).
- The browser is the only thing outside the `docker-compose` network; it reaches `rails`/`react` through their published host ports, not their compose service names.

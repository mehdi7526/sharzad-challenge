# Shahrzad

A recreation of the Shahrzad homepage built with Next.js 16 App Router, React, TypeScript, Tailwind CSS, Ant Design, Zustand, SWR, and Axios. The banner, logo, city illustration, and service icons come from the reference website. The IRANYekanXFaNum font comes from the local Super App project and is loaded with `next/font/local`.

## Getting started

Node.js 22 LTS (22.13 or later) or Node.js 24 LTS is recommended.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

The homepage is available at `/home`; `/` redirects to it. `npm run dev` starts both Next.js on port 3000 and the project backend on port 4000. Stopping the command stops both processes. Run only the project backend with `npm run backend`, or only the frontend with `npm run dev:frontend`. The backend uses Node's built-in HTTP module and Node's native TypeScript type stripping; it adds no server framework or dependency.

```bash
npm run lint
npm run typecheck
npm run build
npm run test:unit
npm run test:e2e
npm run start
```

`test:e2e` starts a temporary production server on port 3210 and the project backend on port 4210 after the build. It requires Chrome to be installed and checks normal, empty, and retryable-error responses on desktop and mobile. If Turbopack cannot open a local connection in a restricted environment, `npm run build:webpack` builds the same production application with Webpack. `npm start` runs the standalone server with the required assets.

## Docker

```bash
docker compose up --build
# After checking the app:
docker compose down
```

Compose builds separate `web` and `backend` services sharing one network namespace, so `http://127.0.0.1:4000` reaches the backend from both the Next.js server and the host browser. Ports 3000 and 4000 are published by the backend service. Open `http://localhost:3000` to match the configured CORS origin. `NEXT_PUBLIC_API_BASE_URL` is passed at image build time. The build needs no backend connection. `.dockerignore` excludes local environment files and dependencies, and the runtime uses a non-root user.

## Backend API

The project backend is a standalone HTTP service. The frontend always retrieves data over HTTP using `NEXT_PUBLIC_API_BASE_URL`; there is no data-source selector. Backend-owned data lives in `backend/data.mts` and is consumed only by `backend/server.mts`. The frontend never imports it.

| Backend endpoint | Response                                                    | Used for                                     |
| ---------------- | ----------------------------------------------------------- | -------------------------------------------- |
| `GET /home`      | `HomepageData`: services, submenus, and banner              | Initial server fetch; browser retry with SWR |
| `GET /viewer`    | `ViewerData`: demo sign-in state, wallet, and notifications | Browser request after mount                  |

The shared functions in `src/features/home/api/home-api.ts` use one `NEXT_PUBLIC_API_BASE_URL` for both server and browser requests. The initial homepage is fetched on the Next.js server; viewer data and homepage retries are requested by the browser. All target the same backend URL. This flow does not implement authentication or payments.

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:4000
BACKEND_CORS_ORIGIN=http://localhost:3000
```

`START_BACKEND=true` starts the included backend alongside Next.js; set it to `false` when the backend already runs separately. It controls process startup only. `npm run backend` runs the backend alone. Open `http://localhost:3000` to match the exact allowed CORS origin. For another frontend origin, change `BACKEND_CORS_ORIGIN` accordingly.

Server and browser requests connect directly to the backend; there are no Next.js API proxy routes. `NEXT_PUBLIC_API_BASE_URL` is fixed during `next build`; rebuild production output or restart development after changing it. The URL must be reachable from both server and browser and cannot contain secrets. Direct browser requests require exact-origin backend CORS. Cross-origin authentication is not implemented.

For the browser suite, build and test against its backend port:

```bash
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:4210 npm run build
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:4210 npm run test:e2e
```

Test configuration supplies the exact backend CORS origin.

Configure backend scenarios in `.env.local`. Restart the server after changing them:

- `BACKEND_HOME_SCENARIO`: `normal`, `slow`, `empty`, or `error`.
- `BACKEND_VIEWER_SCENARIO`: `normal` (signed out), `slow`, `signed-in` (demo account with a balance of 125,000 and two notifications), or `error`.
- The normal scenario has no delay. `slow` adds a fixed 800 ms delay, and `error` returns a 503 from the project backend. Next.js preserves backend error statuses; connection failures return 502 and timeouts return 504.

TypeScript contracts live in `features/home/types`. Axios requests use `ApiResponse<HomepageData>` or `ApiResponse<ViewerData>`. The shared interceptor checks the response envelope; endpoint payloads are trusted without runtime domain validation. See [docs/architecture.md](docs/architecture.md) for the request, error, and cache flows.

## Loading and error handling

The `/home` route uses Next.js loading UI and streaming to show a skeleton in the same page shell. Connection errors, timeouts, and invalid responses show a message and retry action in the services section; an empty result has its own state. Retry is disabled while a request is in progress. Account data loads independently, and the account panel has its own loading, error, and retry states. An account error does not remove the homepage services. Unexpected rendering errors are handled by `error.tsx`, and root layout errors by `global-error.tsx`. Server error details stay in server logs and are not sent to the UI.

## Development and project structure

`app` contains route, layout, loading, and error boundary files. Each feature in `features` owns its UI, types, model, and adapters. Shared infrastructure lives in `shared`. To add a feature, create its feature folder and import it from the relevant route; the homepage page file does not need to grow for every change.

Flex layouts, typography, buttons, and skeletons use shared Ant Design-based components. Simple containers and semantic page regions use HTML elements. Base components live in `shared/components`; Tailwind utilities style the components, and global Tailwind configuration lives in `shared/styles`; shared request utilities live in `shared/lib`. Each feature defines its own API in its feature folder. ESLint restricts direct Ant Design and Axios imports from feature code.

See [docs/architecture.md](docs/architecture.md) for the server/client boundary and architecture decisions.

### Continuing with an agent

Start with [AGENTS.md](AGENTS.md), which records the repository rules and approved behavior. The project-local skill [maintain-shahrzad](.agents/skills/maintain-shahrzad/SKILL.md) provides a task-oriented file map, API and UI workflows, and guidance for selecting checks. It lives in `.agents/skills` and can be invoked as `$maintain-shahrzad` in Codex. Agents without skill discovery can read the same `SKILL.md` directly.

For example: "Use $maintain-shahrzad to implement the requested change. Follow AGENTS.md, preserve the approved page behavior, and report the checks you performed."

## Limitations

The project backend implements the two read-only endpoints needed by this page using backend-owned data. It has no database or persistent writes. Sign-in, wallet balance, notifications, and services without a fixed destination are demo-only; no real payment is made. The scanner control and services with fixed destinations navigate to the reference website in the same tab. Destination pages and actual scanning are outside this challenge. Informational footer links also point to the reference website.

## API response contract

The standalone backend lives in `backend`. Successful responses use `{ meta: { success: true }, data: T }`; errors use `{ meta: { success: false, error_code, error_fields }, message, error_status }`. Pagination applies to paginated lists; these two endpoints do not return it. Shared response types live in `src/shared/types/index.ts`; runtime validation lives in `src/shared/lib/api-response.ts`. The Axios interceptor preserves `AxiosResponse` and checks the shared response envelope, without endpoint-specific parsers. API functions return `response.data` as `ApiResponse<T>`, following the reference PM/UL convention; consumers read the payload from its `data` field. `ApiError` preserves the message, status, and error details.

## Unit and browser tests

`npm run test:unit` runs Vitest unit tests in the Node environment without a server or browser. Tests live in `tests/unit` and cover success and error response envelopes, network error normalization, and service destination resolution. Test data is independent of backend-owned data. These logic tests do not need jsdom or React Testing Library.

`npm run test:e2e` runs Playwright browser tests and requires a production build. Playwright ignores the unit-test folder, and Vitest only reads that folder, so each runner executes only its own tests. DOM behavior, retries, and scrolling are checked with E2E tests.

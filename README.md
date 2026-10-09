# Shahrzad

A recreation of the Shahrzad homepage built with Next.js 16 App Router, React, TypeScript, Tailwind CSS, Ant Design, Zustand, SWR, and Axios. The banner, logo, city illustration, and service icons come from the reference website. The IRANYekanXFaNum font comes from the local Super App project and is loaded with `next/font/local`.

## Getting started

Node.js 22 LTS (22.13 or later) or Node.js 24 LTS is recommended.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

The homepage is available at `/home`; `/` redirects to it. `npm run dev` starts both Next.js on port 3000 and the standalone mock backend on port 4000. Stopping the command stops both processes. Run only the mock backend with `npm run mock`, or only the frontend with `npm run dev:frontend`. The mock uses Node's built-in HTTP module and Node's native TypeScript type stripping; it adds no server framework or dependency.

```bash
npm run lint
npm run typecheck
npm run build
npm run test:unit
npm run test:e2e
npm run start
```

`test:e2e` starts a temporary production server on port 3210 and the mock backend on port 4210 after the build. It requires Chrome to be installed and checks normal, empty, and retryable-error responses on desktop and mobile. If Turbopack cannot open a local connection in a restricted environment, `npm run build:webpack` builds the same production application with Webpack. `npm start` runs the standalone server with the required assets.

## Docker

```bash
docker compose up --build
# After checking the app:
docker compose down
```

Compose builds separate `web` and `mock` services. The web service connects to the mock backend at `http://mock:4000` over the internal Docker network. To use a real backend, run the frontend image with `HOME_DATA_SOURCE=backend` and `API_BASE_URL=https://example.com`; the mock service is not needed. These settings are read on the server at runtime. The build requires neither secrets nor a backend connection. `.dockerignore` excludes environment files, local dependencies, and development output from the build context. The runtime uses a non-root user.

## Data source and mock API

The default setting is `HOME_DATA_SOURCE=mock`, and the frontend always retrieves data over HTTP. Fixtures live only in `backend/mock/fixtures.mts` and are consumed only by the standalone mock backend.

| Backend endpoint | Internal Next.js endpoint | Response                                                    | Used for                                                                   |
| ---------------- | ------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------- |
| `GET /home`      | `GET /api/home`           | `HomepageData`: services, submenus, and banner              | Initial fetch with `fetch` in a Server Component; retry with Axios and SWR |
| `GET /viewer`    | `GET /api/viewer`         | `ViewerData`: demo sign-in state, wallet, and notifications | Browser request after mount with Axios and SWR                             |

For the initial render, the Next.js server requests `GET {API_BASE_URL}/home` directly. The browser calls an internal Next.js API, whose Route Handler connects to the real or mock backend. The backend URL and configuration are not exposed to the browser. This flow does not implement real authentication or payments.

```bash
curl http://127.0.0.1:4000/home
curl http://127.0.0.1:4000/viewer
curl http://127.0.0.1:3000/api/viewer
```

To use a real backend, set `HOME_DATA_SOURCE=backend` and `API_BASE_URL`. Switching the source does not require component changes, and backend failures are never silently replaced with fixture data.

Configure mock scenarios in `.env.local`. Restart the server after changing them:

- `MOCK_HOME_SCENARIO`: `normal`, `slow`, `empty`, or `error`.
- `MOCK_VIEWER_SCENARIO`: `normal` (signed out), `slow`, `signed-in` (demo account with a balance of 125,000 and two notifications), or `error`.
- The normal scenario has no delay. `slow` adds a fixed 800 ms delay, and `error` returns a 503 from the mock backend. Next.js preserves backend error statuses; connection failures return 502 and timeouts return 504.

TypeScript contracts live in `features/home/types`, and runtime validation lives in `api/home-contract.ts`. Axios responses use the explicit `HomepageData` or `ViewerData` types; network data is validated before use. See [docs/architecture.md](docs/architecture.md) for the request, error, and cache flows.

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

The interview backend contract has not been provided. The standalone mock currently implements only the two read-only endpoints needed by this page, and its contract is an assumption. Sign-in, wallet balance, notifications, and services without a fixed destination are demo-only; no real payment is made. The scanner control and services with fixed destinations navigate to the reference website in the same tab. Destination pages and actual scanning are outside this challenge. Informational footer links also point to the reference website.

## API response contract

The standalone backend lives in `backend/mock`. Successful responses use `{ meta: { success: true }, data: T }`; errors use `{ meta: { success: false, error_code, error_fields }, message, error_status }`. Pagination applies to paginated lists; these two endpoints do not return it. The shared definition and validation live in `src/shared/lib/api-response.ts`. The Axios interceptor preserves `AxiosResponse`; domain API functions use `ApiResponse<T>` and validate the envelope and data. `ApiError` preserves the message, status, and error details.

## Unit and browser tests

`npm run test:unit` runs Vitest unit tests in the Node environment without a server or browser. Tests live in `tests/unit` and cover homepage and viewer validation, success and error response contracts, network error normalization, and service destination resolution. Test data is independent of backend fixtures. These logic tests do not need jsdom or React Testing Library.

`npm run test:e2e` runs Playwright browser tests and requires a production build. Playwright ignores the unit-test folder, and Vitest only reads that folder, so each runner executes only its own tests. DOM behavior, retries, and scrolling are checked with E2E tests.

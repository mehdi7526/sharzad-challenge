# Shahrzad Homepage Architecture

## Folder boundaries

`src/app` contains only Next.js routes, layouts, loading UI, and error boundaries. The server-rendered page lives in `features/home/pages/home-page.tsx`; UI components, interactive state, TypeScript contracts, and domain requests live in the feature's `components`, `model`, `types`, and `api` folders. Shared Ant Design wrappers live in `shared/components`, styles in `shared/styles`, and general request utilities in `shared/lib`. This is the project's chosen structure; Next.js does not require a feature-based folder structure.

`backend/mock` is a standalone backend implemented with Node's built-in HTTP module. `fixtures.mts` is the only source of mock data, and only `server.mts` imports it. The frontend and hooks never import fixtures directly. Node runs `.mts` files using its native TypeScript type stripping, while TypeScript also checks them as part of the project. The mock has no separate framework, context, or published package.

## The two data-fetching flows

```text
Initial page request:
HomePage (Server Component)
  → getHomepageData
  → getBackendData + fetch
  → backend GET /home
  → parseHomepageData
  → SSR + SWR fallbackData

Viewer information after mount:
WalletCard / HomePanels
  → useViewer + SWR
  → getViewer + Axios
  → Next.js GET /api/viewer
  → getViewerData + fetch
  → backend GET /viewer
  → parseViewerData
  → typed response, validated again in the browser
```

The server does not make an HTTP request to its own Route Handler for the initial data. `GET /api/home` reuses `getHomepageData` for browser retries. `GET /api/viewer` is the browser-to-backend boundary. The backend URL is read only on the server. This flow does not yet include authentication; session handling and authorization must be added to match the real backend contract.

## Endpoint contracts

`home-endpoints.ts` defines `/home` and `/viewer` in one place. Current GET requests have no query, body, or path parameters. The project response contract is: success is `{ meta: { success: true }, data: T }`, and an error is `{ meta: { success: false, error_code, error_fields }, message, error_status }`. Pagination is not added to non-paginated endpoints; it remains optional for list responses. Shared envelope definitions and validation live in `shared/lib/api-response.ts`. The mock backend supports GET only; other methods return 405 with `Allow: GET`, and unknown paths return 404. Responses include `Cache-Control: no-store`.

`HomepageData` contains `services` and `banner`. Each service has a unique `id`, title, image, destination, optional badge, and optional submenu. The banner's `serviceId` references one of the services. An empty response must use `services: []` and `banner.serviceId: ''`.

`ViewerData` is a discriminated union. When `signedIn: false`, the balance must be `null` and the unread notification count must be zero. When `signedIn: true`, the balance must be a non-negative number and the unread count a non-negative integer. Runtime validation enforces these rules. The signed-in fixture is for demonstration only.

`home-contract.ts` accepts `unknown` only at the JSON validation boundary and returns typed objects without `any` or casts. Domain API functions return `Promise<HomepageData>`, `Promise<ViewerData>`, or `Promise<HomepageResult>`. Axios generics describe the expected compile-time contract; parsers verify the actual network response.

## Request utilities and error handling

`getBackendData<T>(path, parse)` in `shared/lib/backend-request.ts` is server-only. It uses `fetch` with `cache: no-store`, and infers the return type from the parser. Its timeout is eight seconds. Valid backend error statuses and messages, including `error_code` and `error_fields`, are preserved. Invalid JSON or a contract mismatch becomes 502; a timeout becomes 504. Configuration, URL, and programming errors are not hidden; they reach an error boundary or a Route Handler's 500 response.

The shared browser Axios instance in `shared/lib/api-request.ts` uses `/api` as its base URL and has an eleven-second timeout. `create-api-request.ts` configures HTTP defaults and a response error interceptor. The success interceptor returns the original `AxiosResponse`; domain APIs request `ApiResponse<T>` and validate both the envelope and its data. Errors become `ApiError` instances with status and details. The flow does not serialize errors with `JSON.stringify`, use `any`, mutate Axios responses, or add fake authentication redirects. `normalizeApiError` provides the UI with consistent messages for valid Route Handler errors, timeouts, and connection failures. Feature code does not import Axios directly.

## Cache and loading

`useHomepage` passes server-rendered data to SWR as `fallbackData` and avoids a duplicate request on mount. The header, service grid, and banner share the same cache key; `mutate()` refreshes all consumers after a retry.

`useViewer` has no server fallback and requests data in the browser after mount. The wallet card and panels share one key, so SWR deduplicates concurrent requests. The account panel has independent loading, error, and retry states; an account error does not affect the services. Zustand does not store API data.

`loading.tsx` uses Next.js streaming to display a skeleton. Expected network errors are handled in the relevant UI; unexpected rendering errors are handled by `error.tsx`, while root layout errors use `global-error.tsx` and the installed Next.js version's `retry` API.

## Running and connecting a backend

With `HOME_DATA_SOURCE=mock`, `npm run dev` and `npm start` start both the standalone mock backend and frontend, and stop both when the runner exits. `npm run mock` starts only the backend; `npm run dev:frontend` starts only Next.js. The mock defaults to port 4000; `MOCK_PORT` and `API_BASE_URL` can be set explicitly.

With `HOME_DATA_SOURCE=backend`, `API_BASE_URL` is required and the runner does not start the mock. Both sources use the same `fetch`, Axios, and parsers. There is no automatic fallback to fixtures. Compose defines two services; the frontend connects to `http://mock:4000` over the Docker network.

`MOCK_HOME_SCENARIO` supports `normal`, `slow`, `empty`, and `error`. `MOCK_VIEWER_SCENARIO` supports `normal`, `slow`, `signed-in`, and `error`. The normal scenario has no random delay or error; `slow` adds a fixed 800 ms delay, and `error` returns a 503 from the mock backend. Scenarios are configured through environment variables; there is no public query parameter to change them.

## State, navigation, and scrolling

A separate store is created for each `HomeStoreProvider`, so state is not shared between server-rendered requests. `serviceDestination` maps fixed destinations to reference-site URLs; both the service grid and header menu use the same behavior and open links in the same tab. Services without a fixed destination open a demo information panel.

`HomeScrollContent` tracks scroll events, content height with `ResizeObserver`, and viewport resizing. Retries and newly loaded images do not leave the footer state stale. The shell reads only a boolean for the compact header; the mobile footer background uses the remaining pixel distance, and the desktop footer reads only whether scrolling reached the bottom. When the header is compact, the logo and scanner control are removed from keyboard and screen-reader access. CSS respects `prefers-reduced-motion`.

## Styles and palette

Raw colors are defined only in `shared/config/palette.ts`. `paletteStyle` writes CSS variables onto the HTML element during server rendering, so the Ant Design theme and CSS Modules share one color source. Shell layout and coordinated header, wallet, and content motion are in `home-shell`; services, banner, and dropdown styling are in `home-services`; footer, navigation, and panel styles live in their respective files. Tailwind provides the four-column service grid layout. Reference image assets were not changed.

## Verification and limitations

Playwright covers server-rendered homepage data, the browser viewer request, errors and account retries, invalid responses, destinations, and mobile/desktop scrolling. E2E runs use port 4210 for the mock backend and 3210 for the frontend to avoid conflicting with the development server.

The challenge's backend contract has not been provided. The mock simulates only the read-only endpoints required by the UI. Sign-in, wallet, and notification data are demonstrative. Payments, real authentication, and destination pages are not implemented; fixed destinations navigate to the reference site.

## API readability and error handling

Functions in `home-client.ts` make typed requests and return domain data. `readApiData` in `shared/lib/api-error.ts` validates the response envelope and data, then converts contract errors into one displayable error. The API function returns domain data directly, so UI code does not depend on `response.data.data`.

`shared/hooks/use-error-handler.ts` follows the `handleError` pattern used in pm and displays messages through Ant Design. Data hooks connect it to SWR's `onError` callback. A failed request or retry shows a notification, while the inline error and retry control remain visible. Calling `mutate()` without arguments lets SWR retain the request error, so UI code does not rely on `catch` to detect failure. Data, loading, and request errors remain in SWR; the error handler does not keep duplicate state. Errors use the typed `ApiError`; JSON is not serialized into or parsed from `Error.message`. The hook is not used for server-side fetching.

## Unit tests

Vitest runs in the Node environment and uses the project's `@/` alias to include only `tests/unit/**/*.test.ts`. These tests cover domain contracts, response envelopes, network errors, and service destinations. Small fixtures are defined in the tests; no backend server or browser is needed. Async Server Components and scroll behavior remain covered by Playwright. No unit tests were added for presentational wrappers alone.

# Shahrzad Homepage Architecture

## Folder boundaries

`src/app` contains only Next.js routes, layouts, loading UI, and error boundaries. The server-rendered page lives in `features/home/pages/home-page.tsx`; UI components, interactive state, TypeScript contracts, and domain requests live in the feature's `components`, `hooks`, `model`, `types`, and `api` folders. Shared Ant Design wrappers live in `shared/components`, styles in `shared/styles`, and general request utilities in `shared/lib`. This is the project's chosen structure; Next.js does not require a feature-based folder structure.

`backend` is the project's standalone HTTP backend, implemented with Node's built-in HTTP module. `data.mts` owns the service data, and only `server.mts` imports it. The frontend and hooks never import backend data directly. Node runs `.mts` files using its native TypeScript type stripping, while TypeScript also checks them as part of the project. The backend has no separate framework, context, or published package.

## Data-fetching flows

```text
Initial page: HomePage → getHomepage → Axios fetch adapter → backend /home → SSR
Browser viewer: useViewer → getViewer → backend /viewer
Browser home retry: useHomepage/mutate → getHomepage → backend /home
```

Both environments use `NEXT_PUBLIC_API_BASE_URL`. With `NEXT_PUBLIC_API_USE_PROXY=true`, browser requests instead go through `/api/home` or `/api/viewer`; those Route Handlers reuse the same API functions to reach the backend. Server requests never call the application's own Route Handlers. The public settings are fixed at build time and must work from both environments. There is no automatic fallback between targets, and authentication is not implemented.

## Endpoint contracts

API functions use the literal paths `/home` and `/viewer`; SWR uses those same paths as cache keys. Current GET requests have no query, body, or path parameters. The project response contract is: success is `{ meta: { success: true }, data: T }`, and an error is `{ meta: { success: false, error_code, error_fields }, message, error_status }`. Pagination is not added to non-paginated endpoints; it remains optional for list responses. Shared envelope types live in `shared/types/index.ts`; runtime validation lives in `shared/lib/api-response.ts`. The project backend supports GET only; other methods return 405 with `Allow: GET`, and unknown paths return 404. Responses include `Cache-Control: no-store`.

`HomepageData` describes `services` and `banner` at compile time. The backend data gives each service a unique `id` and makes `banner.serviceId` reference one of those services. Its empty scenario uses `services: []` and `banner.serviceId: ''`. These relationships are not checked against backend responses at runtime.

`ViewerData` is a single type with `signedIn: boolean`, `balance: number | null`, and `unreadCount: number`. The backend supplies a null balance and zero unread notifications for guests. TypeScript does not enforce the relationship between sign-in state and balance; runtime domain validation is intentionally omitted. The signed-in scenario supplies account data without implementing authentication.

Server and browser API functions return `Promise<ApiResponse<HomepageData>>` or `Promise<ApiResponse<ViewerData>>`. The page passes initial `HomepageData` and an optional error message separately; there is no second API response type. Axios generics describe the expected compile-time contract. Endpoint payloads are trusted without runtime schemas, following the requested PM/UL pattern.

## Request utilities and error handling

`createApiRequest` in `shared/lib/create-api-request.ts` creates Axios clients with common headers, timeout, and success/error interceptors. Success checks only the `{ meta, data }` envelope. It preserves the original `AxiosResponse`. Transport and contract failures become displayable `ApiError` objects; unexpected programming errors are not hidden. There is no `getBackendData` or `readApiData` call chain.

`home-api.ts` calls the shared `apiRequest` and returns the `ApiResponse<T>` envelope. `api-request.ts` passes the environment URL directly to `createApiRequest`; the factory owns request and response interceptors. Its request interceptor validates the single HTTP(S) `NEXT_PUBLIC_API_BASE_URL`. In the browser it uses this URL directly, or `/api` when `NEXT_PUBLIC_API_USE_PROXY=true`, with an eleven-second timeout. On the server it always uses the same backend URL, an eight-second timeout, the fetch adapter, and `cache: no-store`. It changes individual request config rather than shared defaults. Both public settings are inlined at build time, so production changes require a rebuild. The backend supports exact-origin GET CORS through `BACKEND_CORS_ORIGIN`.

Valid upstream HTTP error statuses, messages, and details are preserved. Invalid JSON or an invalid response envelope returns 502; connection failures return 502; timeouts return 504. The initial page catches expected API errors to render the existing inline retry state. Route Handlers return the API envelope on success and translate errors into HTTP responses. SWR consumers extract the payload from the envelope; `useErrorHandler` displays notifications without storing duplicate API state. Feature code imports the configured client or factory, not Axios directly.

## Cache and loading

`useHomepage` passes server-rendered data to SWR as `fallbackData` and avoids a duplicate request on mount. The header, service grid, and banner share the same cache key; `mutate()` refreshes all consumers after a retry.

`useViewer` has no server fallback and requests data in the browser after mount. The wallet card and panels share one key, so SWR deduplicates concurrent requests. The account panel has independent loading, error, and retry states; an account error does not affect the services. Zustand does not store API data.

`loading.tsx` uses Next.js streaming to display a skeleton. Expected network errors are handled in the relevant UI; unexpected rendering errors are handled by `error.tsx`, while root layout errors use `global-error.tsx` and the installed Next.js version's `retry` API.

## Running and connecting a backend

`npm run dev` and `npm start` start both the project backend and frontend by default, and stop both when the runner exits. `npm run backend` starts only the backend; `npm run dev:frontend` starts only Next.js. `BACKEND_PORT` defaults to 4000. `NEXT_PUBLIC_API_BASE_URL` is the shared request address, independent of how the backend process is launched.

Set `START_BACKEND=false` to connect to an already-running backend without launching a second process. There is no data-source selector or fallback to frontend data. All connections use the same Axios factory. Compose defines `web` and `backend` services sharing a network namespace, allowing the common loopback backend URL from both server and host browser. The backend service publishes both ports. Requests require `NEXT_PUBLIC_API_BASE_URL`; the runner does not invent another address.

`BACKEND_HOME_SCENARIO` supports `normal`, `slow`, `empty`, and `error`. `BACKEND_VIEWER_SCENARIO` supports `normal`, `slow`, `signed-in`, and `error`. The normal scenario has no random delay or error; `slow` adds a fixed 800 ms delay, and `error` returns a 503 from the project backend. Scenarios are configured through environment variables; there is no public query parameter to change them.

## State, navigation, and scrolling

A separate store is created for each `HomeStoreProvider`, so state is not shared between server-rendered requests. `serviceDestination` maps fixed destinations to reference-site URLs; both the service grid and header menu use the same behavior and open links in the same tab. Services without a fixed destination open a demo information panel.

`HomeScrollContent` tracks scroll events, content height with `ResizeObserver`, and viewport resizing. Retries and newly loaded images do not leave the footer state stale. The shell reads only a boolean for the compact header; the mobile footer background uses the remaining pixel distance, and the desktop footer reads only whether scrolling reached the bottom. When the header is compact, the logo and scanner control are removed from keyboard and screen-reader access. CSS respects `prefers-reduced-motion`.

## Styles and palette

Raw colors are defined only in `shared/config/palette.ts`. `paletteStyle` writes CSS variables onto the HTML element during server rendering. The Ant Design theme and Tailwind's `@theme inline` aliases consume these same variables; aliases do not duplicate raw color values. Reference image assets are unchanged.

Components use Tailwind utilities for layout, typography, responsive styling, and transitions. Exact pixel values remain explicit arbitrary values where the approved design requires them. `shared/styles/globals.css` contains the Tailwind import, palette aliases, shared variants, base rules, shared Ant Design defaults using `@apply`, and reduced-motion support. There are no CSS Modules. The layer order places Ant Design and shared defaults below utilities so component utilities can override them predictably.

The `desktop` and `mobile` variants retain the original 1024 px breakpoint; `desktop-tight` covers 1024–1248 px. `squircle` and `superellipse` retain the original browser feature checks. The viewport's named `group/home` exposes `data-compact`; mobile group variants coordinate the header background, logo, scanner, notification control, wallet, and content transforms. Accessibility attributes still come from the same store state. The footer's pixel-dependent transform remains an inline style because it depends on measured scroll distance, while its layout and transition use utilities. Static class names are written in full so Tailwind can discover them during production builds.

## Verification and limitations

Playwright covers server-rendered homepage data, the browser viewer request, errors and account retries, destinations, and mobile/desktop scrolling. E2E runs use port 4210 for the project backend and 3210 for the frontend to avoid conflicting with the development server.

The project backend implements the read-only endpoints required by the UI with backend-owned data. It has no database or persistent writes. Sign-in, wallet, and notification data are demonstrative. Payments, real authentication, and destination pages are not implemented; fixed destinations navigate to the reference site.

## API readability and error handling

API functions make typed Axios requests and return `response.data`, the `ApiResponse<T>` envelope. The shared response interceptor checks the envelope; endpoint payloads have TypeScript types without runtime domain validation. SWR fetchers read the envelope’s `data` field, so components receive domain data without parsing.

`shared/hooks/use-error-handler.ts` follows the `handleError` pattern used in pm and displays messages through Ant Design. Data hooks connect it to SWR's `onError` callback. A failed request or retry shows a notification, while the inline error and retry control remain visible. Calling `mutate()` without arguments lets SWR retain the request error, so UI code does not rely on `catch` to detect failure. Data, loading, and request errors remain in SWR; the error handler does not keep duplicate state. Errors use the typed `ApiError`; JSON is not serialized into or parsed from `Error.message`. The hook is not used for server-side fetching.

## Unit tests

Vitest runs in the Node environment and uses the project's `@/` alias to include only `tests/unit/**/*.test.ts`. These tests cover response envelopes, network errors, server requests, and service destination resolution. Small fixtures are defined in the tests; no backend server or browser is needed. Async Server Components and scroll behavior remain covered by Playwright. No unit tests were added for presentational wrappers alone.

## React 19 compatibility and banner loading

Ant Design 5 uses the official `@ant-design/v5-patch-for-react-19` compatibility package, imported once at the client provider entry. This keeps React 19 rendering compatible with Ant Design's wave effects and imperative rendering without suppressing warnings or changing library major versions.

`PromoBanner` reserves its 2.48 aspect ratio in both the route loading shell and the final link. A shared Ant Design skeleton remains visible until Next Image's `onLoad` fires. The image state is scoped to its source using a React key, so a new banner starts loading independently after a refresh. Image failure replaces the skeleton with a Persian fallback in the same frame. Empty or failed homepage responses do not invent a banner.

## Homepage refactor boundaries

`serviceDestination` maps relative paths to the reference site, leaves HTTPS links as provided, and uses the demo panel for `#` and unsupported schemes. It does not validate all URLs or image fields from the backend. External banner images follow the same `unoptimized` policy as external service images.

Scroll synchronization shares one local function across initial measurement, scroll, resize, and content observation. Account and service panels share one modal frame with explicit content branches and an accessible title; no generic panel framework or new context was introduced. When the panel changes, focus moves to its content so keyboard controls remain inside the dialog. A local visibility flag lets Ant Design finish closing and restore trigger focus before the panel is unmounted. Backend scenario errors identify the supplied value and the allowed scenarios.

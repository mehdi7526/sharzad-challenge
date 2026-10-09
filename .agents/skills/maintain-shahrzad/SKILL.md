---
name: maintain-shahrzad
description: Continue, refactor, or review this Shahrzad Next.js homepage project using its existing API boundaries, shared UI, and approved RTL interactions. Use for work in this repository rather than starting an unrelated Next.js application.
---

# Maintain Shahrzad

Use this skill to implement a requested change while keeping the project's behavior and responsibilities understandable. Repository rules live in [AGENTS.md](../../../AGENTS.md); setup and detailed architecture live in [README.md](../../../README.md) and [docs/architecture.md](../../../docs/architecture.md). Read the relevant sections, then inspect the actual implementation. The file map below describes the current code, not a requirement to preserve every helper forever.

## Find the affected flow

Paths are relative to the repository root. Bare filenames in a row share the preceding file's directory.

| Task                               | Start with these files, relative to the repository root                                                                                                                 |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Initial render and SSR data        | `src/features/home/pages/home-page.tsx`, `src/features/home/api/home-server.ts`, `src/shared/lib/backend-request.ts`                                                    |
| Browser requests, cache, and retry | `src/features/home/api/home-client.ts`, `use-homepage.ts`, `use-viewer.ts`; `src/shared/lib/api-request.ts`, `create-api-request.ts`                                    |
| Response validation and errors     | `src/features/home/api/home-contract.ts`, `src/features/home/types/index.ts`; `src/shared/lib/api-response.ts`, `api-error.ts`; `src/shared/hooks/use-error-handler.ts` |
| Browser-to-backend boundary        | `src/app/api/home/route.ts`, `src/app/api/viewer/route.ts`                                                                                                              |
| Mock responses and execution       | `backend/mock/server.mts`, `backend/mock/fixtures.mts`, `.env.example`, `scripts/run.mjs`, `compose.yml`                                                                |
| Header, wallet, and scroll         | `src/features/home/components/home-header.tsx`, `home-shell.tsx`, `home-content.tsx`, `home-viewport.tsx`, `wallet-card.tsx`; `src/features/home/model/home-store.tsx`  |
| Services, menu, and banner         | `src/features/home/components/services-grid.tsx`, `header-services-menu.tsx`, `promo-banner.tsx`; `src/features/home/model/use-open-service.ts`                         |
| Panels and lazy loading            | `src/features/home/components/home-provider.tsx`, `home-panels.tsx`                                                                                                     |
| Theme, font, and UI primitives     | `src/app/layout.tsx`, `src/app/_fonts.ts`, `src/shared/config/palette.ts`, `theme.ts`, `src/shared/providers/app-providers.tsx`, `src/shared/components`                |
| Regression coverage                | `tests/unit`, `tests/home.spec.ts`, `tests/viewer.spec.ts`, `tests/home-states.spec.ts`                                                                                 |

## Make the change

1. Trace the relevant flow from its consumer to its data or state source. Check all consumers before changing a shared key, prop, contract, or scroll field.
2. Read the applicable guide in `node_modules/next/dist/docs`. In particular, check fetching-data and backend-for-frontend for request changes, server-and-client-components for execution boundaries, and the installed error/loading conventions for route recovery. Resolve the installed version rather than assuming old Next.js behavior.
3. Put the change at the layer that owns it. Keep public domain APIs short and return validated domain data; keep HTTP setup and common error conversion in shared utilities. Keep UI decisions in components or feature hooks.
4. Verify the requested outcome with the checks below. Document any changed contract or setup, and report evidence without treating architecture choices as universal Next.js requirements.

## API changes

The two existing paths are:

```text
Initial home: HomePage → getHomepageData → getBackendData/fetch → backend /home
Browser viewer: useViewer → getViewer/Axios → Next /api/viewer → getViewerData/fetch → backend /viewer
Home retry: useHomepage/mutate → getHomepage/Axios → Next /api/home → getHomepageData → backend /home
```

The menu, services, and banner consume the same homepage SWR key. Account panels and wallet cards share the viewer key. `useHomepage` receives server fallback data and disables mount revalidation; `useViewer` fetches after mount. Preserve that distinction unless the task changes it.

When adding or changing an endpoint, update only the necessary domain type, parser, endpoint path, server/client consumers, and Route Handler. Add mock data only if the UI needs it. Keep API configuration out of components and do not fabricate a full backend framework for these GET endpoints.

The Axios success interceptor preserves `AxiosResponse`. `readApiData` currently handles browser envelope validation and contract-error conversion; `normalizeApiError` handles transport errors. SWR's `onError` calls `handleError`. A bound `mutate()` with no arguments stores a failed revalidation in SWR; a component's `try/catch` is not the error notification mechanism for that flow.

Check success, empty data where supported, invalid JSON/contract, unavailable backend, and retry freshness as relevant. Keep the signed-out viewer consistent with a null balance and zero unread notifications; the signed-in fixture is demo data. An actual authentication change also requires a deliberate session and SWR cache-identity policy.

## Visual and interaction changes

The approved reference is `https://web.shahrzadcity.ir`. Inspect it when the user requests a new comparison; do not infer live behavior from old screenshots. The local font is intentionally retained even if the reference uses another font. Preserve source image/SVG content unless asked to change it.

Scroll happens inside `#home-content`, not the window. `#home-scroll-body` is observed for content changes. Mobile layout starts below 1024 px in the current implementation. The desktop footer is visible only when remaining scroll is at most one pixel; it starts hidden before scroll state is measured. Retain initial synchronization and resize/content observers.

For changes around header or footer motion, inspect top, intermediate scroll, bottom, and scrolling back up. Include resize and content changes after loading or retry when relevant. Check hidden controls' keyboard access and reduced-motion behavior. Keep exact sizes needed for the approved layout; do not redesign while refactoring.

## Choose verification

Read `package.json`, `vitest.config.mts`, and `playwright.config.ts` if scripts or test scope have changed. Current commands are:

| Change                                     | Appropriate checks                                                                        |
| ------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Documentation or agent instructions        | Format the edited Markdown/YAML, review linked paths, and inspect the diff                |
| Pure logic, contracts, or error conversion | `npm run test:unit`, `npm run typecheck`, `npm run lint`, `npm run format:check`          |
| Browser fetching, loading, or retry        | Above checks, a current production build, and relevant Playwright tests                   |
| Layout, navigation, or scroll              | Lint/types/format, relevant Playwright tests, and direct visual comparison when needed    |
| Build, runtime, or Docker setup            | The affected build/run command; validate Docker only when changing or reviewing that path |

`npm run test:unit` runs Vitest in Node without a server. `npm run test:e2e` runs normal, empty, and error scenarios with production Next on port 3210 and mock HTTP on port 4210. Chrome must be installed. The mobile project uses Chromium device emulation; it does not establish real iPhone/Safari compatibility.

Build before E2E; build alone runs neither test suite. Use `npm run build` normally, or `npm run build:webpack` for a demonstrated Turbopack environment limitation. Do not run dev and build against the same output concurrently. Restore any development run you stopped. `npm run dev` starts Next and mock together in mock mode; `npm start` starts the production runner.

Mock scenarios are configured through environment variables and require a restart. `MOCK_HOME_SCENARIO` supports normal/slow/empty/error, and `MOCK_VIEWER_SCENARIO` supports normal/slow/signed-in/error. Normal adds no delay; slow adds 800 ms. The backend error scenario returns 503. Connection failures and invalid upstream contracts become 502; upstream timeouts become 504.

## Finish with a usable handoff

Describe the changed behavior, the layer that owns it, relevant files, and checks actually performed. Record setup or API changes in the existing documentation. Keep production limitations explicit when relevant: real session handling, authorization, payments, and destination-page implementations are outside the current demo. Avoid inventing guarantees from successful unit or browser tests.

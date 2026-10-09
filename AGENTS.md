<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Shahrzad project rules

These rules apply to this repository. Explicit user requests can change project defaults; explain material architecture changes rather than treating the current implementation as the only valid approach.

## Start here

- Read `README.md` and the relevant sections of `docs/architecture.md` before changing a flow.
- For implementation or review work, use `.agents/skills/maintain-shahrzad/SKILL.md` for the file map, workflow, and verification guidance.
- Inspect the working tree and current scripts before editing. Keep unrelated in-progress changes intact.
- Consult the documentation bundled with the installed Next.js version for the affected API. Preserve the generated Next.js block above.

## Scope and approved behavior

- Preserve the approved Persian RTL homepage, existing local font, reference assets, spacing, responsive layout, and scroll animations unless the requested change requires otherwise.
- The desktop footer appears from below only at the end of the content scroll and hides when scrolling away. Keep mobile header, logo, scanner, wallet, content, and footer motion coordinated.
- Keep hidden controls out of keyboard and screen-reader access; retain semantic HTML and reduced-motion support.
- Fixed service destinations open in the same tab; services without a fixed destination show their demo panel. The header menu and service grid must use the same destination logic.
- Authentication, wallet operations, and payments are demonstrative. Do not describe them as real operations. Extend scope only when requested.

## Code organization and readability

- Keep `src/app` focused on Next.js routing, layouts, loading UI, and error boundaries; keep domain behavior in `src/features/<feature>`.
- Shared UI lives in `src/shared/components`, styles in `src/shared/styles`, request infrastructure in `src/shared/lib`, and general hooks in `src/shared/hooks`. Domain APIs stay in the feature's `api` folder. Do not introduce a `shared/api` or `shared/lib/http` layer for request infrastructure.
- Use shared Ant Design components for controls and native HTML for simple containers and semantic regions. Add wrappers when they provide useful common behavior or an intentional public API.
- Prefer explicit, short domain functions. Avoid speculative abstractions, needless import/export chains, empty folders, separate published packages, and unnecessary context or prop forwarding.
- Keep TypeScript strict. Validate network JSON at the boundary; `unknown` is appropriate before validation. Avoid `any` and casts that merely assert a network response is valid.
- Keep documentation and agent instructions in English and product copy in Persian. Explain decisions in the user's language when reporting work.

## API and state boundaries

- Initial homepage data is fetched by the Server Component through `home-server.ts` and the server request utility. Do not make the server call its own internal Route Handler over HTTP.
- Browser requests use the shared Axios instance and SWR through feature API functions and hooks. Route Handlers connect those browser requests to the backend.
- Keep backend configuration server-side: `HOME_DATA_SOURCE` selects `mock` or `backend`, and `API_BASE_URL` configures the upstream address. The browser uses the relative `/api` base URL.
- Keep response types and runtime validation aligned. Success uses `{ meta: { success: true }, data }`; errors carry `message`, `error_status`, `error_code`, and `error_fields` through the error envelope.
- Keep API functions focused on requests and validated domain data. Normalize transport errors centrally, display browser notifications through `useErrorHandler`, and preserve inline errors with retry in the relevant UI. Unexpected errors must remain observable.
- SWR owns API data, loading, errors, and refreshes. Zustand owns interactive UI state; do not copy API responses into it. Keep the store scoped to its provider.
- Fixtures belong to `backend/mock` and are consumed by the mock implementation only. Application components, hooks, and stores must not import them. Unit tests should define their own small input data.
- Both sources use HTTP. Never silently replace real backend failures with mock data. Keep scenarios explicit and deterministic; no random failures or forced latency in normal execution.
- The current `no-store` and SWR refresh settings are deliberate defaults. Change cache or account-identity policies with a stated product reason, and review all consumers of the same data.

## Styling and scroll state

- Define raw UI colors in `shared/config/palette.ts`. Ant Design and CSS Modules share that palette through the theme and server-rendered CSS custom properties. Preserve colors embedded in reference assets.
- Use CSS Modules for precise layout and animations. Tailwind currently handles the simple service grid; avoid expanding the styling stack without a concrete need.
- Keep coordinated shell motion in the shell stylesheet and other component responsibilities in their existing stylesheets.
- Update scroll state on initial mount, scroll, resize, and content-height changes. Loading, retry, and image changes must not leave footer state stale.
- Subscribe to the smallest useful state. Only consumers that need pixel distance should render from it; avoid making the whole shell respond to every scroll event.

## Verification and handoff

- Choose checks for the change: unit tests for contracts and pure logic; Playwright for DOM, navigation, loading, retry, and scroll behavior. Add meaningful regression cases rather than tests for trivial wrappers.
- For application changes, run `lint`, `typecheck`, and `format:check`, plus the relevant tests and build when runtime or build behavior is affected. Documentation-only changes need formatting and link/content review.
- `npm run build` does not run tests. Unit and E2E scripts are separate, and E2E requires a current production build. Prefer the default build; use `build:webpack` when the environment blocks Turbopack and report that distinction.
- If a build requires stopping development servers, stop only this project's processes and restore the previous run after checks.
- Update `README.md` and `docs/architecture.md` when setup, contracts, or responsibilities change. Report actual checks and remaining limits; do not claim pixel-perfect fidelity, production authentication, Docker execution, or test coverage that was not verified.

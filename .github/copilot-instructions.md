# Copilot Instructions for Hex Hole Heroes

These instructions apply to all AI agents (GitHub Copilot, Claude, etc.) working on this repository.

## Pull Request Requirements

- **Screenshots required**: Whenever a PR is created or updated that modifies any UI element (components, pages, styles, layouts, themes), include at least one screenshot showing the rendered result. Screenshots should be captured from the running development server (`npm run dev`) or a production build (`npm run build && npm run preview`).

## Tech Stack

- **React 18 + TypeScript** — all components must be typed; avoid `any`
- **Vite** — build tool; `base` is set to `/hex-hole-heroes/` for GitHub Pages
- **React Router v6** — use `<Routes>` / `<Route>`; nested routes under the `<Layout>` outlet
- **Redux Toolkit + RTK Query** — manage all shared state in the Redux store; use the existing `apiSlice` as the base for any new API endpoints
- **Material UI (MUI)** — use MUI components and the MUI theme system; do not introduce other CSS or UI frameworks

## Code Standards

- All new source files must be TypeScript (`.ts` / `.tsx`).
- Export one component per file; the file name must match the component name.
- All React components must have a corresponding test file (`ComponentName.test.tsx`) using Vitest and React Testing Library.
- Tests must run with `npm test` and coverage with `npm run test:coverage`.
- Do not commit the `dist/`, `coverage/`, or `node_modules/` directories.

## Workflow

- CI runs on every PR (`ci.yml`): all tests must pass before merging.
- Deployment to GitHub Pages runs on push to `main` (`deploy.yml`): keep the `dist/` output compatible with the `/hex-hole-heroes/` base path.

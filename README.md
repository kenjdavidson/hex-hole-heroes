# Hex Hole Heroes

A golf-based hex board game prototype built as a web application. Players navigate a hexagonal grid course, aiming to sink their piece into the "hole" in as few moves as possible.

## Tech Stack

- **React 18** + **TypeScript** — UI and type safety
- **Vite** — Fast build tooling and dev server
- **React Router v6** — Client-side routing
- **Redux Toolkit** + **RTK Query** — State management and future multiplayer API
- **Material UI (MUI)** — Component library and theming
- **Vitest** + **React Testing Library** — Unit and integration testing

## Getting Started

### Prerequisites

- Node.js 20+
- npm 9+

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

### Run tests

```bash
npm test
```

### Run tests with coverage

```bash
npm run test:coverage
```

### Build for production

```bash
npm run build
```

## Project Structure

```
src/
├── main.tsx              # App entry point (Redux + Router providers)
├── App.tsx               # Route definitions
├── App.test.tsx          # App smoke test
├── store/
│   ├── index.ts          # Redux store configuration
│   └── apiSlice.ts       # RTK Query API slice (multiplayer-ready)
├── pages/
│   ├── HomePage.tsx      # Landing / game lobby page
│   └── NotFoundPage.tsx  # 404 page
└── components/
    └── Layout.tsx        # App shell with navigation
```

## License & Trademark

**Hex Hole Heroes** is a trademark of the game creator. The game design, rules,
and name are proprietary.

The source code is licensed under [CC BY-NC 4.0](LICENSE). You may share and
adapt the code for non-commercial purposes with attribution.

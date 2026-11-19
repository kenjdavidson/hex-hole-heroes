# Hex Hole Heroes

A golf-based hex board game prototype built as a web application. Players navigate a hexagonal grid course, aiming to sink their piece into the "hole" in as few moves as possible.

## Tech Stack

- **React 18** + **TypeScript** — UI and type safety
- **Vite** — Fast build tooling and dev server
- **React Router v6** — Client-side routing
- **Redux Toolkit** + **RTK Query** — State management and future multiplayer API
- **Zustand** — Lightweight local canvas state
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

## Terrain pieces

The `src/components/tiles` exports are reusable React-Konva pieces for a
`Layer`. Each takes an axial `origin` and an optional clockwise `rotation` in
degrees. Use multiples of 60° when the rotated hexes must align with the board
grid; other angles are visual rotations and do not align to that grid.

- `FairwayPiece` offers `straight` (6×20), `short` (6×10), `long` (6×12),
  `dogleg-left`, `dogleg-right`, and `split` shapes. Pieces can be placed
  together, with hazards drawn afterward to overlay them.
- `GreenPiece` offers `round` (default), `square`, `oval`, `long`, `bean`, and
  `flower`. Each includes a pin at the origin and a one-hex fairway fringe.
- `BunkerPiece` and `WaterPiece` accept `rectangle`, `flower`, or `bean` shapes.
  Rectangle and bean sizes use positive integer `width` and `height` in hexes;
  flower is a fixed seven-hex shape. Omitting these props preserves their
  original small shapes. Specifying a shape or size defaults to 2×2 for
  bunkers and 6×2 for water. Invalid dimensions use those defaults.
- `TeePiece` is a rectangular tee. The existing fairway and tree pieces remain
  available individually.

For example:

```tsx
<Layer>
  <FairwayPiece origin={{ q: 15, r: 12 }} shape="straight" />
  <GreenPiece origin={{ q: 27, r: 12 }} shape="oval" />
  <WaterPiece origin={{ q: 20, r: 12 }} width={8} height={2} />
  <BunkerPiece origin={{ q: 28, r: 15 }} shape="flower" />
</Layer>
```

These are rendering components; placing them does not yet update gameplay
terrain or add them to the board automatically.

## State Management

The app uses **two separate stores** that manage different concerns:

### Redux Store (`src/store/`)

Manages **game-level state** that needs to persist across sessions and is shared across multiple UI components:

| What | Where | Why Redux |
|---|---|---|
| Active game (golfer, clubs, holes, score) | `store/game/slice.ts` | Persisted to `localStorage` via a listener middleware; consumed by the app shell, scorecard, and routing guards |
| Future multiplayer API calls | `store/apiSlice.ts` | RTK Query is ready to wire up a backend once needed |

Redux is the right choice here because the game session is **serialised state** — it survives page reloads, is read by many components at once, and will eventually travel over the wire to a server.

### Zustand Store (`src/store/hexStore.ts`)

Manages **transient canvas state** that only the board rendering layer needs to know about:

| What | Where | Why Zustand |
|---|---|---|
| Ball hex coordinates `(q, r)` | `hexStore.ts` | Updated on every move; only consumed by `HexBoard`; never needs to persist or be serialised |

Zustand is the right choice here because ball position is **high-frequency, render-local state** — it changes on every shot and only drives a single canvas component. Using the heavier Redux machinery for this would add unnecessary boilerplate and dispatch overhead.

---

**Rule of thumb:** if the state needs to be saved, shared across routes, or sent to a server → **Redux**. If it only drives the canvas and can be discarded on refresh → **Zustand**.

## Project Structure

```
src/
├── main.tsx              # App entry point (Redux + Router providers)
├── App.tsx               # Route definitions
├── App.test.tsx          # App smoke test
├── store/
│   ├── index.ts          # Redux store configuration
│   ├── apiSlice.ts       # RTK Query API slice (multiplayer-ready)
│   ├── hexStore.ts       # Zustand store — transient ball position (q, r)
│   └── game/
│       ├── slice.ts      # Redux game reducer (startGame / clearGame)
│       ├── listeners.ts  # localStorage persistence middleware
│       └── index.ts      # Barrel export
├── pages/
│   ├── HomePage.tsx      # Landing / game board page
│   └── NotFoundPage.tsx  # 404 page
└── components/
    ├── Layout.tsx         # App shell with navigation
    └── HexBoard.tsx       # react-konva hex grid canvas (80×60)
```

## License & Trademark

**Hex Hole Heroes** is a trademark of the game creator. The game design, rules,
and name are proprietary.

The source code is licensed under [CC BY-NC 4.0](LICENSE). You may share and
adapt the code for non-commercial purposes with attribution.

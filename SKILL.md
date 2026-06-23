# SKILL: Async Race Implementation Spec

Execution spec for the Async Race SPA. This is the source of truth for **how** to build it.
Lock this before writing feature code; build phase by phase against the Definition of Done below.

---

## 0. Hard constraints (non-functional — graded, ~190 pts)

- **TypeScript only. `any` is forbidden** — every function's params and return are typed.
- **Functions ≤ 40 lines.** Split anything longer.
- **No magic numbers / strings** — name them in `utils/constants.ts`.
- **ESLint (Unicorn config) + Prettier**: zero errors, zero warnings at submit.
- **Modular layers**: `api` / `state` / UI are separate. UI never calls `fetch`.
- **Husky + lint-staged** pre-commit. Clean, conventional commits.
- No unhandled promise rejections (enable `@typescript-eslint/no-floating-promises`).

---

## 1. API contract

Base URL: `const BASE_URL = 'http://127.0.0.1:3000'` (single constant; reviewer runs server locally).

### Garage

| Op     | Method | URL                       | Body            | Returns                          |
| ------ | ------ | ------------------------- | --------------- | -------------------------------- |
| List   | GET    | `/garage?_page=&_limit=7` | —               | `Car[]` + header `X-Total-Count` |
| Get    | GET    | `/garage/:id`             | —               | `Car` / 404                      |
| Create | POST   | `/garage`                 | `{name, color}` | `Car` (201)                      |
| Update | PUT    | `/garage/:id`             | `{name, color}` | `Car` / 404                      |
| Delete | DELETE | `/garage/:id`             | —               | `{}` / 404                       |

### Engine

| Op         | Method | URL                                   | Returns                                          |
| ---------- | ------ | ------------------------------------- | ------------------------------------------------ |
| Start/Stop | PATCH  | `/engine?id=&status=started\|stopped` | `{velocity, distance}` · 400 · 404               |
| Drive      | PATCH  | `/engine?id=&status=drive`            | `{success:true}` · 400 · 404 · **429** · **500** |

### Winners

| Op     | Method | URL                                                               | Body               | Returns                      |
| ------ | ------ | ----------------------------------------------------------------- | ------------------ | ---------------------------- |
| List   | GET    | `/winners?_page=&_limit=10&_sort=id\|wins\|time&_order=ASC\|DESC` | —                  | `Winner[]` + `X-Total-Count` |
| Get    | GET    | `/winners/:id`                                                    | —                  | `Winner` / 404               |
| Create | POST   | `/winners`                                                        | `{id, wins, time}` | `Winner` (201)               |
| Update | PUT    | `/winners/:id`                                                    | `{wins, time}`     | `Winner` / 404               |
| Delete | DELETE | `/winners/:id`                                                    | —                  | `{}` / 404                   |

`X-Total-Count` only appears when `_limit` is sent — always send `_limit` on list calls to get totals.

---

## 2. Domain types (`src/types`)

```ts
export interface Car {
  id: number;
  name: string;
  color: string;
}
export interface Winner {
  id: number;
  wins: number;
  time: number;
}

export type EngineStatus = 'started' | 'stopped' | 'drive';
export interface EngineResponse {
  velocity: number;
  distance: number;
}
export interface DriveResponse {
  success: boolean;
}

export type WinnerSortField = 'id' | 'wins' | 'time';
export type SortOrder = 'ASC' | 'DESC';

export interface Paginated<T> {
  items: T[];
  total: number;
}
```

No `any`. Network helper returns typed data; parse `X-Total-Count` into `total`.

---

## 3. State model (`src/state`)

Single source of truth via Context + useReducer. Persist across view switches (do NOT reset on nav).

```ts
interface AppState {
  view: 'garage' | 'winners';
  garage: { cars: Car[]; total: number; page: number; selectedId: number | null };
  winners: {
    items: WinnerRow[];
    total: number;
    page: number;
    sort: WinnerSortField;
    order: SortOrder;
  };
  race: { isRacing: boolean; winner: { name: string; time: number } | null };
  form: { create: { name: string; color: string }; update: { name: string; color: string } }; // persisted inputs
}
```

`WinnerRow` = `Winner` joined with its `Car` (name + color) for the table render.
`form` lives in state so inputs survive view switches (persistent-state requirement).

Constants: `CARS_PER_PAGE = 7`, `WINNERS_PER_PAGE = 10`, `GENERATE_COUNT = 100`.

---

## 4. Animation & race engine (the highest-value, highest-risk part)

### Single car drive

```
1. disable start, enable stop
2. PATCH engine started   -> { velocity, distance }
3. durationMs = distance / velocity
4. animate car origin -> finish over durationMs (requestAnimationFrame or CSS transition)
5. PATCH engine drive
     - 200 {success:true}  -> car reached finish cleanly
     - 500                 -> ENGINE BROKE: freeze car at current position, stop animating
6. result: { id, success, timeSec: durationMs / 1000 }
```

- Prefer **CSS transition** with `transition-duration: durationMs` + a transform to the finish X;
  on 500, read current computed transform and pin it (cancel the transition).
- Keep a per-car animation handle so Stop/Reset can cancel cleanly.

### Stop

```
PATCH engine stopped -> reset transform to origin -> enable start, disable stop
```

### Race (all cars on page)

```
1. set race.isRacing = true; disable Start Race, enable Reset
2. for each car on page: run the single-car drive flow, in parallel
3. winner = first car whose drive resolves 200 (use Promise.any over the success-promises)
   - each car's promise RESOLVES on 200 with { id, timeSec }, REJECTS on 500
   - Promise.any ignores the rejections (broken engines) and yields first finisher
   - if ALL reject -> no winner; show "no winner" (every engine broke)
4. on winner: banner "<carName> went first (<timeSec.toFixed(2)>s)" + persist winner
```

### Reset

```
stop all engines -> all cars to origin -> clear winner banner -> enable Start Race
```

### Button-state matrix (test every transition — common −10)

| Car state    | Start    | Stop     |
| ------------ | -------- | -------- |
| At origin    | enabled  | disabled |
| Driving      | disabled | enabled  |
| Broken (500) | disabled | enabled  |

---

## 5. Winner persistence logic (get this exactly right)

On a race win with `{ id, timeSec }`:

```
existing = GET /winners/:id
if 404:
    POST /winners { id, wins: 1, time: timeSec }
else:
    PUT /winners/:id { wins: existing.wins + 1, time: min(existing.time, timeSec) }
```

**Best time = minimum.** Storing the latest instead of the min is a classic deduction.

On **delete car**: `DELETE /garage/:id` **and** `DELETE /winners/:id` (ignore 404 on the winner).

---

## 6. Error-handling rules

| Status | Where       | Handling                                                                                 |
| ------ | ----------- | ---------------------------------------------------------------------------------------- |
| 400    | engine      | bad params — shouldn't happen with valid ids; log + ignore.                              |
| 404    | drive / get | car/engine missing — abort that car's flow gracefully, no console error.                 |
| 429    | drive       | "drive already in progress" — guard handlers so a car can't start twice; treat as no-op. |
| 500    | drive       | engine broke — **freeze car in place**, mark broken; in a race it's just out.            |

Wrap every `fetch` in the `api` layer; never let a rejection escape unhandled to the console.
Rapid start/stop producing 404/429 is officially **not a bug** — but an _unhandled_ rejection reads like one. Catch it.

---

## 7. Definition of Done — per requirement (functional, 215 pts)

Tick each against the live app before submitting.

**View Configuration (30)**

- [ ] Two views: Garage, Winners (10)
- [ ] Garage shows name + page number + total car count (5)
- [ ] Winners shows name + page number + total winner count (5)
- [ ] Page numbers + input contents persist across view switches (10)

**Garage — Car Management (45)**

- [ ] Create / update / delete cars; list renders (20)
- [ ] RGB color picker; selected color + name shown on car (10)
- [ ] Update + delete buttons by each car (5)
- [ ] Pagination, 7 cars/page (10)

**Car Generation (10)**

- [ ] Generate 100 random cars/click; name = 2 random parts (≥10 each); random color (10)

**Car Animation (50)**

- [ ] Start/stop buttons per car (10)
- [ ] Start → wait velocity → animate → drive; stop on 500 (20)
- [ ] Stop → wait → car returns to origin (10)
- [ ] Start disabled while driving; stop disabled at origin (5)
- [ ] Fluid + responsive at 500px (5)

**Race Animation (35)**

- [ ] Start Race drives all cars on page (15)
- [ ] Reset returns all cars to start (10)
- [ ] Winner message names the first finisher (10)

**Winners View (45)**

- [ ] Winners appear in table after winning (15)
- [ ] Pagination, 10/page (10)
- [ ] Columns: №, image, name, wins, best time; wins increment, best time = min (10)
- [ ] Sort by wins and by time, ASC/DESC (10)

---

## 8. Conventions

**Commits** (conventional): `feat:`, `fix:`, `refactor:`, `style:`, `chore:`, `docs:`.
One logical change per commit. No "wip" / "stuff" messages.

**PR**: title + description with what's implemented, screenshots/gif of the race, deploy link,
and how to run the server. Follow the school's PR template.

**File rules**: one component per file; co-locate `*.module.css`; shared constants in
`utils/constants.ts`; no inline magic values; named exports.

---

## 9. Pitfalls checklist

- [ ] Vite `base: '/<repo>/'` set → gh-pages not blank.
- [ ] `_limit` sent on every list call → `X-Total-Count` present → totals correct.
- [ ] Animation handle stored per car → Stop/Reset cancels cleanly mid-drive.
- [ ] Handlers guarded against double-click → no stray 429 in console.
- [ ] Best time uses `Math.min`, not latest.
- [ ] Delete car also deletes winner row.
- [ ] Page clamps when deleting the last car on the last page (don't strand an empty page).
- [ ] No `any`; no function >40 lines; ESLint clean.

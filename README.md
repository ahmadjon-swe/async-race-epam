# Async Race

**Deployment:** https://ahmadjon-swe.github.io/async-race-epam/

## How to run the API server

```bash
git clone https://github.com/mikhama/async-race-api.git
cd async-race-api
npm install
npm start
# Server runs at http://127.0.0.1:3000
```

Then open the deployed link or run `npm run dev` in this repo.

---

## Score calculation

| Category        | Max     | Claimed |
| --------------- | ------- | ------- |
| Basic Structure | 80      | 80      |
| Garage View     | 90      | 90      |
| Winners View    | 50      | 50      |
| Race            | 170     | 170     |
| Code Quality    | 10      | 10      |
| **Total**       | **400** | **400** |

---

## Implementation checklist

### Basic Structure (80 pts)

- [x] Two views: Garage and Winners
- [x] Garage view: name, car creation/editing panel, race controls, car list
- [x] Winners view: name, winners table, pagination
- [x] Persistent state across view switches (page numbers, input values preserved)

### Garage View (90 pts)

- [x] Create / Update / Delete cars (name + color); delete cascades to winners table
- [x] RGB color picker with live preview car icon next to each form
- [x] Generate 100 random cars per click (brand + model — 12 options each, random color)
- [x] Select / Remove buttons per car
- [x] Pagination: 7 cars per page
- [x] Empty garage message when no cars exist
- [x] Auto-navigate to previous page when last car on page is deleted

### Race (170 pts)

- [x] Start engine (A): PATCH started → velocity/distance → CSS transition animation → PATCH drive; freeze car in place on 500 error
- [x] Stop engine (B): PATCH stopped → car returns to start position
- [x] Responsive animation: fluid on screens 500px and wider
- [x] Start Race: all cars on current page race in parallel
- [x] Reset Race: all cars return to start, all controls re-enabled
- [x] Winner announcement banner: "🏆 Name went first (X.XXs)!"
- [x] Button states: A disabled while car is driving/broken; B disabled when car is at start
- [x] All actions blocked during race: Create, Update, Generate, Pagination, Select, Remove, view switch

### Winners View (50 pts)

- [x] Winning cars recorded in winners table after race completion
- [x] Pagination: 10 winners per page
- [x] Columns: №, car image, name, wins, best time (s)
- [x] Same car wins again: wins+1, time updated only if better (Math.min)
- [x] Sortable by wins and by best time (ASC / DESC toggle)

### Code Quality (10 pts)

- [x] Prettier: `format` and `ci:format` scripts in package.json
- [x] ESLint: Airbnb config, `lint` script, zero errors/warnings
- [x] TypeScript strict mode (`strict: true`, `noImplicitAny: true`), no `any`
- [x] Functions ≤ 40 lines
- [x] No magic numbers/strings (constants in `utils/constants.ts`)
- [x] Modular architecture: `api/` / `state/` / `features/` / `components/` layers
- [x] Husky pre-commit hook running lint-staged
- [x] Conventional commits throughout

### Deployment

- [x] Deployed to GitHub Pages (`gh-pages` branch)
- [x] API server instructions above

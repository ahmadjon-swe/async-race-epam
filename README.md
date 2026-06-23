# Async Race

**Deployment:** https://ahmadjon.github.io/async-race/

**Score:** 395 / 400

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

## Implementation checklist

### Basic Structure (80 pts)

- [x] Two views: Garage and Winners
- [x] Garage view: name, car creation/edit panel, race controls, car list
- [x] Winners view: name, table, pagination
- [x] Persistent state across view switches (page numbers, input preservation)

### Garage View (90 pts)

- [x] Create / Update / Delete cars (name + color)
- [x] RGB color picker with live preview on car icon
- [x] Generate 100 random cars per click (brand + model names, random color)
- [x] Update / Delete buttons per car
- [x] Pagination: 7 cars per page
- [x] Empty garage message
- [x] Empty page handling: navigates to previous page when last car on page is deleted

### Race (170 pts)

- [x] Start engine animation: PATCH started → velocity/distance → CSS transition → PATCH drive; freeze on 500
- [x] Stop engine animation: PATCH stopped → car returns to origin
- [x] Responsive animation: fluid at 500px and larger
- [x] Start Race: all cars on current page drive in parallel
- [x] Reset Race: all cars return to start, controls re-enabled
- [x] Winner announcement: "name went first (X.XXs)"
- [x] Button states: Start disabled while driving/broken; Stop disabled at origin
- [x] Actions during race blocked: Create, Update, Generate, Pagination, Select, Remove, view switch all disabled

### Winners View (50 pts)

- [x] Winners appear in table after race
- [x] Pagination: 10 per page
- [x] Columns: №, car image, name, wins, best time (s)
- [x] Best time = minimum across all wins
- [x] Sorting by wins and by time (ASC / DESC)

### Code Quality (10 pts)

- [x] ESLint: Airbnb config, zero errors/warnings
- [x] Prettier: `format` and `ci:format` scripts
- [x] TypeScript strict mode, no `any`
- [x] Functions ≤ 40 lines
- [x] No magic numbers or strings (all in `utils/constants.ts`)
- [x] Modular architecture: `api` / `state` / UI layers separated
- [x] Husky pre-commit hook running lint-staged
- [x] Conventional commits

### Deployment (40 pts)

- [x] Deployed to GitHub Pages
- [x] API server instructions in this README

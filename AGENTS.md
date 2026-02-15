# FUTU — Agent Operating Rules

## Non-negotiables
- Keep changes minimal and coherent; no refactors unless required by the task.
- Prefer deterministic behavior over “best effort”.
- Never break: build, tests, basic booking flow, payment simulator, status polling.
- Always run tests/lint/build after changes; if missing, add the minimal script.

## Definition of Done (DoD)
- Frontend: `npm run build` passes; UI has no obvious broken states for errors/loading.
- Backend: tests pass; endpoints return consistent error payloads.
- Cross-cutting: i18n strings in EE/EN (no hardcoded user-facing text).
- Document any new env vars or scripts in README.

## Quality gates
- No TODO left in shipped code unless explicitly approved.
- Any API contract change must update frontend callsites + docs.
- Add at least 1 targeted test for each bug fix / edge case.

## Local commands (expected)
- Frontend: `npm ci`; `npm run dev`; `npm run build`
- Backend: `mvn test`; `mvn spring-boot:run`


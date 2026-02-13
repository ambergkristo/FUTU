# 🤖 CODING AGENT INSTRUCTION — Issue #15

## Task Assignment

**Work on GitHub issue #15 in repo FUTU**

Base branch: **`main`**

---

## Objective

Implement the Navbar CTA button styling and anchor navigation functionality.

**Issue Definition**: See `backlog/015-navbar-cta-anchor-nav.md`

---

## Step-by-Step Instructions

### 1. Create Feature Branch
```bash
cd C:\Users\Kasutaja\Documents\FUTU
git fetch origin
git checkout -b feat/15-navbar-cta-anchor-nav origin/main
```

### 2. Implement ONLY These Acceptance Criteria

- [ ] CTA button styled and visible on all viewports
- [ ] Navigation works correctly (clicking links navigates to correct pages/sections)
- [ ] Hover states present (visual feedback on link hover)
- [ ] Smooth scroll behavior works on all navigation links
- [ ] Mobile responsive (Navbar adapts to 320px, 768px, 1024px viewports)
- [ ] No broken links in Navbar
- [ ] Semantic HTML + ARIA labels (accessibility)

**Files to modify**:
- `frontend/src/components/Navbar.tsx` (primary)
- `frontend/src/pages/HomePage.tsx` (if anchor IDs missing)

### 3. Do NOT

- ❌ Add new dependencies
- ❌ Modify backend code
- ❌ Modify Vite config
- ❌ Modify API configuration
- ❌ Change TypeScript strict mode
- ❌ Add breaking changes

### 4. Develop & Test Locally

**Start dev server**:
```bash
cd frontend
npm run dev
# Opens http://localhost:5173
```

**Test in browser**:
- Verify Navbar appears at top
- Click CTA button → should navigate to `/booking`
- Click each Navbar link → should scroll smoothly to target section
- Hover over links → should show hover state
- Resize to 320px, 768px, 1024px → Navbar should be responsive
- Open DevTools (F12) → no console errors

### 5. Run Checks (MUST PASS BEFORE PR)

```bash
# From frontend/
cd frontend
npm run lint
npm run build
npm run test

# From repo root
cd ..
./check.ps1
```

**Expected result**: All commands exit with code 0 (success)

### 6. Verify TypeScript Strict

```bash
cd frontend
npm run build
# Should complete without TypeScript errors
```

### 7. Commit Changes

```bash
git add .
git commit -m "feat(navbar): add CTA button styling and anchor navigation (closes #15)"
```

### 8. Push & Open PR

```bash
git push -u origin feat/15-navbar-cta-anchor-nav
```

**Then on GitHub**:
1. Go to repo
2. Click "Compare & pull request"
3. Fill PR description with:

```markdown
## Summary
Implemented Navbar CTA button styling and anchor navigation for issue #15.

## Files Changed
- frontend/src/components/Navbar.tsx
  - Added CTA button styling
  - Implemented smooth scroll anchor navigation
  - Added hover states
  - Ensured mobile responsiveness
  - Improved accessibility with semantic HTML

[Additional files if modified]

## How to Test
1. Start dev server: `cd frontend && npm run dev`
2. Open http://localhost:5173
3. Test CTA button: click it, should navigate to /booking
4. Test Navbar links:
   - Click "Hero" → scrolls to hero section
   - Click "Rooms" → scrolls to rooms section
   - Click "Pricing" → scrolls to pricing section
   - Click "About" → scrolls to about section
   - Click "FAQ" → scrolls to FAQ section
5. Test hover states: hover over links, verify visual feedback
6. Test responsive: resize to 320px, 768px, 1024px widths
7. Verify no console errors (F12 → Console tab)

## Checks Passed
- ✅ npm run lint (ESLint)
- ✅ npm run build (TypeScript + Vite)
- ✅ npm run test (Vitest)
- ✅ ./check.ps1 (full repo check)
```

4. Click "Create pull request"
5. Wait for CI to run
6. Verify CI passes (green checkmarks on checks)

---

## Reference Documentation

**Issue Definition** (full DoD + criteria):
- `backlog/015-navbar-cta-anchor-nav.md`

**Agent Rules**:
- `AGENT_RULES.md`

**Frontend Setup**:
- `ISSUE_15_FRONTEND_SETUP.md`

**PR Template** (GitHub will auto-fill):
- `.github/PULL_REQUEST_TEMPLATE.md`

---

## Success Criteria

✅ **All acceptance criteria implemented** (7/7)
✅ **No new dependencies added**
✅ **Diffs minimal** (only Navbar and possibly HomePage)
✅ **TypeScript strict passes** (`npm run build` succeeds)
✅ **Lint passes** (`npm run lint` succeeds)
✅ **Tests pass** (`npm run test` succeeds)
✅ **Repo check passes** (`./check.ps1` returns PASS)
✅ **PR opened** with summary, files changed, how-to-test
✅ **CI passes** (green on GitHub)

---

## If Stuck

Check these files:
- `START_ISSUE_15.md` — quick start
- `FRONTEND_SETUP.md` — technical details
- `AGENT_RULES.md` — behavior rules
- `backlog/015-navbar-cta-anchor-nav.md` — issue definition

If error encountered, include in PR:
- `check.log` (from repo root)
- First 50 lines of terminal error
- Exact command that failed

---

**Status**: ✅ Ready to delegate to Coding Agent

Base branch: `main`
Task: Issue #15 (Navbar CTA + Anchor Navigation)
Acceptance criteria: 7 items in backlog/015-navbar-cta-anchor-nav.md


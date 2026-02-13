# 🎯 DELEGATE TO CODING AGENT

## Task: Issue #15 — Navbar CTA + Anchor Navigation

**Base branch**: `main`

---

## Complete Agent Instructions

```
Work on GitHub issue #15 in repo FUTU. 
Create branch feat/15-navbar-cta-anchor-nav from main.

Implement ONLY the acceptance criteria:
✓ CTA button styled and visible on all viewports
✓ Navigation works correctly
✓ Hover states present
✓ Smooth scroll on all links
✓ Mobile responsive (320px, 768px, 1024px)
✓ No broken links
✓ Semantic HTML + ARIA labels

Do not add new dependencies.
Keep diffs minimal.
Ensure TypeScript strict passes and lint/build pass.

Run the project checks:
- frontend: npm run build, npm run lint, npm run test
- repo: ./check.ps1

Then open a PR with:
- summary of changes
- files changed list
- exact 'How to test' steps from issue #15
```

---

## Key Files for Agent

| File | Purpose |
|------|---------|
| `AGENT_TASK_15.md` | Complete step-by-step instructions |
| `backlog/015-navbar-cta-anchor-nav.md` | Issue definition (DoD + criteria + how-to-test) |
| `START_ISSUE_15.md` | Quick start reference |
| `AGENT_RULES.md` | Agent behavior rules |
| `FRONTEND_SETUP.md` | Frontend technical details |

---

## What Agent Will Do

1. Create branch from `main`
2. Modify `frontend/src/components/Navbar.tsx`
3. Implement styling + anchor navigation
4. Run `npm run lint`, `npm run build`, `npm run test`
5. Run `./check.ps1`
6. Push branch and open PR
7. Link PR to issue #15

---

## Acceptance Criteria (From Backlog)

Full list in `backlog/015-navbar-cta-anchor-nav.md`:

- [ ] Navbar CTA button is styled and visible on all viewports
- [ ] Clicking CTA button navigates to `/booking`
- [ ] Navbar links have hover states (visual feedback)
- [ ] Smooth scroll behavior works on all navigation links
- [ ] Mobile responsive: Navbar adapts on small screens
- [ ] No broken links in Navbar (all href targets exist)
- [ ] Accessibility: semantic HTML, role="navigation", alt text

---

## Success = PR Merged

✅ All acceptance criteria done
✅ No new dependencies
✅ Minimal diffs
✅ TypeScript strict OK
✅ Lint OK
✅ Build OK
✅ Tests OK
✅ Repo check (./check.ps1) OK
✅ PR opened with proper description
✅ CI passes on GitHub

---

## Ready to Delegate

**Status**: ✅ READY

Use instructions from `AGENT_TASK_15.md` to delegate to Coding Agent with base branch `main`.


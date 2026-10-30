# Motion V3 Audit

Audit date: 2026-10-30. Baseline commit: `70995e2760b6ce406ed9eb27044a38a773e2b96b`.

## Baseline diagnosis

- Route changes mixed a short CSS animation with the browser View Transitions API. Supporting browsers disabled the CSS path, so behavior differed by capability and the captured intermediate frames were already visually complete.
- The five baseline route frames reported `opacity: 1` and `transform: none`; no meaningful exit or entry state remained observable.
- Every scroll-revealed component used the same 24 px vertical movement, a low 0.08 threshold and a global modulo delay. Large page sections therefore appeared before they felt intentionally composed.
- The hero had no authored sequence, filtered results remounted without feedback, performance bars appeared at their final width and the active navigation state jumped between buttons.
- Reduced-motion behavior was already present and was retained as a non-negotiable accessibility boundary.

## Implemented system

- One route state machine owns `idle`, `exiting` and `entering`; section-to-section navigation on Home remains immediate and uses focused, offset-aware scrolling.
- The hero reveals identity, role, title lines, supporting copy, focus tags, actions, availability and portrait in a bounded 70–650 ms sequence.
- IntersectionObserver activates one-shot motion at an 18% threshold. Titles, cards, timeline rows, skills, details, contact columns and the evidence panel use different spatial signatures and local stagger groups.
- Performance bars animate from a left origin only when their panel enters the viewport. Filtered project grids use a short remount animation without a global DOM MutationObserver.
- A measured indicator follows the active navigation target in horizontal desktop and vertical mobile layouts.
- Hover and success feedback cover buttons, icons, tags, resume cards and the copy-email action. No particles, autoplay loops or decorative motion were introduced.
- `prefers-reduced-motion: reduce` bypasses route timing and resolves all reveals, bars and transforms immediately.

## Reproducible visual evidence

- Before recordings: `docs/evidence/motion-v3/before/desktop-1440.webm` and `mobile-390.webm`.
- After recordings: `docs/evidence/motion-v3/after/desktop-1440.webm` and `mobile-390.webm`.
- Each variant includes 0, 120, 250, 400 and 650 ms route screenshots plus `route-frame-manifest.json` with elapsed time, class, opacity and transform.
- The final after manifest observes both `route-exiting` and `route-entering`, including intermediate opacity and transform matrices. This makes the transition demonstrable rather than inferred from source code.

## Performance boundary

Lighthouse 12.8.2 ran five consecutive default-mobile audits against a local production preview for each variant. Medians are reported to reduce single-run variance.

| Metric | Before | After | Delta |
|---|---:|---:|---:|
| Performance | 97 | 97 | 0 |
| Accessibility | 100 | 100 | 0 |
| Best Practices | 100 | 100 | 0 |
| SEO | 100 | 100 | 0 |
| FCP | 1,401 ms | 1,372 ms | −29 ms |
| LCP | 2,154 ms | 1,983 ms | −171 ms |
| TBT | 160 ms | 161 ms | +1 ms |
| CLS | 0.0087 | 0.0087 | 0 |
| Speed Index | 1,893 ms | 1,484 ms | −409 ms |
| Transfer | 210,927 B | 212,439 B | +1,512 B |

One after run scored 92 Performance with 291 ms TBT; the other four scored 97, 98, 97 and 97. The raw local JSON files remain ignored but available in the working copy; the committed aggregate is `reports/motion-v3/lighthouse-summary.json`. These synthetic results are not real-user telemetry.

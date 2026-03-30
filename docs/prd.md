# PRD Coverage Audit (Edge Cases & Test Suite Relevance)

This audit checks whether the current test suite covers the edge cases implied by `docs/PRODUCT_REQUIREMENTS.md`.

## Coverage Summary

| Area | PRD Requirement | Coverage Status | Notes |
|---|---|---|---|
| Emmet expansion | FR-1 | Covered | Valid/invalid/empty, attributes, multiplication, nesting covered. |
| Sanitization | FR-2 / NFR-1 | Mostly covered | Strong XSS coverage exists; a few protocol/URL edge cases still missing. |
| Hydration | FR-3 | Covered | Multiple roots, text nodes, nested nodes, custom replace covered. |
| Registry mapping | FR-4 / NFR-4 | Covered | Registered/unregistered behavior, recursion, default registry tested. |
| Action system | FR-5 | Mostly covered | Delegation and nested action bubbling covered; non-left-click and disabled states not covered. |
| Public APIs | FR-6 | Covered | `pipeline`, `useEmmetRenderer`, `EmmetRenderer` all exercised. |
| Type surface | FR-7 | Partially covered | Runtime exports tested indirectly; package export contract not explicitly tested. |

## Edge Cases Already Covered Well

1. **Invalid/empty Emmet inputs** are validated and expected to throw/fallback behavior is tested.
2. **Sanitization protections** against script tags, event attributes (`onclick`, `onerror`, etc.), and `javascript:` URLs are tested.
3. **Action delegation** correctly handles nested actionable parents and invalid JSON payloads.
4. **Unknown custom tags** route to `UnknownTag` fallback while preserving nested registered children.
5. **Renderer state transitions** (error ↔ success, loading, retry) are tested.

## Edge Cases Missing (Recommended to Add)

### Security/Sanitizer (highest priority)
1. **`data:` and `vbscript:` URL protocols** are not explicitly tested.
2. **SVG/MathML payload attempts** (e.g., `<svg onload=...>`) are not explicitly tested.
3. **Encoded protocol bypasses** (e.g., whitespace/control chars around `javascript:`) are not explicitly tested.
4. **`srcset` and uncommon URL-carrying attributes** are not tested (even if currently disallowed, regression protection is useful).

### Action system
5. **Non-mouse click pathways** are not tested (keyboard-triggered click semantics in browser behavior).
6. **Unmount/remount with changing container refs** is not stress-tested.
7. **Multiple siblings with `data-action` and stop conditions** are not tested.

### Pipeline and API contract
8. **Extremely large Emmet strings** (performance and failure mode) are not tested.
9. **Export contract smoke test** from package entrypoint (`src/index.ts`) is not present.
10. **Custom registry integration through full `EmmetRenderer` path** (not only hook/pipeline slices) could be expanded.

## Tests That Are Likely Redundant / Lower Value

The following are not “wrong,” but can be consolidated to reduce maintenance while preserving confidence:

1. **Sanitizer repetitive invariant loops** for each event attribute in dedicated sections + critical section.
   - Keep one table-driven invariant block, remove duplicated per-attribute single-case tests.

2. **Default registry mapping tests** have many one-assertion-per-tag tests.
   - Replace with a single parameterized table test to reduce repetition.

3. **Component registry constructor/get tests** include near-duplicate happy-path checks.
   - Merge into table-driven tests for readability and smaller surface.

4. **EmmetRenderer error assertions** overlap between “shows fallback”, “includes retry button”, and callback checks.
   - Combine where behavior is same render state.

## Suggested Minimal Test Plan Refinement

1. Keep all core behavior tests for FR-1..FR-6.
2. Add 6–10 targeted missing edge-case tests (security + action edge behavior).
3. Refactor repetitive tests into parameterized suites (no behavior loss).
4. Add one package-export smoke test for FR-7.

## Conclusion

- **Edge-case coverage is good overall but not complete.**
- **Main risk gap is advanced sanitizer bypass/regression coverage.**
- **Some tests are redundant and can be consolidated without reducing safety.**

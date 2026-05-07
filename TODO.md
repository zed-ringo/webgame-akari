# Akari Lanterns TODO

Last verified: 2026-05-06 (browser playthrough)

## Status: PARTIAL — rules are coded but level data does not exercise them

The implementation enforces all three Akari constraints (illumination coverage, lamp mutual visibility, numbered-black-cell adjacency count). However, every shipped puzzle is a grid of plain walls (`#`) with **no numbered black cells**, so the third (most defining) rule never applies and every puzzle has many trivially valid lamp placements.

## Reproduction

Inspecting `PUZZLES` from the page:

```text
easy   = ["...#...", ".......", "#......", ".......", ".......", ".......", "......."]
normal = ["....#...", "........", "........", "....#...", "........", "........", "....#...", "........"]
hard   = ["...#.....", ".........", "#........", ".........", ".........", ".........", ".........", ".........", "........."]
```

No `0`, `1`, `2`, `3`, `4` cells exist. The numbered-adjacency rule (per `docs/GAME_RULES.md`) is not triggered by any puzzle.

## Root cause

The puzzle dataset omits numbered constraint cells. The implemented rule (`countAdjacentLamps == n`) is dead code as far as shipped levels are concerned.

## Fix plan

- [ ] Replace the three puzzles with hand-built Akari boards that include numbered black cells (`0`-`4`) so the adjacency rule actively constrains the solution.
- [ ] Verify each new board has a unique solution (no duplicate solutions).
- [ ] Ship more than 3 puzzles per difficulty; current count is too thin once the puzzle is non-trivial.
- [ ] Add an error-highlight that marks numbered black cells whose constraint is violated by the current lamp placement.
- [ ] Optional: add a generator that places walls and numbered cells, runs an Akari solver, and only ships uniquely-solvable boards.

## References

- Spec: [docs/GAME_RULES.md](docs/GAME_RULES.md)
- Code: [app.js](app.js)

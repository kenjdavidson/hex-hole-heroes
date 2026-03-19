# Hex Hole Heroes — Game Rules & Probability Tables

## Overview

Players navigate a hexagonal grid golf course by selecting a club and rolling dice to determine
shot distance and direction. Each hex represents one unit of distance.

---

## Dice Rolls

### Power Roll — 2d6

Roll two six-sided dice and sum the results (range: 2–12). Cross-reference the sum with the
**Power Table** for the club type in use.

#### Wood Power Table

| 2d6 Roll | Hex Offset | Label        |
|----------|-----------|--------------|
| 2        | −6        | Dub          |
| 3        | −4        | Flub         |
| 4        | −3        | Short        |
| 5        | −2        | Short        |
| 6        | −1        | Little Short |
| 7        | 0         | Standard     |
| 8        | +1        | A Touch Long |
| 9        | +2        | Long         |
| 10       | +3        | Long         |
| 11       | +4        | Big Drive    |
| 12       | +6        | Bomb         |

#### Iron Power Table

| 2d6 Roll | Hex Offset | Label        |
|----------|-----------|--------------|
| 2        | −3        | Dub          |
| 3        | −2        | Flub         |
| 4        | −1        | Short        |
| 5        | −1        | Short        |
| 6        | 0         | Standard     |
| 7        | 0         | Standard     |
| 8        | 0         | Standard     |
| 9        | +1        | Long         |
| 10       | +1        | Long         |
| 11       | +2        | Big Strike   |
| 12       | +3        | Stiffed It   |

> **Note:** The Iron table is also used for Wedge and Putter clubs.

---

### Scatter Roll — d12

Roll a single twelve-sided die (range: 1–12). This roll applies **only** when the selected
club has `scatter > 0` (Woods and some Irons). Cross-reference the result with the
**Scatter Table** below.

Negative offsets are to the **left** (hook/draw); positive offsets are to the **right**
(fade/slice).

| d12 Roll | Lateral Hex Offset | Direction Label |
|----------|--------------------|-----------------|
| 1        | −3                 | Heavy Hook      |
| 2        | −2                 | Hook            |
| 3        | −2                 | Hook            |
| 4        | −1                 | Draw            |
| 5        | −1                 | Draw            |
| 6        | 0                  | Straight        |
| 7        | 0                  | Straight        |
| 8        | +1                 | Fade            |
| 9        | +1                 | Fade            |
| 10       | +1                 | Fade            |
| 11       | +2                 | Slice           |
| 12       | +3                 | Shank           |

---

## Shot Workflow

1. **Select a club** from your bag.
2. **Roll 2d6** (Power Roll) to determine forward hex adjustment.
3. If the club has `scatter > 0`, **roll d12** (Scatter Roll) to determine lateral offset.
4. Apply the results to your current hex position on the board.

---

## Club Bag

The starting bag contains 14 clubs:

| Club          | Type   | Distance (hex) | Scatter |
|---------------|--------|----------------|---------|
| Driver        | Wood   | 12–15          | 2       |
| 3-Wood        | Wood   | 10–12          | 1       |
| 5-Wood        | Wood   | 9–11           | 1       |
| 3-Iron        | Iron   | 9              | 1       |
| 4-Iron        | Iron   | 8              | 1       |
| 5-Iron        | Iron   | 7              | 1       |
| 6-Iron        | Iron   | 6              | 1       |
| 7-Iron        | Iron   | 5              | 0       |
| 8-Iron        | Iron   | 4              | 0       |
| 9-Iron        | Iron   | 3              | 0       |
| Pitching Wedge| Wedge  | 2–3            | 0       |
| Gap Wedge     | Wedge  | 2              | 0       |
| Sand Wedge    | Wedge  | 1–2            | 0       |
| Putter        | Putter | 1–5            | 0       |

# Hex Hole Heroes — Rules

## Overview

Hex Hole Heroes is a hex-grid golf board game where players navigate a course of holes, using a variety of clubs across different terrain types. Each turn a player selects a club, rolls dice to determine shot quality, and moves their ball the resulting number of hexes toward the hole.

---

## Components

- **Hex Game Board** — one or more hole layouts represented on a hex grid
- **Player Tokens** — one per player, placed on the tee at the start of each hole
- **Club Cards** — Driver (Dr), 3-Wood (3W), 5-Wood (5W), Irons (3i–9i), Pitching Wedge (PW), Gap Wedge (GW), Sand Wedge (SW), Putter (P)
- **2D6 (Power Dice)** — two standard six-sided dice used for all full shots
- **1D12 (Putting Die)** — one twelve-sided die used for putts on the green

---

## Object of the Game

Complete each hole in as few strokes as possible. The player with the lowest total stroke count after all holes are played wins.

---

## Turn Structure

1. **Select a Club** — choose any club appropriate for your current lie and distance.
2. **Declare the Shot** — announce your intended direction and target hex.
3. **Roll the Dice** — roll the appropriate dice for the club type (see below).
4. **Apply the Result** — move the ball the calculated number of hexes.
5. **Check Lie** — determine the terrain of the landing hex (fairway, rough, bunker, water, green).
6. **Pass the Turn** — the next player takes their turn.

---

## Club Base Distances

| Club | Base Distance (Hexes) |
|------|-----------------------|
| Driver (Dr) | 12 |
| 3-Wood (3W) | 10 |
| 5-Wood (5W) | 8 |
| 3-Iron (3i) | 7 |
| 4-Iron (4i) | 6 |
| 5-Iron (5i) | 6 |
| 6-Iron (6i) | 5 |
| 7-Iron (7i) | 5 |
| 8-Iron (8i) | 4 |
| 9-Iron (9i) | 4 |
| Pitching Wedge (PW) | 3 |
| Gap Wedge (GW) | 3 |
| Sand Wedge (SW) | 2 |
| Putter (P) | — *(see Putting Mode)* |

---

## Terrain Effects

| Terrain | Effect |
|---------|--------|
| Fairway | No penalty |
| Rough | −1 Hex to all shots taken from this lie |
| Bunker | May only use a Wedge; −1 Hex penalty |
| Water Hazard | 1-stroke penalty; drop ball at nearest fairway hex |
| Green | Must use Putter |
| Out of Bounds | 1-stroke penalty; replay from previous lie |

---

## Dice Probability & Resolution

### 1. The Power Die (2D6)

All shots (except Putts) require a 2D6 roll to determine the quality of the strike. The outcome is applied as an offset to the Club's base distance.

| Roll (Total) | Wood (Dr, 3W, 5W) | Iron (3i–9i) | Wedge (PW, GW, SW) | Probability |
|:---:|---|---|---|:---:|
| 2 | −6 Hexes | −3 Hexes | −2 Hexes | 2.8% |
| 3–5 | −3 Hexes | −1 Hex | −1 Hex | 25.0% |
| 6–8 | Standard | Standard | Standard | 44.4% |
| 9–11 | −1 Hex | +1 Hex | +1 Hex | 25.0% |
| 12 | −2 Hexes | +2 Hexes | +1 Hex *(Drop/Stop)* | 2.8% |

> **Note on Woods:** A roll of 12 with a Wood is a "Wild Shot" — the extra distance comes with a loss of control (−2 hex offset applied as a misdirection penalty at the GM's discretion).

### 2. Putting Mode (D12)

When the ball is on the green, the Putter is the only legal club. The D12 represents the "Touch" required to sink the putt.

| Roll | Result |
|------|--------|
| > Current Distance in Hexes | **Success** — ball sinks |
| ≤ Current Distance in Hexes | **Miss** — ball advances toward hole by the rolled value |
| 12 (any distance) | **Critical Success** — "The Long Bomb", automatic sink |
| 1 (any distance) | **Critical Failure** — "Three-Putt", ball moves 3 hexes away from the hole |

---

## Winning the Game

After all players have completed the final hole, total each player's stroke count across all holes. The player with the **fewest strokes** wins. In the event of a tie, tied players share the victory (or play a sudden-death playoff hole at the group's discretion).

---

## Glossary

| Term | Definition |
|------|-----------|
| **Lie** | The terrain type of the hex where the ball currently rests |
| **Stroke** | Any attempt to hit the ball, including penalty strokes |
| **Drop/Stop** | Ball does not roll past its landing hex (used for certain critical wedge results) |
| **Long Bomb** | A critical-success putt that sinks from any distance |
| **Three-Putt** | A critical-failure putt that pushes the ball 3 hexes away from the hole |

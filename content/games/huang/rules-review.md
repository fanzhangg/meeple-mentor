# HUANG Rules - Markdown Review Draft

> Source: `content/games/huang/source/rules.pdf`
> Status: Draft conversion for human review. This file is not yet treated as canonical app context.
> Conversion note: The source PDF is laid out as visual spreads, so this draft is manually structured from the rendered pages and text extraction. Diagrams and examples are summarized rather than reproduced exactly.

## Review Checklist

- [ ] Verify component counts against the source PDF.
- [ ] Verify setup wording and board diagram details.
- [ ] Verify leader placement restrictions.
- [ ] Verify tile placement scoring and exceptions.
- [ ] Verify Peasants' Riot effects.
- [ ] Verify pagoda creation and scoring.
- [ ] Verify revolt rules.
- [ ] Verify war rules and example.
- [ ] Verify end-game scoring and tie-breakers.
- [ ] Verify optional rules are clearly separated from the base game.
- [ ] Verify credits and publication metadata.

## Base Game

### Overview

HUANG is a tile-laying game by Reiner Knizia for 2 to 4 players. Players build competing states, position leaders, place tiles, score victory points in multiple colors, and resolve conflicts when rival leaders of the same color end up in the same state.

Each player has five leader discs, one in each role/color:

| Role | Color | General function |
| --- | --- | --- |
| Governor | Yellow | Leadership, support for leaders, fallback scoring |
| Soldier | Red | Military strength in wars |
| Farmer | Blue | River placement, special blue placement action |
| Trader | Green | Markets, pagoda actions |
| Artisan | White | Wild victory points at game end |

The winner is not the player with the most total points. At the end of the game, each player compares their four non-white colors after assigning white points as wild. The player's lowest color is their final score.

### Components

The PDF lists the following base-game components:

- 1 game board
- 4 screens
- 5 leader discs per player, one in each color
- Civilization tiles in yellow, red, blue, and green
- Market tiles
- Pagodas
- Unification markers
- Victory point tokens in yellow, red, blue, green, and white
- A bag for drawing tiles

Review note: The exact component counts should be checked directly against the PDF component list before this file becomes canonical.

### Setup

1. Place the board in the center of the table, using the base-game side.
2. Place the pagodas, unification markers, and victory point tokens near the board.
3. Put the civilization tiles into the bag.
4. Place the starting yellow Governor tiles on the marked board spaces.
5. Deal each player a screen and their five leaders.
6. Each player draws 6 civilization tiles and keeps them hidden behind their screen.
7. Reveal Market tiles as instructed by the rulebook.
8. Choose a starting player.

Review note: The PDF setup uses a diagram and numbered callouts. This draft preserves the rules conceptually, but the exact diagram-specific details need visual review.

### States

A state is a connected group of one or more tiles that contains at least one leader. Tiles are connected orthogonally, not diagonally.

Connected tiles without any leader are not a state. They can later become a state when a leader is connected to them.

Each state may contain multiple leaders, but after conflicts are resolved it may not contain more than one leader of the same color.

### Turn Structure

On your turn, take 2 actions. You may choose the same action twice if legal.

Available actions:

- Position 1 leader.
- Place 1 tile.
- Discard 2 blue Farmer tiles to cause a Peasants' Riot.
- Discard 2 green Trader tiles to establish a pagoda.
- Replace up to 6 tiles from behind your screen.

After taking 2 actions, complete end-of-turn steps:

1. Score any pagodas controlled by your leaders.
2. Refill your hidden tiles to 6.
3. Any other player with fewer than 6 hidden tiles also refills to 6.
4. Refill the Market display.
5. The next player takes a turn.

### Position 1 Leader

You may place, move, or withdraw one of your leaders.

When placing or moving a leader onto the board:

- The leader must be placed on an empty land space.
- The leader must be orthogonally adjacent to a yellow Governor tile.
- The leader may not be placed on a river space.
- The leader may not be placed in a way that unites states and creates a conflict.

A leader may be placed so that it unites states only if doing so does not create a conflict.

If a leader's last adjacent yellow Governor tile is removed, that leader is removed from the board and returned to its owner.

Withdrawing a leader returns it from the board to the owning player's supply.

### Place 1 Tile

Choose one tile from behind your screen and place it face up on an empty space.

Placement restrictions:

- A blue Farmer tile must be placed on a river space.
- Non-blue tiles may not be placed on river spaces.
- The placed tile may connect groups of tiles and may create or unite states.

If the tile is placed in a state that contains a leader of the same color, the player controlling that leader gains 1 victory point of the tile's color.

If the tile is placed in a state with no matching-color leader, but the state contains a yellow Governor leader, the player controlling that yellow Governor leader gains 1 victory point of the tile's color.

If the placed tile unites states and causes a conflict, no victory point is gained for placing that tile.

Keep victory points hidden behind your screen. Players may exchange five 1-point tokens for one 5-point token of the same color.

#### Green Trader Tile Effect

After placing a green Trader tile, if the placement did not lead to a war, you may take one face-up Market tile and place it behind your screen.

Review note: Confirm whether the Market tile is replaced immediately or during the normal end-of-turn refill step.

#### Blue Farmer Tile Effect

After placing a blue Farmer tile, you may continue placing more blue Farmer tiles as part of the same action if each additional blue tile is placed adjacent to the previously placed blue tile.

You may continue this chain only while the previous blue placement did not lead to a war and did not establish a new pagoda.

Score each placed blue tile normally if it qualifies for scoring.

### Discard 2 Blue Farmer Tiles to Cause a Peasants' Riot

Reveal and discard 2 blue Farmer tiles from behind your screen, placing them face down in the box. Then choose 1 tile on the board and remove it, placing it face down in the box.

The removed tile may be a starting yellow Governor tile. Once removed, that space no longer has its starting-tile effect.

Removing a tile may split a state into multiple separate groups. Each resulting group is evaluated normally according to whether it contains leaders.

If removing the tile leaves a leader with no adjacent yellow Governor tile, return that leader to its owner.

If removing the tile removes a tile under a building, remove the building and place it near the board.

If your blue Farmer leader is not on the board, you may use that off-board leader as one of the two required blue Farmer tiles. In that case, discard only 1 blue Farmer tile from behind your screen.

### Discard 2 Green Trader Tiles to Establish a Pagoda

Reveal and discard 2 green Trader tiles from behind your screen, placing them face down in the box. Then establish one pagoda on an existing triangle of 3 same-color tiles, following the normal pagoda placement rules.

If your green Trader leader is not on the board, you may use that off-board leader as one of the two required green Trader tiles. In that case, discard only 1 green Trader tile from behind your screen.

### Replace Up To 6 Tiles

Discard any number of tiles from behind your screen, up to 6, placing them face down in the box. Then draw the same number of tiles from the bag.

### Pagodas

After placing a tile, if that tile completes a triangle of 3 same-color tiles, you may establish the matching-color pagoda on those 3 tiles.

Conditions:

- The placed tile must be one of the 3 tiles in the triangle.
- The placed tile must not have created a war.
- None of the 3 tiles may already support another building.
- The pagoda color must match the 3 tiles.

If the matching pagoda is next to the board, place it on the triangle. If the matching pagoda is already on the board, move it from its current triangle to the new triangle.

Tiles under a pagoda remain in play and continue to count as tiles of their color. A yellow Governor tile under a pagoda can still support adjacent leaders.

At the end of your turn, for each of your leaders in a state containing a same-color pagoda, gain 1 victory point in that leader's color for each same-color pagoda in that state.

The yellow Governor leader's fallback scoring ability does not apply to pagoda scoring.

Review note: Confirm whether multiple same-color pagodas can ever be in the same state in the base game, or whether this wording mainly matters for optional buildings and movement.

### Conflicts

Conflicts happen when two leaders of the same color are in the same state.

A conflict must be fully resolved before the action is complete. After all conflicts are resolved, every state must contain only different-colored leaders.

There are two types of conflict:

- Revolt: caused by positioning a leader into a state that already has a same-color leader.
- War: caused by placing a tile that unites two or more states containing same-color leaders.

### Revolts

A revolt occurs when a player positions a leader into a state that already contains a leader of the same color.

The player who positioned the new leader is the attacker. The player who controls the existing same-color leader is the defender.

Determine each side's strength:

1. Count yellow Governor tiles orthogonally adjacent to each involved leader.
2. The attacker may commit additional yellow Governor tiles from behind their screen.
3. The defender may commit additional yellow Governor tiles from behind their screen.

A yellow Governor tile adjacent to both involved leaders counts for both sides.

If a player's yellow Governor leader is not on the board, that off-board leader may add 1 strength for that player.

The higher strength wins. Ties are won by the defender.

The losing leader is returned to its owner. The winner gains 1 victory point in the color of the leaders involved in the revolt. Committed yellow Governor tiles are discarded face down into the box.

### Wars

A war occurs when placing a tile unites two or more states and the resulting state would contain two or more leaders of the same color.

Place a unification marker on the tile that united the states.

The unifying tile has no other effect during the war:

- It does not score a victory point.
- If it is red, it does not add war strength.
- If it is green, it does not allow taking a Market tile.

For each leader color that appears in conflict, resolve a war.

Determine each warring state's strength:

1. Count red Soldier tiles in that state.
2. Add 1 strength if the red Soldier leader supporting that state is off the board and eligible to support.
3. Players may commit red Soldier tiles from behind their screens to support one of the warring states.

Support order begins with the player to the left of the player who placed the unifying tile and proceeds clockwise. The player who placed the unifying tile commits last.

Any player may support a warring state, even if they do not control a leader in that state.

The state with the highest strength wins. If there is a tie, the player who placed the unifying tile decides which tied state wins.

After determining the winner:

1. Note the strength of each losing state.
2. Simultaneously remove all conflicting leaders from losing states.
3. Simultaneously remove all red Soldier tiles from losing states.
4. Do not remove the unifying tile because of the war.
5. Non-conflicting leaders in losing states remain on the board if still legally supported.
6. For each removed losing leader, the player controlling the matching-color leader in the winning state gains 1 victory point of that leader color.
7. From the winning state, discard red Soldier tiles equal to the highest losing strength. Discard committed red Soldier tiles first, then red Soldier tiles from the board if needed.
8. Remove the unification marker.

If more conflicts remain after resolving one war, continue resolving wars until no state contains duplicate leader colors.

Review note: The PDF example should be checked to confirm whether this draft captures every removal and scoring edge case, especially multi-color wars.

### Game End

The end of the game is triggered when a player tries to draw a tile for any reason and cannot because the bag is empty.

When the game ends:

1. Players reveal the victory points behind their screens.
2. Count yellow, red, blue, and green victory points separately.
3. Assign white Artisan victory points as wild points to any of the four colors.
4. Each player's final score is their lowest total among yellow, red, blue, and green after assigning white points.

The player with the highest final score wins.

Tie-breakers:

1. Compare the tied players' second-lowest color totals.
2. If still tied, compare the third-lowest color totals, then the fourth-lowest if needed.
3. If all four color totals are tied, the player with fewer unassigned or originally white victory points wins.
4. If still tied, nobody wins.

Review note: Confirm the exact wording of the final white-point tie-breaker.

## Optional Rules

The following sections are optional modules. They should be clearly labeled as optional in any player-facing summary or chat context.

### Rogue Bandits

Rogue Bandits adds Bandit tiles to the game.

Setup:

- Use the Bandit tiles for this module.
- Randomly select 5 Bandit tiles for the game using the reveal procedure described in the PDF.
- Return the remaining Bandit tiles to the box.
- Place the selected Bandit tiles on their corresponding board spaces.

Rules:

- Leaders may not be placed adjacent to a Bandit tile.
- You may place a tile adjacent to a Bandit tile only if that placement connects the Bandit tile to a state with at least as many red Soldier tiles as the number of bandits shown on the Bandit tile.
- You do not gain the normal tile-placement victory point for that placement.
- Place a unification marker on the tile placed adjacent to the Bandit tile.
- If the state contains a red Soldier leader, that leader's controller gains red victory points equal to the number of bandits on the Bandit tile.
- The player who placed the tile removes that many red Soldier tiles from the state.
- Remove the Bandit tile from the board and place it next to the board.

Rogue Bandits cannot be combined with Eighteen Kingdoms.

Review note: Confirm the exact Bandit setup procedure and the number/shape references from the PDF.

### Eighteen Kingdoms

Eighteen Kingdoms uses the reverse side of the board. It includes capitals, different geography, and granaries.

Additional components:

- The reverse-side board.
- Granaries.

Setup:

- Use the Eighteen Kingdoms side of the board.
- Place a yellow Governor tile on each capital space.
- Place a granary on each capital space.
- Return blue pagodas to the box, because blue pagodas cannot be established in this module.

Rules:

- Granaries provide blue victory points at the end of the game.
- If you end your turn with your blue Farmer leader in a state containing more than one granary, remove all but one granary from that state and place the removed granaries behind your screen.
- At game end, each granary behind your screen counts as 2 blue victory points.

Review note: Confirm whether the setup uses 19 capital spaces and 19 granaries, as read from the PDF.

### Gamefound Exclusives

The PDF includes promotional or exclusive modules that may be combined with the base game and optional rules as described.

#### Royal Palace

Royal Palace adds one building.

The Royal Palace can be established on a specific pattern of 4 yellow Governor tiles, following building rules similar to pagodas.

It may also be established using the green Trader discard action, following the special procedure described in the PDF.

The Royal Palace does not award victory points directly.

If you end your turn controlling a yellow Governor leader in a state containing the Royal Palace, draw until you have up to 7 tiles behind your screen instead of the usual 6.

Review note: Confirm the exact 4-tile shape and whether the Peasants' Riot removes the Royal Palace exactly like pagodas.

#### Dragon Dynasty

Dragon Dynasty adds a fifth player.

Use the same setup and gameplay rules, with the added fifth-player components. It can be combined with other optional rules as allowed by the PDF.

Review note: Confirm whether any special setup adjustment exists beyond adding the fifth player's components.

## Credits and Metadata

Designer: Reiner Knizia.

Illustration credit in the PDF appears to name Bartlomiej Jedrzejewski. Review the exact accented spelling before updating app metadata.

The PDF copyright line and external designer-game list appear to point to 2023 for HUANG. Current app metadata may list 2024, so publication year should be verified before updating.

Review note: Final credits should be copied from the official source exactly once the reviewer confirms spelling and publication details.

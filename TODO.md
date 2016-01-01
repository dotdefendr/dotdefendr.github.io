# TODO

This game is far from completed and still has many features that need implementation and bugs to exterminate.
The following is a list of tasks that have not yet been completed.

### Instructions

Each task can be claimed by a user.
Claimed tasks should be formatted as follows:

- Task description - Username - Starting date

For example:

- Add bullet movement animation - dotdefendr - 12/27/15

Finished tasks should be crossed out and included in their
respective pull requests. The date of completion should 
also be appended. For example:

- ~~Add bullet movement animation~~ - dotdefender - 12/27/15 - 12/30/15

Pick a task and create a branch for it. 
Only add commits having to do with that task.

## Tasks

- ~~Move tasks into separate file.~~ - kfarr2 - 12/31/15 - 12/31/15
- Add title to beginning screen.
- Add player stats to end screen.
- Add "bounce" effect for enemies that collide with players.
- Debug end screen.
- Add an `obstactle` layer.
- Add obstacle collision logic for players, bullets and enemies.
- Debug obstacle layer.
- Add "Wave" functionality.
- **EITHER:** Define `wave` serializable data structure.
- **OR:** Write dynamic wave generation logic.
- Add `achievements` layer.
- Define `achievement` serializable data structure (so achievements can be loaded from a `.json` file).

## Known Bugs

- Occasionally enemies will freeze where they spawned. The sprite remains while the object is unresponsive to collisions.
- Sometimes page will not finish loading and playground will be left-aligned.


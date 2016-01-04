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
- Change enemy spawn logic to "actor" array method - kfarr2 - 12/31/15
- Add title to beginning screen.
- Add 2 timers. Pause Timer & Overall Game Timer
- Add player stats to end screen.
- Add "bounce" effect for enemies that collide with players.
- Debug end screen.
- Add an `item` layer. - kfarr2 - 12/31/15
- ~~Add an `obstactle` layer.~~ - kfarr2 - 12/31/15 - 1/1/16
- ~~Add obstacle collision logic for players, bullets and enemies.~~ - kfarr2 - 12/31/15 - 1/3/16
- Debug obstacle layer. - kfarr2 - 1/3/16
- Add `achievements` layer.
- Define `achievement` serializable data structure (so achievements can be loaded from a `.json` file).

##### These will be decided on later

- Add "Wave" functionality. - kfarr2 - 12/31/15
- **EITHER:** Define `wave` serializable data structure.
- **OR:** Write dynamic wave generation logic.

## Known Bugs

- Occasionally enemies will freeze where they spawned. The sprite remains while the object is unresponsive to collisions.
- Sometimes page will not finish loading and playground will be left-aligned.
- Esc key functionality is broken in Firefox.

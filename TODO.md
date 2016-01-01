# TODO

This game is far from completed and still has many features that need implementation and bugs to exterminate.
The following is a list of tasks that have not yet been completed.

### Instructions

Pick a task and create a branch for it. Only add commits having to do with that task.
In your pull request, edit this file to show the ~~crossed out task~~ followed by the
date and your username.

## Tasks

- ~~Move tasks into separate file.~~ 12/31 kfarr2
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

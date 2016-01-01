# DOT DEFENDR

## Introduction

A top-down, 2 dimensional, defensive shooter game.

Controls are
    WASD: Movement
    Mouse:
        Move to aim crosshair.
        Click to single fire.
        Click & hold for sustained fire.
    Esc:
        Restart the game.

## Requirements

All dependencies come packaged with the game,
which means you don't have to install anything (yay!).

However, there are a few requirements

- Apache web server installed & running
- PHP installed & running
- Javascript is enabled in your browser.

## Setup

Once you have placed the project in the correct directory,
you can do the following (I use Vim for editing. If you use
a different text editor, make sure to specify that one.)

First you will have to change the example config file to point
at the directory the game is located in. Use `pwd` to find your
filepath and edit the paths on lines 6 and 10.

    pwd
    vim dot-defender.conf.example

Next, move the config file into the directory that your version
of Apache specifies. Then restart the Apache httpd service.

    mv dot-defender.conf.example /etc/httpd/vhost.d/_dot-defender.conf
    service httpd restart

Now you should be able to see the site from within a browser
when you connect to your [VM's] ip address.

## Pitfalls

Here are some errors I've run into and how I've gotten around them.

- `service httpd restart` says something about `mod_WSGI`.
    Open the file it specifies and delete the line referencing mod_WSG; It's not important for this project. Yet.

# TODO

This game is far from completed and still has many features that need implementation and bugs to exterminate.
The following is a list of tasks that have not yet been completed.

### Instructions

Pick a task and create a branch for it. Only add commits having to do with that task.
In your pull request, edit this file to show the ~~crossed out task~~ after completion.

## Tasks

- Move tasks into separate file.
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

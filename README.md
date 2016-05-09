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
        Pause/Unpause the game.

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

Theres always stuff to do in the [todo file](TODO.md)

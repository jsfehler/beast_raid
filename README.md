
# Beast Raid

https://jsfehler.itch.io/beast-raid

Consume beasts, get the power.

A game demo for Metroidvania Month XIV. Consume enemies in battle and use their abilities to navigate the platforming segments.

# Controls

Platformer:
- Arrow keys for movement.
- Spacebar to jump (once acquired).
- Hold the Down arrow key for 2 seconds, then press spacebar to Spark Jump (once acquired).
- W key to save (at save points).
- E key to open menu.

Battle:
- Arrow keys or left mouse to select action.
- Enter key or left mouse to confirm.

# Game Notes

- Capsules you can pick up in platformer areas increase health points.
- Keyboard is not connected to menus. For those, use the mouse.
- Skill Menus are somewhat working, but in this demo learning new skills won't do anything.
- In this demo, not every beast has an ability to get.

# Contributing

Found a bug? Open a ticket under the issues tab in Github. A well written ticket will include at the minimum:
- A title summarizing the issue
- A description of why the issue is a bug
- Steps to reproduce, formatted in numbered bullet points, describing how to reproduce the bug.

Want a new feature? Are you prepared to write the code yourself? Then:
- Submit an issue in Github describing the desired new feature. If accepted, then:
- Submit a Pull Request in Github.

Found some stinky code that you know could be improved? Are you worried that the children of tomorrow will copy the stinky code in this repo? Are you prepared to refactor the code yourself?
- Submit an issue in Github describing the stinky code and why it stinks. If accepted, then:
- Submit a Pull Request in Github.

# TODO:

The following would have been nice in the demo, but I ran out of time:

- Don't allow same random enemy twice in a row.
- Show player HP outside of battle somewhere.
- Don't allow player to store multiple of a beast ability (e.g.: Can't absorb Jump twice)
- Doors that are locked to an ability (e.g.: Fire blue laser beam at blue doors to unlock them.)
- Keyboard support for menus
- Battle: After picking target, make enemy sprite not show hand/interactable icon when hovered with mouse
- Battle: Allow multiple enemies and target select in battle
- Battle: If player absorbs more than 4 abilities, force them to discard one.

# Building the game

1 - Run the following command: `npm run build`. A file called `beastRaid.js` will be compiled and placed into the `dist/` directory.

2 - The following files/folders are required to run the game:
```
assets/
dist/
fonts/
lib/
index.html
```

# License

The following MIT licensed software libraries are used by this project:

https://github.com/photonstorm/phaser

https://github.com/rexrainbow/phaser3-rex-notes

https://github.com/jsfehler/phaser-ui-tools

The fonts used in this project have their own licenses, see `fonts/` for more details.

The contents of the `src/` directory are licensed under the GNU Lesser General Public License v3.0. See `src/LICENSE.md` for more details.

The contents of the `assets/` directory are licensed under the Creative Commons Attribution-NonCommercial 4.0 International License. See https://creativecommons.org/licenses/by-nc/4.0/ for more details.

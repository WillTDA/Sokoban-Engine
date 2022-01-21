<h1 align="center">
    📦 Sokoban Engine 📦
</h1>

Create and manage Sokoban games with ease.

[![NPM](https://nodei.co/npm/sokoban-engine.png)](https://npmjs.com/package/sokoban-engine)

[![Downloads](https://img.shields.io/npm/dt/sokoban-engine?logo=npm&style=flat-square)](https://npmjs.com/package/sokoban-engine) [![Discord Server](https://img.shields.io/discord/667479986214666272?logo=discord&logoColor=white&style=flat-square)](https://discord.gg/P2g24jp)

## Features

- 🔓 <b>Fully Customisable</b> | The size of the Sokoban grid, number of boxes, and entity appearances is up to you.

- 🎮 <b>Randomly Generated Levels</b> | Generate a random game with a random size and number of boxes. (Custom levels coming soon!)

- 🏗️ <b>Easy to Set Up and Use</b> | All the logic that goes into making Sokoban is handled for you.

- ⏱️ <b>Synchronous</b> | All functions are synchronous, so you can use them in your game loop.

<b>Please Note:</b> Custom levels are not currently supported. Want to request a feature? [Open an Issue](https://github.com/WillTDA/Sokoban-Engine/issues), or Fork and [Submit a Pull Request](https://github.com/WillTDA/Sokoban-Engine/pulls) on our [GitHub Repository](https://github.com/WillTDA/Sokoban-Engine)!

## Installation and Setup

To install the package, run the following command in your terminal:

`npm i sokoban-engine --save`

Setting up the package for use is as simple as creating a new Sokoban class and setting the width and height of the game grid.

There are also a few other options you can set, such as the number of boxes on the level, and the appearance of each entity.

```js
const SokobanEngine = require("sokoban-engine");
const sokoban = new SokobanEngine(10, 10, { // Setting up a 10x10 grid
    boxes: 2, // Number of boxes to generate on the level
    entityAppearance: { // Customise what each entity on the level looks like
        player: "🤪",
        box: "📦",
        boxOnGoal: "✅",
        goal: "📥",
        wall: "🚧",
        floor: "⬛"
    }
});
```

## Code Example

Here's a quick example of how to use the package to create your own Sokoban game to run in the terminal.

```js
const SokobanEngine = require("sokoban-engine");
const sokoban = new SokobanEngine(10, 10);

while (!sokoban.hasWon) { // Keep running the game until all boxes are on the goals

    // Displaying the level
    console.clear();
    console.log(`Sokoban`);
    console.log(`Moves: ${sokoban.moves.toLocaleString()}`);
    sokoban.level.forEach(row => console.log(row.join("")));
    console.log("(w,a,s,d) to move, (r) to restart the level, (q) to quit");

    let movement = // Get the user's input somehow

    switch (movement) {
        case "w":
            sokoban.moveUp(); // Move up
            break;
        case "a":
            sokoban.moveLeft(); // Move left
            break;
        case "s":
            sokoban.moveDown(); // Move down
            break;
        case "d":
            sokoban.moveRight(); // Move right
            break;
        case 'r':
            sokoban.reset(); // Restart the level
            break;
        case "q":
            process.exit(); // Quit the game
    }
}

// Displaying the level
console.clear();
console.log(`Sokoban`);
console.log(`Moves: ${sokoban.moves.toLocaleString()}`);
sokoban.level.forEach(row => console.log(row.join("")));
console.log("You win!");
```

## Contact Us

- 👋 Need Help? [Join Our Discord Server](https://discord.gg/P2g24jp)!

- 👾 Found a Bug or want to Request a Feature? [Open an Issue](https://github.com/WillTDA/Sokoban-Engine/issues), or Fork and [Submit a Pull Request](https://github.com/WillTDA/Sokoban-Engine/pulls) on our [GitHub Repository](https://github.com/WillTDA/Sokoban-Engine)!
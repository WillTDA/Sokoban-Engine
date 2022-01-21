const { generateSokobanLevel } = require("sokoban-generator");

module.exports = function generate(width, height, options = {}, boxesLastTiles) {
    let opts = {
        width: width,
        height: height,
        boxes: options.boxes,
        minWalls: 3, // the minimum number of walls
        attempts: 5000,
        seed: Date.now(), // level generation seed
        initialPosition: { // player spawn position
            x: Math.floor(Math.random() * width),
            y: Math.floor(Math.random() * height),
        },
        type: "class", // the return type, either "string" or "class" 
    };

    let level = generateSokobanLevel(opts);

    if (level === null) return generate(width, height, options, boxesLastTiles);
    level = level._data._data;

    let boxCount = 0;
    let hasPlayer = false;
    for (let i = 0; i < level.length; i++) {
        for (let j = 0; j < level[i].length; j++) {
            if (level[i][j] === "#") level[i][j] = options.entityAppearance.wall; //wall
            if (level[i][j] === "@") level[i][j] = options.entityAppearance.player; //player
            if (level[i][j] === "+") level[i][j] = options.entityAppearance.goal; //goal
            if (level[i][j] === "$") level[i][j] = options.entityAppearance.box; //box
            if (level[i][j] === "*") level[i][j] = options.entityAppearance.goal; //goal
            if (level[i][j] === ".") level[i][j] = options.entityAppearance.goal; //goal
            if (level[i][j] === " ") level[i][j] = options.entityAppearance.floor; //floor
            if (level[i][j] === options.entityAppearance.box) {
                boxCount++;
                boxesLastTiles[`${boxCount}`] = options.entityAppearance.floor;
            }
            if (level[i].includes(options.entityAppearance.player)) hasPlayer = true;
        }
    }
    if (boxCount !== opts.boxes) return generate(width, height, options, boxesLastTiles);
    if (!hasPlayer) return generate(width, height, options, boxesLastTiles);
    return level;
};
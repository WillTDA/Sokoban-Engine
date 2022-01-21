const { generate, getPlayerPosition, checkWin } = require("./util/index");

/**
 * Sokoban Game Options
 * @typedef {object} gameOptions
 * @prop {number} [boxes=1] The Number of Boxes to Generate. Defaults to 1.
 * @prop {object} [entityAppearance={}] The Appearance of the Entities. (Player, Boxes, Goals, Walls, Floor)
 * @prop {string} [entityAppearance.player="😄"] The Player's Appearance.
 * @prop {string} [entityAppearance.box="📦"] The Box's Appearance.
 * @prop {string} [entityAppearance.boxOnGoal="✅"] The Box's Appearance when on a Goal.
 * @prop {string} [entityAppearance.goal="📥"] The Goal's Appearance.
 * @prop {string} [entityAppearance.wall="🚧"] The Wall's Appearance.
 * @prop {string} [entityAppearance.floor="⬛"] The Floor's Appearance.
 */

const gameOptions = {
    boxes: 1,
    entityAppearance: {
        player: "😄",
        box: "📦",
        boxOnGoal: "✅",
        goal: "📥",
        wall: "🚧",
        floor: "⬛"
    }
};

class Sokoban {
    /**
     * @param {number} width The Width of the Sokoban Grid.
     * @param {number} height The Height of the Sokoban Grid.
     * @param {gameOptions} options The Options for the Game.
     * 
     * @example
     * const SokobanEngine = require("sokoban-engine");
     * const sokoban = new SokobanEngine(5, 5, {
     *     boxes: 2,
     *     entityAppearance: {
     *         player: "😄",
     *         box: "📦",
     *         boxOnGoal: "✅",
     *         goal: "📥",
     *         wall: "🚧",
     *         floor: "⬛"
     *     }
     * });
     */
    constructor(width, height, options = {}) {
        //validating the parameters
        if (!width) return console.log("Sokoban Engine Error: Width not Provided.\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'");
        if (!height) return console.log("Sokoban Engine Error: Height not Provided.\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'");
        if (isNaN(width)) return console.log("Sokoban Engine Error: Width is not a Number.\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'");
        if (isNaN(height)) return console.log("Sokoban Engine Error: Height is not a Number.\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'");
        if (width < 5) return console.log("Sokoban Engine Error: Width must be more than 5.\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'");
        if (height < 5) return console.log("Sokoban Engine Error: Height must be more than 5.\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'");
        if (width % 1 !== 0) return console.log("Sokoban Engine Error: Width must be an Integer.\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'");
        if (height % 1 !== 0) return console.log("Sokoban Engine Error: Height must be an Integer.\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'");

        //set width and height

        /**
         * The Width of the Sokoban Grid.
         * @type {number}
         */

        this.width = width;

        /**
         * The Height of the Sokoban Grid.
         * @type {number}
         */
        
        this.height = height;

        //defaulting the options if not provided
        if (!options.boxes) options.boxes = 1;
        if (!options.entityAppearance) options.entityAppearance = {};
        if (!options.entityAppearance.player) options.entityAppearance.player = "😄";
        if (!options.entityAppearance.box) options.entityAppearance.box = "📦";
        if (!options.entityAppearance.boxOnGoal) options.entityAppearance.boxOnGoal = "✅";
        if (!options.entityAppearance.goal) options.entityAppearance.goal = "📥";
        if (!options.entityAppearance.wall) options.entityAppearance.wall = "🚧";
        if (!options.entityAppearance.floor) options.entityAppearance.floor = "⬛";

        //validating the options
        if (isNaN(options.boxes)) return console.log("Sokoban Engine Error: Boxes is not a Number.\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'");
        if (options.boxes < 1) return console.log("Sokoban Engine Error: There must be at least one box on a level.\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'");
        if (options.boxes > width * height) return console.log("Sokoban Engine Error: There must be less boxes than the number of spaces on a level.\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'");

        if (typeof options.entityAppearance !== "object") return console.log("Sokoban Engine Error: Entity Appearance Options is not an Object.\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'");
        if (typeof options.entityAppearance.player !== "string") return console.log("Sokoban Engine Error: Player's Appearance must be a String.\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'");
        if (typeof options.entityAppearance.box !== "string") return console.log("Sokoban Engine Error: Box's Appearance must be a String.\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'");
        if (typeof options.entityAppearance.boxOnGoal !== "string") return console.log("Sokoban Engine Error: Box's Appearance when on a Goal must be a String.\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'");
        if (typeof options.entityAppearance.goal !== "string") return console.log("Sokoban Engine Error: Goal's Appearance must be a String.\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'");
        if (typeof options.entityAppearance.wall !== "string") return console.log("Sokoban Engine Error: Wall's Appearance must be a String.\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'");
        if (typeof options.entityAppearance.floor !== "string") return console.log("Sokoban Engine Error: Floor's Appearance must be a String.\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'");

        const entityAppearances = [
            options.entityAppearance.player,
            options.entityAppearance.box,
            options.entityAppearance.boxOnGoal,
            options.entityAppearance.goal,
            options.entityAppearance.wall,
            options.entityAppearance.floor
        ];

        for (let i = 0; i < entityAppearances.length; i++) {
            for (let j = 0; j < entityAppearances.length; j++) {
                if (i !== j && entityAppearances[i] === entityAppearances[j]) return console.log("Sokoban Engine Error: Each Entity Appearance must be Unique.\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'");
            }
        }

        //set the options
        this.options = options;

        //set required variables and generate the level

        /**
         * The appearance of the tile the player is on, before the player moved to it.
         * 
         * Note: **Do not change the values of this property, it is required for the game to work properly.**
         * @type {string}
         */

        this.playerLastTile = options.entityAppearance.floor;

        /**
         * The appearance of the tile a box is on, before that box moved to it.
         * 
         * Note: **Do not change the values of this property, it is required for the game to work properly.**
         * @type {object}
         * 
         * @example
         * { "Box ID Number": "Tile Appearance" }
         */
        this.boxesLastTiles = {};

        /**
         * Data about the boxes in the game. Helps with identifying each box as a separate entity.
         * 
         * Note: **Do not change the values of this property, it is required for the game to work properly.**
         * @type {object}
         * 
         * @example
         * { "Box X-Y Coordinates": "Box ID Number" }
         */

        this.boxes = {};

        /**
         * An array containing coordinates of goals in the game.
         * 
         * Note: **Do not change the values of this property, it is required for the game to work properly.**
         * @type {string[]}
         * 
         * @example
         * [ { "x": "X-Coordinate", "y": "Y-Coordinate" } ... ]
         */

        this.boxGoals = [];

        /**
         * Whether the player has won the game or not. This occurs when all the boxes are on goal tiles.
         * 
         * Note: **Do not change the values of this property, it is required for the game to work properly.**
         * @type {boolean}
         */

        this.hasWon = false;

        /**
         * The number of times the player has moved.
         * 
         * Note: **Do not change the values of this property, it is required for the game to work properly.**
         * @type {number}
         */

        this.moves = 0;

        /**
         * The Sokoban level, represented as a two dimensional array.
         * 
         * Note: **Do not change the values of this property, it is required for the game to work properly.**
         * 
         * @type {string[][]}
         */

        this.level = generate(this.width, this.height, this.options, this.boxesLastTiles);

        /**
         * The original state of the Sokoban level, represented as a two dimensional array. Used when resetting the level.
         * 
         * Note: **Do not change the values of this property, it is required for the game to work properly.**
         * 
         * @type {string[][]}
         */
        this.originalLevel = JSON.parse(JSON.stringify(this.level));

        //creating inital coordinates for boxes and goals
        let boxCounter = 1;
        for (let i = 0; i < this.level.length; i++) {
            for (let j = 0; j < this.level[i].length; j++) {
                if (this.level[i][j] === this.options.entityAppearance.box) {
                    this.boxes[`${j},${i}`] = boxCounter;
                    boxCounter++;
                }
                if (this.level[i][j] === this.options.entityAppearance.goal) this.boxGoals.push({ x: j, y: i });
            }
        }
    }

    /**
     * Reset the Sokoban Game to the Original State in which it was Generated.
     * @returns {void}
     * @example
     * const sokoban = new SokobanEngine(5, 5);
     * sokoban.reset();
     */
    reset() {
        this.level = JSON.parse(JSON.stringify(this.originalLevel));
        this.playerLastTile = this.options.entityAppearance.floor;
        this.boxesLastTile = {};
        this.boxes = {};
        this.boxGoals = [];
        this.hasWon = false;
        this.moves = 0;

        //creating inital coordinates for boxes and goals
        let boxCounter = 1;
        for (let i = 0; i < this.level.length; i++) {
            for (let j = 0; j < this.level[i].length; j++) {
                if (this.level[i][j] === this.options.entityAppearance.box) {
                    this.boxes[`${j},${i}`] = boxCounter;
                    boxCounter++;
                }
                if (this.level[i][j] === this.options.entityAppearance.goal) this.boxGoals.push({ x: j, y: i });
            }
        }
    }

    /**
     * Move the Player Upwards on the Sokoban Board.
     * 
     * Note: **All game logic is handled by the engine itself. The state of the game is automatically updated.**
     * 
     * @returns {boolean} Whether it was possible to move the player or not.
     * @example
     * const sokoban = new SokobanEngine(5, 5);
     * sokoban.moveUp();
     */
    moveUp() {
        if (this.hasWon === true) {
            console.log("Sokoban Engine Error: Game has already been won.\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'");
            return false;
        }
        let playerPosition = getPlayerPosition(this.level, this.options.entityAppearance.player);
        if (playerPosition.y === 0) return false;
        if (this.level[playerPosition.y - 1][playerPosition.x] === this.options.entityAppearance.wall) return false;
        if (this.level[playerPosition.y - 1][playerPosition.x] === this.options.entityAppearance.box || this.level[playerPosition.y - 1][playerPosition.x] === this.options.entityAppearance.boxOnGoal) {
            if (playerPosition.y - 1 === 0) return false;
            if (this.level[playerPosition.y - 2][playerPosition.x] === this.options.entityAppearance.wall) return false;
            if (this.level[playerPosition.y - 2][playerPosition.x] === this.options.entityAppearance.box || this.level[playerPosition.y - 2][playerPosition.x] === this.options.entityAppearance.boxOnGoal) return this.level;

            //moving the box
            let box = this.boxes[`${playerPosition.x},${playerPosition.y - 1}`];
            delete this.boxes[`${playerPosition.x},${playerPosition.y - 1}`];
            this.boxes[`${playerPosition.x},${playerPosition.y - 2}`] = box;
            this.level[playerPosition.y - 1][playerPosition.x] = this.boxesLastTiles[box];
            this.boxesLastTiles[box] = this.level[playerPosition.y - 2][playerPosition.x];
            this.level[playerPosition.y - 2][playerPosition.x] = this.level[playerPosition.y - 2][playerPosition.x] === this.options.entityAppearance.goal ? this.options.entityAppearance.boxOnGoal : this.options.entityAppearance.box;

            //moving the player
            this.level[playerPosition.y][playerPosition.x] = this.playerLastTile;
            this.playerLastTile = this.level[playerPosition.y - 1][playerPosition.x];
            this.level[playerPosition.y - 1][playerPosition.x] = this.options.entityAppearance.player;
            this.moves++;
            if (checkWin(this.boxes, this.boxGoals)) this.hasWon = true;
            return true;
        } else {
            this.level[playerPosition.y][playerPosition.x] = this.playerLastTile;
            this.playerLastTile = this.level[playerPosition.y - 1][playerPosition.x];
            this.level[playerPosition.y - 1][playerPosition.x] = this.options.entityAppearance.player;
            this.moves++;
            return true;
        }
    }

    /**
     * Move the Player Downwards on the Sokoban Board.
     * 
     * Note: **All game logic is handled by the engine itself. The state of the game is automatically updated.**
     * 
     * @returns {boolean} Whether it was possible to move the player or not.
     * @example
     * const sokoban = new SokobanEngine(5, 5);
     * sokoban.moveDown();
     */
    moveDown() {
        if (this.hasWon === true) {
            console.log("Sokoban Engine Error: Game has already been won.\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'");
            return false;
        }
        let playerPosition = getPlayerPosition(this.level, this.options.entityAppearance.player);
        if (playerPosition.y === this.height - 1) return false;
        if (this.level[playerPosition.y + 1][playerPosition.x] === this.options.entityAppearance.wall) return false;
        if (this.level[playerPosition.y + 1][playerPosition.x] === this.options.entityAppearance.box || this.level[playerPosition.y + 1][playerPosition.x] === this.options.entityAppearance.boxOnGoal) {
            if (playerPosition.y + 1 === this.height - 1) return false;
            if (this.level[playerPosition.y + 2][playerPosition.x] === this.options.entityAppearance.wall) return false;
            if (this.level[playerPosition.y + 2][playerPosition.x] === this.options.entityAppearance.box || this.level[playerPosition.y + 2][playerPosition.x] === this.options.entityAppearance.boxOnGoal) return this.level;

            //moving the box
            let box = this.boxes[`${playerPosition.x},${playerPosition.y + 1}`];
            delete this.boxes[`${playerPosition.x},${playerPosition.y + 1}`];
            this.boxes[`${playerPosition.x},${playerPosition.y + 2}`] = box;
            this.level[playerPosition.y + 1][playerPosition.x] = this.boxesLastTiles[box];
            this.boxesLastTiles[box] = this.level[playerPosition.y + 2][playerPosition.x];
            this.level[playerPosition.y + 2][playerPosition.x] = this.level[playerPosition.y + 2][playerPosition.x] === this.options.entityAppearance.goal ? this.options.entityAppearance.boxOnGoal : this.options.entityAppearance.box;

            //moving the player
            this.level[playerPosition.y][playerPosition.x] = this.playerLastTile;
            this.playerLastTile = this.level[playerPosition.y + 1][playerPosition.x];
            this.level[playerPosition.y + 1][playerPosition.x] = this.options.entityAppearance.player;
            this.moves++;
            if (checkWin(this.boxes, this.boxGoals)) this.hasWon = true;
            return true;
        } else {
            this.level[playerPosition.y][playerPosition.x] = this.playerLastTile;
            this.playerLastTile = this.level[playerPosition.y + 1][playerPosition.x];
            this.level[playerPosition.y + 1][playerPosition.x] = this.options.entityAppearance.player;
            this.moves++;
            return true;
        }
    }

    /**
     * Move the Player to the Left on the Sokoban Board.
     * 
     * Note: **All game logic is handled by the engine itself. The state of the game is automatically updated.**
     * 
     * @returns {boolean} Whether it was possible to move the player or not.
     * @example
     * const sokoban = new SokobanEngine(5, 5);
     * sokoban.moveLeft();
     */
    moveLeft() {
        if (this.hasWon === true) {
            console.log("Sokoban Engine Error: Game has already been won.\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'");
            return false;
        }
        let playerPosition = getPlayerPosition(this.level, this.options.entityAppearance.player);
        if (playerPosition.x === 0) return false;
        if (this.level[playerPosition.y][playerPosition.x - 1] === this.options.entityAppearance.wall) return false;
        if (this.level[playerPosition.y][playerPosition.x - 1] === this.options.entityAppearance.box || this.level[playerPosition.y][playerPosition.x - 1] === this.options.entityAppearance.boxOnGoal) {
            if (playerPosition.x - 1 === 0) return false;
            if (this.level[playerPosition.y][playerPosition.x - 2] === this.options.entityAppearance.wall) return false;
            if (this.level[playerPosition.y][playerPosition.x - 2] === this.options.entityAppearance.box || this.level[playerPosition.y][playerPosition.x - 2] === this.options.entityAppearance.boxOnGoal) return this.level;

            //moving the box
            let box = this.boxes[`${playerPosition.x - 1},${playerPosition.y}`];
            delete this.boxes[`${playerPosition.x - 1},${playerPosition.y}`];
            this.boxes[`${playerPosition.x - 2},${playerPosition.y}`] = box;
            this.level[playerPosition.y][playerPosition.x - 1] = this.boxesLastTiles[box];
            this.boxesLastTiles[box] = this.level[playerPosition.y][playerPosition.x - 2];
            this.level[playerPosition.y][playerPosition.x - 2] = this.level[playerPosition.y][playerPosition.x - 2] === this.options.entityAppearance.goal ? this.options.entityAppearance.boxOnGoal : this.options.entityAppearance.box;

            //moving the player
            this.level[playerPosition.y][playerPosition.x] = this.playerLastTile;
            this.playerLastTile = this.level[playerPosition.y][playerPosition.x - 1];
            this.level[playerPosition.y][playerPosition.x - 1] = this.options.entityAppearance.player;
            this.moves++;
            if (checkWin(this.boxes, this.boxGoals)) this.hasWon = true;
            return true;
        } else {
            this.level[playerPosition.y][playerPosition.x] = this.playerLastTile;
            this.playerLastTile = this.level[playerPosition.y][playerPosition.x - 1];
            this.level[playerPosition.y][playerPosition.x - 1] = this.options.entityAppearance.player;
            this.moves++;
            return true;
        }
    }

    /**
     * Move the Player to the Right on the Sokoban Board.
     * 
     * Note: **All game logic is handled by the engine itself. The state of the game is automatically updated.**
     * 
     * @returns {boolean} Whether it was possible to move the player or not.
     * @example
     * const sokoban = new SokobanEngine(5, 5);
     * sokoban.moveRight();
     */
    moveRight() {
        if (this.hasWon === true) {
            console.log("Sokoban Engine Error: Game has already been won.\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'");
            return false;
        }
        let playerPosition = getPlayerPosition(this.level, this.options.entityAppearance.player);
        if (playerPosition.x === this.width - 1) return false;
        if (this.level[playerPosition.y][playerPosition.x + 1] === this.options.entityAppearance.wall) return false;
        if (this.level[playerPosition.y][playerPosition.x + 1] === this.options.entityAppearance.box || this.level[playerPosition.y][playerPosition.x + 1] === this.options.entityAppearance.boxOnGoal) {
            if (playerPosition.x + 1 === this.width - 1) return false;
            if (this.level[playerPosition.y][playerPosition.x + 2] === this.options.entityAppearance.wall) return false;
            if (this.level[playerPosition.y][playerPosition.x + 2] === this.options.entityAppearance.box || this.level[playerPosition.y][playerPosition.x + 2] === this.options.entityAppearance.boxOnGoal) return this.level;

            //moving the box
            let box = this.boxes[`${playerPosition.x + 1},${playerPosition.y}`];
            delete this.boxes[`${playerPosition.x + 1},${playerPosition.y}`];
            this.boxes[`${playerPosition.x + 2},${playerPosition.y}`] = box;
            this.level[playerPosition.y][playerPosition.x + 1] = this.boxesLastTiles[box];
            this.boxesLastTiles[box] = this.level[playerPosition.y][playerPosition.x + 2];
            this.level[playerPosition.y][playerPosition.x + 2] = this.level[playerPosition.y][playerPosition.x + 2] === this.options.entityAppearance.goal ? this.options.entityAppearance.boxOnGoal : this.options.entityAppearance.box;

            //moving the player
            this.level[playerPosition.y][playerPosition.x] = this.playerLastTile;
            this.playerLastTile = this.level[playerPosition.y][playerPosition.x + 1];
            this.level[playerPosition.y][playerPosition.x + 1] = this.options.entityAppearance.player;
            this.moves++;
            if (checkWin(this.boxes, this.boxGoals)) this.hasWon = true;
            return true;
        } else {
            this.level[playerPosition.y][playerPosition.x] = this.playerLastTile;
            this.playerLastTile = this.level[playerPosition.y][playerPosition.x + 1];
            this.level[playerPosition.y][playerPosition.x + 1] = this.options.entityAppearance.player;
            this.moves++;
            return true;
        }
    }
}

module.exports = Sokoban;
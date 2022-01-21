module.exports = function getPlayerPosition(level, playerEntity) {
    for (let i = 0; i < level.length; i++) {
        for (let j = 0; j < level[i].length; j++) {
            if (level[i][j] === playerEntity) return { x: j, y: i };
        }
    }
}
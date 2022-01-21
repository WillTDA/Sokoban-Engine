module.exports = function hasWon(boxes, boxGoals) {
    for (let i = 0; i < boxGoals.length; i++) {
        if (!boxes[`${boxGoals[i].x},${boxGoals[i].y}`]) return false;
    }
    return true;
}
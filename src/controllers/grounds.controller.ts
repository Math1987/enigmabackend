export const getGroundsOnPositions = (world_name, positions, callback) => {
  let grounds = [];

  for (let pos of positions) {
    grounds.push({ x: pos.x, y: pos.y, key: "desert" });
  }
  callback(grounds);
};

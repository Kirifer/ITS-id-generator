const { randomUUID } = require("crypto");


function generateFileKey() {
  return randomUUID();
}

module.exports = generateFileKey;

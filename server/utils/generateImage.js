const { resolveTemplateKeyFromType } = require("./templateKey");
const { renderSide } = require("./imageRenderer");

async function generateIDImages(card) {
  const typeKey = resolveTemplateKeyFromType(card.type);

  return {
    front: await renderSide(card, `${typeKey}_front`, "front"),
    back: await renderSide(card, `${typeKey}_back`, "back"),
  };
}

module.exports = { generateIDImages };

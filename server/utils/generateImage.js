const { resolveTemplateKeyFromType } = require("./templateKey");
const { renderSide } = require("./imageRenderer");

async function generateIDImages(card) {
  const typeKey = resolveTemplateKeyFromType(card.type);

  const frontResult = await renderSide(card, `${typeKey}_front`, "front");
  const backResult = await renderSide(card, `${typeKey}_back`, "back");

  return {
    frontUrl: frontResult.url,
    frontKey: frontResult.key,

    backUrl: backResult.url,
    backKey: backResult.key,
  };
}

module.exports = { generateIDImages };

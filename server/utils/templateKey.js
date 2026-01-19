function resolveTemplateKeyFromType(type) {
  const t = String(type || "").trim().toLowerCase();

  if (t === "intern") return "intern";
  if (t === "employee") return "employee";

  throw new Error(`Invalid card type: ${type}`);
}

module.exports = { resolveTemplateKeyFromType };

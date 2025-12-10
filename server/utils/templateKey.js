function resolveTemplateKeyFromType(type) {
  const t = String(type || '').trim().toLowerCase();
  if (t === 'intern') return 'intern';
  if (t === 'employee') return 'employee';
  return 'default';
}
module.exports = { resolveTemplateKeyFromType };

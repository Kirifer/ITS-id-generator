// server/utils/generateImage.js
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const SERVER_ROOT = path.join(__dirname, "..");
const TEMPLATES_DIR = path.join(SERVER_ROOT, "templates");

/* ------------ helpers (unchanged/condensed) ------------ */
const escapeXml = (s = "") =>
  String(s).replace(/[<>&"']/g, m =>
    m === "<" ? "&lt;" : m === ">" ? "&gt;" : m === "&" ? "&amp;" : m === '"' ? "&quot;" : "&#39;"
  );

const resolveTypeKey = (type) => {
  const t = String(type || "").trim().toLowerCase();
  return t === "intern" ? "intern" : t === "employee" ? "employee" : "default";
};

function toPx(val, axisBase, scale = 1) {
  if (val == null) return undefined;
  if (typeof val === "string" && val.trim().endsWith("%")) {
    const p = parseFloat(val);
    return Number.isFinite(p) ? Math.round((p / 100) * axisBase) : undefined;
  }
  const n = Number(val);
  return Number.isFinite(n) ? Math.round(n * scale) : undefined;
}

/* ------------ template cache ------------ */
const templateCache = new Map();

async function loadTemplateCached(templateKey) {
  const k = String(templateKey || "default");
  if (templateCache.has(k)) return templateCache.get(k);

  const cfgPath = path.join(TEMPLATES_DIR, `${k}.json`);
  if (!fs.existsSync(cfgPath)) throw new Error(`Template config not found: ${k}.json`);
  const raw = JSON.parse(fs.readFileSync(cfgPath, "utf-8"));

  const bgAbs = path.isAbsolute(raw.background)
    ? raw.background
    : path.join(TEMPLATES_DIR, raw.background);
  if (!fs.existsSync(bgAbs)) throw new Error(`Background not found: ${bgAbs}`);

  const meta = await sharp(bgAbs).metadata();
  const bgW = meta.width || 1200;
  const bgH = meta.height || 750;

  const designW = Number(raw?.designSize?.width)  || bgW;
  const designH = Number(raw?.designSize?.height) || bgH;
  const force   = !!raw.forceOutputToDesignSize;
  const fit     = raw.backgroundFit || "cover";

  let canvasW, canvasH, bgCanvasBuf;
  if (force) {
    canvasW = designW;
    canvasH = designH;
    bgCanvasBuf = await sharp(bgAbs)
      .resize(canvasW, canvasH, {
        fit, position: "centre",
        background: { r:0,g:0,b:0,alpha:0 },
      })
      .ensureAlpha()
      .toBuffer();
  } else {
    canvasW = bgW;
    canvasH = bgH;
    bgCanvasBuf = await sharp(bgAbs).ensureAlpha().toBuffer();
  }

  const cfg = {
    __backgroundAbs: bgAbs,
    __designW: designW,
    __designH: designH,
    __forceOutput: force,
    __bgFit: fit,
    __photo: raw.photo || null,
    __text: raw.text || {},
    __signature: raw.signature || null,           // NEW: optional signature box
  };

  const out = { cfg, canvasW, canvasH, bgCanvasBuf };
  templateCache.set(k, out);
  return out;
}

/* ------------ text layer ------------ */
function buildTextSVG(canvasW, canvasH, items) {
  const nodes = [];
  for (const it of items) {
    const { text, spec, sx, sy } = it;
    if (!spec || text == null || text === "") continue;

    const align = spec.align || "left";
    const baseline = spec.baseline || "alphabetic";
    const hasBox = spec.box && (spec.box.width != null);
    const boxLeft  = hasBox ? toPx(spec.box.x,     canvasW, sx) : undefined;
    const boxTop   = hasBox ? toPx(spec.box.y,     canvasH, sy) : undefined;
    const boxWidth = hasBox ? toPx(spec.box.width, canvasW, sx) : undefined;

    let x;
    if (hasBox && align === "center") x = (boxLeft ?? 0) + (boxWidth ?? 0) / 2;
    else if (hasBox && align === "right") x = (boxLeft ?? 0) + (boxWidth ?? 0);
    else x = toPx(spec.x, canvasW, sx) ?? 0;

    let y = toPx(spec.y, canvasH, sy) ?? 0;
    if (hasBox && y === 0 && typeof boxTop === "number") y = boxTop;

    let fs = spec.fontSize;
    if (typeof fs === "string" && fs.endsWith("%")) fs = (parseFloat(fs) / 100) * canvasH;
    fs = Number(fs); if (!Number.isFinite(fs)) fs = 36;
    fs = Math.max(1, Math.round(fs * sy));

    let ls = Number(spec.letterSpacing);
    ls = Number.isFinite(ls) ? ls * sy : 0;

    const ta = align === "center" ? "middle" : align === "right" ? "end" : "start";
    const db =
      baseline === "top" ? "text-before-edge" :
      baseline === "middle" ? "middle" : "alphabetic";

    const content = escapeXml(spec.uppercase ? String(text).toUpperCase() : String(text));
    nodes.push(
      `<text x="${x}" y="${y}" text-anchor="${ta}" dominant-baseline="${db}" ` +
      `style="font-size:${fs}px;font-weight:${spec.weight || spec.fontWeight || 700};` +
      `fill:${spec.fill || "#000"};font-family:${spec.fontFamily || "Arial, Helvetica, sans-serif"};` +
      `letter-spacing:${ls ? ls + "px" : "normal"}">${content}</text>`
    );
  }
  return Buffer.from(`<svg width="${canvasW}" height="${canvasH}" xmlns="http://www.w3.org/2000/svg">${nodes.join("")}</svg>`);
}

/* ------------ render a single side by template key ------------ */
async function renderSide(card, templateKey, fileSuffix = "") {
  const { cfg, canvasW, canvasH, bgCanvasBuf } = await loadTemplateCached(templateKey);
  const sx = canvasW / cfg.__designW;
  const sy = canvasH / cfg.__designH;

  let img = sharp(bgCanvasBuf).ensureAlpha();

  // photo on this side?
  if (card.photoPath && cfg.__photo) {
    const photoAbs = path.join(SERVER_ROOT, String(card.photoPath).replace(/^\//, ""));
    if (fs.existsSync(photoAbs)) {
      const w = toPx(cfg.__photo.width,  canvasW, sx) ?? 300;
      const h = toPx(cfg.__photo.height, canvasH, sy) ?? 380;
      const l = toPx(cfg.__photo.left,   canvasW, sx) ?? 0;
      const t = toPx(cfg.__photo.top,    canvasH, sy) ?? 0;
      const r = toPx(cfg.__photo.radius, Math.min(canvasW, canvasH), Math.min(sx, sy)) ?? 0;

      let photoBuf = await sharp(photoAbs).rotate().resize(w, h, { fit: "cover" }).toBuffer();
      if (r > 0) {
        const mask = Buffer.from(`<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${r}" ry="${r}"/></svg>`);
        photoBuf = await sharp(photoBuf).composite([{ input: mask, blend: "dest-in" }]).toBuffer();
      }
      img = img.composite([{ input: photoBuf, left: l, top: t }]);
    }
  }

  // optional signature overlay (rear)
  if (cfg.__signature) {
    const { left, top, width, height, file } = cfg.__signature;
    if (file) {
      const sigAbs = path.isAbsolute(file) ? file : path.join(TEMPLATES_DIR, file);
      if (fs.existsSync(sigAbs)) {
        const w = toPx(width,  canvasW, sx);
        const h = toPx(height, canvasH, sy);
        const l = toPx(left,   canvasW, sx) ?? 0;
        const t = toPx(top,    canvasH, sy) ?? 0;
        const sigBuf = await sharp(sigAbs).resize(w, h, { fit: "contain" }).ensureAlpha().toBuffer();
        img = img.composite([{ input: sigBuf, left: l, top: t }]);
      }
    }
  }

  // text layer (decide per side via template)
  const fullName = `${card?.fullName?.firstName || ""} ${card?.fullName?.middleInitial || ""} ${card?.fullName?.lastName || ""}`.replace(/\s+/g," ").trim();
  const items = [
    { text: fullName,                      spec: cfg.__text.name,     sx, sy },
    { text: card?.position,                spec: cfg.__text.position, sx, sy },
    { text: card?.type,                    spec: cfg.__text.type,     sx, sy },
    { text: card?.idNumber,                spec: cfg.__text.idNumber, sx, sy },
    { text: card?.emergencyContact?.phone, spec: cfg.__text.emPhone,  sx, sy },
    // OPTIONAL rear-only: emergency contact name and CEO name
    { text: `${card?.emergencyContact?.firstName || ""} ${card?.emergencyContact?.lastName || ""}`.trim(),
      spec: cfg.__text?.emName, sx, sy },
    { text: cfg.__text?.ceoName?.value || "", spec: cfg.__text?.ceoName, sx, sy }, // you can set value in template or fetch from DB later
  ];
  const textLayer = buildTextSVG(canvasW, canvasH, items);
  img = img.composite([{ input: textLayer, left: 0, top: 0 }]);

  // save
  const outDir = path.join(SERVER_ROOT, "uploads", "generated");
  fs.mkdirSync(outDir, { recursive: true });
  const outName = `${Date.now()}-${card?.idNumber || "id"}${fileSuffix ? `-${fileSuffix}` : ""}.png`;
  await img.png().toFile(path.join(outDir, outName));
  return `/uploads/generated/${outName}`;
}

/* ------------ public API ------------ */
async function generateIDImages(card) {
  const typeKey = resolveTypeKey(card?.type);
  // expect templates like: "employee_front.json", "employee_back.json"
  const frontKey = `${typeKey}_front`;
  const backKey  = `${typeKey}_back`;

  const front = await renderSide(card, frontKey, "front");
  const back  = await renderSide(card, backKey,  "back");
  return { front, back };
}

module.exports = {
  generateIDImages,
  // keep old name generating only one side if you still use it anywhere:
  generateIDImage: async (card, templateKey) => renderSide(card, templateKey, "front"),
};

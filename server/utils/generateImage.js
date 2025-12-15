// server/utils/generateImage.js
const { createCanvas, loadImage } = require("canvas");
const path = require("path");
const fs = require("fs");
const bwipjs = require("bwip-js");

const SERVER_ROOT = path.join(__dirname, "..");
const TEMPLATES_DIR = path.join(SERVER_ROOT, "templates");

/* ------------ helpers ------------ */
const resolveTypeKey = (type) => {
  const t = String(type || "").trim().toLowerCase();
  return t === "intern" ? "intern" : t === "employee" ? "employee" : "default";
};

function toPx(val, base) {
  if (val == null) return 0;
  if (typeof val === "string" && val.endsWith("%")) {
    return Math.round((parseFloat(val) / 100) * base);
  }
  return Math.round(Number(val));
}

/* ------------ image cover helper ------------ */
function drawImageCover(ctx, img, x, y, w, h) {
  const imgRatio = img.width / img.height;
  const boxRatio = w / h;

  let sx, sy, sw, sh;

  if (imgRatio > boxRatio) {
    sh = img.height;
    sw = sh * boxRatio;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    sw = img.width;
    sh = sw / boxRatio;
    sx = 0;
    sy = (img.height - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

/* ------------ barcode helper ------------ */
async function generateBarcodeImage(text, width, height) {
  const buf = await bwipjs.toBuffer({
    bcid: "code128",
    text: String(text),
    scale: 3,
    height,
    includetext: false,
    backgroundcolor: "FFFFFF",
  });
  return loadImage(buf);
}

/* ------------ load template ------------ */
async function loadTemplate(templateKey) {
  const cfgPath = path.join(TEMPLATES_DIR, `${templateKey}.json`);
  if (!fs.existsSync(cfgPath)) {
    throw new Error(`Template not found: ${templateKey}.json`);
  }

  const raw = JSON.parse(fs.readFileSync(cfgPath, "utf-8"));
  const bgPath = path.join(TEMPLATES_DIR, raw.background);
  const bgImage = await loadImage(bgPath);

  const designW = raw.designSize?.width || bgImage.width;
  const designH = raw.designSize?.height || bgImage.height;

  return {
    bgImage,
    bgW: bgImage.width,
    bgH: bgImage.height,
    designW,
    designH,
    photo: raw.photo || null,
    text: raw.text || {},
    barcode: raw.barcode || null,
  };
}

/* ------------ render one side ------------ */
async function renderSide(card, templateKey, suffix) {
  const tpl = await loadTemplate(templateKey);

  const canvas = createCanvas(tpl.designW, tpl.designH);
  const ctx = canvas.getContext("2d");

  /* ---------- BACKGROUND (CENTERED & SCALED) ---------- */
  const scale = Math.min(
    tpl.designW / tpl.bgW,
    tpl.designH / tpl.bgH
  );

  const bgDrawW = tpl.bgW * scale;
  const bgDrawH = tpl.bgH * scale;
  const bgX = (tpl.designW - bgDrawW) / 2;
  const bgY = (tpl.designH - bgDrawH) / 2;

  ctx.drawImage(tpl.bgImage, bgX, bgY, bgDrawW, bgDrawH);

  /* ---------- PHOTO ---------- */
  if (card.photoPath && tpl.photo) {
    const photoPath = path.join(
      SERVER_ROOT,
      card.photoPath.replace(/^\//, "")
    );

    if (fs.existsSync(photoPath)) {
      const img = await loadImage(photoPath);

      const w = toPx(tpl.photo.width, tpl.designW);
      const h = toPx(tpl.photo.height, tpl.designH);
      const x = toPx(tpl.photo.left, tpl.designW);
      const y = toPx(tpl.photo.top, tpl.designH);

      drawImageCover(ctx, img, x, y, w, h);
    }
  }

  /* ---------- BARCODE ---------- */
  if (tpl.barcode && card.idNumber) {
    const bw = toPx(tpl.barcode.width, tpl.designW);
    const bh = toPx(tpl.barcode.height, tpl.designH);
    const bx = toPx(tpl.barcode.x, tpl.designW);
    const by = toPx(tpl.barcode.y, tpl.designH);

    const barcodeImg = await generateBarcodeImage(card.idNumber, bw, bh);
    ctx.drawImage(barcodeImg, bx, by, bw, bh);
  }

  /* ---------- TEXT ---------- */
  const drawText = (value, spec) => {
    if (!value || !spec) return;

    ctx.fillStyle = spec.fill || "#000";
    ctx.font = `${spec.weight || 700} ${spec.fontSize || 30}px Arial`;
    ctx.textAlign = spec.align || "left";

    ctx.fillText(
      value,
      toPx(spec.x, tpl.designW),
      toPx(spec.y, tpl.designH)
    );
  };

  const fullName =
    `${card.fullName.firstName} ${card.fullName.middleInitial || ""} ${card.fullName.lastName}`
      .replace(/\s+/g, " ")
      .trim();

  drawText(fullName, tpl.text.name);
  drawText(card.position, tpl.text.position);
  drawText(card.idNumber, tpl.text.idNumber);
  drawText(
    `${card.emergencyContact?.firstName || ""} ${card.emergencyContact?.lastName || ""}`.trim(),
    tpl.text.emName
  );
  drawText(card.emergencyContact?.phone, tpl.text.emPhone);

  /* ---------- SAVE ---------- */
  const outDir = path.join(SERVER_ROOT, "uploads", "generated");
  fs.mkdirSync(outDir, { recursive: true });

  const outName = `${Date.now()}-${card.idNumber}-${suffix}.png`;
  const outPath = path.join(outDir, outName);

  fs.writeFileSync(outPath, canvas.toBuffer("image/png"));

  return `/uploads/generated/${outName}`;
}

/* ------------ public API ------------ */
async function generateIDImages(card) {
  const typeKey = resolveTypeKey(card.type);
  return {
    front: await renderSide(card, `${typeKey}_front`, "front"),
    back: await renderSide(card, `${typeKey}_back`, "back"),
  };
}

module.exports = { generateIDImages };

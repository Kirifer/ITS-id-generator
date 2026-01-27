const path = require("path");
const fs = require("fs");
const bwipjs = require("bwip-js");
const { loadImage } = require("canvas");

const SERVER_ROOT = path.join(__dirname, "..");
const TEMPLATES_DIR = path.join(SERVER_ROOT, "templates");

function toPx(val, base) {
  if (val == null) return 0;
  if (typeof val === "string" && val.endsWith("%")) {
    return Math.round((parseFloat(val) / 100) * base);
  }
  return Math.round(Number(val));
}

function drawImageCover(ctx, img, x, y, w, h) {
  const ir = img.width / img.height;
  const br = w / h;

  let sx, sy, sw, sh;

  if (ir > br) {
    sh = img.height;
    sw = sh * br;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    sw = img.width;
    sh = sw / br;
    sx = 0;
    sy = (img.height - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

async function generateBarcodeImage(text, height) {
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

async function loadTemplate(templateKey) {
  const raw = JSON.parse(
    fs.readFileSync(path.join(TEMPLATES_DIR, `${templateKey}.json`), "utf-8"),
  );

  const bgImage = await loadImage(path.join(TEMPLATES_DIR, raw.background));

  return {
    bgImage,
    bgW: bgImage.width,
    bgH: bgImage.height,
    designW: raw.designSize.width,
    designH: raw.designSize.height,
    photo: raw.photo || null,
    text: raw.text || {},
    barcode: raw.barcode || null,
    signature: raw.signature || null,
  };
}

module.exports = {
  SERVER_ROOT,
  toPx,
  drawImageCover,
  generateBarcodeImage,
  loadTemplate,
};

const { createCanvas, loadImage } = require("canvas");
const path = require("path");
const fs = require("fs");

const {
  SERVER_ROOT,
  toPx,
  drawImageCover,
  generateBarcodeImage,
  loadTemplate,
} = require("./imageHelper");

async function renderSide(card, templateKey, suffix) {
  const tpl = await loadTemplate(templateKey);
  const canvas = createCanvas(tpl.designW, tpl.designH);
  const ctx = canvas.getContext("2d");

  const scale = Math.min(tpl.designW / tpl.bgW, tpl.designH / tpl.bgH);
  ctx.drawImage(
    tpl.bgImage,
    (tpl.designW - tpl.bgW * scale) / 2,
    (tpl.designH - tpl.bgH * scale) / 2,
    tpl.bgW * scale,
    tpl.bgH * scale
  );

  if (suffix === "front" && card.photoPath && tpl.photo) {
    const img = await loadImage(
      path.join(SERVER_ROOT, card.photoPath.replace(/^\//, ""))
    );

    drawImageCover(
      ctx,
      img,
      toPx(tpl.photo.left, tpl.designW),
      toPx(tpl.photo.top, tpl.designH),
      toPx(tpl.photo.width, tpl.designW),
      toPx(tpl.photo.height, tpl.designH)
    );
  }

  if (suffix === "back" && tpl.barcode && card.idNumber) {
    const bw = toPx(tpl.barcode.width, tpl.designW);
    const bh = toPx(tpl.barcode.height, tpl.designH);
    const barcode = await generateBarcodeImage(card.idNumber, bh);

    ctx.drawImage(
      barcode,
      toPx(tpl.barcode.x, tpl.designW),
      toPx(tpl.barcode.y, tpl.designH),
      bw,
      bh
    );
  }

  const drawText = (value, spec) => {
    if (!value || !spec) return;

    let size = spec.fontSize || 30;
    ctx.fillStyle = spec.fill || "#000";
    ctx.textAlign = spec.align || "left";
    ctx.textBaseline = "top";

    while (size >= (spec.minFontSize || 14)) {
      ctx.font = `${spec.weight || 700} ${size}px Arial`;
      if (
        !spec.maxWidth ||
        ctx.measureText(value).width <= toPx(spec.maxWidth, tpl.designW)
      )
        break;
      size--;
    }

    ctx.fillText(value, toPx(spec.x, tpl.designW), toPx(spec.y, tpl.designH));
  };

  if (suffix === "front") {
    drawText(
      `${card.fullName.firstName} ${card.fullName.middleInitial || ""} ${
        card.fullName.lastName
      }`.trim(),
      tpl.text.name
    );
    drawText(card.position, tpl.text.position);
    drawText(card.employeeNumber, tpl.text.idNumber);
  }

  if (suffix === "back") {
    if (card.emergencyContact) {
      drawText(
        `Name: ${card.emergencyContact.firstName} ${card.emergencyContact.lastName}`,
        tpl.text.emName
      );
      drawText(`Number: ${card.emergencyContact.phone}`, tpl.text.emPhone);
    }

    drawText(card.hrDetails.name, tpl.text.hrName);
    drawText(card.hrDetails.position, tpl.text.hrTitle);

    if (tpl.signature && card.hrDetails.signaturePath) {
      const sig = await loadImage(
        path.join(SERVER_ROOT, card.hrDetails.signaturePath.replace(/^\//, ""))
      );
      ctx.drawImage(
        sig,
        toPx(tpl.signature.x, tpl.designW),
        toPx(tpl.signature.y, tpl.designH),
        toPx(tpl.signature.width, tpl.designW),
        toPx(tpl.signature.height, tpl.designH)
      );
    }
  }

  const outDir = path.join(SERVER_ROOT, "uploads", "generated");
  fs.mkdirSync(outDir, { recursive: true });

  const file = `${Date.now()}-${card.idNumber}-${suffix}.png`;
  fs.writeFileSync(path.join(outDir, file), canvas.toBuffer());

  return `/uploads/generated/${file}`;
}

module.exports = { renderSide };

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

const { renderInternFront } = require("./internLayout");

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
    tpl.bgH * scale,
  );

  if (suffix === "front" && card.photoPath && tpl.photo) {
    const img = await loadImage(
      path.join(SERVER_ROOT, card.photoPath.replace(/^\//, "")),
    );

    drawImageCover(
      ctx,
      img,
      toPx(tpl.photo.left, tpl.designW),
      toPx(tpl.photo.top, tpl.designH),
      toPx(tpl.photo.width, tpl.designW),
      toPx(tpl.photo.height, tpl.designH),
    );
  }

  if (suffix === "front" && templateKey.toLowerCase().includes("employee")) {
    try {
      const overlayPath = path.join(
        SERVER_ROOT,
        "templates",
        "Blue-Geometric-Vector.png",
      );
      const overlayImg = await loadImage(overlayPath);

      const overlayConfig = tpl.overlay || {
        x: 6,
        y: 50,
        width: tpl.designW,
        height: tpl.designH,
        opacity: 0.95,
      };

      ctx.globalAlpha = overlayConfig.opacity;
      ctx.drawImage(
        overlayImg,
        toPx(overlayConfig.x, tpl.designW),
        toPx(overlayConfig.y, tpl.designH),
        toPx(overlayConfig.width, tpl.designW),
        toPx(overlayConfig.height, tpl.designH),
      );
      ctx.globalAlpha = 1.0;
    } catch (err) {
      console.error(`Failed to load overlay image:`, err.message);
    }
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
      bh,
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

    const x = toPx(spec.x, tpl.designW);
    const y = toPx(spec.y, tpl.designH);

    const lines = String(value).split("\n");
    const lineHeight = size * 1.2;

    lines.forEach((line, i) => {
      ctx.fillText(line, x, y + i * lineHeight);
    });
  };

  const drawEmployeeNameShrink = (fullName, spec) => {
    if (!fullName || !spec) return;

    let size = spec.fontSize || 30;
    const minSize = spec.minFontSize || 16;

    ctx.fillStyle = spec.fill || "#000";
    ctx.textAlign = spec.align || "left";
    ctx.textBaseline = "top";

    const firstName = fullName.firstName || "";
    const middleInitial = fullName.middleInitial || "";
    const lastName = fullName.lastName || "";

    const firstNameParts = firstName.trim().split(/\s+/);

    let nameValue;

    if (firstNameParts.length === 2) {
      nameValue = `${firstNameParts[0]}\n${firstNameParts[1]}${middleInitial ? " " + middleInitial + " " : ""}\n${lastName}`.trim();
      size = Math.floor(size * 0.7);
    } else if (firstNameParts.length >= 3) {
      const line1 = firstNameParts.slice(0, 2).join(" ");
      const line2 = `${firstNameParts.slice(2).join(" ")}${middleInitial ? " " + middleInitial : ""}`;
      nameValue = `${line1}\n${line2}\n${lastName}`.trim();
      size = Math.floor(size * 0.7);
    } else {
      if (middleInitial) {
        nameValue = `${firstName} ${middleInitial}\n${lastName}`.trim();
      } else {
        nameValue = `${firstName}\n${lastName}`.trim();
      }
    }

    const maxWidth = spec.maxWidth ? toPx(spec.maxWidth, tpl.designW) : null;

    while (maxWidth && size >= minSize) {
      ctx.font = `${spec.weight || 700} ${size}px Arial`;
      const lines = nameValue.split("\n");
      const maxLineWidth = Math.max(
        ...lines.map((l) => ctx.measureText(l).width),
      );
      if (maxLineWidth <= maxWidth) break;
      size--;
    }

    const x = toPx(spec.x, tpl.designW);
    const y = toPx(spec.y, tpl.designH);

    const lines = nameValue.split("\n");
    const lineHeight = size * 1.15;

    lines.forEach((line, i) => {
      ctx.fillText(line, x, y + i * lineHeight);
    });
  };

  if (suffix === "front") {
    if (templateKey.toLowerCase().includes("employee")) {
      drawEmployeeNameShrink(card.fullName, tpl.text.name);

      let positionValue = card.position;
      let positionLineCount = 1;

      if (positionValue) {
        const words = positionValue.trim().split(/\s+/);
        if (words.length === 2) {
          positionValue = words.join("\n");
          positionLineCount = 2;
        } else if (words.length >= 3) {
          positionValue = `${words[0]} ${words[1]}\n${words.slice(2).join(" ")}`;
          positionLineCount = 2;
        }
      }

      drawText(positionValue, tpl.text.position);

      let idNumberSpec = { ...tpl.text.idNumber };
      if (positionLineCount === 2 && tpl.text.position) {
        const positionFontSize = tpl.text.position.fontSize || 30;
        const lineHeight = positionFontSize * 1.2;
        idNumberSpec.y = (tpl.text.idNumber.y || 0) + lineHeight;
      }

      drawText(card.employeeNumber, idNumberSpec);
    } else {
      renderInternFront(ctx, tpl, card, drawText);
    }
  }

  if (suffix === "back") {
    if (card.emergencyContact) {
      drawText(
        `Name: ${card.emergencyContact.firstName} ${card.emergencyContact.middleInitial || ""} ${card.emergencyContact.lastName}`.trim(),
        tpl.text.emName,
      );
      drawText(`Number: ${card.emergencyContact.phone}`, tpl.text.emPhone);
    }

    drawText(card.hrDetails.name, tpl.text.hrName);
    drawText(card.hrDetails.position, tpl.text.hrTitle);

    if (tpl.signature && card.hrDetails.signaturePath) {
      const sig = await loadImage(
        path.join(SERVER_ROOT, card.hrDetails.signaturePath.replace(/^\//, "")),
      );
      ctx.drawImage(
        sig,
        toPx(tpl.signature.x, tpl.designW),
        toPx(tpl.signature.y, tpl.designH),
        toPx(tpl.signature.width, tpl.designW),
        toPx(tpl.signature.height, tpl.designH),
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

const { toPx } = require("./imageHelper");

function renderInternFront(ctx, tpl, card, drawText) {
  const first = card.fullName.firstName || "";
  const middle = card.fullName.middleInitial || "";
  const last = card.fullName.lastName || "";

  let nameRaw = `${first} ${middle} ${last}`.replace(/\s+/g, " ").trim();

  let nameValue = nameRaw;
  let isTwoLines = false;

  if (nameRaw.length > 28) {
    const words = nameRaw.split(" ");
    const half = Math.ceil(words.length / 2);
    nameValue = `${words.slice(0, half).join(" ")}\n${words
      .slice(half)
      .join(" ")}`;
    isTwoLines = true;
  }

  const nameSpec = { ...tpl.text.name };
  const positionSpec = { ...tpl.text.position };
  const idSpec = { ...tpl.text.idNumber };

  const lockedOtherSize = Math.min(
    positionSpec.fontSize || 30,
    idSpec.fontSize || 28,
  );

  let nameSize = nameSpec.fontSize || 40;

  if (isTwoLines) {
    nameSize = Math.floor(nameSize * 0.66);
  }

  const minNameSize = nameSpec.minFontSize || 18;

  if (nameSize <= lockedOtherSize) {
    nameSize = lockedOtherSize + 2;
  }

  const maxNameWidth = nameSpec.maxWidth
    ? toPx(nameSpec.maxWidth, tpl.designW)
    : null;

  ctx.fillStyle = nameSpec.fill || "#000";
  ctx.textAlign = nameSpec.align || "center";
  ctx.textBaseline = "top";

  while (maxNameWidth && nameSize >= minNameSize) {
    ctx.font = `${nameSpec.weight || 700} ${nameSize}px Arial`;
    const lines = nameValue.split("\n");
    const maxLineWidth = Math.max(
      ...lines.map((l) => ctx.measureText(l).width),
    );
    if (maxLineWidth <= maxNameWidth) break;
    nameSize--;
  }

  if (nameSize <= lockedOtherSize) {
    nameSize = lockedOtherSize + 2;
  }

  let nameY = toPx(nameSpec.y, tpl.designH);

  if (isTwoLines) {
    nameY -= Math.round(nameSize * 0.9);
  }

  const nameX = toPx(nameSpec.x, tpl.designW);
  const nameLineHeight = nameSize * 1.05;
  const nameLines = nameValue.split("\n");

  nameLines.forEach((line, i) => {
    ctx.font = `${nameSpec.weight || 700} ${nameSize}px Arial`;
    ctx.fillText(line, nameX, nameY + i * nameLineHeight);
  });

  drawText(card.position, positionSpec);
  drawText(card.employeeNumber, idSpec);
}

module.exports = { renderInternFront };

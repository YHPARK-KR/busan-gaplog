// README에 넣는 구간 그림을 만든다. 값은 data/raw.json, 색은 DESIGN.md에서 읽는다.
//   node build-figure.js  →  docs/windows-light.svg, docs/windows-dark.svg
const fs = require("fs");
const { summarize, EXPECTED } = require("./lib.js");

const design = fs.readFileSync("DESIGN.md", "utf8").split("---")[1];
const colors = Object.fromEntries([...design.matchAll(/^  ([a-z-]+): "(#[0-9A-Fa-f]{6})"$/gm)].map((m) => [m[1], m[2]]));
const raw = JSON.parse(fs.readFileSync("data/raw.json", "utf8"));
const rows = summarize(raw.device, raw.start, raw.hours, raw.records);

const W = 880, H = 262, PAD = 28, TOP = 46, BAR_H = 120;
const slot = (W - PAD * 2) / rows.length, bw = slot - 8;
const FONT = "-apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', sans-serif";

function svg(c) {
  const p = [];
  p.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="24개 구간의 받은 기록 수: 정상 19, 일부 빠짐 3, 전부 빠짐 2" font-family="${FONT}" style="font-variant-numeric: tabular-nums">`);
  p.push(`<rect width="${W}" height="${H}" rx="6" fill="${c.surface}"/>`);
  p.push(`<line x1="${PAD}" y1="${TOP + BAR_H + 0.5}" x2="${W - PAD}" y2="${TOP + BAR_H + 0.5}" stroke="${c.line}"/>`);
  rows.forEach((r, i) => {
    const x = PAD + i * slot + 4, cx = x + bw / 2;
    const h = Math.round((r.got / EXPECTED) * BAR_H);
    if (r.st === "MISSING") {
      p.push(`<rect x="${x + 0.5}" y="${TOP + 0.5}" width="${bw - 1}" height="${BAR_H - 1}" rx="2" fill="none" stroke="${c.muted}" stroke-dasharray="4 4"/>`);
    } else {
      if (r.st === "PARTIAL") p.push(`<rect x="${x + 0.5}" y="${TOP + 0.5}" width="${bw - 1}" height="${BAR_H - 1}" rx="2" fill="none" stroke="${c.line}"/>`);
      p.push(`<rect x="${x}" y="${TOP + BAR_H - h}" width="${bw}" height="${h}" rx="2" fill="${r.st === "OK" ? c.primary : c.partial}"/>`);
    }
    const strong = r.st !== "OK";
    p.push(`<text x="${cx}" y="${TOP - 10}" text-anchor="middle" font-size="${strong ? 13 : 11}" font-weight="${strong ? 600 : 400}" fill="${strong ? c.ink : c.muted}">${r.got}</text>`);
    p.push(`<text x="${cx}" y="${TOP + BAR_H + 18}" text-anchor="middle" font-size="11" fill="${c.muted}">${String(i).padStart(2, "0")}</text>`);
  });
  const ly = H - 26;
  let lx = PAD + 4;
  const legend = [["OK", "정상 19구간"], ["PARTIAL", "일부 빠짐 3구간"], ["MISSING", "전부 빠짐 2구간"]];
  for (const [st, label] of legend) {
    if (st === "MISSING") p.push(`<rect x="${lx + 0.5}" y="${ly - 10.5}" width="11" height="11" rx="2" fill="none" stroke="${c.muted}" stroke-dasharray="4 4"/>`);
    else p.push(`<rect x="${lx}" y="${ly - 11}" width="12" height="12" rx="2" fill="${st === "OK" ? c.primary : c.partial}"/>`);
    p.push(`<text x="${lx + 19}" y="${ly}" font-size="13" font-weight="500" fill="${c.ink}">${label}</text>`);
    lx += 150;
  }
  p.push(`<text x="${W - PAD - 4}" y="${ly}" text-anchor="end" font-size="11" fill="${c.muted}">막대 위 숫자는 받은 기록 수(구간마다 ${EXPECTED}개가 와야 한다), 아래는 시각(UTC)</text>`);
  p.push("</svg>");
  return p.join("\n") + "\n";
}

const count = (st) => rows.filter((r) => r.st === st).length;
if (count("OK") !== 19 || count("PARTIAL") !== 3 || count("MISSING") !== 2) throw new Error("범례 숫자와 데이터가 다르다");
const pick = (prefix) => Object.fromEntries(["primary", "partial", "surface", "ink", "muted", "line"].map((k) => [k, colors[prefix + k]]));
fs.mkdirSync("docs", { recursive: true });
fs.writeFileSync("docs/windows-light.svg", svg(pick("")));
fs.writeFileSync("docs/windows-dark.svg", svg(pick("dark-")));
console.log(rows.map((r) => r.got).join(" "));

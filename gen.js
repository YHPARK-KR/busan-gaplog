// 모의 설비 기록 발생기: 24시간, 1분 주기. 통신 끊김 구간을 일부러 넣는다.
const fs = require("fs");
const { STEP_SEC } = require("./lib");

const START = Date.UTC(2026, 10, 20, 0, 0, 0) / 1000; // 2026-11-20 00:00 UTC
const HOURS = 24;
// 끊김: [시작 분, 끝 분) — 03:20∼03:45 일부 빠짐, 09:00∼11:00 두 구간 전부 빠짐, 17:50∼18:10 두 구간에 걸쳐 일부 빠짐
const GAPS = [[200, 225], [540, 660], [1070, 1090]];

let seed = 20261120;
function rnd() { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }

const rows = [];
for (let m = 0; m < HOURS * 60; m++) {
  if (GAPS.some(([a, b]) => m >= a && m < b)) continue; // 통신이 끊긴 동안은 기록이 남지 않는다
  const t = START + m * STEP_SEC;
  const kwh = 1.8 + 0.4 * Math.sin((m / 1440) * 2 * Math.PI) + (rnd() - 0.5) * 0.2; // 분당 절감 전력량(모의 값)
  rows.push({ t, kwh: Number(kwh.toFixed(3)) });
}
fs.mkdirSync("data", { recursive: true });
fs.writeFileSync("data/raw.json", JSON.stringify({ device: "MOCK-ESD-01", start: START, hours: HOURS, records: rows }));
console.log(`기록 ${rows.length}개 생성(끊김 없으면 ${HOURS * 60}개)`);

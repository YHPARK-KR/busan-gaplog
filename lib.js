// 구간 기록 공통 로직: 구간 나누기, 지문 계산, 상태 판정
const crypto = require("crypto");

const WINDOW_SEC = 3600; // 구간 길이: 1시간
const STEP_SEC = 60; // 기록 주기: 1분
const EXPECTED = WINDOW_SEC / STEP_SEC; // 구간마다 받아야 할 기록 수

// 한 구간의 기록을 정해진 순서와 형식의 문자열로 만든다(누가 계산해도 같은 지문이 나오게)
function canonical(records) {
  return records
    .slice()
    .sort((a, b) => a.t - b.t)
    .map((r) => `${r.t},${r.kwh.toFixed(3)}`)
    .join("\n");
}

function fingerprint(records) {
  return crypto.createHash("sha256").update(canonical(records)).digest("hex");
}

function status(received) {
  if (received === EXPECTED) return "OK"; // 정상
  if (received === 0) return "MISSING"; // 전부 빠짐
  return "PARTIAL"; // 일부 빠짐
}

// 기록 전체를 구간별 요약으로 바꾼다
function summarize(deviceId, startTs, windows, records) {
  const out = [];
  for (let w = 0; w < windows; w++) {
    const from = startTs + w * WINDOW_SEC;
    const inWin = records.filter((r) => r.t >= from && r.t < from + WINDOW_SEC);
    out.push({
      v: 1,
      dev: deviceId,
      from,
      sec: WINDOW_SEC,
      exp: EXPECTED,
      got: inWin.length,
      st: status(inWin.length),
      sum: Number(inWin.reduce((s, r) => s + r.kwh, 0).toFixed(3)),
      h: fingerprint(inWin),
    });
  }
  return out;
}

module.exports = { WINDOW_SEC, STEP_SEC, EXPECTED, canonical, fingerprint, status, summarize };

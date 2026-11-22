// 대조 화면을 만든다. 네트워크 접속 없이 data/ 파일만 읽는다.
//   PACE_MS=4000 OUT=data/verify.json node verify.js   (체인 대조 결과를 먼저 남긴다)
//   node build-view.js  →  view.html
const fs = require("fs");
const { summarize, EXPECTED } = require("./lib.js");

const front = fs.readFileSync("DESIGN.md", "utf8").split("---")[1];
const c = Object.fromEntries([...front.matchAll(/^  ([a-z-]+): "(#[0-9A-Fa-f]{6})"$/gm)].map((m) => [m[1], m[2]]));
const raw = JSON.parse(fs.readFileSync("data/raw.json", "utf8"));
const ledger = JSON.parse(fs.readFileSync("data/ledger.json", "utf8"));
const verify = JSON.parse(fs.readFileSync("data/verify.json", "utf8"));
const rows = summarize(raw.device, raw.start, raw.hours, raw.records).map((r) => ({
  ...r,
  sig: (ledger.entries.find((e) => e.from === r.from) || {}).sig,
  same: (verify.rows.find((v) => v.from === r.from) || {}).same,
}));

const LABEL = { OK: "정상", PARTIAL: "일부 빠짐", MISSING: "전부 빠짐" };
const hh = (t) => new Date(t * 1000).toISOString().slice(11, 16);
const num = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
const ok = rows.filter((r) => r.st === "OK"), held = rows.filter((r) => r.st !== "OK");
const sum = (a) => a.reduce((s, r) => s + r.sum, 0);
const tx = (sig) => `https://explorer.solana.com/tx/${sig}?cluster=devnet`;
const day = new Date(raw.start * 1000).toISOString().slice(0, 10);
const checked = verify.checkedAt.slice(0, 16).replace("T", " ");

const bars = rows.map((r, i) => {
  const h = Math.round((r.got / EXPECTED) * 100);
  return `<li class="slot ${r.st.toLowerCase()}"><a href="#h${i}" title="${hh(r.from)} ${LABEL[r.st]} ${r.got}/${EXPECTED}"><span class="n">${r.got}</span><span class="track"><span class="fill" style="height:${h}%"></span></span><span class="h">${String(i).padStart(2, "0")}</span></a></li>`;
}).join("\n");

const trs = rows.map((r, i) => `<tr id="h${i}">
<td>${hh(r.from)}</td>
<td><span class="tag ${r.st.toLowerCase()}">${LABEL[r.st]}</span></td>
<td class="r">${r.got}/${EXPECTED}</td>
<td class="r">${num(r.sum)}</td>
<td class="mono" title="${r.h}">${r.h.slice(0, 12)}</td>
<td>${r.same ? "일치" : '<strong>불일치</strong>'}</td>
<td><a href="${tx(r.sig)}">${r.sig.slice(0, 8)}…</a></td>
</tr>`).join("\n");

const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>구간 대조 | busan-gaplog</title>
<!-- design-basis: DESIGN.md (Stitch 프로젝트 Busan GapLog Audit View) -->
<style>
:root{--primary:${c.primary};--partial:${c.partial};--partial-surface:${c["partial-surface"]};--surface:${c.surface};--well:${c.well};--ink:${c.ink};--muted:${c.muted};--line:${c.line};--rule:${c.rule}}
*{box-sizing:border-box}
html{background:var(--surface);color:var(--ink);font:13px/1.55 Pretendard,-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic",system-ui,sans-serif;font-variant-numeric:tabular-nums;scrollbar-color:var(--rule) var(--surface);caret-color:var(--primary)}
::selection{background:var(--partial-surface);color:var(--ink)}
body{margin:0;padding:24px 16px 48px}
main{max-width:960px;margin:0 auto;border:1px solid var(--rule);border-radius:6px}
header,section{padding:16px 24px}
section{border-top:1px solid var(--rule)}
h1{font-size:20px;line-height:1.4;font-weight:600;margin:0}
h2{font-size:16px;line-height:1.5;font-weight:600;margin:8px 0 12px}
p{margin:4px 0 0}
.muted{color:var(--muted)}
a{color:var(--primary);text-underline-offset:3px}
a:focus-visible{outline:1px solid var(--ink);outline-offset:2px}
.mono{font:12px/1.5 "JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace}
.timeline{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(24,1fr);gap:6px}
.slot a{display:flex;flex-direction:column;align-items:stretch;text-align:center;text-decoration:none;color:var(--muted);font-size:11px}
.slot .track{height:120px;display:flex;align-items:flex-end;border-radius:2px;margin:4px 0}
.slot .fill{width:100%;background:var(--primary);border-radius:2px}
.slot.partial .track{outline:1px solid var(--line);outline-offset:-1px}
.slot.partial .fill{background:var(--partial)}
.slot.missing .track{border:1px dashed var(--muted)}
.slot.partial .n,.slot.missing .n{color:var(--ink);font-weight:600;font-size:13px;line-height:16px}
.slot .n{line-height:16px}
.slot a:hover .track,.slot a:focus-visible .track{outline:1px solid var(--ink);outline-offset:1px}
.legend{display:flex;flex-wrap:wrap;gap:8px 24px;margin:12px 0 0;padding:0;list-style:none;color:var(--muted);font-size:12px}
.legend i{display:inline-block;width:11px;height:11px;border-radius:2px;margin-right:6px;vertical-align:-1px;background:var(--primary)}
.legend .partial i{background:var(--partial)}
.legend .missing i{background:none;border:1px dashed var(--muted)}
.figures{display:flex;flex-wrap:wrap;gap:8px 0;margin:0}
.figures div{padding-right:24px;margin-right:24px;border-right:1px solid var(--line)}
.figures div:last-child{border:0;margin:0;padding:0}
.figures dt{color:var(--muted);font-size:11px;font-weight:500}
.figures dd{margin:0;font-size:16px;font-weight:600}
.scroll{overflow-x:auto}
table{width:100%;border-collapse:collapse;min-width:640px}
th{text-align:left;font-size:11px;font-weight:500;color:var(--muted);border-bottom:1px solid var(--rule);padding:6px 8px}
td{height:34px;padding:0 8px;border-bottom:1px solid var(--line);white-space:nowrap}
tbody tr:last-child td{border-bottom:0}
tbody tr:hover,tbody tr:target{background:var(--well)}
.r{text-align:right}
.tag{display:inline-block;padding:0 6px;border-radius:2px;border:1px solid var(--primary);color:var(--primary);font-size:12px;line-height:20px}
.tag.partial{border-color:var(--partial);color:var(--muted)}
.tag.missing{border:1px dashed var(--muted);color:var(--muted)}
footer{max-width:960px;margin:12px auto 0;color:var(--muted);font-size:12px}
@media (max-width:720px){body{padding:0 0 32px}main{border-left:0;border-right:0;border-radius:0}header,section{padding:16px}.timeline{gap:2px}.slot .h,.slot .n{font-size:9px}.slot.partial .n,.slot.missing .n{font-size:10px}.figures div{border:0;margin:0;padding-right:24px}footer{padding:0 16px}}
</style>
</head>
<body>
<main>
<header>
<h1>구간 대조</h1>
<p>원본 기록과 솔라나 데브넷 메모를 구간별로 맞춰 본 결과입니다.</p>
<p class="muted">모의 데이터, 데브넷. 설비 ${raw.device}, ${day} 하루(UTC), 대조 시각 ${checked} UTC</p>
</header>
<section>
<h2>구간별 받은 기록 수</h2>
<ol class="timeline">
${bars}
</ol>
<ul class="legend">
<li><i></i>정상 ${ok.length}구간 (${EXPECTED}/${EXPECTED})</li>
<li class="partial"><i></i>일부 빠짐 ${rows.filter((r) => r.st === "PARTIAL").length}구간</li>
<li class="missing"><i></i>전부 빠짐 ${rows.filter((r) => r.st === "MISSING").length}구간</li>
</ul>
</section>
<section>
<dl class="figures">
<div><dt>원본과 체인 대조</dt><dd>일치 ${verify.match} / 불일치 ${verify.mismatch}</dd></div>
<div><dt>확정분 (정상 구간 합)</dt><dd>${num(sum(ok))} kWh</dd></div>
<div><dt>보류 ${held.length}구간 (받은 값만 더한 합)</dt><dd>${num(sum(held))} kWh</dd></div>
</dl>
</section>
<section>
<h2>구간 ${rows.length}개</h2>
<div class="scroll">
<table>
<thead><tr><th>시각</th><th>상태</th><th class="r">받은 개수</th><th class="r">합계 kWh</th><th>지문 앞 12자리</th><th>대조</th><th>거래</th></tr></thead>
<tbody>
${trs}
</tbody>
</table>
</div>
</section>
</main>
<footer>기록 계정 <a class="mono" href="https://explorer.solana.com/address/${ledger.account}?cluster=devnet">${ledger.account}</a>. 지문은 구간 원본의 SHA-256이고, 거래 링크에서 체인에 남은 메모를 볼 수 있습니다.</footer>
</body>
</html>
`;
fs.writeFileSync("view.html", html);
console.log("view.html", html.length, "bytes");

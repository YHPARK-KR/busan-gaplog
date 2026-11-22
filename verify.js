// 대조: 체인 밖 원본에서 지문을 다시 계산해, 체인에 남은 구간 요약과 비교한다.
// 기록을 남긴 쪽의 장부 파일(ledger)에는 거래 서명만 있고, 요약 내용은 체인에서 읽는다.
const fs = require("fs");
const { Connection } = require("@solana/web3.js");
const { summarize } = require("./lib");

const ledger = JSON.parse(fs.readFileSync(process.env.LEDGER || "data/ledger.json"));
const RPC = process.env.RPC || ledger.rpc;
const MEMO = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";
const LABEL = { OK: "정상", PARTIAL: "일부 빠짐", MISSING: "전부 빠짐" };

function memoOf(tx) {
  for (const ix of tx.transaction.message.instructions) {
    if (ix.programId.toBase58() === MEMO) return typeof ix.parsed === "string" ? ix.parsed : null;
  }
  return null;
}

(async () => {
  const conn = new Connection(RPC, "confirmed");
  const raw = JSON.parse(fs.readFileSync(process.argv[2] || "data/raw.json"));
  const local = summarize(raw.device, raw.start, raw.hours, raw.records);
  let match = 0, mismatch = 0, confirmed = 0, heldWindows = 0, heldPartial = 0;
  const rows = [];
  for (const w of local) {
    const e = ledger.entries.find((x) => x.from === w.from);
    const hh = new Date(w.from * 1000).toISOString().slice(11, 16);
    if (!e) { console.log(hh, "체인 기록 없음"); mismatch++; continue; }
    await new Promise((r) => setTimeout(r, Number(process.env.PACE_MS || 0))); // 공개 RPC 요청 제한을 피하는 간격
    const tx = await conn.getParsedTransaction(e.sig, { maxSupportedTransactionVersion: 0 });
    const onchain = tx && memoOf(tx) ? JSON.parse(memoOf(tx)) : null;
    const same = onchain && onchain.h === w.h && onchain.got === w.got && onchain.st === w.st && onchain.from === w.from;
    same ? match++ : mismatch++;
    rows.push({ from: w.from, same: !!same });
    if (w.st === "OK") confirmed += w.sum; else { heldWindows++; heldPartial += w.sum; }
    console.log(hh, (LABEL[w.st] + "      ").slice(0, 6), `${w.got}/${w.exp}`.padStart(5), same ? "일치" : "불일치", e.sig.slice(0, 12) + "…");
  }
  console.log(`\n대조: 일치 ${match} / 불일치 ${mismatch}`);
  console.log(`확정분(정상 구간 합): ${confirmed.toFixed(3)} kWh`);
  console.log(`보류: ${heldWindows}개 구간 (그 구간에 실제로 받은 값의 합 ${heldPartial.toFixed(3)} kWh)`);
  // OUT을 주면 대조 결과를 파일로 남긴다(build-view.js가 읽는다)
  if (process.env.OUT) fs.writeFileSync(process.env.OUT, JSON.stringify({ checkedAt: new Date().toISOString(), rpc: RPC, match, mismatch, rows }, null, 1));
  process.exit(mismatch ? 1 : 0);
})().catch((e) => { console.error("실패:", e.message); process.exit(2); });

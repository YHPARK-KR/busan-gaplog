// 구간 요약을 솔라나 데브넷에 메모 거래로 남긴다. 원본 기록은 체인 밖(data/raw.json)에 둔다.
const fs = require("fs");
const { Connection, Keypair, PublicKey, Transaction, TransactionInstruction, sendAndConfirmTransaction, LAMPORTS_PER_SOL } = require("@solana/web3.js");
const { summarize } = require("./lib");

const RPC = process.env.RPC || "https://api.devnet.solana.com";
const MEMO = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
const KEY_PATH = ".keys/devnet.json";

function loadKey() {
  if (fs.existsSync(KEY_PATH)) return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync(KEY_PATH))));
  const kp = Keypair.generate();
  fs.mkdirSync(".keys", { recursive: true });
  fs.writeFileSync(KEY_PATH, JSON.stringify(Array.from(kp.secretKey)), { mode: 0o600 });
  return kp;
}

(async () => {
  const conn = new Connection(RPC, "confirmed");
  const payer = loadKey();
  console.log("기록 계정", payer.publicKey.toBase58());
  let bal = await conn.getBalance(payer.publicKey);
  if (bal < 0.01 * LAMPORTS_PER_SOL) {
    const sig = await conn.requestAirdrop(payer.publicKey, 1 * LAMPORTS_PER_SOL);
    await conn.confirmTransaction(sig, "confirmed");
    bal = await conn.getBalance(payer.publicKey);
  }
  console.log("잔액(SOL)", bal / LAMPORTS_PER_SOL);

  const raw = JSON.parse(fs.readFileSync("data/raw.json"));
  const wins = summarize(raw.device, raw.start, raw.hours, raw.records);
  const ledgerPath = process.env.LEDGER || "data/ledger.json";
  const ledger = fs.existsSync(ledgerPath) ? JSON.parse(fs.readFileSync(ledgerPath)) : { rpc: RPC, account: payer.publicKey.toBase58(), entries: [] };
  for (const w of wins) {
    if (ledger.entries.some((e) => e.from === w.from)) continue; // 이미 남긴 구간은 다시 남기지 않는다
    await new Promise((r) => setTimeout(r, Number(process.env.PACE_MS || 0))); // 공개 RPC 요청 제한을 피하는 간격
    const ix = new TransactionInstruction({ keys: [{ pubkey: payer.publicKey, isSigner: true, isWritable: false }], programId: MEMO, data: Buffer.from(JSON.stringify(w), "utf8") });
    const sig = await sendAndConfirmTransaction(conn, new Transaction().add(ix), [payer]);
    ledger.entries.push({ from: w.from, sig });
    fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 1));
    console.log(new Date(w.from * 1000).toISOString().slice(11, 16), w.st, sig.slice(0, 16) + "…");
  }
  console.log("남긴 구간", ledger.entries.length);
})().catch((e) => { console.error("실패:", e.message); process.exit(1); });

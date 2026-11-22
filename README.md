# 빠진 구간까지 적는 설비 가동 기록 (시연)

설비 가동 기록을 1시간 구간으로 잘라, 구간마다 지문(SHA-256)·받은 개수/받았어야 할 개수·상태(정상, 일부 빠짐, 전부 빠짐)를 솔라나 메모 거래로 남긴다. 원본은 체인 밖에 두고, 누구든 원본에서 지문을 다시 계산해 대조한다.

실제 설비 데이터가 아니라 모의 기록이다.

```
node gen.js                 # 모의 기록 24시간(통신 끊김 3곳 포함) → data/raw.json
node anchor.js              # 구간 요약 24건을 체인에 기록 → data/ledger.json (거래 서명)
node verify.js              # 원본 ↔ 체인 대조, 확정분·보류분 합계
node verify.js data/raw-tampered.json   # 원본을 고친 경우 불일치로 나온다
```

환경 변수: `RPC`(기본 데브넷), `LEDGER`(기본 `data/ledger.json`).
로컬 확인: `solana-test-validator --ledger test-ledger --reset` 실행 뒤 `RPC=http://127.0.0.1:8899 LEDGER=data/ledger-local.json`.

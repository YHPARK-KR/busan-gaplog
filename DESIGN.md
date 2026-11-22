---
version: alpha
name: Ledger Audit Interface
description: Stitch 프로젝트 "Busan GapLog Audit View"가 만든 디자인 시스템을 옮긴 것. 원본은 docs/stitch/DESIGN.md. README 그림과 view.html이 이 값을 읽는다.
colors:
  primary: "#165B58"
  partial: "#7BAEA8"
  partial-surface: "#DDECE9"
  surface: "#F4F6F4"
  well: "#EBEFEA"
  ink: "#1B2A26"
  muted: "#526660"
  line: "#D8E0DC"
  rule: "#C8D2CD"
  dark-primary: "#93D2CE"
  dark-partial: "#3A6D68"
  dark-surface: "#24332F"
  dark-ink: "#E3F5EE"
  dark-muted: "#A9BDB6"
  dark-line: "#3C4D48"
typography:
  headline-lg:
    fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', system-ui, sans-serif"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.4
  headline-md:
    fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.5
  body-md:
    fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', system-ui, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.55
  label-sm:
    fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', system-ui, sans-serif"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.45
  code-md:
    fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: 2px
  md: 4px
  lg: 6px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
---

# Ledger Audit Interface

> Stitch가 낸 본문을 그대로 두고 아래 「옮기면서 바꾼 것」만 더했다. 본문과 위 토큰이 다르면 토큰이 우선이다.

## Overview

깃허브 README의 구간 그림과 대조 화면(`view.html`)에 쓴다. 심사자가 1분 안에 원본과 체인 기록이 맞는지, 어느 구간이 비었는지 확인하는 읽기·작업형 화면이다.

옮기면서 바꾼 것:

- 색 토큰은 Stitch 본문 Colors 절이 적은 값(바탕 `#F4F6F4`, 잉크 `#1B2A26`, 강조 `#165B58` 등)을 썼다. Stitch 머리말의 머티리얼 계열 토큰 48개는 원본 파일에만 둔다.
- 글꼴은 한글 때문에 프리텐다드를 앞에 두고 시스템 글꼴로 내려간다. 단일 파일이라 웹 글꼴을 불러오지 않는다. 행간은 배수로 바꿨다.
- `dark-*`는 깃허브 어두운 테마용 그림 값이다. `dark-surface`·`dark-ink`·`dark-primary`·`dark-partial`은 Stitch의 inverse·secondary 토큰에서 왔고 `dark-muted`·`dark-line`은 같은 색조로 직접 정했다.
- 상태는 색만으로 구분하지 않고 받은 개수와 글자를 함께 적는다.


## Brand & Style (Stitch 원문)
The design system establishes a clinical, archival aesthetic designed for cryptographic inspection and chain verification. Drawing inspiration from institutional government ledgers, scientific print documents, and legacy terminal documentation, the interface eschews contemporary software consumerism (such as decorative elevation, rounded candy pills, and exaggerated hero metrics) in favor of high-density information architecture, total structural legibility, and understated utilitarian precision.

The emotional signature is cold, objective, and authoritative—giving auditors, node operators, and forensic researchers uninhibited focus on state proofs and transaction histories. Visual hierarchy is established strictly through 1px horizontal and vertical hairline dividers, typographic weight shifts, and disciplined tabular data alignment.

## Colors
The palette evokes archival rag paper and deep maritime ledger ink. High-contrast white and pure black are avoided to prevent optical vibration under sustained data audit conditions.

- **Canvas & Surface**: Neutral off-white ground with a subtle sage/grey tint (`#F4F6F4` for main backing, `#EBEFEA` for alternating rows or code inspection wells).
- **Ink & Typography**: Deep forest slate (`#1B2A26`) serves as primary ink for maximum contrast without harshness; secondary metadata uses subdued mineral slate (`#526660`).
- **Dividers & Rules**: Hairline borders are rendered strictly in `#D8E0DC` (secondary boundaries) and `#C8D2CD` (primary section rules).
- **Single Accent (Harbor Teal)**: `#165B58` identifies active inspection points, primary cryptographic confirmation states, and key navigational landmarks.
- **Verification States**:
  - *Full / Verified*: Deep harbor teal (`#165B58`) solid or foreground tint.
  - *Partial / Reindexing*: Lighter muted teal wash (`#7BAEA8` foreground or `#DDECE9` background tint).
  - *Missing / Gap State*: Unfilled transparent background with a crisp dashed rule (`#C8D2CD`), signalling non-presence or missing payload without loud alert tones.

## Typography
Typography reflects editorial restraint and technical precision. In system environments supporting Korean locale, standard system font stacks (`Pretendard`, `-apple-system`, `BlinkMacSystemFont`, `system-ui`) gracefully fall back under the `Inter` typographic proportions.

Rules for typographic execution:
1. **Numeric Strictness**: All numeric columns, block numbers, gas quantities, timestamps, and balance fields must use font-feature-settings: `"tnum" 1` (tabular figures) to ensure perfect vertical column scanning.
2. **Technical Artifacts**: Hashes, state roots, Merkle paths, and signatures are explicitly set in `JetBrains Mono` at 11px or 12px with zero kerning embellishment.
3. **Hierarchy**: Maximum headline scale never exceeds 20px. Visual rank is established by tabular alignment, uppercase section headers (`label-sm`), and ink contrast rather than enlarged headline point sizes.

## Layout & Spacing
The layout follows a strict document-like columnar sheet model constrained to a maximum width of 960px, pinned either centrally or left-aligned on large viewports to preserve scan lines. 

- **Layout Grid**: Content is framed inside a structured sheet rather than floating card clusters. Sections are delimited by clean 1px continuous horizontal rules with 0px margins separating related sections.
- **Rhythm & Density**: Component padding favors compact vertical densities (`space-xs` and `space-sm`) to support dense row-level scanning of multi-thousand-block logs.
- **Responsive Handling**:
  - *Desktop (≥960px)*: Sheet is rigidly fixed at `max-width: 960px`. Multi-column verification ledgers render side-by-side with fixed data widths.
  - *Tablet & Mobile (<960px)*: Outer sheet borders drop flush with the screen edges (`margin: 0`), replacing fixed column alignments with horizontal scrolling tables or stacked key-value pairs wrapped in 1px dividing rules.

## Elevation & Depth
Elevation in this design system is entirely two-dimensional and planar.

- **Zero Shadows**: Drop shadows, blur filters, outer glows, and ambient halos are strictly prohibited.
- **Planes via Hairlines**: Depth and visual separation are conveyed solely through subtle 1px structural strokes (`#D8E0DC` and `#C8D2CD`).
- **Surface Nesting**: Inset elements (such as log inspectors, code trays, or raw hex dumps) obtain visual depth by transitioning to a slightly darker background value (`#EBEFEA`), demarcated by a 1px border.
- **Modal & Popover Overlays**: When ephemeral layers are required, they utilize an opaque solid background with a continuous 1px `#1B2A26` perimeter outline and zero ambient shadow.

## Shapes
The shape language is hard-edged, geometric, and engineered. Soft pill badges, stadium borders, and dynamic circular tags are excluded.

- **Structural Containers**: Outer audit tables, modal sheets, and frame sections use a micro-radius of 6px (`rounded-sm`).
- **Internal Bars & Elements**: Progress markers, metric bars, and micro indicators use a corner radius of exactly 2px.
- **Inputs & Action Triggers**: Form inputs, action buttons, and segmented switch selectors use a strict 2px to 4px boundary.
- **Missing State Indicators**: Rendered with sharp corners, transparent fills, and uniform 1px dashed borders (dash pattern: `4px 4px`).

## Components

### Buttons & Trigger Controls
- **Default State**: Background `#F4F6F4`, border 1px solid `#C8D2CD`, text `#1B2A26`, 4px corner radius, padding `4px 10px`, font size 12px.
- **Active / Primary**: Background `#165B58`, border 1px solid `#165B58`, text `#F4F6F4`.
- **Hover / Focus**: Border darkened to `#1B2A26`, keyboard focus indicated by a crisp 1px outline offset by 2px. No drop shadows.

### Tables & Log Rows
- Tables are the core component of the system.
- Headers are left-aligned, set in `label-sm` with `#526660` text and an explicit 1px solid bottom border (`#C8D2CD`).
- Rows feature a height of 32px to 36px, with 1px bottom borders in `#D8E0DC`. No zebra striping; hovering over a row applies a solid tint (`#EBEFEA`).
- Monospace hash cells truncate with an ellipsis in the center (`0x1a2b...9f8e`) and reveal full text on immediate focus.

### Status Indicators & Badges
- Pill shapes are forbidden. All indicators use rectangular tags with 2px corner radiuses or raw typographic monograms.
- **Verified / Sync**: Text `#165B58`, border 1px solid `#165B58`, background transparent.
- **Partial**: Text `#526660`, border 1px solid `#7BAEA8`, background `#F4F6F4`.
- **Gap / Missing**: Text `#526660`, border 1px dashed `#C8D2CD`, background transparent.

### Inputs & Filters
- Compact single-line fields with 1px border `#C8D2CD`, background `#F4F6F4`, font `JetBrains Mono` 12px for address inputs.
- Active focus state changes border directly to `#165B58` with no glow or halo effect.

### Containers & Section Cards
- No floating cards with multiple elevation borders. All sections are modular panels bonded by a unified outer 1px border (`#C8D2CD`), max-width 960px, divided internally by 1px hairlines.
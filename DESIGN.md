---
version: alpha
name: busan-gaplog README
description: 깃허브 README와 그 안의 구간 그림에 쓰는 값. 읽기형 문서, 절제형 색.
colors:
  primary: "#0F6B5C"
  primary-tint: "#9CC8BD"
  surface: "#F5F7F4"
  ink: "#1B2420"
  muted: "#55625C"
  line: "#D3D9D4"
  dark-primary: "#57B8A4"
  dark-primary-tint: "#2C6B5F"
  dark-surface: "#151B18"
  dark-ink: "#E4EAE6"
  dark-muted: "#9BA8A1"
  dark-line: "#303A35"
typography:
  label-md:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', sans-serif"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.4
  label-sm:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', sans-serif"
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: 2px
  md: 6px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 28px
---

# busan-gaplog README

## Overview

읽기형 문서다. 심사자가 저장소를 열고 1분 안에 무엇을 기록하고 무엇이 확인됐는지 알게 하는 것이 목적이다. 매체는 깃허브 README(마크다운)와 그 안에 넣는 SVG 그림 한 장이다. 꾸밈은 그림 한 장에만 쓰고, 나머지는 문장과 표로 둔다.

## Colors

절제형이다. 항구 물빛에서 딴 짙은 청록(`primary`) 하나만 뜻을 가진다. 정상 구간은 `primary`, 일부 빠진 구간은 같은 색의 옅은 값(`primary-tint`), 전부 빠진 구간은 색을 채우지 않고 점선 틀만 둔다. 상태는 색만으로 구분하지 않고 받은 개수를 숫자로 함께 적는다. 바탕과 글자는 순백·순검정 대신 청록 기가 도는 값이다. `dark-*`는 깃허브 어두운 테마용 같은 역할의 값이다.

## Typography

그림 안 글자는 시스템 글꼴이다. 깃허브가 SVG를 이미지로 넣어 웹 글꼴을 불러올 수 없기 때문이다. 숫자는 `tabular-nums`로 폭을 맞춘다.

## Layout

그림 폭 880px, 24개 구간을 같은 폭의 세로 막대로 한 줄에 놓는다. 막대 높이는 받은 개수에 비례한다. 범례는 왼쪽 아래 한 줄이다.

## Shapes

막대 모서리 2px, 그림 바탕 모서리 6px. 그림자와 그라디언트는 쓰지 않는다.

## Do's and Don'ts

- 그림의 값은 `data/raw.json`에서 계산한다. 손으로 적지 않는다.
- README에 배지 줄, 이모지 아이콘, 제목 위 작은 라벨, 가운뎃점 구분자를 넣지 않는다.
- 모의 데이터와 데브넷이라는 점을 첫 화면에서 밝힌다.
- 색을 더 쓰려면 이 파일에 역할과 함께 먼저 적는다.

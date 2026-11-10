# 프로젝트 모음집

**🔗 https://projects-portal-beta.vercel.app**

제가 만든 서비스들을 한 번에 확인할 수 있는 포털 페이지입니다.

## Playground

게임과 재미 중심 프로젝트

| 프로젝트 | 설명 | GitHub | Vercel |
|----------|------|--------|--------|
| open-survivor | 뱀서류 생존 게임 | [바로가기](https://github.com/sonic240612/open-survivor) | [바로가기](https://open-survivor.vercel.app) |
| LADDER | 사다리 타기 게임 | [바로가기](https://github.com/sonic240612/LADDER) | [바로가기](https://ladder-roulette.vercel.app) |
| TikaTuka | 주사위 보드게임 | [바로가기](https://github.com/sonic240612/TikaTuka) | [바로가기](https://tikatuka-one.vercel.app) |
| Mars Panic!!! | 비공개 프로젝트 | - | - |
| iF | AI 캐릭터 채팅 & 인터랙티브 스토리텔링 플랫폼 | [바로가기](https://github.com/sonic240612/iF) | [바로가기](https://if-chat-plum.vercel.app) |
| beatsync | 실시간 멀티플레이어 음악 퀴즈 & 타임라인 카드 배틀 웹 게임 | [바로가기](https://github.com/sonic240612/beatsync) | - |

## Tools

실용적인 도구 프로젝트

| 프로젝트 | 설명 | GitHub | Vercel |
|----------|------|--------|--------|
| 어디가?(WhereTo?) | 랜덤 장소 추천 서비스 | [바로가기](https://github.com/sonic240612/whereto) | [바로가기](https://whereto-swart.vercel.app) |
| PixelCircle | 픽셀 아트용 정밀 픽셀 원형 생성기 | [바로가기](https://github.com/sonic240612/pixel-circle) | [바로가기](https://pixel-circle.vercel.app) |

## Lab

AI 에이전트와 협업 방식을 탐구하는 실험적 프로젝트

| 프로젝트 | 설명 | GitHub |
|----------|------|--------|
| Lodex | 로컬 LLM과 OpenRouter를 연결하는 데스크톱 AI 에이전트 | [바로가기](https://github.com/sonic240612/Lodex) |
| hand-in-hand | 여러 사람이 하나의 Codex 세션을 이어가는 협업 프로토타입 | [바로가기](https://github.com/sonic240612/hand-in-hand) |

## Life

일상과 생산성 프로젝트

| 프로젝트 | 설명 | GitHub | Vercel |
|----------|------|--------|--------|
| HueWorld | 실시간 글로벌 무드 맵 | [바로가기](https://github.com/sonic240612/HueWorld) | [바로가기](https://hueworld.vercel.app) |
| zen_pebble | 디지털 디톡스 & 인내심 테스트 | [바로가기](https://github.com/sonic240612/zen_pebble) | [바로가기](https://zen-pebble.vercel.app) |
| Focus Forest | Pomodoro 타이머 & 스케줄 플래너 | [바로가기](https://github.com/sonic240612/Focus-Forest) | [바로가기](https://focus-forest-jet.vercel.app) |

## 기능

- **Projects / Blog 섹션** — 상단 섹션 탭으로 프로젝트 목록과 실험 기록(Blog)을 전환. 섹션 상태는 `localStorage`에 저장되고, Blog는 `#/blog`, 포스트는 `#/blog/<slug>` 해시 라우팅으로 주소·뒤로 가기를 지원 (포스트에서 `Esc`로도 목록으로 돌아갑니다). 포스트를 읽고 있는 동안에는 목록 필터(카테고리·태그·정렬)가 숨고, 같은 칸 오른쪽(정렬 단추가 있던 자리)에 `← Blog`·`원문 Markdown` 단추가 나타납니다. 이 두 단추는 다른 탭 단추와 같은 뼈대(`.tab-btn`)를 씁니다: 탭 바가 화면 위에 있을 때는 세로 58px로 넓적하게 서고, 스크롤로 탭 바가 줄어들면 42px로 쪼그라들며 글자가 접혀 아이콘만 남습니다. 본문 맨 위의 제목이 화면 밖으로 밀려나면 날짜·제목만 유리알 알약에 담아 탭 바 한가운데(좌우 단추 사이)에 얹어 고정합니다. 알약은 자리 차지를 하지 않고, 제목이 길면 위아래로 불어나 두 줄까지 적은 뒤 잘립니다. 좌우 단추 사이가 200px보다 좁아지면 알약은 탭 바 아래로 내려갑니다
- **Blog 도입부** — Projects와 같은 자리, `Blog` 제목 위에 `Seongwoo Choi · sonic240612` 소개 줄을 둡니다
- **상단 좌측** — GitHub 아이콘만 남겼습니다. 프로필 링크이고, 사이트 이름은 화면판 독서기를 위해 감춰 두어 페이지 제목으로는 읽힙니다
- **카테고리 탭** — All / Playground / Tools / Lab / Life로 프로젝트 분류
- **태그 필터** — Blog 필터 단추는 `blog.js` 상단의 `CATEGORIES` 배열로 정의합니다. 현재는 `All` 하나만 켜 두었고, 값을 넣으면 포스트 frontmatter의 `tags`와 연결되어 필터로 동작합니다
- **정렬** — Newest / Oldest 버튼으로 최신순·오래된 순 정렬 (프로젝트와 실험 기록 모두 적용). 정렬 단추도 다른 탭과 같은 뼈대(`.tab-btn`)를 쓰기 때문에, 탭 바가 화면 위에 있을 때는 세로 58px(좁은 화면은 56px)로 같이 서고 스크롤하면 42px로 함께 줄어듭니다. 선택 렌즈도 따라서 움직입니다
- **초기 밝기 모드** — 저장된 모드가 없으면 접속 기기의 Light / Dark 설정으로 시작. 모드 버튼으로 직접 선택한 값은 다음 방문에도 우선 적용
- **iPhone 화면 여백** — 배경은 화면 끝까지 이어지고, 헤더·탭은 다이나믹 아일랜드 안전 영역을 피해 배치. 페이지 끝에 하단 안전 여백을 두어 마지막 내용까지 스크롤 가능
- **Liquid Glass 테마** — 사이트의 유일한 디자인. Apple의 조작 계층/콘텐츠 계층 구분을 참고한 웹 구현. 배경을 실제로 굴절시키는 캡슐, 미세한 색분산, 포인터 반사광, 눌림에 반응하는 광학 두께, 스프링으로 움직이는 드래그 가능한 선택 렌즈를 제공하며 Light / Dark 모드 지원
- **모션 제어** — Liquid Glass 효과는 처음 방문할 때 기본으로 켜짐. 시스템의 움직임 줄이기 설정과 별개로 상단 반짝임 버튼에서 켜거나 끌 수 있으며, 직접 끈 선택은 다음 방문에도 유지
- **프로젝트 아이콘** — Liquid Glass 카드에 프로젝트별 SVG 아이콘 표시. Lodex 원본 앱 아이콘과 hand-in-hand의 기존 브랜드 마크를 사용하고 나머지 11개는 서비스 성격에 맞춰 제작
- **실험 기록** — `posts/<slug>.md` 파일 하나가 포스트 하나. frontmatter(`title`, `date`, `tags`, `summary`)와 마크다운(제목·표·코드 블록·인용·목록·구분선)을 사이트 내장 렌더러가 HTML로 변환. 외부 마크다운 라이브러리 없음
- **접근성** — 키보드 포커스, 사이트 내 모션 끄기, 시스템 투명도 줄이기·고대비 설정, 배경 흐림 미지원 브라우저의 대체 배경 지원
- 섹션·카테고리·태그·정렬·모션 상태는 `localStorage`에 저장되어 유지됨

Liquid Glass는 Apple의 네이티브 렌더러가 아닌 웹 재현입니다. Chromium에서는 SVG 변위 필터로 실제 배경 굴절을 적용하고, Safari·Firefox 등에서는 CSS 배경 흐림과 반사광으로 대체합니다. 모션을 끄면 정적인 유리 표현을 유지하고, 투명도 감소·고대비 설정에서는 불투명한 배경으로 대체합니다. 외부 라이브러리 없이 구현했으며 스프링이 정착하면 애니메이션 계산도 멈춥니다.

디자인 참고: [Meet Liquid Glass (WWDC25)](https://developer.apple.com/videos/play/wwdc2025/219/), [Apple HIG — Materials](https://developer.apple.com/design/human-interface-guidelines/materials).

## 실험 기록 추가하기

1. 글 폴더를 만듭니다: `posts/<slug>/` (`slug`가 주소 `#/blog/<slug>`가 됩니다). 안에 `index.md`를 넣고, 그 글에서 쓰는 이미지는 같은 폴더에 함께 둡니다.

```text
posts/
  strata-qwen38-benchmark/
    index.md
    bench-voxel.png      ← 본문에서 ![복셀 벤치마크](bench-voxel.png)
```

   본문만 둘 일은 예전처럼 `posts/<slug>.md` 하나로 두어도 됩니다(둘 다 게시 대상입니다).
2. 파일 맨 위에 frontmatter를 적습니다.

```markdown
---
title: 포스트 제목
date: 2026-11-10
tags: [llm, gpu, benchmark]
summary: 목록 카드에 한 줄로 표시될 요약.
demo: bench.html         ← 선택. 포스트 폴더의 HTML을 본문 안에서 실행
demo_height: 420         ← 선택. 데모 프레임 높이(px, 기본 460)
draft: false             ← 선택. true면 게시 목록에서 빠짐
---

본문 마크다운…
```

3. 게시 목록을 갱신합니다: `node tools/build-posts.mjs`
   - `posts/*/index.md`와 `posts/*.md`를 자동으로 훑어서 `posts/index.json`(브라우저가 읽는 게시 목록)과 `posts/posts.js`(`file://` 미리보기 사본)을 다시 씁니다.
   - `index.json`에 직접 적어 둔 항목은 그대로 보존해 합집합으로 만듭니다. 글은 남겨 두고 목록에서 빼고 싶으면 frontmatter에 `draft: true`를 적으면 되고, 목록에 있는데 파일이 없는 항목은 경고 후 빠집니다. slug가 겹치면 경고하고 비정상 종료 코드를 남깁니다.
   - frontmatter의 `demo` 값이 포스트 폴더에 없거나 사이트 밖을 가리키면 빌드에서 경고합니다.
   - 목록 순서는 정렬에 영향을 주지 않습니다(Newest / Oldest가 frontmatter의 `date` 기준).
4. 미리보기를 새로고침합니다. `file://`로 여는 경우엔 Markdown을 고칠 때마다 3단계를 다시 실행해야 반영됩니다.
5. (선택) Blog 필터 단추를 추가하려면 `blog.js` 상단의 `CATEGORIES = []`에 태그 이름을 적습니다. 포스트 frontmatter의 `tags`와 연결되어 목록 필터로 동작하고, 포스트 헤더의 태그도 클릭 가능한 링크로 바뀝니다. 등록되지 않은 태그는 이름만 표시되고, 저장된 필터 값이 목록에 없으면 `All`로 되돌아갑니다.

### 이미지는 포스트 폴더에

본문에서 `![설명](photo.png)`처럼 파일명만 쓰면 그 글 폴더를 기준으로 해석됩니다.

| Markdown에서 쓴 경로 | 실제로 불러오는 파일 |
| --- | --- |
| `![설명](photo.png)` | `posts/<slug>/photo.png` |
| `![설명](../shared.png)` | `posts/shared.png` |
| `![설명](/assets/…)` | 사이트 루트 기준 (서버·`file://` 모두 동작) |
| `![설명](https://…)` | 그대로 외부에서 |

이미지는 `display: block`·`max-width: 100%`로 폭만 맞춰 둥근 모서리로 놓이고 `loading="lazy"`로 늦게 불러오며, 캡션은 그리지 않습니다(`alt`는 대체 텍스트로만 쓰입니다). `![x](javascript:…)` 같은 위험한 경로와 태그 안의 `onerror=`는 예전처럼 무력화됩니다.

### 본문 안에 실행되는 데모 끼우기

frontmatter에 `demo: bench.html` 한 줄이면 그 HTML이 포스트 본문 안에서 돌아갑니다. 위치를 직접 정하려면 본문의 원하는 자리에 `[[demo]]`를 한 줄 단독으로 놓습니다(마커가 없으면 본문 맨 위에 올라갑니다).

- iframe은 `sandbox="allow-scripts allow-forms allow-modals allow-popups allow-pointer-lock"`로 격리됩니다. 캔버스·WebGL·버튼·폼·`alert`·팝업은 동작하지만, 바깥 페이지 DOM과 `localStorage`·쿠키·IndexedDB는 차단됩니다.
- 프레임 아래에 같은 파일을 새 창으로 여는 링크가 붙습니다. 저장소에 상태를 남기는 데모는 그 링크로 열었을 때 정상 동작합니다.
- 데모 안에 다른 HTML을 iframe으로 중첩할 수도 있습니다. `file://` 미리보기에서는 격리된 창이 로컬 파일을 불러오지 못하므로(`Not allowed to load local resource`) 데모 프레임만 같은 출처로 열어 줍니다. 그 때는 라벨이 `실행 중 · 로컬 미리보기(같은 출처)`로 바뀌고, 서버·배포 환경에서는 항상 격리된 창입니다.
- 데모 안에서 사이트의 로컬 JS·JSON을 런타임 `import`·`fetch`로 가져오는 것은 차단됩니다(CDN에서 ES 모듈로 불러오는 것은 가능). 데모는 단일 파일로 만드세요.
- 높이는 `demo_height`(px, 기본 460)로 잡고, 모바일에서는 화면의 68%를 넘지 않습니다.
- `demo`는 포스트 폴더 안의 상대 경로만 허용합니다. 사이트 밖 URL이나 없는 파일은 iframe 대신 `데모를 열 수 없습니다.` 안내로 바뀝니다(`file://` 미리보기에서는 확인을 생략합니다).

데모 HTML 작성 규칙(뷰포트 메타, 다크 모드 대응, CDN 지양 등)은 사이트 안의 `#/blog/writing-guide` 글에 정리해 두었습니다.

지원하는 마크다운 문법: 제목(`#`~`######`), 구분선(`---`), 인용(`>`), 순서·비순서 목록, 표(`:---:` 정렬, 칸 안에서 `<br>`), 강조·기울임·취소선, 인라인 코드와 언어 표시 펜스(` ```mermaid `), 링크·이미지. HTML은 이스케이프되므로 `<br>`만 허용됩니다.

## 로컬에서 보기

- 서버로 여는 경우(권장): 사이트 폴더에서 `python -m http.server` 실행 후 `http://localhost:8000` 접속. 포스트는 `posts/<slug>/index.md`(또는 `posts/<slug>.md`)를 바로 읽습니다.
- `index.html`을 더블클릭해 여는 경우(`file://`)에는 브라우저가 `fetch`를 차단하므로, `posts/posts.js`(위 4단계에서 생성된 미리보기 사본)를 사용합니다. Markdown을 수정한 뒤 사본을 갱신하지 않으면 이전 내용이 보입니다.

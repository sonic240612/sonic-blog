# 프로젝트 모음집

**🔗 https://sonic240612.github.io/sonic-blog/**

제가 만든 서비스들을 한 번에 확인할 수 있는 포털 페이지입니다.

## Playground

게임과 재미 중심 프로젝트

| 프로젝트 | 설명 | GitHub |
| ---------- | ------ | -------- |
| open-survivor | 뱀서류 생존 게임 | [바로가기](https://github.com/sonic240612/open-survivor) |
| LADDER | 사다리 타기 게임 | [바로가기](https://github.com/sonic240612/LADDER) |
| TikaTuka | 주사위 보드게임 | [바로가기](https://github.com/sonic240612/TikaTuka) |
| Mars Panic!!! | 비공개 프로젝트 | - |
| iF | AI 캐릭터 채팅 & 인터랙티브 스토리텔링 플랫폼 | [바로가기](https://github.com/sonic240612/iF) |
| beatsync | 실시간 멀티플레이어 음악 퀴즈 & 타임라인 카드 배틀 웹 게임 | [바로가기](https://github.com/sonic240612/beatsync) |

## Tools

실용적인 도구 프로젝트

| 프로젝트 | 설명 | GitHub |
| ---------- | ------ | -------- |
| 어디가?(WhereTo?) | 랜덤 장소 추천 서비스 | [바로가기](https://github.com/sonic240612/whereto) |
| PixelCircle | 픽셀 아트용 정밀 픽셀 원형 생성기 | [바로가기](https://github.com/sonic240612/pixel-circle) |

## Lab

AI 에이전트와 협업 방식을 탐구하는 실험적 프로젝트

| 프로젝트 | 설명 | GitHub |
|----------|------|--------|
| Lodex | 로컬 LLM과 OpenRouter를 연결하는 데스크톱 AI 에이전트 | [바로가기](https://github.com/sonic240612/Lodex) |
| hand-in-hand | 여러 사람이 하나의 Codex 세션을 이어가는 협업 프로토타입 | [바로가기](https://github.com/sonic240612/hand-in-hand) |

## Life

일상과 생산성 프로젝트

| 프로젝트 | 설명 | GitHub |
| ---------- | ------ | -------- |
| HueWorld | 실시간 글로벌 무드 맵 | [바로가기](https://github.com/sonic240612/HueWorld) |
| zen_pebble | 디지털 디톡스 & 인내심 테스트 | [바로가기](https://github.com/sonic240612/zen_pebble) |
| Focus Forest | Pomodoro 타이머 & 스케줄 플래너 | [바로가기](https://github.com/sonic240612/Focus-Forest) |

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

## 로컬에서 보기

- 서버로 여는 경우(권장): 사이트 폴더에서 `python -m http.server` 실행 후 `http://localhost:8000` 접속. 포스트는 `posts/<slug>/index.md`(또는 `posts/<slug>.md`)를 바로 읽습니다.
- `index.html`을 더블클릭해 여는 경우(`file://`)에는 브라우저가 `fetch`를 차단하므로, `posts/posts.js`(`node tools/build-posts.mjs`가 만드는 미리보기 사본)를 사용합니다. Markdown을 수정한 뒤 사본을 갱신하지 않으면 이전 내용이 보입니다.
- 실험 기록을 추가하는 방법(글 폴더 만들기·frontmatter·이미지 경로·`demo` 한 줄)은 사이트 안의 기록 가이드 `#/blog/writing-guide`에 적어 두었습니다. 배포는 GitHub Pages 워크플로(`.github/workflows/deploy.yml`)가 `main` push마다 자동으로 합니다.

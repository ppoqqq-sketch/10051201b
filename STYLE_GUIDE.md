# 10051201b - Official Artist Archive 디자인 시스템 & 스타일 가이드 (Style Guide)

> **"칠흑의 흑요석(Deep Obsidian) 위에 피어나는 은은한 샴페인 골드(Champagne Gold)와 따스한 웜 아이보리(Warm Ivory)"**  
> 본 문서는 아티스트 **10051201b-i'm cho** 공식 웹사이트(`10051201b.com`)의 시각적 정체성과 미세하게 조율된 오리지널 색감 스펙을 영구 보존하기 위한 전용 스타일 설명서입니다.  
> 훗날 웹사이트 코드를 수정하다가 색감이나 분위기가 틀어졌을 때, 본 문서의 스펙을 그대로 적용하면 지금 마음에 드신 그 화면을 100% 복원할 수 있습니다.

---

## 1. 팔레트 디자인 철학 (Design Philosophy)

1. **절대적인 블랙의 깊이감 (Deep Obsidian Darkness)**:
   - 배경에 푸르스름한 네이비나 물 빠진 회색빛이 도는 것을 철저히 배제하고, 순수한 칠흑의 어둠(`#050608` ~ `#010203`)을 기본 캔버스로 사용합니다.
2. **미세한 금빛 웜톤의 온기 (Subtle Champagne Gold Tint)**:
   - 본문 글자는 차가운 모니터용 슬레이트 그레이 대신, 아날로그 고급 한지나 클래식 바이닐 음반의 라이너 노트처럼 아주 미세한 금빛과 온기가 감도는 웜톤(`#eae3d2`)을 띱니다.
3. **톤다운된 웜 아이보리 화이트 (Softened Dim White)**:
   - 제목과 주요 포인트에 눈을 찌르는 쨍한 100% 흰색(`#ffffff`)을 쓰지 않고, 3~5% 살짝 어둡고 부드러운 웜 아이보리(`#ede8dd`)를 사용하여 장시간 머물러도 눈이 편안합니다.
4. **차분하고 고급스러운 로열 샴페인 골드 (Royal Champagne Gold)**:
   - 샛노란 오랜지빛 골드가 아닌, 유럽 클래식 갤러리나 명품 음향 기기에서 쓰이는 차분하고 기품 있는 골드(`#d4af37`)를 액센트로 씁니다.

---

## 2. 핵심 CSS 변수 원본 코드 (`style.css` `:root`)

모든 글로벌 색상 규칙은 `style.css` 최상단의 `:root`에 정의되어 있습니다.

```css
:root {
  /* ================= 배경 & 레이어 ================= */
  --bg-dark: #050608;                        /* 가장 깊은 칠흑 배경 베이스 */
  --bg-card: rgba(13, 15, 21, 0.85);         /* 글래스모피즘 카드 배경 (블루기 제거) */
  --bg-card-hover: rgba(20, 23, 32, 0.92);   /* 카드 마우스 호버 시 배경 */
  --bg-player: rgba(9, 10, 14, 0.96);        /* 하단 고정 플레이어 배경 */
  
  /* ================= 테두리 (Borders) ================= */
  --border-light: rgba(255, 245, 220, 0.07);  /* 은은하고 따뜻한 미세 테두리 */
  --border-hover: rgba(212, 175, 55, 0.25);   /* 마우스 올렸을 때 샴페인 골드 테두리 */
  
  /* ================= 텍스트 타이포그래피 ================= */
  --text-white: #ede8dd;                     /* 제목/강조용: 톤다운된 따뜻한 웜 아이보리 */
  --text-primary: #eae3d2;                   /* 본문 텍스트: 미세하게 금빛이 감도는 웜 텍스트 */
  --text-secondary: #aba392;                 /* 보조 설명글: 차갑지 않은 샌드 골드 그레이 */
  --text-muted: #787162;                     /* 메타데이터/날짜: 차분한 앤틱 브론즈 그레이 */
  
  /* ================= 골드 & 브랜드 액센트 ================= */
  --accent-gold: #d4af37;                    /* 메인 시그니처 샴페인 골드 */
  --accent-amber: #b8932e;                   /* 보조 앰버 골드 (그라데이션용) */
  --accent-violet: #8b5cf6;                  /* 스토리 배지 포인트 바이올렛 */
  --accent-blue: #3b82f6;                    /* 보조 블루 */
  
  /* ================= 외부 플랫폼 브랜드 컬러 ================= */
  --spotify-green: #1db954;
  --youtube-red: #ff0000;
  --naver-green: #03c75a;
  --blogger-orange: #f57c00;
  
  /* ================= 그림자 & 광원 ================= */
  --shadow-main: 0 10px 30px -10px rgba(0, 0, 0, 0.8);
  --shadow-glow: 0 0 30px rgba(212, 175, 55, 0.18);
  
  /* ================= 레이아웃 ================= */
  --player-height: 84px;
  --font-sans: -apple-system, BlinkMacSystemFont, "Pretendard", "Apple SD Gothic Neo", "Segoe UI", Roboto, sans-serif;
}
```

---

## 3. 배경 그라데이션 및 앰비언트 광원 스펙

### ① 전체 바디 배경 (Body Background)
```css
body {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  padding-bottom: calc(var(--player-height) + 40px);
  /* 상단 중앙에서 은은하게 시작하여 바닥으로 갈수록 완전한 칠흑으로 떨어짐 */
  background: radial-gradient(circle at 50% 0%, #0d0f15 0%, #050608 65%, #010203 100%);
  user-select: none;
}
```

### ② 배경 앰비언트 오로라 광원 (Ambient Glows)
차가운 블루 빛을 완전히 배제하고, 은은한 골드와 보라빛 조명만 아주 옅게(`opacity: 0.22`) 흩뿌려 배경의 어두운 깊이를 해치지 않습니다.

```css
.ambient-glow {
  position: fixed;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
  z-index: 0;
  opacity: 0.22; /* 0.35에서 0.22로 낮춰 배경의 블랙을 깊게 유지 */
}

/* 우측 상단: 은은한 샴페인 골드 */
.glow-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.2), transparent 70%);
  top: -100px;
  right: -100px;
}

/* 좌측 하단: 부드러운 심야 바이올렛 */
.glow-2 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(120, 80, 180, 0.12), transparent 70%);
  bottom: 100px;
  left: -200px;
}

/* 우측 중앙: 따스한 앰버 골드 (차가운 블루를 대체) */
.glow-3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(190, 150, 50, 0.1), transparent 70%);
  top: 40%;
  right: 10%;
}
```

---

## 4. 컴포넌트별 색상 사용 규칙

| 컴포넌트 | 적용 속성 및 값 | 시각적 효과 |
| :--- | :--- | :--- |
| **메인 히어로 타이틀** | `color: var(--text-white);` | 부드럽고 차분한 아이보리 화이트 |
| **히어로 골드 강조 텍스트** | `linear-gradient(135deg, #fcedca 0%, #d4af37 60%, #b8932e 100%)` | 은은한 샴페인 골드 광채 |
| **단일 트랙 스포트라이트 카드** | `linear-gradient(135deg, rgba(16, 18, 25, 0.9), rgba(9, 11, 16, 0.96))` | 묵직하고 우아한 다크 글래스 |
| **재생 프로그레스 바** | `linear-gradient(90deg, var(--accent-gold), #e6b450)` | 흐르는 금빛 오디오 바 |
| **메인 재생 버튼 (Play)** | `background: var(--text-white); color: #000;` | 부드러운 화이트 / 호버 시 골드 |
| **스토리 카드 (음악)** | `linear-gradient(135deg, rgba(16, 18, 25, 0.88), rgba(9, 11, 16, 0.94))` | 깊은 블랙 질감의 패널 |
| **스토리 카드 (사진)** | `linear-gradient(135deg, rgba(14, 18, 26, 0.88), rgba(9, 11, 16, 0.95))` | 미세한 틸 포인트 테두리 |
| **본문 글자 (단락 P)** | `color: var(--text-secondary);` (`#aba392`) | 부드럽고 눈이 편안한 웜 그레이 |
| **본문 강조 (Strong)** | `color: var(--text-white);` (`#ede8dd`) | 은은한 아이보리 하이라이트 |
| **이스터에그 트리거 (`i'm cho`)** | `cursor: default !important;` / 호버: `#f6e05e` | 3번 연속 클릭 시 시크릿 모달 실행 |

---

## 5. 비상 복구 가이드 (Emergency Troubleshooting)

만약 나중에 웹사이트 코드를 수정하다가 **"화면이 갑자기 파랗게 보이거나, 글자가 너무 쨍하게 하얗게 변했다"** 싶으실 때는 아래 3가지만 확인하시면 됩니다.

### 체크포인트 1: `style.css` `:root` 변수 확인
`style.css` 7행~30행의 `:root` 값이 위 **[2. 핵심 CSS 변수 원본 코드]**와 일치하는지 확인합니다.

### 체크포인트 2: `index.html` 캐시 버전 확인
CSS를 수정하신 후 브라우저나 CDN이 예전 버전을 기억하고 있을 수 있습니다. `index.html` 상단의 캐시 버전을 1 올려주시면 즉시 최신 스타일이 적용됩니다:
```html
<!-- 예: v=7에서 변경 시 v=8로 갱신 -->
<link rel="stylesheet" href="style.css?v=8">
```

### 체크포인트 3: 원클릭 백업 복원 (Terminal)
아래 명령어를 터미널에서 실행하면 오늘 완벽하게 저장된 백업본으로 1초 만에 완전히 되돌릴 수 있습니다:
```bash
# 황금 색감 백업본 압축 풀기
tar -zxvf "/Volumes/PortableSSD/구글드라이브/00_시스템_백업_아카이브/10051201b_공식홈페이지_완전체_황금색감백업_20261021.tar.gz" -C /Volumes/PortableSSD/code/
```

---
*기록일자: 2026년 10월 21일*  
*작성자: Antigravity × 10051201b*

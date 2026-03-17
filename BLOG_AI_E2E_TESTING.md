# AI와 함께 E2E 테스트 자동화하기 — Claude Code + Playwright + Storybook

> **포트폴리오 OS 프로젝트**에 E2E 테스트를 도입한 경험을 공유합니다.
> Claude Code(AI 코딩 에이전트)를 활용해서 테스트 환경 구축부터 디버깅까지 전 과정을 자동화했습니다.

---

## 배경

Next.js + React + Zustand로 만든 **OS 테마 포트폴리오** 프로젝트입니다. 창 열기/닫기, 태스크바, 스타트 메뉴 등 인터랙션이 많다 보니 "이게 제대로 동작하는지 어떻게 믿지?"라는 고민이 생겼습니다.

직접 테스트 코드를 짜기보다 **Claude Code에게 시켜보자**는 생각으로 시작했습니다.

---

## 기술 스택

| 역할 | 도구 |
|---|---|
| AI 코딩 에이전트 | Claude Code (claude-sonnet-4-6) |
| E2E 테스트 | Playwright |
| AI ↔ 브라우저 연결 | Playwright MCP |
| 컴포넌트 개발/테스트 | Storybook 8 |
| 프레임워크 | Next.js 16, React 19, TypeScript |
| 스타일 | Tailwind CSS v4 |

---

## 1단계 — Playwright MCP 설정

가장 먼저 한 것은 Claude Code가 브라우저를 직접 제어할 수 있도록 **Playwright MCP**를 연결하는 것이었습니다.

```json
// .mcp.json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

Claude Code 설정(`~/.claude/settings.json`)에 MCP 자동 활성화를 추가했습니다.

```json
{
  "enableAllProjectMcpServers": true
}
```

이렇게 하면 Claude Code가 MCP 도구를 통해 **실제 브라우저를 열고, 클릭하고, 텍스트를 입력**하는 작업을 직접 수행할 수 있습니다.

---

## 2단계 — Playwright E2E 테스트 설정

Next.js 앱 전체 흐름을 검증하는 E2E 테스트 설정을 구성했습니다.

```ts
// playwright.config.ts
export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: "http://localhost:3000" },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

`webServer` 옵션 덕분에 테스트 실행 시 **Next.js 개발 서버가 자동으로 시작**됩니다.

작성된 앱 E2E 테스트들:

```ts
// e2e/window.spec.ts
test("앱 열기 → 태스크바에 탭이 추가된다", async ({ page }) => {
  await page.getByText("Terminal.sh").click();
  await expect(page.locator(".absolute.bottom-0").getByText("Terminal.sh")).toBeVisible();
});

test("윈도우 닫기 버튼으로 앱을 닫을 수 있다", async ({ page }) => {
  await page.getByText("README.md").click();
  await page.getByRole("button", { name: "닫기" }).click();
  await expect(page.locator(".absolute.bottom-0").getByText("README.md")).not.toBeVisible();
});
```

---

## 3단계 — Storybook으로 컴포넌트 단위 테스트 구성

앱 전체 테스트만으로는 부족합니다. **컴포넌트 단위의 인터랙션**도 검증하고 싶었습니다.

### Storybook 설치 시 겪은 문제

처음에는 `@storybook/nextjs`를 설치했지만 **Next.js 16과 호환 문제**가 발생했습니다.

```
next@16.1.6 not in peer deps range ^13.5.0 || ^14.0.0 || ^15.0.0
```

해결책: **`@storybook/react-vite`** 로 교체. Next.js 의존성 없이 Vite만으로 구동합니다.

### Tailwind CSS v4 연동

Tailwind v4는 PostCSS 방식 대신 Vite 플러그인을 사용합니다.

```ts
// .storybook/main.ts
viteFinal: async (config) => {
  config.plugins = [...(config.plugins ?? []), tailwindcss()];
  config.resolve = {
    ...config.resolve,
    alias: {
      "@": path.resolve(__dirname, ".."),
      "next/image": path.resolve(__dirname, "./mocks/next-image.tsx"),
    },
  };
  return config;
},
```

`next/image` 모킹이 필요한 이유는 아래에서 설명합니다.

### Zustand 상태 주입

스토리에서 Zustand 스토어 초기 상태를 직접 주입할 수 있습니다.

```tsx
// stories/desktop/StartMenu.stories.tsx
decorators: [
  (Story) => {
    useOsStore.setState({ startMenuOpen: true, openWindows: [] });
    return (
      <div className="relative h-screen w-64">
        <Story />
      </div>
    );
  },
],
```

### 인터랙션 테스트 (play 함수)

Storybook의 `play` 함수로 스토리 내에서 클릭, 입력 등의 인터랙션을 시뮬레이션할 수 있습니다.

```tsx
export const StartMenuToggle: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const startBtn = canvas.getByRole("button", { name: /start/i });

    await userEvent.click(startBtn);
    await expect(useOsStore.getState().startMenuOpen).toBe(true);

    await userEvent.click(startBtn);
    await expect(useOsStore.getState().startMenuOpen).toBe(false);
  },
};
```

---

## 4단계 — Storybook Playwright 테스트 분리

Storybook 컴포넌트 테스트를 위한 **별도의 Playwright 설정**을 만들었습니다.

```ts
// playwright.storybook.config.ts
export default defineConfig({
  testDir: "./e2e/storybook",
  use: { baseURL: "http://localhost:6006" },
  webServer: {
    command: "npm run storybook",
    url: "http://localhost:6006",
    reuseExistingServer: true,
  },
});
```

Storybook 테스트에서는 **iframe URL 방식**을 사용합니다.

```ts
// /?path=/story/... 대신 iframe URL 사용
const story = (id: string) =>
  `/iframe.html?viewMode=story&id=${id}&globals=&args=`;
```

**이유**: `/?path=/story/...`는 Storybook UI 사이드바가 포함되어 뷰포트가 줄어듭니다.
사이드바가 있으면 캔버스 너비가 640px 미만이 되어 `hidden sm:inline` 같은 Tailwind 반응형 클래스가 동작하지 않습니다.
`iframe.html`을 쓰면 **1280px 전체 뷰포트**로 테스트할 수 있습니다.

---

## 5단계 — AI가 직접 디버깅한 버그들

Claude Code가 테스트를 실행하고 실패를 분석해서 스스로 수정했습니다.

### 버그 1: 닫기 버튼 선택자 오류

```ts
// 틀린 코드
page.locator("button[aria-label='close']")
page.locator("button", { hasText: "×" }) // X는 SVG 아이콘

// 올바른 코드
page.getByRole("button", { name: "닫기" }) // aria-label="닫기"
```

Window 컴포넌트의 실제 `aria-label`을 확인해서 수정했습니다.

### 버그 2: 창이 겹쳐서 아이콘 클릭 불가

```ts
// 문제: README.md 창(z-index 11)이 열리면 Terminal.sh 아이콘(z-index 10)을 가림
await page.getByText("README.md").click();
await page.getByText("Terminal.sh").click(); // 실패!

// 해결: 스타트 메뉴를 통해 앱 열기
await page.getByRole("button", { name: /start/i }).click();
await page.locator(".absolute.bottom-12").getByText("Terminal.sh").click();
```

### 버그 3: `process is not defined` — next/image 호환 문제

Storybook(Vite 환경)에서 `config/apps.ts`가 모든 앱 컴포넌트를 즉시 import하는데,
`ProfileApp` → `next/image` → `process.env` 참조 → **Vite에서 `process` 없음** → 에러

```tsx
// .storybook/mocks/next-image.tsx
const NextImage = ({ src, alt, ...props }) => (
  <img src={typeof src === "string" ? src : src?.src ?? ""} alt={alt} {...props} />
);
export default NextImage;
```

```ts
// .storybook/main.ts alias 추가
"next/image": path.resolve(__dirname, "./mocks/next-image.tsx"),
```

### 버그 4: Strict Mode 위반 (복수 요소 매칭)

```ts
// 문제: getByText("TERMINAL")이 <span>TERMINAL</span>과 부모 <div>를 모두 매칭
await expect(page.getByText("TERMINAL")).toBeVisible(); // strict mode 에러

// 해결: 구체적인 선택자 사용
await expect(page.locator("span.font-black", { hasText: "TERMINAL" })).toBeVisible();
```

### 버그 5: 최대화 CSS 트랜지션 타이밍

```ts
// 문제: 클릭 직후 측정하면 transition-all duration-200이 아직 진행 중
await maxBtn.click();
const afterWidth = await windowEl.evaluate((el) => el.getBoundingClientRect().width);
// afterWidth === beforeWidth (아직 애니메이션 중)

// 해결: 트랜지션 완료 후 측정
await maxBtn.click();
await page.waitForTimeout(400); // 200ms transition + 여유
const afterWidth = await windowEl.evaluate((el) => el.getBoundingClientRect().width);
```

---

## 최종 결과

| 테스트 파일 | 테스트 수 | 커버리지 |
|---|---|---|
| `e2e/boot.spec.ts` | 부팅 시퀀스 | 부팅 화면 → 데스크탑 전환 |
| `e2e/desktop.spec.ts` | 데스크탑 UI | 아이콘, 스타트 메뉴 |
| `e2e/window.spec.ts` | 윈도우 시스템 | 열기/닫기/다중 창 |
| `e2e/storybook/desktop.spec.ts` | 14개 | DesktopIcon, StartMenu, Taskbar |
| `e2e/storybook/ui-components.spec.ts` | 21개 | OsButton, OsCard, Input, ErrorBox 등 |
| `e2e/storybook/window-apps.spec.ts` | 20개 | Window, ContactApp, TerminalApp |

**Storybook 컴포넌트 테스트: 55/55 통과** ✅

```
Running 55 tests using 1 worker
55 passed (58.3s)
```

---

## AI와 협업한 소감

이번 작업에서 AI가 단순히 코드를 생성하는 것을 넘어 **실제 문제를 발견하고 근본 원인을 추적해서 수정**했습니다.

특히 인상적이었던 것:

1. **스크린샷 분석**: 실패한 테스트의 스크린샷을 보고 `process is not defined` 에러임을 파악
2. **연쇄 import 추적**: `StartMenu` → `config/apps.ts` → `ProfileApp` → `next/image` → `process` 라는 연결고리를 찾아냄
3. **환경 차이 이해**: Next.js(Node.js)와 Storybook(Vite/브라우저)의 환경 차이에서 오는 문제를 정확히 진단

다만 AI도 틀릴 때가 있습니다. 처음에 `reuseExistingServer: true`로 설정된 구서버를 그대로 사용해서 새 설정이 적용되지 않는 문제가 있었고, 서버를 직접 재시작해서 해결했습니다.

---

## 실행 방법

```bash
# 컴포넌트 테스트 (Storybook 기반)
npm run test:storybook

# 앱 E2E 테스트 (Next.js 기반)
npm run test:e2e

# UI 모드로 시각적 확인
npm run test:storybook:ui
npm run test:e2e:ui
```

---

*이 글은 포트폴리오 OS 프로젝트 개발 과정의 일부입니다.*
*GitHub: [cjy3458](https://github.com/cjy3458)*

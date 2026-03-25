export interface Contribution {
  title: string;
  problem: string;
  solution: string;
  result: string;
}

export interface ProjectData {
  id: string;
  title: string;
  year: string;
  stack: string[];
  desc: string;
  fullDesc: string;
  features: string[];
  contributions?: Contribution[];
  images?: string[];
  links: { label: string; href: string }[];
}

export const PROJECTS: ProjectData[] = [
  {
    id: "web-os-emulator",
    title: "Web OS Emulator",
    year: "2025.11",
    stack: [
      "React 19",
      "TypeScript",
      "Zustand",
      "Tailwind CSS v4",
      "NestJS",
      "TypeORM",
      "Swagger",
    ],
    desc: "웹 브라우저에서 동작하는 OS 시뮬레이터. 터미널·멀티 윈도우 GUI를 실제 OS처럼 구현. Boostcamp 팀 프로젝트 (2025.11.03 ~ 11.21)",
    fullDesc:
      "React 19 + NestJS 풀스택으로 설계한 Web OS 에뮬레이터입니다. 프론트엔드 아키텍처 전반(Zustand WindowStore, XTerm.js 터미널, useFetch 공통 훅, 커맨드 맵 패턴)과 백엔드 Window CRUD REST API, SSE 실시간 동기화, Swagger 문서화를 담당했습니다. 18일 안에 브라우저 OS의 핵심 동작을 구현한 팀 프로젝트입니다.",
    features: [
      "Gemini AI 터미널 교정: 잘못된 명령어 입력 시 AI가 올바른 명령어 제안, Y/N으로 재실행 결정 — 풀스택 구현",
      "Zustand WindowStore: windows[] 배열 구조 + ComponentType<T> 패턴으로 타입 안전한 멀티 윈도우 관리",
      "Window CRUD REST API (NestJS): Promise.all 병렬 처리 + zIndex 서버 자동 할당 + SSE broadcast 연동",
    ],
    images: [
      "/projects/web-os/web-os-1.png",
    ],
    contributions: [
      {
        title: "Gemini AI 기반 터미널 명령어 교정 기능 구현 — 풀스택 설계",
        problem:
          "존재하지 않는 명령어를 입력하면 단순 에러만 출력되고, 사용자가 올바른 명령어를 직접 찾아야 했습니다.",
        solution:
          "백엔드: Google Gemini API(gemini-2.5-flash)를 NestJS 서비스로 래핑하고, 명령어 명세서(prompt.txt)를 FileSearchStore에 업로드해 RAG 방식으로 참조하도록 구성했습니다. responseJsonSchema로 응답 구조를 { COMMAND, PAYLOAD } 형태로 강제해 안정적인 JSON을 보장했습니다. 프론트엔드: 서버에서 400 에러로 교정 데이터가 내려오면 correction-prompt 타입의 터미널 라인으로 렌더링하고, pendingCorrection 상태로 Y/N 입력을 대기합니다. Y 입력 시 reExecute API로 교정된 명령어를 재실행하고, N 입력 시 취소 메시지를 출력합니다.",
        result:
          "잘못된 명령어 입력 즉시 AI가 올바른 명령어를 제안하고 재실행까지 처리합니다. 사용자가 명령어를 정확히 기억하지 않아도 터미널을 쉽게 사용할 수 있게 되었습니다.",
      },
      {
        title: "Zustand 기반 윈도우 상태 관리 (WindowStore) 구현",
        problem:
          "멀티 윈도우 OS 환경에서 각 윈도우의 위치·크기·z-index·포커스 상태를 전역에서 일관되게 관리해야 했습니다. 이후 서버 동기화(SSE)를 고려한 확장 가능한 구조도 필요했습니다.",
        solution:
          "Zustand로 전역 윈도우 상태(windows[], maxZIndex, activeWindowId)를 설계하고 생성·닫기·포커스·이동·최소화·최대화 액션을 정의했습니다. 단일 객체에서 배열 구조로 전환해 서버 응답의 윈도우 목록을 그대로 반영할 수 있도록 설계했습니다. 동적 컴포넌트 렌더링 방식으로 cloneElement·renderItem 콜백 대신 ComponentType<T>를 채택해, WindowManager가 Store에 저장된 컴포넌트 참조를 그대로 렌더링하는 단순 위임 구조로 만들었습니다.",
        result:
          "모든 윈도우 액션이 단일 스토어에서 관리되어 상태의 예측 가능성이 높아졌고, 이후 SSE 동기화 연동 시에도 스토어에 직접 반영 가능한 구조를 미리 확보했습니다.",
      },
      {
        title: "Window CRUD REST API 백엔드 구현 (NestJS)",
        problem:
          "OS 환경에서 각 윈도우의 상태(위치·크기·레이어 순서·최소화/최대화)를 서버에서 중앙 관리하고, 여러 클라이언트 간에 실시간으로 동기화할 수 있는 백엔드 API가 필요했습니다.",
        solution:
          "NestJS의 Module + Controller + Service + DTO 구조 전체를 직접 설계해 GET(목록 조회) · POST(생성) · PUT(업데이트) · DELETE(삭제) 4개 엔드포인트를 구현했습니다. Window 생성 시 Application upsert와 Process 레코드를 자동 생성해 실행 중인 프로세스를 DB에서 추적 가능하게 했습니다. 다수 윈도우 동시 생성 시 for 루프를 Promise.all + .map 병렬 처리로 리팩토링해 I/O 대기를 줄였고, 상태 변경 완료 후 SSE broadcast()로 모든 구독 클라이언트에 실시간 동기화했습니다. Swagger 데코레이터로 API 문서도 완성했습니다.",
        result:
          "Window 상태 관리 API 전 레이어를 단독으로 설계·구현해 팀 연동을 빠르게 완료했습니다. Swagger 문서화 덕분에 프론트엔드 팀이 별도 커뮤니케이션 없이 API를 즉시 사용할 수 있었습니다.",
      },
    ],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/boostcampwm2025/web22-web-os-emulation",
      },
    ],
  },
  {
    id: "urimodu-dabinchi",
    title: "우리-모두-다빈치",
    year: "2025.12 ~",
    stack: [
      "React",
      "TypeScript",
      "Sentry",
      "Mixpanel",
      "Tailwind",
      "FSD Architecture",
    ],
    desc: "누구나 가볍게 즐길 수 있는 퀘게임 서비스. FE 3명, BE 2명 팀 프로젝트.",
    fullDesc:
      "나눔보스 — 누구나 가볍게 즐길 수 있는 퀘게임 서비스입니다. Sentry·n8n·Gemini AI를 연결한 에러 자동 분석 파이프라인, Vite 번들 최적화, Web/Mobile 멀티 플랫폼 공통 패키지 설계, Mixpanel 기반 수치 지표 환경 구축까지 서비스 품질과 개발 효율 전반을 개선했습니다.",
    features: [
      "Sentry → n8n → Gemini AI → Notion 파이프라인으로 에러 원인 파악 시간 2시간 → 5분 단축",
      "Vite Vendor Chunk 분리 + lazy loading으로 Lighthouse 77 → 92점, FCP 50%·LCP 55% 개선",
      "Memoization·비제어 컴포넌트·상태관리 최적화로 렌더 커밋 73회 → 3회(95.9%), AppLayout 리렌더링 18ms → 3.4ms(81%) 감소",
      "Mixpanel 도입으로 수치 기반 이벤트 지표 시각화 및 라운드 총 시간 데이터 확보",
    ],
    contributions: [
      {
        title: "Sentry, n8n, AI: 에러 자동 분석 AI Agent 파이프라인 구축",
        problem:
          "프로덕션에서 에러가 발생할 때마다 Sentry를 수동으로 확인하고 원인을 분석해야 하는 반복 작업이 있었습니다. 에러 내용을 팀에 공유하고 문서화하는 과정에도 수작업이 소요됐습니다.",
        solution:
          "Sentry Webhook → n8n 워크플로우 → Gemini AI 분석 → Notion 자동 문서화 파이프라인을 구축했습니다. Gemini AI가 stacktrace 기반으로 발생 파일 위치·원인·해결 방향을 자동 분석하여 구조화된 리포트를 생성합니다.",
        result:
          "에러 발생 즉시 AI 분석 리포트가 Notion에 자동 생성되어 원인 파악 시간이 2시간에서 5분으로 단축됐습니다. 에러 분석 및 문서화 수작업이 완전히 제거됐습니다.",
      },
      {
        title: "Vite 빌드 최적화: Vendor Chunk 분리를 통한 초기 로드 시간 개선",
        problem:
          "프로젝트 규모가 커짐에 따라 외부 라이브러리가 포함된 Vendor Chunk 파일의 크기가 비대해졌습니다. 단일 파일 크기가 커서 브라우저의 초기 로딩 속도(LCP, FCP)가 저하됐습니다. 앱 코드만 변경되고 라이브러리는 그대로인 경우에도 모든 파일을 다시 다운로드해야 했습니다.",
        solution:
          "라이브러리를 기준으로 Vendor Chunk를 분할하고, 초기 페이지에서 필요 없는 코드를 lazy loading으로 코드 스플리팅했습니다.",
        result:
          "초기 로드 번들 사이즈 10% 감소, 재방문(캐시) 기준 로드 번들 사이즈 70% 감소. Lighthouse 성능 점수 77 → 92점(15점 향상), FCP 1.4초 → 0.7초(50% 개선), LCP 2.0초 → 0.9초(55% 개선).",
      },
      {
        title: "Memoization·비제어 컴포넌트·상태관리 최적화를 통한 렌더링 성능 개선",
        problem:
          "채팅 메시지 수신 시 구독 위치 문제로 PlayerListSection 등 무관한 컴포넌트까지 리렌더링이 발생했습니다. 채팅 입력 시 글자 입력마다 컴포넌트 트리 전체가 리렌더링되어 한 세션 73회 렌더 커밋이 발생했습니다. 토스트 알림 발생 시 AppLayout 리렌더링이 정적 자식 컴포넌트에 불필요하게 전파됐습니다.",
        solution:
          "Zustand 구독을 실제 데이터 사용 컴포넌트 내부로 이동하고, 소켓 이벤트 핸들러에서는 getState()로 구독 없이 스토어에 직접 접근했습니다. useState → useRef 기반 비제어 컴포넌트로 전환해 타이핑 중 React 렌더링 사이클에서 완전히 분리했습니다. props 변화가 없는 정적 컴포넌트에 React.memo를 적용해 부모 리렌더링 전파를 차단했습니다.",
        result:
          "채팅 입력 중 같은 글자 수 입력 상황에서 렌더 커밋 73회 → 3회로 95.9% 감소했습니다. AppLayout 리렌더링 비용 18ms → 3.4ms로 81% 감소했습니다.",
      },
      {
        title: "Mixpanel 기반 이벤트 모니터링 도입",
        problem:
          "Sentry 커스텀 데이터가 모두 String 타입으로 저장되어 평균(avg)·비율 등 수치 기반 지표 계산이 불가능했습니다. 사용자 행동 데이터를 에러 로그와 함께 관리하면서 가독성이 저하되고 목적별 분석이 어려웠습니다.",
        solution:
          "이벤트 기반 분석 도구인 Mixpanel을 도입했습니다. 사용자 행동을 이벤트와 속성 구조로 체계적으로 수집하고, 수치형 데이터 기반 평균·분포·전환율 등 통계 지표를 시각화했습니다.",
        result:
          "사용자들의 라운드 시간별 드로잉 시간 비율의 평균을 측정하여 라운드 총 시간 설정을 변경했습니다. 에러 추적과 사용자 분석 도메인을 분리하여 관리 효율이 향상됐습니다.",
      },
    ],
    images: [
      "/projects/davinci/2-lobby.gif",
      "/projects/davinci/3-show.gif",
      "/projects/davinci/4-draw.gif",
      "/projects/davinci/5-replay.gif",
      "/projects/davinci/6-score.gif",
      "/projects/davinci/7-result.gif",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/boostcampwm2025/web04-we-are-all-da-Vinci" },
      { label: "서비스 링크", href: "https://wlldv.art/" },
    ],
  },
  {
    id: "arti",
    title: "Arti",
    year: "2023.09 - 2023.12",
    stack: ["Next.js", "TypeScript", "React", "Recoil", "Emotion"],
    desc: "신진 의류 디자이너 홍보 및 투표 기반 서비스 플랫폼. PO 1명, PD 1명, FE 3명, BE 4명.",
    fullDesc:
      "신진 의류 디자이너의 작품을 홍보하고 투표할 수 있는 서비스 플랫폼입니다. CSR 기반 React에서 Next.js로 직접 마이그레이션하여 SEO와 코어 웹 성능을 대폭 개선했고, 파트 간 협업 프로세스를 주도적으로 설계해 프로젝트 불확실성을 제거했습니다.",
    features: [
      "처음 접한 Next.js를 2주 이내에 익혀 SSR 라우팅 구축, Lighthouse LCP·FCP 35% 개선",
      "페이지별 메타데이터 작성으로 Lighthouse SEO 96점 달성",
      "일일 진행 상황 공유 문화 제안으로 파트 간 협업 효율 향상 및 테스크 번업 횟수 감소",
    ],
    contributions: [
      {
        title: "이미지 최적화 및 SEO 개선을 위한 React → Next.js 마이그레이션",
        problem:
          "다수의 고해상도 의상 이미지로 인해 초기 렌더링 속도가 느려지고 사용자 이탈이 발생했습니다. CSR 기반의 React 환경에서 검색 로봇의 크롤링 효율이 낮아 Lighthouse SEO가 65점이었습니다.",
        solution:
          "처음 접한 Next.js를 2주 안에 익혀 마이그레이션을 진행해 SSR 기반 HTML 렌더링으로 전환했습니다. 페이지별 metadata API로 OG 태그·키워드를 직접 설정하고, Next/Image + priority 속성으로 뷰포트 이미지 LCP를 직접 제어하며 자동 WebP 변환 및 압축을 적용했습니다.",
        result:
          "Lighthouse LCP·FCP 35% 개선, SEO 96점으로 개선됐습니다.",
      },
      {
        title:
          "파트 간 협업 시너지 창출 및 프로젝트 가시성 확보를 위한 프로세스 개선 주도",
        problem:
          "각 파트가 유기적으로 연결되어 있음에도 불구하고 서로의 상세 진행 상황을 파악하기 어려웠습니다. 테스크 Due date가 다가옴에 따라 완성도를 객관적으로 측정하고 관리할 수 있는 명확한 기준이 없었습니다.",
        solution:
          "매일 정해진 시간에 모든 파트가 모여 오늘 한 일과 다음 날 목표를 공유하는 문화를 제안했습니다. 기한 대비 현재 맡은 테스크의 실질적인 구현 완성도를 매일 공유함으로써 프로젝트의 불확실성을 제거했습니다.",
        result:
          "비효율적인 중복 확인 과정이 감소하고, 모든 팀원이 동일한 목표 지점과 타임라인을 공유하며 작업 효율이 향상됐습니다. 매일 공유되는 완성도 지표를 통해 테스크 분배가 용이해지고 마감 기한 내 높은 퀄리티로 프로젝트를 완수했습니다.",
      },
    ],
    images: [
      "/projects/arti/image 540.png",
      "/projects/arti/image 541.png",
      "/projects/arti/image 542.png",
      "/projects/arti/image 543.png",
    ],
    links: [{ label: "GitHub", href: "https://github.com/orgs/Lucy-Arti/repositories" }],
  },
  {
    id: "cau-likelion-wiki",
    title: "CAU-Likelion-WIKI",
    year: "2023.10 - 2023.12",
    stack: ["Next.js", "TypeScript", "Recoil", "Emotion", "TanStack Query"],
    desc: "중앙대학교 멋쟁이사자처럼 학회의 오프더레코드 멋사위키. PO 1명, FE 4명, BE 4명.",
    fullDesc:
      "중앙대학교 멋쟁이사자처럼 학회 전용 오프더레코드 위키 서비스입니다. TanStack Query 커스텀 훅 설계로 불필요한 API 호출을 제거하고, 반응형 레이아웃과 PWA 전환으로 모바일 사용자 비중 60% 이상인 환경에 맞춘 UX를 제공했습니다.",
    features: [
      "TanStack Query queryKey 중심 재설계로 동일 조건 요청 캐시 재사용, 불필요한 네트워크 트래픽 제거",
      "반응형 레이아웃(@media) 적용 및 PWA 전환으로 모바일 60% 이상 사용자 접근성 개선",
    ],
    contributions: [
      {
        title: "TanStack Query 기반 커스텀 훅 설계를 통한 데이터 패칭 최적화",
        problem:
          "메인 페이지가 리렌더링될 때마다 매번 API를 호출하여 불필요한 네트워크 트래픽이 발생했습니다. 동일 조건 요청의 중복 호출과 불필요한 리페치로 인해 응답 지연 및 클라이언트 처리 비용이 증가했습니다.",
        solution:
          "TanStack Query를 도입해 데이터 요청 단위를 queryKey 중심으로 재설계했습니다. 입력값 기준으로 키를 분리해 동일 조건 요청은 캐시 재사용이 가능하도록 구성했습니다.",
        result:
          "여러 번 목록을 조회하더라도 추가 네트워크 요청 없이 캐시를 활용하므로 응답 속도 및 서버 비용이 최적화됐습니다. API 호출 로직을 Custom hook으로 관리하여 향후 기능 수정이나 캐시 정책 변경 시 대응이 용이한 구조를 구축했습니다.",
      },
      {
        title: "모바일/앱 유사 UX 강화",
        problem:
          "구글폼 설문을 통해 모바일에서 접속하는 비율이 응답 기준 60% 이상인 것을 확인했습니다. 기존 웹 화면이 모바일 환경에서 레이아웃이 깨지거나 이용 흐름이 끊겨 접근성이 저하되는 UX 문제가 발생했습니다.",
        solution:
          "모바일·태블릿·데스크톱 구간을 기준으로 @media 기반 반응형 레이아웃을 적용했습니다. 웹앱을 PWA로 전환해 설치형 앱 유사 UX를 제공했습니다.",
        result:
          "설치형 PWA 기반으로 브라우저 진입 부담을 줄이고 앱처럼 빠르게 접근 가능한 사용자 경험을 확보했습니다. 모바일 사용성(가독성·탭 동선·화면 안정성)을 개선하여 실제 사용 비중에 맞춘 UX를 제공했습니다.",
      },
    ],
    images: [
      "/projects/wiki/wiki-1.png",
      "/projects/wiki/wiki-2.png",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/cau-likelion-org/kiwi-client" },
      { label: "서비스 링크", href: "https://wiki.cau-likelion.org/" },
    ],
  },
];

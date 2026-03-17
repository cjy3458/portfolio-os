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
      "/projects/web-os-1.svg",
      // "/projects/web-os-2.svg",
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
      "공통 컴포넌트·DTO 타입 독립 패키지 설계로 Web/Mobile 멀티 플랫폼 운영 비용 절감",
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
          "프로젝트 규모가 커지며 외부 라이브러리가 포함된 Vendor Chunk 파일이 비대해졌습니다. 앱 코드만 변경돼도 라이브러리 포함 전체 파일을 다시 다운로드해야 해서 재방문 사용자의 로딩 성능이 낮았습니다.",
        solution:
          "라이브러리를 기준으로 Vendor Chunk를 분할하고, 초기 페이지에서 필요 없는 코드를 lazy loading으로 스플리팅했습니다.",
        result:
          "초기 로드 번들 사이즈 10% 감소, 재방문(캐시) 기준 번들 사이즈 70% 감소. Lighthouse 성능 77 → 92점, FCP 1.4초 → 0.7초(50%), LCP 2.0초 → 0.9초(55%) 개선.",
      },
      {
        title:
          "멀티 플랫폼(Web/Mobile) 공통 인터페이스 및 컴포넌트 패키지 설계",
        problem:
          "웹 게임 프로젝트의 모바일 버전 확장 시 웹·모바일 간 중복 코드 발생 및 유지보수 효율 저하가 우려됐습니다. 클라이언트-서버 간 데이터 통신 시 서로 다른 환경에서 동일한 DTO 타입을 보장하기도 어려웠습니다.",
        solution:
          "프로젝트 전반에서 공통으로 사용되는 컴포넌트·DTO 타입·상수를 독립적인 오픈소스 패키지로 분리 설계했습니다. 모노레포 및 외부 패키지에서도 즉시 사용 가능한 구조로 구현했습니다.",
        result:
          "버전 관리를 통한 협력된 업데이트로 멀티 플랫폼 운영 비용을 절감했습니다. 공유 DTO 타입으로 클라이언트-서버 간 통신 신뢰도를 높였습니다.",
      },
      {
        title: "Mixpanel 기반 이벤트 모니터링 도입",
        problem:
          "Sentry 커스텀 데이터가 모두 String 타입으로 저장돼 평균·비율 등 수치 기반 지표 계산이 불가능했습니다. 사용자 행동 데이터와 에러 데이터가 혼재해 목적별 분석이 어려웠습니다.",
        solution:
          "이벤트 기반 분석 도구인 Mixpanel을 도입했습니다. 사용자 행동을 이벤트와 속성 구조로 체계적으로 수집하고, 평균·분포·전환율 등 통계 지표를 시각화했습니다.",
        result:
          "라운드 시간별 드로핑 비율의 평균을 측정해 라운드 총 시간 설정을 변경했습니다. 에러 추적과 사용자 분석 도메인을 분리해 관리 효율이 향상됐습니다.",
      },
    ],
    links: [{ label: "GitHub", href: "https://github.com/cjy3458" }],
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
          "다수의 고해상도 이미지로 인해 초기 렌더링 속도가 느리고 사용자 이탈이 발생했습니다. CSR 기반 React 플랫폼이라 검색 로봇의 크롤링이 낮아 Lighthouse SEO가 60점대에 머물렀습니다.",
        solution:
          "처음 접한 Next.js를 2주 이내에 익혀 SSR 라우팅을 구축했습니다. 페이지별 메타데이터를 작성해 검색엔진 노출을 최적화하고, Next/Image를 활용해 자동 이미지 최적화를 적용했습니다.",
        result:
          "Lighthouse LCP·FCP 35% 개선, SEO 96점 달성. 검색 노출 증가로 신규 유입 경로를 확보했습니다.",
      },
      {
        title:
          "파트 간 협업 시너지 창출 및 프로젝트 가시성 확보를 위한 프로세스 개선 주도",
        problem:
          "각 파트가 유기적으로 연결되어 있음에도 서로의 실제 진행 상황을 파악하기 어려웠습니다. 테스크 Due-date가 다가올 때 팀원들의 완성도를 객관적으로 확인·관리할 기준이 없었습니다.",
        solution:
          "매일 정해진 시간에 모든 파트가 모여 오늘 한 일과 다음 날 목표를 공유하는 문화를 제안했습니다. 구현 완성도를 매일 공유함으로써 프로젝트의 불확실성을 수치화해 제거했습니다.",
        result:
          "비효율적인 중복 확인 과정이 감소하고, 모든 팀원이 동일한 목표 지점과 타임라인을 공유하게 됐습니다. 마감 기한 내 높은 퀄리티로 프로젝트를 완수했습니다.",
      },
    ],
    links: [{ label: "GitHub", href: "https://github.com/cjy3458" }],
  },
  {
    id: "cau-likelion-wiki",
    title: "CAU-Likelion-WIKI",
    year: "2023.10 - 2023.12",
    stack: ["Next.js", "TypeScript", "Recoil", "Emotion", "TanStack Query"],
    desc: "중앙대학교 멋쟁이사자처럼 학회의 오프더레코드 멋사위키. PO 1명, FE 4명, BE 4명.",
    fullDesc:
      "중앙대학교 멋쟁이사자처럼 학회 전용 오프더레코드 위키 서비스입니다. TanStack Query 커스텀 훅 설계로 불필요한 API 호출을 제거하고, 공식 API가 공개되지 않은 Markdown Editor 라이브러리의 내부 구조를 직접 분석·수정하여 기획 요구사항을 100% 충족시켰습니다.",
    features: [
      "TanStack Query 커스텀 훅 + staleTime 60초로 중복 API 요청 차단 및 서버 비용 최적화",
      "Markdown Editor 라이브러리 소스 분석 후 내부 직접 수정으로 미공개 기능 구현",
      "외부 라이브러리 한계 극복으로 기획 요구사항 100% 충족 및 교체 비용 절감",
    ],
    contributions: [
      {
        title: "TanStack Query 기반 커스텀 훅 설계를 통한 데이터 패칭 최적화",
        problem:
          "메인 페이지가 렌더링될 때마다 메뉴 API를 호출하여 불필요한 네트워크 트래픽이 발생했습니다. UI 컴포넌트 안에 비동기 데이터 로직이 혼재해 재사용성도 낮았습니다.",
        solution:
          "커스텀 훅을 설계해 UI 컴포넌트와 비동기 데이터 로직을 완벽히 분리하고 재사용성을 극대화했습니다. staleTime을 1분(60초)으로 설정해 Fresh 상태일 때는 캐싱된 값을 반환하여 불필요한 중복 요청을 차단했습니다.",
        result:
          "여러 번 목록을 조회해도 추가 네트워크 요청 없이 캐시를 활용하여 응답 속도와 서버 비용을 최적화했습니다. API 호출 로직이 Custom hook으로 분리돼 향후 캐시 정책 변경 시 단일 지점에서 대응 가능한 구조를 갖췄습니다.",
      },
      {
        title:
          "사용자 경험 향상을 위한 Markdown Editor 라이브러리 내부 구조 개선",
        problem:
          "react-md-editor를 사용하는 중 기본 제공 툴바 위에 기능 추가를 요청받았습니다. 라이브러리가 툴바의 특정 동작을 수정할 공식 API를 공개하지 않아 추가가 불가능한 상황이었습니다.",
        solution:
          "node_modules에 설치된 라이브러리의 소스 코드를 직접 분석해 툴바 내부 상태 관리 메커니즘을 파악했습니다. 라이브러리 내부 코드를 직접 수정해 기획 요구사항에 맞는 커스텀 툴바와 기능을 구현했습니다.",
        result:
          "외부 라이브러리의 한계에 갇히지 않고 기획자가 의도한 마크다운 편집 환경을 구축했습니다. 라이브러리 교체 비용을 절감하고 기존 환경을 유지하면서 요구사항에 적극 대응해 개발 속도가 향상됐습니다.",
      },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/cjy3458" },
      { label: "서비스 링크", href: "https://cjy3458.tistory.com/" },
    ],
  },
];

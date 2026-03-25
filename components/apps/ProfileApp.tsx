import Image from "next/image";
import { LayoutGrid } from "lucide-react";
import TagList from "@/components/ui/TagList";

const skills = [
  { name: "REACT.JS" },
  { name: "TYPESCRIPT" },
  { name: "NEXT.JS" },
  { name: "NEST.JS" },
  { name: "TAILWIND CSS" },
  { name: "EMOTION" },
  { name: "STYLED-COMPONENTS" },
  { name: "ZUSTAND" },
  { name: "RECOIL" },
  { name: "TANSTACK QUERY" },
  { name: "SENTRY / MIXPANEL" },
];

const introduces = [
  {
    title:
      "문제를 빠르게 진단하고 개선하여, 서비스에 실질적인 성과를 만듭니다.",
    body: "사용자 행동 데이터와 피드백을 기반으로 문제를 정의합니다.\n가설을 세우고 실험하여, 개선 후 초기 이탈률을 30% → 18%로 감소시켰습니다.",
  },
  {
    title: "반복 작업은 AI로 줄이고, 핵심 문제에 집중합니다.",
    body: "더 나은 가치를 담은 프로젝트를 더 빠르게 만들기 위해 자동화와 AI 생산성 증폭에 관심이 많습니다.\n확보한 시간으로 성능 최적화와 깊이 있는 학습에 투자합니다.",
  },
  {
    title: "소통과 기록으로 지식을 나누며 함께 성장합니다.",
    body: "기록은 개인의 성장이 아니라, 팀의 자산이라고 생각합니다.\n문서화와 코드 리뷰를 통해 지식을 공유하고, 함께 더 나은 선택을 할 수 있도록 주도합니다.",
  },
];

// Server Component — no interactivity needed
export default function ProfileApp() {
  return (
    <div className="p-6 font-mono leading-relaxed min-h-full">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-32 h-32 border-2 border-black shrink-0 shadow-[4px_4px_0px_rgba(0,0,0,1)] overflow-hidden">
          <Image
            src="/profileIMG.png"
            alt="최재영 프로필 사진"
            width={128}
            height={128}
            className="object-cover w-full h-full"
            priority
          />
        </div>
        <div>
          <h1 className="text-3xl font-black uppercase mb-1">최재영</h1>
          <p className="font-bold border-b-2 border-black pb-2 inline-block mb-4">
            FrontEnd Engineer
          </p>
          <p className="text-base font-bold mb-4">
            사용자 편리함을 최우선으로 여기는 개발자 최재영입니다.
          </p>
          <div className="flex flex-col gap-3">
            {introduces.map((item) => (
              <div key={item.title}>
                <p className="font-bold text-sm">{item.title}</p>
                <p className="text-xs text-gray-600 whitespace-pre-wrap mt-1">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 border-t-2 border-dashed border-gray-300 pt-6">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <LayoutGrid size={20} /> CORE SKILLS
        </h2>
        <TagList items={skills.map((s) => s.name)} layout="grid" />
      </div>
    </div>
  );
}

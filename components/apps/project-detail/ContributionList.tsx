import type { Contribution } from "@/config/projects";
import SectionHeader from "@/components/ui/SectionHeader";
import OsCard from "@/components/ui/OsCard";

interface ContributionListProps {
  contributions: Contribution[];
}

export default function ContributionList({ contributions }: ContributionListProps) {
  return (
    <section>
      <SectionHeader title="Key Contributions" />
      <div className="flex flex-col gap-5">
        {contributions.map((c) => (
          <OsCard key={c.title}>
            <h3 className="font-black text-sm mb-3">{c.title}</h3>
            <div className="flex flex-col gap-2 text-xs leading-relaxed">
              <div className="flex gap-2">
                <span className="shrink-0 font-black bg-black text-white px-1.5 py-0.5 text-[10px] h-fit">
                  문제
                </span>
                <p className="text-gray-700">{c.problem}</p>
              </div>
              <div className="flex gap-2">
                <span className="shrink-0 font-black bg-gray-700 text-white px-1.5 py-0.5 text-[10px] h-fit">
                  해결
                </span>
                <p className="text-gray-700">{c.solution}</p>
              </div>
              <div className="flex gap-2">
                <span className="shrink-0 font-black border-2 border-black text-black px-1.5 py-0.5 text-[10px] h-fit">
                  결과
                </span>
                <p className="font-bold text-black">{c.result}</p>
              </div>
            </div>
          </OsCard>
        ))}
      </div>
    </section>
  );
}

import { CheckSquare } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

interface FeatureListProps {
  features: string[];
}

export default function FeatureList({ features }: FeatureListProps) {
  return (
    <section>
      <SectionHeader title="Key Features" />
      <ul className="flex flex-col gap-2">
        {features.map((feat) => (
          <li key={feat} className="flex items-start gap-2 text-sm leading-relaxed">
            <CheckSquare size={14} className="shrink-0 mt-0.5" />
            <span>{feat}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

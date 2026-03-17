import TagList from "@/components/ui/TagList";
import SectionHeader from "@/components/ui/SectionHeader";

interface TechStackListProps {
  stack: string[];
}

export default function TechStackList({ stack }: TechStackListProps) {
  return (
    <section>
      <SectionHeader title="Tech Stack" />
      <TagList items={stack} />
    </section>
  );
}

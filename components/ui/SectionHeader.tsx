interface SectionHeaderProps {
  title: string;
  className?: string;
}

export default function SectionHeader({ title, className = "" }: SectionHeaderProps) {
  return (
    <h2
      className={`text-xs font-black uppercase tracking-widest text-gray-400 mb-3 border-b border-gray-200 pb-1 ${className}`.trim()}
    >
      {title}
    </h2>
  );
}

interface TagListProps {
  items: string[];
  layout?: "wrap" | "grid";
}

export default function TagList({ items, layout = "wrap" }: TagListProps) {
  const containerClass =
    layout === "grid"
      ? "grid grid-cols-2 gap-2"
      : "flex flex-wrap gap-2";

  return (
    <div className={containerClass}>
      {items.map((item) => (
        <span
          key={item}
          className="border-2 border-black px-2 py-1 text-xs font-bold uppercase bg-white shadow-button"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

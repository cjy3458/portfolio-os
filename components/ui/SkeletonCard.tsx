interface SkeletonCardProps {
  hasImage?: boolean;
}

export default function SkeletonCard({ hasImage = true }: SkeletonCardProps) {
  return (
    <div className="flex gap-3 border-2 border-black p-3 animate-pulse">
      <div className="flex-1">
        <div className="h-3 bg-gray-200 w-3/4 mb-2" />
        <div className="h-2 bg-gray-100 w-full mb-1" />
        <div className="h-2 bg-gray-100 w-2/3" />
      </div>
      {hasImage && <div className="shrink-0 w-20 h-16 bg-gray-200" />}
    </div>
  );
}

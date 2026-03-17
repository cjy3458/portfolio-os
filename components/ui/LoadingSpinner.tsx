import { RefreshCw } from "lucide-react";

interface LoadingSpinnerProps {
  /** 아이콘 크기 (px). 기본값 24 */
  size?: number;
  /** true면 부모 영역 전체를 덮는 흰 오버레이로 표시 */
  overlay?: boolean;
  /** 스피너 아래 표시할 텍스트 */
  label?: string;
}

export default function LoadingSpinner({
  size = 24,
  overlay = false,
  label,
}: LoadingSpinnerProps) {
  const inner = (
    <div className="flex flex-col items-center gap-3 text-sm font-bold text-gray-500 font-mono">
      <RefreshCw size={size} className="animate-spin" />
      {label && <span>{label}</span>}
    </div>
  );

  if (overlay) {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-10 bg-white">
        {inner}
      </div>
    );
  }

  return <div className="flex justify-center py-4">{inner}</div>;
}

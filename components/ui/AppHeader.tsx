import { ReactNode } from "react";

interface AppHeaderProps {
  /** 헤더 좌측 아이콘 */
  icon?: ReactNode;
  /** 헤더 제목 */
  title: string;
  /** 헤더 우측 액션 영역 (버튼 등) */
  action?: ReactNode;
  className?: string;
}

export default function AppHeader({ icon, title, action, className = "" }: AppHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between mb-4 border-b-2 border-black pb-3 font-mono ${className}`.trim()}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-black uppercase text-sm tracking-widest">{title}</span>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

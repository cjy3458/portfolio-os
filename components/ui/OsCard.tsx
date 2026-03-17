import { ReactNode } from "react";

interface OsCardProps {
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}

/**
 * OS 스타일 카드 컴포넌트.
 * onClick 있으면 <button>, 없으면 <div>.
 */
export default function OsCard({ onClick, className = "", children }: OsCardProps) {
  const cls =
    `border-2 border-black p-3 shadow-[3px_3px_0px_rgba(0,0,0,1)] ` +
    (onClick
      ? "hover:shadow-none hover:translate-y-0.5 transition-all group cursor-pointer "
      : "") +
    className;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`w-full text-left ${cls}`}>
        {children}
      </button>
    );
  }

  return <div className={cls}>{children}</div>;
}

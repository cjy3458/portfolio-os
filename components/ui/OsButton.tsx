import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Size = "icon" | "sm" | "md";

const sizeClass: Record<Size, string> = {
  icon: "p-1",
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-xs",
};

const BASE =
  "inline-flex items-center gap-2 border-2 border-black font-bold hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0.5";

interface Shared {
  size?: Size;
  className?: string;
  children: ReactNode;
}

// href 없으면 <button>, href 있으면 <a>
type OsButtonProps =
  | (Shared & { href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)
  | (Shared & { href: string } & AnchorHTMLAttributes<HTMLAnchorElement>);

export default function OsButton({
  size = "sm",
  className = "",
  children,
  ...props
}: OsButtonProps) {
  const cls = `${BASE} ${sizeClass[size]} ${className}`.trim();

  if ("href" in props && props.href !== undefined) {
    const { href, ...rest } = props as Shared & { href: string } & AnchorHTMLAttributes<HTMLAnchorElement>;
    return <a href={href} className={cls} {...rest}>{children}</a>;
  }

  const rest = props as Shared & ButtonHTMLAttributes<HTMLButtonElement>;
  return <button className={cls} {...rest}>{children}</button>;
}

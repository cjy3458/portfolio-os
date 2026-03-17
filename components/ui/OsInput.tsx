import { InputHTMLAttributes, forwardRef } from "react";

interface OsInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const OsInput = forwardRef<HTMLInputElement, OsInputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`flex-1 border-2 border-black px-2 py-0.5 bg-gray-50 text-xs text-gray-700 outline-none focus:bg-white focus:border-gray-500 transition-colors min-w-0 font-mono ${className}`.trim()}
        {...props}
      />
    );
  }
);

OsInput.displayName = "OsInput";

export default OsInput;

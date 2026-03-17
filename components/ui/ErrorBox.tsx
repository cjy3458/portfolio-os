interface ErrorBoxProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorBox({ message, onRetry }: ErrorBoxProps) {
  return (
    <div className="border-2 border-black p-4 text-sm font-mono">
      <p className="font-black mb-1">[ ERROR ]</p>
      <p className="text-gray-600">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 border-2 border-black px-3 py-1 text-xs font-bold hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0.5"
        >
          재시도
        </button>
      )}
    </div>
  );
}

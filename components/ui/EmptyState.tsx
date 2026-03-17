interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({ message = "항목을 찾을 수 없습니다." }: EmptyStateProps) {
  return (
    <p className="text-sm text-gray-500 text-center mt-8 font-mono">{message}</p>
  );
}

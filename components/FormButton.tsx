"use client";

type FormButtonProps = {
  children: React.ReactNode;
  pending?: boolean;
  disabled?: boolean;
  className?: string;
};

export function FormButton({
  children,
  pending = false,
  disabled = false,
  className = "",
}: FormButtonProps) {
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={`w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${className}`}
    >
      {pending ? "処理中..." : children}
    </button>
  );
}

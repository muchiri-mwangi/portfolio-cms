"use client";

export default function ConfirmDeleteButton({
  action,
  confirmText = "Are you sure? This can't be undone.",
  label = "Delete",
  className = "text-xs font-semibold text-red-600",
}: {
  action: (formData: FormData) => void;
  confirmText?: string;
  label?: string;
  className?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      <button type="submit" className={className}>
        {label}
      </button>
    </form>
  );
}

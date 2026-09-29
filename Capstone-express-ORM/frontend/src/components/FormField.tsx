export default function FormField({
  label,
  name,
  type = "text",
  required = false,
  placeholder = "",
  compact = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  compact?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold">
      <span className={compact ? "mb-1 block" : "mb-2 block"}>{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-black/15 px-4 font-normal outline-none focus:border-ink ${compact ? "py-2.5" : "py-3"}`}
      />
    </label>
  );
}

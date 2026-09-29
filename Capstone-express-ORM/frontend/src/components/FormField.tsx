export default function FormField({
  label,
  name,
  type = 'text',
  required = false,
  placeholder = '',
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm font-semibold">
      <span className="mb-2 block">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-black/15 px-4 py-3 font-normal outline-none focus:border-ink"
      />
    </label>
  );
}

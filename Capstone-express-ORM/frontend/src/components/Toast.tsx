export default function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <div
      className={`fixed right-5 top-24 z-[70] max-w-sm rounded-xl border-l-4 bg-ink px-5 py-4 text-sm text-white shadow-soft ${type === 'error' ? 'border-red-300' : 'border-sage'}`}
    >
      {message}
    </div>
  );
}

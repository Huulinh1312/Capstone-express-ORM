import { X } from 'lucide-react';

export default function Modal({
  children,
  onClose,
  size = 'lg',
}: {
  children: React.ReactNode;
  onClose: () => void;
  size?: 'md' | 'lg';
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-0 md:p-5"
      onClick={onClose}
    >
      <section
        className={`relative max-h-screen w-full overflow-auto rounded-none bg-white md:rounded-[28px] ${size === 'md' ? 'md:max-w-md' : 'md:max-w-5xl'}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white shadow"
          aria-label="Đóng"
        >
          <X size={21} />
        </button>
        {children}
      </section>
    </div>
  );
}

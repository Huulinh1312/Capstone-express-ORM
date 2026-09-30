import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 360);

    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-30 grid h-12 w-12 place-items-center rounded-full bg-ink text-white shadow-soft transition hover:-translate-y-1 hover:bg-coral"
      aria-label="Lên đầu trang"
      title="Lên đầu trang"
    >
      <ArrowUp size={20} />
    </button>
  );
}

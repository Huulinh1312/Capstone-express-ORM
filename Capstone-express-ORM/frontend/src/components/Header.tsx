import { Bell, LogOut, Search } from "lucide-react";
import { useState } from "react";
import { imageUrl } from "../api/axiosClient";
import type { User, View } from "../types";

export interface HeaderProps {
  user: User | null;
  view: View;
  query: string;
  onNavigate: (view: View) => void;
  onSearch: (query: string) => void;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
}

export default function Header({
  user,
  view,
  query,
  onNavigate,
  onSearch,
  onLogin,
  onRegister,
  onLogout,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-paper/90 px-4 py-3 backdrop-blur-xl md:px-8">
      <div className="mx-auto flex max-w-[1450px] flex-wrap items-center gap-3 md:gap-6">
        <button
          className="flex items-center gap-2"
          onClick={() => onNavigate("home")}
          aria-label="Về trang chủ"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-coral font-display text-2xl font-bold text-white">
            P
          </span>
          <span className="hidden font-display text-2xl font-bold sm:block">
            pinboard
          </span>
        </button>
        <nav className="order-3 flex items-center gap-1 md:order-2">
          <NavButton
            active={view === "home"}
            onClick={() => onNavigate("home")}
          >
            Trang chủ
          </NavButton>
          <NavButton
            active={view === "create"}
            onClick={() => onNavigate("create")}
          >
            Tạo
          </NavButton>
        </nav>
        <form
          className="order-4 flex min-w-[180px] flex-1 items-center gap-2 rounded-full bg-stone-100 px-4 md:order-3"
          onSubmit={(event) => {
            event.preventDefault();
            onSearch(event.currentTarget.search.value.trim());
          }}
        >
          <Search size={18} className="text-stone-400" />
          <input
            name="search"
            defaultValue={query}
            className="w-full bg-transparent py-3 text-sm outline-none"
            placeholder="Tìm ý tưởng, hình ảnh..."
            aria-label="Tìm kiếm"
          />
        </form>
        <div className="order-2 ml-auto flex items-center gap-2 md:order-4">
          {user ? (
            <>
              <Bell size={19} className="hidden text-stone-500 sm:block" />
              <button
                onClick={() => onNavigate("profile")}
                className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-ink text-sm font-bold text-white"
              >
                <UserAvatar user={user} />
              </button>
              <button
                onClick={onLogout}
                className="hidden p-2 text-stone-400 hover:text-ink sm:block"
                title="Đăng xuất"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onLogin}
                className="px-2 py-2 text-sm font-bold text-stone-500"
              >
                Đăng nhập
              </button>
              <button
                onClick={onRegister}
                className="rounded-full bg-coral px-4 py-2.5 text-sm font-bold text-white"
              >
                Đăng ký
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function UserAvatar({ user }: { user: User }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (user.anh_dai_dien && !imageFailed) {
    return (
      <img
        src={imageUrl(user.anh_dai_dien)}
        alt={`Ảnh đại diện của ${user.ho_ten}`}
        onError={() => setImageFailed(true)}
        className="h-full w-full object-cover"
      />
    );
  }

  return initials(user.ho_ten);
}

function NavButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className={`rounded-full px-4 py-2 text-sm font-bold ${active ? "bg-ink text-white" : "text-stone-500"}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
function initials(name = "P") {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(-2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "P"
  );
}

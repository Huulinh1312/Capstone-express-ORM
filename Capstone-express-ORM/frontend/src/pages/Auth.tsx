import { FormEvent, useEffect, useState } from "react";
import { X } from "lucide-react";
import FormField from "../components/FormField";
import { getApiMessage } from "../api/axiosClient";
import { loginApi, registerApi } from "../api/authApi";

export default function Auth({
  mode,
  onClose,
  onSwitch,
  onLogin,
  onNotify,
}: {
  mode: "login" | "register";
  onClose: () => void;
  onSwitch: (mode: "login" | "register") => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onNotify: (message: string) => void;
}) {
  const register = mode === "register";
  const [error, setError] = useState("");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      if (register) {
        await registerApi({
          email: String(data.get("email")),
          mat_khau: String(data.get("mat_khau")),
          ho_ten: String(data.get("ho_ten")),
          tuoi: data.get("tuoi") ? Number(data.get("tuoi")) : undefined,
        });
        onNotify("Tạo tài khoản thành công. Đăng nhập để bắt đầu.");
        onSwitch("login");
      } else {
        await onLogin(String(data.get("email")), String(data.get("mat_khau")));
      }
    } catch (err) {
      setError(getApiMessage(err));
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-hidden bg-ink/60 px-4 py-4 sm:px-6 md:items-center md:p-5"
      onClick={onClose}
    >
      <section
        className="relative max-h-[calc(100dvh-0.5rem)] w-full max-w-md overflow-hidden rounded-[24px] bg-white p-5 shadow-soft sm:p-7 md:rounded-[28px] md:p-9"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full hover:bg-cream"
          aria-label="Đóng"
        >
          <X />
        </button>
        <div className="mb-5 flex items-center gap-2 sm:mb-6">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-coral font-display text-2xl font-bold text-white">
            P
          </span>
          <span className="font-display text-2xl font-bold">pinboard</span>
        </div>
        <h2 className="font-display text-2xl font-bold leading-tight sm:text-3xl">
          {register ? "Bắt đầu tạo bảng của riêng bạn." : "Chào mừng trở lại."}
        </h2>
        <p className="mt-2 leading-6 text-stone-500 sm:mt-3">
          {register
            ? "Một nơi nhỏ để lưu những điều lớn lao."
            : "Tiếp tục hành trình tìm kiếm cảm hứng của bạn."}
        </p>
        <form className="mt-5 space-y-3 sm:mt-6" onSubmit={submit}>
          <FormField
            label="Email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            compact
          />
          <FormField
            label="Mật khẩu"
            name="mat_khau"
            type="password"
            required
            placeholder="Mật khẩu"
            compact
          />
          {register && (
            <>
              <FormField
                label="Họ tên"
                name="ho_ten"
                required
                placeholder="Tên của bạn"
                compact
              />
              <FormField
                label="Tuổi"
                name="tuoi"
                type="number"
                placeholder="25"
                compact
              />
            </>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button className="w-full rounded-full bg-coral px-5 py-3.5 font-bold text-white">
            {register ? "Tạo tài khoản" : "Đăng nhập"}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-stone-500 sm:mt-6">
          {register ? "Đã có tài khoản?" : "Chưa có tài khoản?"}{" "}
          <button
            className="font-bold text-coral"
            onClick={() => onSwitch(register ? "login" : "register")}
          >
            {register ? "Đăng nhập" : "Đăng ký"}
          </button>
        </p>
      </section>
    </div>
  );
}

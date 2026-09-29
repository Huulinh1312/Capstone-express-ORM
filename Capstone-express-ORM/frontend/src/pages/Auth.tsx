import { FormEvent, useState } from 'react';
import { X } from 'lucide-react';
import FormField from '../components/FormField';
import { getApiMessage } from '../api/axiosClient';
import { loginApi, registerApi } from '../api/authApi';

export default function Auth({
  mode,
  onClose,
  onSwitch,
  onLogin,
  onNotify,
}: {
  mode: 'login' | 'register';
  onClose: () => void;
  onSwitch: (mode: 'login' | 'register') => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onNotify: (message: string) => void;
}) {
  const register = mode === 'register';
  const [error, setError] = useState('');
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const data = new FormData(event.currentTarget);
    try {
      if (register) {
        await registerApi({
          email: String(data.get('email')),
          mat_khau: String(data.get('mat_khau')),
          ho_ten: String(data.get('ho_ten')),
          tuoi: data.get('tuoi') ? Number(data.get('tuoi')) : undefined,
        });
        onNotify('Tạo tài khoản thành công. Đăng nhập để bắt đầu.');
        onSwitch('login');
      } else {
        await onLogin(String(data.get('email')), String(data.get('mat_khau')));
      }
    } catch (err) {
      setError(getApiMessage(err));
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-0 md:p-5"
      onClick={onClose}
    >
      <section
        className="relative min-h-screen w-full bg-white p-8 md:min-h-0 md:max-w-md md:rounded-[28px] md:p-10"
        onClick={(event) => event.stopPropagation()}
      >
        <button onClick={onClose} className="absolute right-5 top-5">
          <X />
        </button>
        <div className="mb-8 flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-coral font-display text-2xl font-bold text-white">
            P
          </span>
          <span className="font-display text-2xl font-bold">pinboard</span>
        </div>
        <h2 className="font-display text-4xl font-bold leading-tight">
          {register ? 'Bắt đầu tạo bảng của riêng bạn.' : 'Chào mừng trở lại.'}
        </h2>
        <p className="mt-3 leading-6 text-stone-500">
          {register
            ? 'Một nơi nhỏ để lưu những điều lớn lao.'
            : 'Tiếp tục hành trình tìm kiếm cảm hứng của bạn.'}
        </p>
        <form className="mt-7 space-y-4" onSubmit={submit}>
          <FormField
            label="Email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
          />
          <FormField
            label="Mật khẩu"
            name="mat_khau"
            type="password"
            required
            placeholder="Mật khẩu"
          />
          {register && (
            <>
              <FormField label="Họ tên" name="ho_ten" required placeholder="Tên của bạn" />
              <FormField label="Tuổi" name="tuoi" type="number" placeholder="25" />
            </>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button className="w-full rounded-full bg-coral px-5 py-3.5 font-bold text-white">
            {register ? 'Tạo tài khoản' : 'Đăng nhập'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-stone-500">
          {register ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
          <button
            className="font-bold text-coral"
            onClick={() => onSwitch(register ? 'login' : 'register')}
          >
            {register ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </p>
      </section>
    </div>
  );
}

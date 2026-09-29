import { FormEvent, useState } from 'react';
import { Upload } from 'lucide-react';
import FormField from '../components/FormField';
import { getApiMessage } from '../api/axiosClient';
import { uploadImageApi } from '../api/imageApi';
import type { User } from '../types';

export default function UploadPage({
  user,
  onLogin,
  onDone,
  onNotify,
}: {
  user: User | null;
  onLogin: () => void;
  onDone: () => void;
  onNotify: (message: string, type?: 'success' | 'error') => void;
}) {
  const [preview, setPreview] = useState<string>();
  if (!user)
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <h1 className="font-display text-4xl font-bold">Đăng nhập để tiếp tục</h1>
        <button
          onClick={onLogin}
          className="mt-7 rounded-full bg-coral px-6 py-3 font-bold text-white"
        >
          Đăng nhập
        </button>
      </div>
    );
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await uploadImageApi(new FormData(event.currentTarget));
      onDone();
    } catch (error) {
      onNotify(getApiMessage(error), 'error');
    }
  };
  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-9">
      <div className="rounded-[28px] bg-white p-6 shadow-soft md:p-10">
        <p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-coral">
          Create a new pin
        </p>
        <h1 className="font-display text-4xl font-bold md:text-5xl">Thêm một điều đáng nhớ.</h1>
        <form className="mt-8 space-y-5" onSubmit={submit}>
          <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 bg-cream p-6 text-center">
            <input
              name="hinh_anh"
              type="file"
              accept="image/*"
              required
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) setPreview(URL.createObjectURL(file));
              }}
            />
            {preview ? (
              <img src={preview} alt="Xem trước" className="max-h-52 rounded-xl object-contain" />
            ) : (
              <>
                <Upload className="text-stone-500" />
                <strong className="mt-3">Kéo thả hoặc nhấp để tải lên</strong>
                <span className="mt-1 text-sm text-stone-400">JPG, PNG hoặc WEBP</span>
              </>
            )}
          </label>
          <FormField
            label="Tiêu đề"
            name="ten_hinh"
            required
            placeholder="Những buổi sáng chậm rãi"
          />
          <label className="block text-sm font-semibold">
            <span className="mb-2 block">Mô tả</span>
            <textarea
              name="mo_ta"
              className="min-h-28 w-full resize-y rounded-xl border border-black/15 px-4 py-3 font-normal outline-none focus:border-ink"
            />
          </label>
          <div className="flex justify-end">
            <button className="rounded-full bg-coral px-6 py-3 font-bold text-white">
              Lưu hình ảnh
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

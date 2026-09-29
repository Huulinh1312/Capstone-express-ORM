import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import ImageCard from '../components/ImageCard';
import { getApiMessage } from '../api/axiosClient';
import { getImagesApi, saveImageApi } from '../api/imageApi';
import type { ImagePin, User } from '../types';

export default function Home({
  query,
  user,
  onOpenDetail,
  onLogin,
  onNotify,
}: {
  query: string;
  user: User | null;
  onOpenDetail: (id: number) => void;
  onLogin: () => void;
  onNotify: (message: string, type?: 'success' | 'error') => void;
}) {
  const [images, setImages] = useState<ImagePin[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    getImagesApi(query)
      .then((result) => setImages(result.data))
      .catch((error) => onNotify(getApiMessage(error), 'error'))
      .finally(() => setLoading(false));
  }, [query]);
  const save = async (id: number) => {
    if (!user) return onLogin();
    try {
      await saveImageApi(id);
      onNotify('Đã lưu hình ảnh vào bộ sưu tập.');
    } catch (error) {
      onNotify(getApiMessage(error), 'error');
    }
  };
  return (
    <main className="mx-auto max-w-[1450px] px-5 pb-20 pt-10 md:px-9 md:pt-14">
      <section className="mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-coral">
            A little place for big ideas
          </p>
          <h1 className="max-w-3xl font-display text-5xl font-bold leading-[.98] tracking-tight md:text-7xl">
            Những điều làm bạn thấy rung động.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-stone-500">
            Khám phá, lưu giữ và chia sẻ những hình ảnh khiến ngày thường trở nên thú vị hơn.
          </p>
        </div>
        <div className="hidden h-32 w-32 rotate-3 items-center justify-center rounded-[50%_50%_18%_50%] bg-sage p-6 md:flex">
          <strong className="font-display text-2xl leading-none">
            stay
            <br />
            curious.
          </strong>
        </div>
      </section>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-black/10 pb-4 md:flex-row md:items-center">
        <p className="text-stone-500">
          {query ? `${images.length} kết quả cho “${query}”` : 'Gợi ý dành cho bạn'}
        </p>
        <div className="flex gap-2 overflow-x-auto">
          <button className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-white">
            Tất cả
          </button>
          <button className="rounded-full border border-black/10 px-4 py-2 text-sm text-stone-500">
            Nghệ thuật
          </button>
          <button className="rounded-full border border-black/10 px-4 py-2 text-sm text-stone-500">
            Thiết kế
          </button>
        </div>
      </div>
      {loading ? (
        <div className="py-24 text-center text-stone-400">Đang tải những ý tưởng hay...</div>
      ) : images.length ? (
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-4 xl:columns-5">
          {images.map((image) => (
            <ImageCard
              key={image.hinh_id}
              image={image}
              onOpen={() => onOpenDetail(image.hinh_id)}
              onSave={() => save(image.hinh_id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <Sparkles className="mx-auto mb-3 text-coral" />
          <h2 className="font-display text-3xl font-bold">Chưa có hình ảnh phù hợp</h2>
        </div>
      )}
    </main>
  );
}

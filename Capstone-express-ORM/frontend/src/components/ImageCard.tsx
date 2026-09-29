import { Link2 } from 'lucide-react';
import { useState } from 'react';
import { imageUrl } from '../api/axiosClient';
import type { ImagePin, User } from '../types';

export default function ImageCard({
  image,
  onOpen,
  onSave,
}: {
  image: ImagePin;
  onOpen: () => void;
  onSave: () => void;
}) {
  const [failed, setFailed] = useState(false);
  const creator = image.nguoi_dung;
  return (
    <article className="mb-5 break-inside-avoid">
      <div className="group relative overflow-hidden rounded-2xl bg-cream">
        <button className="block w-full" onClick={onOpen} aria-label={`Mở ${image.ten_hinh}`}>
          {failed ? (
            <div className="grid min-h-48 place-items-center bg-sage px-5 text-center font-display text-2xl">
              {image.ten_hinh}
            </div>
          ) : (
            <img
              src={imageUrl(image.duong_dan)}
              alt={image.ten_hinh}
              onError={() => setFailed(true)}
              className="max-h-[520px] min-h-32 w-full object-cover transition duration-500 group-hover:scale-105"
            />
          )}
        </button>
        <div className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-between bg-gradient-to-t from-black/60 to-transparent p-4 pt-12 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={onSave}
            className="rounded-full bg-coral px-4 py-2 text-sm font-bold text-white"
          >
            Lưu
          </button>
          <button
            onClick={onOpen}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/90"
            aria-label="Mở chi tiết"
          >
            <Link2 size={17} />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 px-1 pt-3">
        <Avatar user={creator} />
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold">{image.ten_hinh}</h3>
          <p className="truncate text-xs text-stone-400">
            {creator?.ho_ten || 'Cộng đồng pinboard'}
          </p>
        </div>
      </div>
    </article>
  );
}

function Avatar({ user }: { user?: Pick<User, 'ho_ten' | 'anh_dai_dien'> }) {
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-cream text-xs font-bold">
      {user?.anh_dai_dien ? (
        <img src={imageUrl(user.anh_dai_dien)} alt="" className="h-full w-full object-cover" />
      ) : (
        user?.ho_ten?.slice(0, 1).toUpperCase() || 'P'
      )}
    </span>
  );
}

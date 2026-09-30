import { FormEvent, useEffect, useState } from "react";
import FormField from "../components/FormField";
import ImageCard from "../components/ImageCard";
import { getApiMessage, imageUrl } from "../api/axiosClient";
import {
  getCreatedImagesApi,
  getProfileApi,
  getSavedImagesApi,
  updateProfileApi,
} from "../api/userApi";
import type { ImagePin, User } from "../types";

export default function Profile({
  user,
  onEdit,
  onOpenDetail,
  onNotify,
}: {
  user: User | null;
  onEdit: () => void;
  onOpenDetail: (id: number) => void;
  onNotify: (message: string, type?: "success" | "error") => void;
}) {
  const [tab, setTab] = useState<"created" | "saved">("created");
  const [images, setImages] = useState<ImagePin[]>([]);
  useEffect(() => {
    if (tab === "created")
      getCreatedImagesApi()
        .then((result) => setImages(result.data))
        .catch((error) => onNotify(getApiMessage(error), "error"));
    else
      getSavedImagesApi()
        .then((result) =>
          setImages(
            result.data.map((item) => ({ ...item.hinh_anh, saved: true })),
          ),
        )
        .catch((error) => onNotify(getApiMessage(error), "error"));
  }, [tab]);
  if (!user)
    return (
      <div className="py-24 text-center">
        <h1 className="font-display text-4xl font-bold">
          Đăng nhập để xem hồ sơ
        </h1>
      </div>
    );
  return (
    <main className="mx-auto max-w-6xl px-5 py-12 md:px-9">
      <section className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="grid h-28 w-28 place-items-center overflow-hidden rounded-full bg-ink font-display text-5xl text-white">
          {user.anh_dai_dien ? (
            <img
              src={imageUrl(user.anh_dai_dien)}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            user.ho_ten.slice(0, 1)
          )}
        </div>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-coral">
            Your creative corner
          </p>
          <h1 className="font-display text-5xl font-bold leading-[1.08] tracking-normal">
            {user.ho_ten}
          </h1>
          <p className="text-stone-500">{user.email}</p>
        </div>
        <button
          onClick={onEdit}
          className="rounded-full bg-cream px-5 py-3 text-sm font-bold sm:ml-auto"
        >
          Chỉnh sửa hồ sơ
        </button>
      </section>
      <div className="mb-7 flex gap-6 border-b border-black/10">
        <button
          onClick={() => setTab("created")}
          className={`border-b-2 px-1 py-3 text-sm font-bold ${tab === "created" ? "border-coral" : "border-transparent text-stone-400"}`}
        >
          Đã tạo
        </button>
        <button
          onClick={() => setTab("saved")}
          className={`border-b-2 px-1 py-3 text-sm font-bold ${tab === "saved" ? "border-coral" : "border-transparent text-stone-400"}`}
        >
          Đã lưu
        </button>
      </div>
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-4">
        {images.map((image) => (
          <ImageCard
            key={image.hinh_id}
            image={image}
            onOpen={() => onOpenDetail(image.hinh_id)}
            onSave={() => undefined}
          />
        ))}
      </div>
    </main>
  );
}

export function EditProfile({
  user,
  onCancel,
  onSaved,
}: {
  user: User;
  onCancel: () => void;
  onSaved: (user: User) => void;
}) {
  const [avatarPreview, setAvatarPreview] = useState(
    user.anh_dai_dien ? imageUrl(user.anh_dai_dien) : "",
  );

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await updateProfileApi(new FormData(event.currentTarget));
    onSaved(result.data.data);
  };
  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <div className="rounded-[28px] bg-white p-7 shadow-soft md:p-10">
        <p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-coral">
          Profile settings
        </p>
        <h1 className="font-display text-4xl font-bold">
          Chỉnh sửa thông tin cá nhân.
        </h1>
        <form className="mt-8 space-y-5" onSubmit={submit}>
          <FormField
            label="Họ tên"
            name="ho_ten"
            required
            placeholder={user.ho_ten}
          />
          <FormField
            label="Tuổi"
            name="tuoi"
            type="number"
            placeholder={String(user.tuoi || "")}
          />
          <label className="block text-sm font-semibold">
            <span className="mb-2 block">Ảnh đại diện</span>
            <span className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-black/15 bg-cream p-3">
              <input
                name="anh_dai_dien"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) setAvatarPreview(URL.createObjectURL(file));
                }}
              />
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Xem trước ảnh đại diện"
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <span className="grid h-16 w-16 place-items-center rounded-full bg-ink text-2xl text-white">
                  {user.ho_ten.slice(0, 1)}
                </span>
              )}
              <span className="text-sm text-stone-500">Chọn file ảnh mới</span>
            </span>
          </label>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full bg-cream px-5 py-3 font-bold"
            >
              Hủy
            </button>
            <button className="rounded-full bg-coral px-5 py-3 font-bold text-white">
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

import { FormEvent, useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import Modal from '../components/Modal';
import { getApiMessage, imageUrl } from '../api/axiosClient';
import {
  addCommentApi,
  checkSavedApi,
  getCommentsApi,
  getImageDetailApi,
  saveImageApi,
} from '../api/imageApi';
import type { Comment, ImagePin, User } from '../types';

export default function ImageDetail({
  id,
  user,
  onClose,
  onLogin,
  onNotify,
}: {
  id: number;
  user: User | null;
  onClose: () => void;
  onLogin: () => void;
  onNotify: (message: string, type?: 'success' | 'error') => void;
}) {
  const [image, setImage] = useState<ImagePin | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [saved, setSaved] = useState(false);
  const [text, setText] = useState('');
  useEffect(() => {
    Promise.all([
      getImageDetailApi(id),
      getCommentsApi(id),
      user ? checkSavedApi(id) : Promise.resolve({ data: { isSaved: false } }),
    ])
      .then(([detail, commentResult, savedResult]) => {
        setImage(detail.data);
        setComments(commentResult.data);
        setSaved(savedResult.data.isSaved);
      })
      .catch((error) => onNotify(getApiMessage(error), 'error'));
  }, [id, user]);
  if (!image)
    return (
      <Modal onClose={onClose}>
        <div className="p-20 text-center text-stone-400">Đang tải...</div>
      </Modal>
    );
  const save = async () => {
    if (!user) return onLogin();
    try {
      await saveImageApi(id);
      setSaved(true);
      onNotify('Đã lưu hình ảnh.');
    } catch (error) {
      onNotify(getApiMessage(error), 'error');
    }
  };
  const comment = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) return onLogin();
    if (!text.trim()) return;
    try {
      await addCommentApi(id, text);
      setText('');
      setComments((await getCommentsApi(id)).data);
      onNotify('Đã thêm bình luận.');
    } catch (error) {
      onNotify(getApiMessage(error), 'error');
    }
  };
  return (
    <Modal onClose={onClose}>
      <div className="grid md:grid-cols-[1.05fr_.95fr]">
        <div className="flex min-h-[330px] items-center justify-center bg-stone-100 md:min-h-[610px]">
          <img
            src={imageUrl(image.duong_dan)}
            alt={image.ten_hinh}
            className="max-h-[690px] w-full object-contain"
          />
        </div>
        <div className="flex flex-col p-6 md:p-9">
          <div className="flex items-start justify-between gap-3 pr-5">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-coral">
                Pin detail
              </p>
              <h2 className="font-display text-4xl font-bold">{image.ten_hinh}</h2>
            </div>
            <button
              onClick={save}
              className="rounded-full bg-coral px-5 py-3 text-sm font-bold text-white"
            >
              {saved ? 'Đã lưu' : 'Lưu'}
            </button>
          </div>
          <p className="mt-4 leading-7 text-stone-500">
            {image.mo_ta || 'Một hình ảnh được chia sẻ trong cộng đồng pinboard.'}
          </p>
          <div className="my-6 border-t border-black/10 pt-5">
            <strong>{comments.length} bình luận</strong>
            <div className="mt-4 max-h-56 space-y-4 overflow-y-auto">
              {comments.map((item) => (
                <div key={item.binh_luan_id}>
                  <strong className="text-sm">{item.nguoi_dung?.ho_ten || 'Người dùng'}</strong>
                  <p className="text-sm text-stone-600">{item.noi_dung}</p>
                </div>
              ))}
            </div>
          </div>
          <form className="mt-auto flex gap-2" onSubmit={comment}>
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="min-w-0 flex-1 rounded-full border border-black/10 px-4 py-3 text-sm"
              placeholder="Thêm nhận xét..."
            />
            <button className="grid h-11 w-11 place-items-center rounded-full bg-coral text-white">
              <Send size={17} />
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );
}

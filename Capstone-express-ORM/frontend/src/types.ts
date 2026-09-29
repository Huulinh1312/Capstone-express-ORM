export type View = 'home' | 'create' | 'profile' | 'edit-profile';

export interface User {
  nguoi_dung_id?: number;
  email: string;
  ho_ten: string;
  tuoi?: number | null;
  anh_dai_dien?: string | null;
}

export interface ImagePin {
  hinh_id: number;
  ten_hinh: string;
  duong_dan: string;
  mo_ta?: string | null;
  nguoi_dung_id: number;
  nguoi_dung?: Pick<User, 'ho_ten' | 'anh_dai_dien'>;
  saved?: boolean;
}

export interface Comment {
  binh_luan_id: number;
  noi_dung: string;
  ngay_binh_luan: string;
  nguoi_dung?: Pick<User, 'ho_ten' | 'anh_dai_dien'>;
}

export interface SavedImage {
  hinh_anh: ImagePin;
}

export interface ApiErrorShape {
  message?: string;
}

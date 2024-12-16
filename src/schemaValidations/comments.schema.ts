export interface commentsSchema {
  id: number;
  ngayBinhLuan: Date;
  noiDung: string;
  saoBinhLuan: number;
  tenNguoiBinhLuan: string;
  avatar?: string;
}

export interface feedbackSchema {
  content: commentsSchema;
}

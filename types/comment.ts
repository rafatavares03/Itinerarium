export type Comment = {
  id: string;
  texto: string;
  linha_id: number;
  usuario_id: string;
  created_at: Date;
};

export type CommentWithUser = Comment & {
  usuario: {
    id: string;
    name: string | null;
  };
};

export type CommentsPagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type GetCommentsResult = {
  comentarios: CommentWithUser[];
  pagination: CommentsPagination;
};
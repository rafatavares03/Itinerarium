export type Comment = {
  id: string;
  texto: string;
  email: string;
  linha_id: number;
  created_at: Date;
};

export type CommentsPagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type GetCommentsResult = {
  comentarios: Comment[];
  pagination: CommentsPagination;
};
export type Comment = {
  id: string;
  texto: string;
  linha_id: number;
  usuario_id: string;
  created_at: Date;
};

export type CommentWithUser = Comment & {
  user: {
    id: string;
    name: string | null;
  };
};
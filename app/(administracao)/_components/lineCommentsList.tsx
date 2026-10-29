"use client";

import { useState, useEffect, useTransition } from "react";
import { getCommentsByLineAction } from "@/app/actions/commentActions";
import Pagination from "@/app/components/pagination";
import { CommentWithUser, CommentsPagination } from "@/types/comment";

interface LineCommentsListProps {
  lineId: number | string;
}

export default function LineCommentsList({ lineId }: LineCommentsListProps) {
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [pagination, setPagination] = useState<CommentsPagination | null>(null);
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const itemsAmount = 15;

  const fetchComments = (targetPage: number, start?: string, end?: string) => {
    startTransition(async () => {

      const result = await getCommentsByLineAction(
        lineId, 
        targetPage, 
        itemsAmount, 
        start || undefined, 
        end || undefined
      );
      console.log(result);

      if (!result || !result.success) {
        return;
      }

      setComments(result.data?.comentarios ?? []);
      setPagination(result.data?.pagination ?? null);
    });
  };

  useEffect(() => {
    fetchComments(page, startDate, endDate);
  }, [lineId, page, startDate, endDate]);

  const handleFilterChange = (type: 'start' | 'end', value: string) => {
    setPage(1);
    if (type === 'start') setStartDate(value);
    if (type === 'end') setEndDate(value);
  };

  return (
    <div className="w-full flex border-2 border-icy-aqua-700 relative mt-5">
      <h2 className="bg-icy-aqua-700 font-title text-semibold text-white tracking-widest rounded-t-md font-bold absolute top-[-25px] left-0 italic px-2">Comentários</h2>
      <div className="flex flex-col gap-1 text-white flex-1">
        <div className="flex flex-wrap gap-4 items-center bg-icy-aqua-300 p-3 w-full">
          <div className="flex gap-1">
            <label className="text-xs text-space-indigo-700">Data Inicial</label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => handleFilterChange('start', e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded p-1 text-sm text-white"
            />
          </div>
          <div className="flex gap-1">
            <label className="text-xs text-gray-400">Data Final</label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => handleFilterChange('end', e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded p-1 text-sm text-white"
            />
          </div>
          {(startDate || endDate) && (
            <button 
              onClick={() => { setStartDate(""); setEndDate(""); setPage(1); }}
              className="self-end text-xs text-icy-aqua-400 underline hover:text-white"
            >
              Limpar filtros
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2 min-h-[200px]">
          {comments.length === 0 && !isPending ? (
            <p className="text-gray-400 text-sm italic">Nenhum comentário encontrado para esta linha.</p>
          ) : (
            comments.map((comment, index) => (
              <div 
                key={comment.id ?? index}
                className="p-3 bg-gray-900/80 border border-icy-aqua-400/40 rounded-lg flex flex-col gap-1"
              >
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span className="font-semibold text-icy-aqua-400">
                    {comment.usuario.name || "Anônimo"}
                  </span>
                  <span>{new Date(comment.created_at).toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-200 break-words">{comment.texto}</p>
              </div>
            ))
          )}
        </div>

        {isPending && (
          <div className="text-center text-sm text-gray-400 py-2">Carregando comentários...</div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <Pagination 
            quantidade={pagination.totalPages} 
            pagina={page} 
            onChange={(novaPagina) => setPage(novaPagina)} 
          />
        )}
      </div>
    </div>
  );
}
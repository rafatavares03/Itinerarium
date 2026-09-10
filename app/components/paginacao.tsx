'use client'

export default function Paginacao({
  quantidade,
  pagina,
  onChange
}: {
  quantidade: number,
  pagina: number,
  onChange: (pagina: number) => void
}) {
   const botoes = 5;

  let inicio = Math.max(1, pagina - 2);
  let fim = Math.min(quantidade, inicio + botoes - 1);

  inicio = Math.max(1, fim - botoes + 1);
  const paginas = Array.from(
    { length: fim - inicio + 1 },
    (_, i) => inicio + i
  );

  return (
    <div className="flex justify-center gap-2 py-1">
      {paginas.map(numero => (
        <button
          key={numero}
          type="button"
          onClick={() => onChange(numero)}
          className={"size-[30px] border-1 border-space-indigo-700 text-space-indigo-700" + (pagina === numero ? " font-bold text-white bg-space-indigo-700" : "")}
        >
          {numero}
        </button>
      ))}
    </div>
  );
}
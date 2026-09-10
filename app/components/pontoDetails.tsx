import { useEffect, useState } from "react";
import { Ponto } from "@/types/ponto";
import { FaArrowAltCircleLeft, FaRegEdit } from "react-icons/fa";

export default function PontoDetails({
  ponto,
  onClose,
  toUpdate,
  onUpdate
}: {
  ponto: Ponto,
  toUpdate?: boolean,
  onClose: () => void,
  onUpdate?: (antigo: Ponto, novo: Ponto) => void
}) {
  const [update, setUpdate] = useState(false);
  const [novo, setNovo] = useState(ponto);

  useEffect(() => {
    setNovo(ponto);
  }, [ponto]);

  function atualizaNovo(campo: keyof Ponto, valor: string) {
    setNovo((atual) => ({
      ...atual,
      [campo]: valor
    }));
  }

  function atualizaCoordenada(indice: 1 | 0, valor: string) {
    setNovo((atual) => ({
      ...atual,
      coordenada: atual.coordenada.map((coord, i) => i === indice ? Number(valor) : coord) as [number, number]
    }));
  }

  const containerStyle = "flex flex-col h-full relative px-5 overflow-y-auto";
  const titleStyle = "font-display font-semibold text-center p-5";
  const labelStyle = "font-main font-semibold text-sm text-space-indigo-700";
  const inputStyle = "bg-space-indigo-700 text-icy-aqua-100 font-display px-3 py-2 mt-2 mb-5 outline-0";
  const infoStyle = "font-display mt-2 mb-5";
  const buttonStyle = "absolute bottom-0 left-1 right-0 bg-space-indigo-800 font-display font-bold flex justify-center gap-2 rounded-b-2xl py-3 text-icy-aqua-400";
  const backButtonStyle = "absolute left-[20px] top-[20px] size-[25px] text-space-indigo-700"

  if((update || toUpdate) && onUpdate) {
    return (
      <form className={containerStyle}>
        <h1 className={titleStyle}>Editar ponto</h1>
        <button type="button" onClick={onClose} className="cursor-pointer">
          <FaArrowAltCircleLeft className={backButtonStyle}/>
        </button>
        <label htmlFor="logradouro" className={labelStyle}>Endereço</label>
        <input type="text" name="logradouro" id="logradouro" value={novo.logradouro} onChange={(e) => atualizaNovo("logradouro", e.target.value)} className={inputStyle}/>
        <label htmlFor="numero" className={labelStyle}>Número</label>
        <input type="text" name="numero" id="numero" value={novo.numero} onChange={(e) => atualizaNovo("numero", e.target.value)} className={inputStyle}/>
        <label htmlFor="latitude" className={labelStyle}>Latitude</label>
        <input type="text" name="latitude" id="latitude" value={novo.coordenada[0]} onChange={(e) => atualizaCoordenada(0, e.target.value)} className={inputStyle}/>
        <label htmlFor="Longitude" className={labelStyle}>Longitude</label>
        <input type="text" name="longitude" id="longitude" value={novo.coordenada[1]} onChange={(e) => atualizaCoordenada(1, e.target.value)} className={inputStyle}/>
        <button type="button" className={buttonStyle} onClick={() => onUpdate(ponto, novo)}>Salvar</button>
      </form>
    );
  }

  return (
    <div className={containerStyle}>
      <h1 className={titleStyle}>Ponto de ônibus</h1>
      <button type="button" onClick={onClose} className="cursor-pointer">
        <FaArrowAltCircleLeft className={backButtonStyle}/>
      </button>
      <h2 className={labelStyle}>Endereço:</h2>
      <p className={infoStyle}>{ponto.logradouro.concat(ponto.numero) ?? "Endereço indisponível."}</p>
      <div className="flex justify-between flex-wrap">
        <div>
          <h2 className={labelStyle}>Latitude:</h2>
          <p className={infoStyle}>{ponto.coordenada[0]}</p>
        </div>
        <div>
          <h2 className={labelStyle}>Longitude:</h2>
          <p className={infoStyle}>{ponto.coordenada[1]}</p>
        </div>
      </div>
      {onUpdate &&
        <button type="button" className={buttonStyle} onClick={() => setUpdate(true)}>
          <FaRegEdit className="size-[20px]"/>  Editar
        </button>
      }
    </div>
  );

}
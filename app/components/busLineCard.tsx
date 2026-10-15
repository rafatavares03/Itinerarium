import { BusLineBasic } from "@/types/busLine"

export default function BusLineCard({
  busLine,
  onClick
}: {
  busLine: BusLineBasic,
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className="bg-space-indigo-700 h-[150px] w-[200px] rounded-xl flex flex-col 
                  shadow-[0_10px_10px_3px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-105
                  "
    >
      <div className="flex-1 flex justify-center items-center font-bold text-center">
        <p className="text-dusty-grape-100 text-xl">{busLine.codigo}</p>
      </div>
      <p className="bg-icy-aqua-400 rounded-b-xl font-semibold text-center">
        {busLine.origem} - {busLine.destino}
      </p>
    </div>
  )
}
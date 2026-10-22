import { useState } from "react";
import { CidadeDetails } from "@/types/cidade";
import SearchToolBar from "../../components/searchToolBar";
import BusLineList from "./busLineList";
import { BusLineBasic } from "@/types/busLine";

export default function BusLineContainer({
  city,
  onAddClick,
  onLineClick
}: {
  city: CidadeDetails | null,
  onAddClick: () => void,
  onLineClick: (id: BusLineBasic) => void
}) {
  const [search, setSearch] = useState("");

  return (
    <div className="w-7xl">
      <SearchToolBar 
        placeholder="Busque por código ou pelo nome da linha"
        onInputChange={(newValue:string) => setSearch(newValue)}
        onAddClick={onAddClick}
        canAdd
      />
      <BusLineList city={city} onClick={onLineClick}/>
    </div>
  );
}
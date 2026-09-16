import { useState } from "react";
import { CidadeDetails } from "@/types/cidade";
import SearchToolBar from "../../components/searchToolBar";
import BusLineList from "./busLineList";

export default function BusLineContainer({
  city,
  onAddClick,
}: {
  city: CidadeDetails | null,
  onAddClick: () => void
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
      <BusLineList city={city}/>
    </div>
  );
}
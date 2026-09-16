import { IoMdAdd } from "react-icons/io";

export default function SearchToolBar({
  placeholder,
  onInputChange,
  onAddClick,
  canAdd
}: {
  placeholder: string,
  onInputChange: (newValue: string) => void,
  onAddClick?: () => void,
  canAdd?: boolean
}) {
  return (
    <div className="flex flex-row items-center justify-around gap-10">
     <div className="bg-space-indigo-800 border-3 border-space-indigo-800 flex-1 flex items-center justify-center gap-1 rounded-3xl pl-3">
          <label htmlFor="searchBar" className="font-semibold text-icy-aqua-500">Pesquisar</label>
          <input 
            type="text" 
            name="searchBar" 
            id="searchBar" 
            className="bg-space-indigo-700 border-l-2 border-icy-aqua-500 outline-0 rounded-3xl px-5 py-1 text-icy-aqua-100 w-full"
            placeholder={placeholder}
            onChange={(e) => onInputChange(e.target.value)}
            />
      </div>
      {canAdd &&
        <div 
        className="bg-space-indigo-800 cursor-pointer flex items-center gap-2 justify-center font-semibold py-1 rounded-3xl text-center text-display text-icy-aqua-100 w-[175px]" 
        onClick={onAddClick}
        >
          <IoMdAdd className="inline size-[30px]"/>
          <span className="text-md">Cadastrar</span>
        </div>
      }
    </div>
  );
}
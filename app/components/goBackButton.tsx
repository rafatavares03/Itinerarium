import { FaArrowAltCircleLeft } from "react-icons/fa";

export default function GoBackButton({
  style,
  children,
  onClick,
}: {
  style: string,
  children?: React.ReactNode 
  onClick: () => void
}) {
  return (
    <div className="flex gap-2 items-center">
      <button type="button" onClick={onClick} className="cursor-pointer">
        <FaArrowAltCircleLeft className={style}/>
      </button>
      {children}
    </div>
  );
}
'use client'

export default function Modal({
  children,
  open
}: {
  children: React.ReactNode
  open: boolean,
}) {
  if(!open) return null;

  return (
    <div className="bg-black/40 fixed flex inset-0 items-center justify-center z-10 p-4" >
      {children}
    </div>
  );
}
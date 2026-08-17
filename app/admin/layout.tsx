import AdminMenu from "./_components/AdminMenu";

export default function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>){
  return (
    <main className="flex">
      <div className="bg-space-indigo-800 h-screen w-[200px] p-5">
        <AdminMenu/>
      </div>
      <div className="flex-1">{children}</div>
    </main>
  )
}
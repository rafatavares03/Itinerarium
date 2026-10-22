import AdminMenu from "./_components/AdminMenu";

export default function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>){
  return (
    <main className="flex flex-col">
      <div className="bg-space-indigo-800 px-5 py-1">
        <AdminMenu/>
      </div>
      <div className="">{children}</div>
    </main>
  )
}
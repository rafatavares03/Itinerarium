'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminMenu() {
  const pathName = usePathname();
  const linkStyle = "border-b border-mist-400 font-display py-3 text-center h-full hover:text-white hover:border-white"
  const linkActiveStyle = " text-white border-white font-semibold"

  return (
    <div className="flex flex-column justify-end text-mist-400">
      <Link href="/admin/cidade" className={linkStyle + (pathName.match("/admin/cidade") ? linkActiveStyle : "")}>Cidade</Link>
    </div>
  );
}
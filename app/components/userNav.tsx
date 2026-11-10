'use client'

import { signOut } from "next-auth/react"
import { useState } from "react";
import { User } from "next-auth";
import AccountManager from "./auth/accountManager";
import Modal from "./modal";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function UserNav({
    user
}: {
    user: User | null
}) {
  const [modal, setModal] = useState(false);
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin") || pathname.startsWith("/gestao");


  if (!user) {
    return (
      <>
        <button onClick={() => setModal(true)}
          className="px-2 py-1 bg-icy-aqua-400 text-space-indigo-700 w-[80px] text-center rounded-md">
            Entrar
        </button>
        <Modal open={modal}><AccountManager onClose={() => setModal(false)}/></Modal>
      </>
    )
  }

  return (
    <div className="flex items-center gap-4">
      {!isAdminPage && (user.role === "ADMIN" || user.role === "ADMIN_MUN") && 
        <Link href={(user.role === "ADMIN") ? '/admin' : '/gestao'}
          className="text-xs bg-icy-aqua-100 p-1 font-semibold text-icy-aqua-700 rounded-md uppercase"
        >
          Gerenciamento
        </Link>
      }
      <span className="text-white font-bold">{user.name}</span>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
      >
        Sair
      </button>
    </div>
  )
}
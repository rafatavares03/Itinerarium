'use client'

import { useSession, signOut } from "next-auth/react"
import { useState } from "react";
import AccountManager from "./auth/accountManager";
import Modal from "./modal";

export default function UserNav() {
  const { data: session, status } = useSession();
  const [modal, setModal] = useState(false);

  if (status === "loading") return null;

  if (!session) {
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
      <span className="text-white font-bold">{session.user?.name}</span>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
      >
        Sair
      </button>
    </div>
  )
}
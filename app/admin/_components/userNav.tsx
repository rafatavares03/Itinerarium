'use client'

import { useSession, signOut } from "next-auth/react"
import Link from "next/link";

export default function UserNav() {
  const { data: session, status } = useSession()

  if (status === "loading") return null;

  if (!session) {
    return <Link href="/login" className="px-2 py-1 bg-icy-aqua-400 text-space-indigo-700 w-[80px] text-center rounded-md">Entrar</Link>;
  }

  return (
    <div className="flex items-center gap-4">
      <span>Olá, {session.user?.name}</span>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
      >
        Sair
      </button>
    </div>
  )
}
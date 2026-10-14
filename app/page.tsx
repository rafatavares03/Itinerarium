'use client'

import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <p>Carregando sessão...</p>
  }

  if (status === 'unauthenticated') {
    return <p>Acesso negado. Faça login.</p>
  }
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      Olá {session?.user.name}
    </div>
  );
}

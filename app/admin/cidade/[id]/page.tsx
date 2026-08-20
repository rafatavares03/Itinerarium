'use client'

import { use } from "react";

export default function City({
  params,
}: {
  params: Promise<{id: string}>
}) {
  const {id} = use(params);

  return (
    <p>Cidade</p>
  )
}
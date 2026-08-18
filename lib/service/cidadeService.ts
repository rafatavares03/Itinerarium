'use server'

import { getByName } from "../data/cidadeDAO";

export async function buscarCidade(formData: FormData) {
  const cidade = formData.get("buscaCidade")
  if(typeof cidade !== "string") return;

  const resposta = await getByName(cidade);
  console.log(resposta);
  return;
}
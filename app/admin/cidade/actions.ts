'use server'

import { z } from 'zod';
import { updateCityBounds, saveCity } from '@/lib/data/cidadeDAO';

const MunicipioSchema = z.object({
  id: z.number(),
  nome: z.string()
})

const MunicipiosSchema = z.array(MunicipioSchema);

const GeometriaSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("Polygon"),
    coordinates: z.array(
      z.array(
        z.tuple([z.number(), z.number()])
      )
    ),
  }),

  z.object({
    type: z.literal("MultiPolygon"),
    coordinates: z.array(
      z.array(
        z.array(
          z.tuple([z.number(), z.number()])
        )
      )
    ),
  }),
]);

const MalhaSchema = z.object({
  type: z.literal("FeatureCollection"),

  features: z.array(
    z.object({
      type: z.literal("Feature"),
      geometry: GeometriaSchema,
    })
  ),
});

async function fetchMunicipiosPorUF(uf: string) {
  const dados = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`);
  if(!dados || !dados.ok) return null;

  return await dados.json();
}

async function fetchMunicipioMalha(id: number) {
  const dados = await fetch(`https://servicodados.ibge.gov.br/api/v3/malhas/municipios/${id}?formato=application/vnd.geo+json&qualidade=intermediaria`);
  if(!dados || !dados.ok) return null;

  return await dados.json();
}

export async function criaCidade(formData: FormData) {
  const nome = formData.get('cidadeNome');
  const uf = formData.get('cidadeUF');
  const failed = {
    success: false,
    bounds: null
  }
  if(!nome || !uf) return failed;

  const dadosMunicipios = await fetchMunicipiosPorUF(uf.toString());
  if(!dadosMunicipios) return failed;

  const municipios = MunicipiosSchema.parse(dadosMunicipios);
  const municipio = municipios.find(mun => mun.nome.toLocaleLowerCase() === nome.toString().toLocaleLowerCase());
  if(!municipio) return failed;

  const dadosMalha = await fetchMunicipioMalha(municipio.id);
  if(!dadosMalha) return failed;

  const malha = MalhaSchema.parse(dadosMalha);

  
  const res = await saveCity({id: municipio.id, nome: nome.toString(), uf: uf.toString(), geometria: malha.features[0].geometry});
  console.log(res);
  return {
    success: true,
    bounds: []
  }
}

export async function editarCidade(formData: FormData) {
  const id = Number(formData.get("cidadeId"));

  const boundsString = formData.get("enquadramento");

  console.log("id:", id);
  console.log("bounds:", boundsString);

  if (!boundsString) {
    return { success: false };
  }

  const enquadramento = JSON.parse(boundsString as string);

  return await updateCityBounds(id, enquadramento);
}
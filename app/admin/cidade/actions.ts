'use server'

import { z } from 'zod';
import createCity from '@/lib/data/cidadeDAO';

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
  if(!nome || !uf) return;

  const dadosMunicipios = await fetchMunicipiosPorUF(uf.toString());
  if(!dadosMunicipios) return;

  const municipios = MunicipiosSchema.parse(dadosMunicipios);
  const municipio = municipios.find(mun => mun.nome.toLocaleLowerCase() === nome.toString().toLocaleLowerCase());
  if(!municipio) return;

  const dadosMalha = await fetchMunicipioMalha(municipio.id);
  if(!dadosMalha) return;

  const malha = MalhaSchema.parse(dadosMalha);

  await createCity({nome: nome.toString(), uf: uf.toString(), geometria: malha.features[0].geometry});
}
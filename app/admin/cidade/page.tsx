'use client'

import { criaCidade, editarCidade } from "../actions/cityActions";
import Modal from "@/app/components/modal";
import { useActionState, useEffect, useState } from "react";
import Form from 'next/form';
import Link from "next/link";
import { IoIosCloseCircle, IoMdAdd } from "react-icons/io";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { buscaCidades } from "@/lib/services/cityService";
import { CidadeDetails } from "@/types/cidade";
import dynamic from "next/dynamic";
import { useMapEvents } from "react-leaflet";
import SearchToolBar from "@/app/components/searchToolBar";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const initialState = {
  success: false,
  bounds: null
}


export default function Cities() {
  const [cadastrarModal, setCadastrarModal] = useState(false);
  const [editarModal, setEditarModal] = useState(false);
  const [cidades, setCidades] = useState<CidadeDetails[]>([]);
  const [cidadeEmEdicao, setCidadeEmEdicao] = useState<CidadeDetails|null>(null)
  const [form, setForm] = useState({
    nome: '',
    quantidade: 10,
    pagina: 1
  });
  const [state, addCityAction, isPending] = useActionState(createCity, initialState);
  const [state2, updateCityAction, isPending2] = useActionState(updateCity, initialState);

  async function createCity(prevState:any, formData: FormData) {
    const res = await criaCidade(formData);
    console.log(res);
  
    setCadastrarModal(false);
    return res
  }

  async function updateCity(prevState:any, formData: FormData) {
    const res = await editarCidade(formData);
    console.log(res);

    setEditarModal(false);
    setCidadeEmEdicao(null);
    return res;
  }

  function exibirModalCadastro(){
    setCadastrarModal(true);
  }

  function fecharModalCadastro() {
    setCadastrarModal(false);
  }

  useEffect(() => {
    const carregarCidades = async () => {
      const dados = await buscaCidades(form);
      if(dados.success) {
        if(dados.cidades) {
          setCidades(dados.cidades);
        }
      }
    }

    carregarCidades();
  }, [])

  useEffect(() => {
    const timeout = setTimeout(async () => {
     const dados = await buscaCidades(form);

      if (dados.success) {
        if(dados.cidades) {
          setCidades(dados.cidades);
        }
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [form.nome, form.pagina])

  return (
    <div className="m-auto py-5 w-6xl">
      {ModalComponent(cadastrarModal, addCityAction,fecharModalCadastro)}
      {ModalComponent(editarModal, updateCityAction, () => setEditarModal(false), cidadeEmEdicao)}

      <SearchToolBar 
        placeholder="Busque uma cidade..."
        onInputChange={(newValue: string) => {
          setForm((form) => ({
            ...form,
            nome: newValue,
            pagina: 1
          }));
        }}
        onAddClick={exibirModalCadastro}
        canAdd
      />


      {(cidades.length === 0) ? <p className="text-center font-main text-lg font-semibold mt-10">Não há cidades disponíveis.</p> : 
        <div className="flex flex-col gap-5 py-10">
          {cidades.map((cidade:any) => {
            return (
              <div key={cidade.id} 
                className="bg-white border border-white flex items-center justify-between h-[60px] hover:border-icy-aqua-400 px-5 rounded-sm"
              >
                <p className="font-semibold w-80">{cidade.nome} - {cidade.uf}</p>
                <div>
                  <FiEdit className="size-[20px] hover:text-icy-aqua-400" 
                    onClick={() => {
                      setCidadeEmEdicao(cidade)
                      setEditarModal(true)
                    }}                  
                  />
                </div>
                <div>
                  <Link href={`/admin/cidade/${cidade.id}`}><FaArrowAltCircleRight className="text-icy-aqua-400 size-[30px]"/></Link>
                </div>
              </div>
            )
          })}
        </div>
      }

    </div>
  );
}

function ModalComponent(
  modal: boolean,
  formAction: (formData: FormData) => void,
  fecharModalCadastro: () => void,
  cidade?: CidadeDetails|null
) {
  const inputStyle = "bg-space-indigo-800 mt-4 outline-0 py-2 px-5 rounded-md";
  const buttonStyle = "bg-icy-aqua-400 cursor-pointer font-display font-semibold py-1 mx-auto rounded-sm text-space-indigo-900 w-[220px]";
  const containerDimension = cidade ? "w-3xl" : "h-[340px] w-2xl";
  const [bounds, setBounds] = useState(cidade?.enquadramento ?? null);

  function MapBounds({ onChange }: {
    onChange: (bounds: [[number, number], [number, number]]) => void
  }) {
    useMapEvents({
      moveend: (e) => {
        const bounds = e.target.getBounds();

        onChange([
          [bounds.getSouth(), bounds.getWest()],
          [bounds.getNorth(), bounds.getEast()]
        ]);
      }
    });

    return null;
  }

  return (
    <Modal open={modal}>
        <div className={"bg-space-indigo-900 m-auto text-white rounded-[20px] py-5 px-10 " + containerDimension}>
          <Form action={formAction} className="flex flex-col h-full justify-between relative text-icy-aqua-50">
            <IoIosCloseCircle className="absolute cursor-pointer size-[30px] -top-px right-[-15px]" onClick={fecharModalCadastro}/>
            <h2 className="font-semibold font-display text-2xl text-center">Registrar nova cidade</h2>
            <div className="flex gap-3">
              <div className="flex-1 flex flex-col">
                <label htmlFor="cidadeNome">Nome:</label>
                <input type="text" name="cidadeNome" id="cidadeNome" className={inputStyle} defaultValue={cidade?.nome ?? ""} />
              </div>

              <div className="flex flex-col w-[100px]">
                <label htmlFor="cidadeUF">UF:</label>
                <input type="text" name="cidadeUF" id="cidadeUF" className={inputStyle} defaultValue={cidade?.uf ?? ""}/>
              </div>
            </div>
            <input type="hidden" name="cidadeId" value={cidade?.id ?? ""}/>
            <input type="hidden" name="enquadramento" value={bounds ? JSON.stringify(bounds) : ""}/>

            {cidade ?
              <>
                <p>Centralize a cidade no mapa. Essa referência será utilizada como visualização inicial da cidade.</p>
                <MapContainer bounds={cidade.enquadramento} className="h-[300px] my-5 w-full">
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                    />
                    <MapBounds onChange={setBounds} />
                </MapContainer>
              </>
              : ''
            }
            <button type="submit" className={buttonStyle}>Confirmar</button>
          </Form>
        </div>
      </Modal>
  );
}
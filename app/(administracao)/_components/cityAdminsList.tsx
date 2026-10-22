'use client';

import { useCityAdmins } from '@/app/hooks/useCityAdmins';
import { useState } from 'react';
import Modal from '../../components/modal';
import RegisterForm from '../../components/auth/registerForm';
import { IoIosCloseCircle } from 'react-icons/io';


export default function CityAdminsList({
  cityId
}: {
  cityId: string
}) {
  const { admins, loading, error } = useCityAdmins(cityId);
  const [modal, setModal] = useState(false);

  if (loading) return <p>Carregando administradores...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      {admins.length === 0 ? (
        <p>Nenhum administrador encontrado.</p>
      ) : (
        <ul>
          {admins.map((admin) => (
            <li key={admin.id} className="p-2">
              <p className="font-semibold">{admin.name} <span className="text-sm text-gray-500">{admin.email}</span></p>
              <button type="button"></button>
            </li>
          ))}
        </ul>
      )}
      <button type="button" 
        className="px-3 py-1 bg-icy-aqua-700 text-white font-semibold"
        onClick={() => setModal(true)}
      >
        Cadastrar
      </button>
      <Modal open={modal}>
        <div className="relative">
          <IoIosCloseCircle className="absolute cursor-pointer size-[30px] top-px right-px" onClick={() => setModal(false)}/>
          <RegisterForm cityId={cityId}/>
        </div>
      </Modal>
    </div>
  );
}
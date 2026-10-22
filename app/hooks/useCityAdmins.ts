'use client';

import { useState, useEffect } from "react";
import { getCityAdminsAction } from "../actions/userActions";
import { User } from "@/types/user";

export function useCityAdmins(cityId: string | number | undefined) {
  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cityId) {
      setLoading(false);
      return;
    }

    async function fetchAdmins() {
      try {
        setLoading(true);
        setError(null);
        const numericId = Number(cityId);

        const response = await getCityAdminsAction(numericId);
        console.log(response);

        if(!response.success) {
          setError(response.message || "Erro ao buscar administradores");
          setAdmins([]);
          return
        }

        if(response.data) {
          setAdmins(response.data);
        }

      } catch (err) {
        setError("Ocorreu um erro ao carregar os administradores.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAdmins();
  }, [cityId]);

  return { admins, loading, error };
}
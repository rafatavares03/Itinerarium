'use client'

import { use, useEffect, useState, useActionState } from 'react';
import { useSession } from 'next-auth/react';
import { BusRoute } from '@/types/busRoute';
import { Ponto } from '@/types/ponto';
import dynamic from 'next/dynamic';
import { useCity } from '@/app/hooks/useCity';
import BusRouteDetails from '@/app/components/busRouteDetails';
import useLineAndRoutes from '@/app/hooks/useLineAndRoutes';
import { useBusSchedule } from '@/app/hooks/useBusSchedule';
import { IoIosCloseCircle } from "react-icons/io";
import Modal from '@/app/components/modal';
import ScheduleTableView from '@/app/components/scheduleTableView';
import Form from 'next/form';
import { createCommentAction } from '@/app/actions/commentActions';


const RouteViewerMap = dynamic(
  () => import("@/app/components/routeViewerMap"),
  {
    ssr: false,
  }
);

const commentInitialState = {
  success: false,
  message: ""
}

export default function Line({
  params
}: {
  params: Promise<{cityId: string, lineCode: string}>
}) {
  const { cityId, lineCode } = use(params);
  const {city, loading: cityLoading} = useCity(cityId);
  const {line, busRoutes} = useLineAndRoutes(cityId, lineCode);
  const {schedule} = useBusSchedule((!line) ? "" : line.id);
  const [route, setRoute] = useState<BusRoute | null>(null);
  const [scheduleModal, setScheduleModal] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const [commentState, commentFormAction, pending] = useActionState(createCommentAction, commentInitialState);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";
  const user = session?.user;

  useEffect(() => {
    if(busRoutes.length > 0) {
      setRoute(busRoutes[0])
    }
  }, [busRoutes]);

  useEffect(() => {
  if (commentState.success) {
    setCommentModal(false);
  }
}, [commentState.success]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  function formatRemainingTime(expiration: Date | string) {
    const expirationDate = new Date(expiration);
    const difference = expirationDate.getTime() - currentTime.getTime();

    if(difference <= 0) {
      return "expired";
    }

    const totalMinutes = Math.floor(difference / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    if(days > 0) {
      return `${days}d ${hours}h`;
    }

    if(hours > 0) {
      return `${hours}h ${minutes}min`;
    }

    return `${minutes}min`;
  }

  function getPoints(route: BusRoute | null) {
    if(!route) return [];
    const points: Ponto[] = route.pontos
                                    .filter((point) => point.id !== undefined)
                                    .map((point) => {
      return {
      id: point.id,
      logradouro: point.logradouro ?? "",
      numero: point.numero ?? "",
      cidade_id: parseInt(cityId),
      coordenada: point.coordenada
    }})

    return points;
  }
  const routeActiveStyle = " font-bold text-icy-aqua-50";
  const buttonStyle = "cursor-pointer transition-all "
  const spanStyle = "bg-icy-aqua-100 text-space-indigo-700 text-xs font-display font-semibold px-2 rounded-md uppercase mx-1 my-auto"
  
  return (
    <>
      <div className="flex w-7xl h-[85vh] my-5 mx-auto border-3 border-icy-aqua-400">
        {city &&
          <>
            <RouteViewerMap bounds={city.enquadramento} points={getPoints(route)} route={route}/>
            <div className="flex flex-col gap-2 h-full w-2/5 bg-space-indigo-700 py-3">
              <button type="button" 
                className="py-1 bg-icy-aqua-400 mx-3 rounded-md font-bold"
                onClick={() => setScheduleModal(true)}
              >
                Horário
              </button>
              <div className='flex'>
                {busRoutes && busRoutes.map((busRoute, idx) => 
                  <div key={busRoute.id} className="flex-1 relative">
                    <button type="button" onClick={() => setRoute(busRoute)}
                      className={"flex-1 transition-all border-b-2 w-full" 
                                  + ((route && busRoute.id === route.id) ? routeActiveStyle : " text-icy-aqua-500 opacity-50")
                      }>
                        <p className="w-full uppercase font-main mr-1">{!busRoute.ida ? line?.destino : line?.origem}

                        {busRoute.vigencia && new Date(busRoute.vigencia) > currentTime
                          ? <span className={spanStyle}>{formatRemainingTime(busRoute.vigencia)}</span>: ""}
                        </p>
                    
                    </button>
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-y-auto">
                <BusRouteDetails busStops={getPoints(route)}/>
              </div>
              {isAuthenticated && 
                <button type="button" 
                  onClick={() => setCommentModal(true)}
                  className="bg-icy-aqua-400 rounded-md"
                >
                  Enviar comentário
                </button>
              }
            </div>
          </>
        }
      </div>
      <Modal open={(scheduleModal || commentModal)}>
        <div className="bg-space-indigo-700 p-10 flex flex-col rounded-lg relative ">
          <button type="button" className="absolute top-[10px] right-[10px]" 
            onClick={() => {
              setScheduleModal(false);
              setCommentModal(false);
            }}
          >
            <IoIosCloseCircle className="text-icy-aqua-400 size-[30px]"/>
          </button>
          {scheduleModal &&
            <>
              <h2 className="font-display text-icy-aqua-100 text-center font-bold text-lg mb-5">Linha {lineCode} - Horário</h2>
              <div className="flex-1 flex gap-3">
                <ScheduleTableView schedule={schedule.filter(hour => hour.ida)} title={(line && line.origem) ?`Saída: ${line.origem}` : ''}/>
                <ScheduleTableView schedule={schedule.filter(hour => !hour.ida)} title={(line && line.destino) ?`Saída: ${line.destino}` : ''}/>
              </div>
            </>
          }
          {commentModal && line &&
            <Form action={commentFormAction} className="text-icy-aqua-100 flex flex-col justify-center items-center">
              <p>Envie um comentário sobre a linha ou trajeto para a gestão. Seu comentário pode ser importante para melhorias do serviço!</p>
              <input type="hidden" name="line" value={line?.id} />
              <textarea name="text" id="text" className="w-full h-48 my-2 outline-none bg-space-indigo-600 resize-none"></textarea>
              <button className="bg-icy-aqua-400 py-1 px-3 text-space-indigo-800 rounded-lg">Enviar</button>
            </Form>
          }
        </div>
      </Modal>
    </>
  )
}
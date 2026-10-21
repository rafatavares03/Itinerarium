'use client'

import { use } from 'react';
import { useBusLines } from '../hooks/useBusLines';
import BusLineCard from '../components/busLineCard';
import { useCity } from '../hooks/useCity';
import UserNav from '../components/userNav';
import Link from 'next/link';

export default function City({
  params
}: {
  params: Promise<{city: string}>
}) {
  const { city } = use(params);
  const {cityInfo, loading: cityLoading} = useCity(city);
  const {busLines, setBusLines, loading} = useBusLines(parseInt(city));

  return (
    <>
      <div className="w-full h-[80px] bg-space-indigo-700 flex items-center">
        {cityInfo && 
          <Link href={`/${cityInfo.id}`}
            className="text-center text-dusty-grape-100 text-2xl flex-1 font-bold font-title">
              {`${cityInfo?.nome} - ${cityInfo?.uf}`}
          </Link>
        }
        <UserNav/>
      </div>
      <div className="flex gap-5 w-7xl mx-auto py-5">
        {busLines.map(busLine => (
          <Link href={`/${city}/${busLine.id}`} key={busLine.id}>
            <BusLineCard busLine={busLine}/>
          </Link>
        ))}
      </div>
    </>
  );
}
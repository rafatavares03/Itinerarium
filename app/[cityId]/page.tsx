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
  params: Promise<{cityId: string}>
}) {
  const { cityId } = use(params);
  const {city, loading: cityLoading} = useCity(cityId);
  const {busLines, setBusLines, loading} = useBusLines(parseInt(cityId));

  return (
    <>
      <div className="flex gap-5 w-7xl mx-auto py-5">
        {busLines.map(busLine => (
          <Link href={`/${cityId}/${busLine.id}`} key={busLine.id}>
            <BusLineCard busLine={busLine}/>
          </Link>
        ))}
      </div>
    </>
  );
}
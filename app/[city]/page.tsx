'use client'

import { use } from 'react';
import { useBusLines } from '../hooks/useBusLines';
import BusLineCard from '../components/busLineCard';
import Link from 'next/link';

export default function City({
  params
}: {
  params: Promise<{city: string}>
}) {
  const { city } = use(params);
  const {busLines, setBusLines, loading} = useBusLines(parseInt(city));

  return (
    <div className="flex gap-5">
      {busLines.map(busLine => (
        <Link href={`/${city}/${busLine.id}`} key={busLine.id}>
          <BusLineCard busLine={busLine}/>
        </Link>
      ))}
    </div>
  );
}
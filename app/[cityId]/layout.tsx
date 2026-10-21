// app/[cityId]/layout.tsx
import Link from "next/link";
import UserNav from "@/app/components/userNav";
import { getCityBasicInfoAction } from "@/app/actions/cityActions";
import { getCityAction } from "@/app/actions/cityActions";

interface CityLayoutProps {
  children: React.ReactNode;
  params: Promise<{ cityId: string }>; 
}

export default async function CityLayout({ children, params }: CityLayoutProps) {
  const { cityId } = await params;
  const data = await getCityBasicInfoAction(parseInt(cityId));
  const city = data.data ?? null

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full h-[80px] bg-space-indigo-700 flex items-center px-6">
        <div className="w-full h-[80px] bg-space-indigo-700 flex items-center">
        {city && 
          <Link href={`/${city.id}`}
            className="text-center text-dusty-grape-100 text-2xl flex-1 font-bold font-title">
              {`${city?.nome} - ${city?.uf}`}
          </Link>
        }
        <UserNav/>
      </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
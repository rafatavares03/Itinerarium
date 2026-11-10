import { getCityBasicInfoAction } from "../actions/cityActions";
import Link from "next/link";
import UserNav from "./userNav";
import { auth } from "@/auth";

getCityBasicInfoAction

export default async function Header({
  cityId
}: {
  cityId: string | undefined
}) {
  const session = await auth()
  const id = parseInt(cityId ?? '');
  const data = Number.isNaN(id) ? null : await getCityBasicInfoAction(id);
  const user = session?.user ?? null;
  const city = data?.data ?? null;
  const isAuthenticated = !!session?.user;
  let basePath = "/";
  if(isAuthenticated && user.role !== "USER") {
    basePath += (user.role === "ADMIN") ? "admin/" : "gestao/";
  }
  
  return (
    <header className="w-full h-[80px] bg-space-indigo-700 flex items-center px-6">
      <div className="w-full h-[80px] bg-space-indigo-700 flex items-center relative">
        {city && 
          <Link href={`${basePath}${city.id}`}
            className="text-center text-dusty-grape-100 text-2xl flex-1 font-bold font-title">
              {`${city?.nome} - ${city?.uf}`}
          </Link>
        }
      <div className="absolute right-0">
        <UserNav user={user}/>
      </div>
      </div>
    </header>
  )
}
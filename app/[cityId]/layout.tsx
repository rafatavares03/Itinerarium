import Header from "../components/header";

interface CityLayoutProps {
  children: React.ReactNode;
  params: Promise<{ cityId: string }>; 
}

export default async function CityLayout({ children, params }: CityLayoutProps) {
  const { cityId } = await params;

  return (
    <div className="min-h-screen flex flex-col">
      <Header cityId={cityId}/>

      <main>{children}</main>
    </div>
  );
}
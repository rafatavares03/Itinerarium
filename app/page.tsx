import Header from "./components/header";
import CityCards from "./components/cityCards";

export default function Home() {
  return (
    <>
      <Header cityId={undefined}/>
      <CityCards/>
    </>
  );
}

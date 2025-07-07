import { BackgroundShapes } from "@/components/shared/BackgroundShapes";
import { NavBar } from "@/components/shared/NavBar";


export const HomePage = () => {
    return (
    <div className="relative min-h-screen overflow-hidden bg-gray-100 bg-main">
      <NavBar />
      <div className="pt-16">
        <BackgroundShapes />
      </div>
      <div className="fixed top-0 z-10 flex flex-col items-center justify-center h-screen gap-3 px-4 text-center size-full">
        <p className="text-2xl font-semibold text-gray-800">
            El compte enrere encara no ha començat!
        </p>
        <p className="text-lg text-gray-600">
            Torna més tard per veure els participants i votar.
        </p>
        <a className="px-4 py-2 mt-4 text-white rounded bg-violet-500 hover:bg-violet-700" href="/">
            Refrescar
        </a>
      </div>
    </div>
  );
};
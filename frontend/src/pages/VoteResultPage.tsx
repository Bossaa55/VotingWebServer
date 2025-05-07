import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavBar } from "../components/NavBar";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { BackgroundShapes } from "@/components/BackgroundShapes";


export const VoteResultPage = () => {
  useEffect(() => {
    confetti();
  }, []);

 return (
    <div className="min-h-screen bg-gray-100 bg-main relative overflow-hidden">
      <NavBar />
      <div className="pt-16">
        <BackgroundShapes />
      </div>
      <div className="text-center z-10 fixed top-0 size-full flex items-center justify-center h-screen">
        <Card className="shadow-md w-100">
            <CardHeader className="flex flex-col items-center justify-between gap-4">
                <CardTitle className="text-xl font-semibold">Vot Exitós</CardTitle>
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="size-32 my-5">
                  <circle fill="#05df72" cx="16" cy="16" r="14"/>
                  <circle fill="#05df72" className="bg-green-400 opacity-25" cx="16" cy="16" r="16"/>
                  <g fill="none" strokeWidth="1.5" stroke="#fff" transform="translate(4.37, 4.37) scale(0.97)">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m 4.5,12.75 6,6 9,-13.5" stroke="#fff"/>
                  </g>
                </svg>
                <CardDescription className="text-lg">
                  Has votat per 
                  <span className="text-violet-500"> Name</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-1">
                <p className="text-muted-foreground text-lg">Gràcies per la teva participació!</p>
                <p className="text-muted-foreground text-lg">El teu vot ha estat enregistrat amb èxit.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavBar } from "../components/NavBar";
import { useEffect } from "react";
import confetti from "canvas-confetti";


export const VoteResultPage = () => {
  useEffect(() => {
    confetti();
  }, []);

 return (
    <div className="min-h-screen bg-gray-100 bg-main relative overflow-hidden">
      <NavBar />
      <div className="pt-16">
        <img
          src="/path1.svg"
          className="fixed bottom-0 left-0 w-45 h-auto z-0"
          alt="Background Path"
        />
        <img
          src="/path2.svg"
          className="fixed bottom-0 right-0 w-45 h-auto z-0"
          alt="Background Path"
        />
        <img
          src="/path3.svg"
          className="fixed top-10 left-0 w-45 h-auto z-0"
          alt="Background Path"
        />
        <img
          src="/path4.svg"
          className="fixed top-10 right-0 w-35 h-auto z-0"
          alt="Background Path"
        />
      </div>
      <div className="text-center z-10 fixed top-0 size-full flex items-center justify-center h-screen">
        <Card className="hover:shadow-lg transition-shadow w-100">
            <CardHeader className="flex flex-col items-center justify-between">
                <CardTitle className="text-xl font-semibold">Vot Existos</CardTitle>
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="size-32  ">
                  <circle fill="#00ff00" cx="16" cy="16" r="14.8"/>
                  <circle fill="#00ff00" className="bg-green-400 opacity-25" cx="16" cy="16" r="16"/>
                  <g fill="none" strokeWidth="1.5" stroke="#fff" transform="translate(4.37, 4.37) scale(0.97)">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m 4.5,12.75 6,6 9,-13.5" stroke="#fff"/>
                  </g>
                </svg>
                <CardDescription>Has votat per Name</CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

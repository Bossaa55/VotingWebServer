import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavBar } from "../components/shared/NavBar";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { BackgroundShapes } from "@/components/shared/BackgroundShapes";
import type { Participant } from "@/interface/Participant";


export const VoteResultPage = () => {
  const [participant, setParticipant] = useState<Participant | null>(null);

  useEffect(() => {
    const fetchVoteInfo = async () => {
      try {
        const response = await fetch(`/api/vote-info`);

        if(response.ok) {
          const data = await response.json();
          confetti();
          setParticipant(data);
        }else{
          window.location.href = "/vote";
        }
      } catch (error) {
        console.error("Failed to fetch participants:", error);
      }
    };

    fetchVoteInfo();
  }, []);


 return (
    <div className="min-h-screen bg-gray-100 bg-main relative overflow-hidden">
      <NavBar />
      <div className="pt-16">
        <BackgroundShapes />
      </div>
      <div className="text-center z-10 fixed top-0 size-full flex items-center justify-center h-screen">
            {
              !participant ? (
                  <div role="status">
                      <svg aria-hidden="true" className="size-16 text-gray-300 animate-spin fill-violet-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                      </svg>
                      <span className="sr-only">Loading...</span>
                  </div>
              ) : (
                <Card className="shadow-md w-100">
                    <CardHeader className="flex flex-col items-center justify-between gap-4">
                        <CardTitle className="text-2xl font-semibold">Vot Exitós</CardTitle>
                        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="size-32 my-5">
                          <circle fill="#05df72" cx="16" cy="16" r="14"/>
                          <circle fill="#05df72" className="bg-green-400 opacity-25" cx="16" cy="16" r="16"/>
                          <g fill="none" strokeWidth="1.5" stroke="#fff" transform="translate(4.37, 4.37) scale(0.97)">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m 4.5,12.75 6,6 9,-13.5" stroke="#fff"/>
                          </g>
                        </svg>
                        <CardDescription className="text-lg">
                          Has votat per:
                          <p className="text-violet-500 font-medium text-xl">{participant?.name}</p>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center gap-1">
                        <p className="text-muted-foreground text-lg">Gràcies per la teva participació!</p>
                        <p className="text-muted-foreground text-lg">El teu vot ha estat enregistrat amb èxit.</p>
                    </CardContent>
                </Card>
              )
            }
      </div>
    </div>
  );
};

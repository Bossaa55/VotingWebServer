import { CountdownCard } from "@/components/admin/VotingProcess/cards/CountdownCard";
import { ParticipantListCard } from "@/components/admin/VotingProcess/cards/ParticipantListCard";
import { TotalVotesCard } from "@/components/admin/VotingProcess/cards/TotalVotesCard";
import { CountdownModal } from "@/components/admin/VotingProcess/modals/CountdownModal";
import { ResetModal } from "@/components/admin/VotingProcess/modals/ResetModal";
import { StartCountdownModal } from "@/components/admin/VotingProcess/modals/StartCountdownModal";
import { StopModal } from "@/components/admin/VotingProcess/modals/StopModal";
import { participants as debugParticipants } from "@/components/debug/data";
import { BackgroundShapes } from "@/components/shared/BackgroundShapes";
import { NavBar } from "@/components/shared/NavBar";
import { Card } from "@/components/ui/card";
import type { Participant } from "@/interface/Participant";
import { useState } from "react";

const BottomButtons = ({
  isRunning,
  resetButtonClick,
  startButtonClick,
  stopButtonClick,
}: {
  isRunning: boolean;
  resetButtonClick: () => void;
  startButtonClick: () => void;
  stopButtonClick: () => void;
}) => {
  return (
    <Card className="z-10 grid items-center grid-cols-3 col-span-2 gap-3 px-4">
      {isRunning ? (
        <button
          className="w-full col-span-3 py-2 text-white bg-red-500 rounded hover:bg-blue-600"
          onClick={stopButtonClick}
        >
          Parar
        </button>
      ) : (
        <>
          <button
            className="w-full py-2 text-white bg-red-500 rounded hover:bg-blue-600"
            onClick={resetButtonClick}
          >
            Reiniciar
          </button>
          <button
            className="w-full col-span-2 py-2 text-white rounded bg-violet-500 hover:bg-blue-600"
            onClick={startButtonClick}
          >
            Iniciar
          </button>
        </>
      )}
    </Card>
  );
};

export const AdminVotingProcess = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [participants, setParticipants] =
    useState<Participant[]>(debugParticipants);
  const [timeLeft, setTimeLeft] = useState<number>(120);
  const [isCountdownModalOpen, setIsCountdownModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isStartCountdownModalOpen, setIsStartCountdownModalOpen] =
    useState(false);
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);

  return (
    <div className="flex flex-col items-center h-screen bg-main">
      <BackgroundShapes />
      <NavBar />
      <div className="grid w-full h-full grid-cols-2 gap-4 p-3 grid-rows-8 pt-18">
        <TotalVotesCard totalVotes={0} />
        <CountdownCard
          handleClick={() => setIsCountdownModalOpen(true)}
          timeLeft={timeLeft}
        />
        <ParticipantListCard participants={participants} />
        <BottomButtons
          isRunning={isRunning}
          resetButtonClick={() => setIsResetModalOpen(true)}
          startButtonClick={() => setIsStartCountdownModalOpen(true)}
          stopButtonClick={() => setIsStopModalOpen(true)}
        />
        <CountdownModal
          timeLeft={timeLeft}
          isOpen={isCountdownModalOpen}
          onConfirm={(seconds) => {
            setTimeLeft(seconds);
            setIsCountdownModalOpen(false);
          }}
          onClose={() => setIsCountdownModalOpen(false)}
        />
        <ResetModal
          isOpen={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
        />
        <StartCountdownModal
          isOpen={isStartCountdownModalOpen}
          onClose={() => setIsStartCountdownModalOpen(false)}
          onConfirm={() => {
            setIsRunning(true);
            setIsStartCountdownModalOpen(false);
          }}
        />
        <StopModal
          isOpen={isStopModalOpen}
          onClose={() => setIsStopModalOpen(false)}
          onConfirm={() => {
            setIsRunning(false);
            setIsStopModalOpen(false);
          }}
        />
      </div>
    </div>
  );
};

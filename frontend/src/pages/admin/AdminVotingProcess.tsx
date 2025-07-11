import { CountdownCard } from "@/components/admin/VotingProcess/cards/CountdownCard";
import { ParticipantListCard } from "@/components/admin/VotingProcess/cards/ParticipantListCard";
import { TotalVotesCard } from "@/components/admin/VotingProcess/cards/TotalVotesCard";
import { CountdownModal } from "@/components/admin/VotingProcess/modals/CountdownModal";
import { ResetModal } from "@/components/admin/VotingProcess/modals/ResetModal";
import { StartCountdownModal } from "@/components/admin/VotingProcess/modals/StartCountdownModal";
import { StopModal } from "@/components/admin/VotingProcess/modals/StopModal";
import { BackgroundShapes } from "@/components/shared/BackgroundShapes";
import { NavBar } from "@/components/shared/NavBar";
import { Card } from "@/components/ui/card";
import type { Participant } from "@/interface/Participant";
import { useEffect, useState } from "react";

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
    useState<Participant[] | null>(null);
  const [totalVotes, setTotalVotes] = useState(-1);
  const [timeLeft, setTimeLeft] = useState<number>(-1);
  const [isCountdownModalOpen, setIsCountdownModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isStartCountdownModalOpen, setIsStartCountdownModalOpen] =
    useState(false);
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);

  const fetchCountdownTime = async () => {
    try {
      const response = await fetch(`/api/admin/countdown-time`);

      if(response.ok) {
        const data = await response.json();
        let countdownTime = data.countdown_time;
        setTimeLeft(countdownTime);
      }else{
        console.error("Failed to fetch countdown time");
        setTimeLeft(120);
      }
    } catch (error) {
      console.error("Failed to fetch countdown time:", error);
    }
  }

  const fetchParticipantsStatus = async () => {
    try {
      const response = await fetch(`/api/vote-results`);

      if(response.ok) {
        const data = await response.json();
        let participants = data.participants || [];
        setParticipants(participants);
        setTotalVotes(participants.reduce((sum: any, p: { votes: any; }) => sum + (p.votes || 0), 0));
      }else{
        console.error("Failed to fetch vote results");
        setParticipants([]);
      }
    } catch (error) {
      console.error("Failed to fetch participants:", error);
    }
  }

  useEffect(() => {
    const subscribeToParticipants = () => {
      // Connect directly to your backend server
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const backendHost = 'localhost:8000'; // Change this to your backend server port
      const wsUrl = `${protocol}//${backendHost}/api/admin/subscribe-participants`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("WebSocket connected");
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setParticipants(data.participants || []);
        setTotalVotes(data.participants.reduce((sum: any, p: { votes: any; }) => sum + (p.votes || 0), 0));
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
      };

      // Return cleanup function
      return () => {
        ws.close();
      };
    };

    fetchCountdownTime();
    fetchParticipantsStatus();
    const cleanupWs = subscribeToParticipants();

    // Cleanup on component unmount
    return cleanupWs;
  }, []);

  const handleUpdateCountdownTime = async (seconds: number) => {
    try {
      const formData = new FormData();
      formData.append('seconds', seconds.toString());

      const response = await fetch(`/api/admin/set-countdown`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setTimeLeft(seconds);
        setIsCountdownModalOpen(false);
      } else {
        console.error("Failed to update countdown time");
      }
    } catch (error) {
      console.error("Failed to update countdown time:", error);
    }
  }

  const handleStartCountdown = async () => {
    try {
      const response = await fetch(`/api/admin/toggle-countdown`, {
        method: 'POST',
      });
      if (response.ok) {
        const data = await response.json();
        setIsRunning(data.is_countdown_on);
        setTimeLeft(data.countdown_time);
        setIsStartCountdownModalOpen(false);
      } else {
        console.error("Failed to start countdown");
      }
    } catch (error) {
      console.error("Failed to start countdown:", error);
    }
  };

  const handleStopCountdown = async () => {
    try {
      const response = await fetch(`/api/admin/toggle-countdown`, {
        method: 'POST',
      });
      if (response.ok) {
        const data = await response.json();
        setIsRunning(data.is_countdown_on);
        setTimeLeft(data.countdown_time);
        setIsStopModalOpen(false);
      } else {
        console.error("Failed to start countdown");
      }
    } catch (error) {
      console.error("Failed to start countdown:", error);
    }
  };

  const handleResetVotes = async () => {
    try {
      const response = await fetch(`/api/admin/reset-votes`, {
        method: 'POST',
      });
      if (response.ok) {
        fetchParticipantsStatus();
        setIsResetModalOpen(false);
      } else {
        console.error("Failed to reset votes");
      }
    } catch (error) {
      console.error("Failed to reset votes:", error);
    }
  };

  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft <= 0) {
      setIsRunning(false);
      fetchCountdownTime();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  return (
    <div className="flex flex-col items-center h-screen bg-main">
      <BackgroundShapes />
      <NavBar />
      <div className="grid w-full h-full grid-cols-2 gap-4 p-3 grid-rows-8 pt-18">
        <TotalVotesCard totalVotes={totalVotes} />
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
          onConfirm={(seconds) => handleUpdateCountdownTime(seconds)}
          onClose={() => setIsCountdownModalOpen(false)}
        />
        <ResetModal
          isOpen={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
          onConfirm={() => handleResetVotes()}
        />
        <StartCountdownModal
          isOpen={isStartCountdownModalOpen}
          onClose={() => setIsStartCountdownModalOpen(false)}
          onConfirm={() => handleStartCountdown()}
        />
        <StopModal
          isOpen={isStopModalOpen}
          onClose={() => setIsStopModalOpen(false)}
          onConfirm={() => handleStopCountdown()}
        />
      </div>
    </div>
  );
};

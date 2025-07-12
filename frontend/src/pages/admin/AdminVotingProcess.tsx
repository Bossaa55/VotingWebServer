import { CountdownCard } from "@/components/admin/VotingProcess/cards/CountdownCard";
import { ParticipantListCard } from "@/components/admin/VotingProcess/cards/ParticipantListCard";
import { TotalVotesCard } from "@/components/admin/VotingProcess/cards/TotalVotesCard";
import { BottomButtons } from "@/components/admin/VotingProcess/cards/BottomButtons";
import { CountdownModal } from "@/components/admin/VotingProcess/modals/CountdownModal";
import { ResetModal } from "@/components/admin/VotingProcess/modals/ResetModal";
import { StartCountdownModal } from "@/components/admin/VotingProcess/modals/StartCountdownModal";
import { StopModal } from "@/components/admin/VotingProcess/modals/StopModal";
import { BackgroundShapes } from "@/components/shared/BackgroundShapes";
import { NavBar } from "@/components/shared/NavBar";
import { useCountdown } from "@/hooks/useCountdown";
import { useParticipants } from "@/hooks/useParticipants";
import { useModals } from "@/hooks/useModals";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect } from "react";

export const AdminVotingProcess = () => {
  const {
    isRunning,
    timeLeft,
    setTimeLeft,
    fetchCountdownTime,
    fetchCountdownStatus,
    updateCountdownTime,
    toggleCountdown,
  } = useCountdown();

  const {
    participants,
    totalVotes,
    setParticipants,
    setTotalVotes,
    fetchParticipantsStatus,
    resetVotes,
  } = useParticipants();

  const {
    isCountdownModalOpen,
    setIsCountdownModalOpen,
    isResetModalOpen,
    setIsResetModalOpen,
    isStartCountdownModalOpen,
    setIsStartCountdownModalOpen,
    isStopModalOpen,
    setIsStopModalOpen,
  } = useModals();

  useWebSocket(setParticipants, setTimeLeft, setTotalVotes);

  useEffect(() => {
    fetchCountdownTime();
    fetchParticipantsStatus();
    fetchCountdownStatus();
  }, []);

  const handleUpdateCountdownTime = async (seconds: number) => {
    const success = await updateCountdownTime(seconds);
    if (success) {
      setIsCountdownModalOpen(false);
    }
  };

  const handleStartCountdown = async () => {
    const success = await toggleCountdown();
    if (success) {
      setIsStartCountdownModalOpen(false);
    }
  };

  const handleStopCountdown = async () => {
    const success = await toggleCountdown();
    if (success) {
      setIsStopModalOpen(false);
    }
  };

  const handleResetVotes = async () => {
    const success = await resetVotes();
    if (success) {
      setIsResetModalOpen(false);
    }
  };

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
          onConfirm={handleUpdateCountdownTime}
          onClose={() => setIsCountdownModalOpen(false)}
        />
        <ResetModal
          isOpen={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
          onConfirm={handleResetVotes}
        />
        <StartCountdownModal
          isOpen={isStartCountdownModalOpen}
          onClose={() => setIsStartCountdownModalOpen(false)}
          onConfirm={handleStartCountdown}
        />
        <StopModal
          isOpen={isStopModalOpen}
          onClose={() => setIsStopModalOpen(false)}
          onConfirm={handleStopCountdown}
        />
      </div>
    </div>
  );
};
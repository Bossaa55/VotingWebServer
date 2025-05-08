import VoteConfirmModal from "@/components/vote/VoteConfirmModal";
import { NavBar } from "../components/shared/NavBar";
import { VotingCard } from "@/components/vote/VotingCard";
import { useEffect, useState } from "react";
import { BackgroundShapes } from "@/components/shared/BackgroundShapes";
import { SplashScreen } from "@/components/vote/SplashScreen";
import { participants } from "@/components/debug/data";

export const VotingPage = () => {
  const [selectedParticipant, setSelectedParticipant] = useState<{
    id: string;
    name: string;
    description: string;
  } | null>(null);

  const handleVote = async (id: string) => {
    // Simulate an API call to cast a vote
    return new Promise((resolve) => {
      setTimeout(() => {
      console.log(`Voted for participant with ID: ${id}`);
      resolve(true);
      window.location.href = `/voteresult?participantId=${id}`;
      }, 1000);
    });
  };

  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {

    return;
  }, [isSplashVisible]);

  return isSplashVisible ? (
    <SplashScreen />
  ) : (
    <div className="min-h-screen bg-gray-100 bg-main relative overflow-hidden">
      <NavBar />
      <div className="pt-16">
        <BackgroundShapes />
        <div className="text-center z-10 relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {participants.map((participant) => (
              <VotingCard
                key={participant.id}
                participant={participant}
                onVote={() => setSelectedParticipant(participant)}
              />
            ))}
          </div>
        </div>
      </div>
      {selectedParticipant && (
        <VoteConfirmModal
          participant={selectedParticipant}
          onConfirm={async () => {
            await handleVote(selectedParticipant.id);
            setSelectedParticipant(null);
          }}
          onClose={() => setSelectedParticipant(null)}
          isOpen={!!selectedParticipant}
        />
      )}
    </div>
  );
};

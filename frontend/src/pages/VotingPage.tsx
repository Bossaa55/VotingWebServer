import VoteConfirmModal from "@/components/vote/VoteConfirmModal";
import { NavBar } from "../components/shared/NavBar";
import { VotingCard } from "@/components/vote/VotingCard";
import { useEffect, useState } from "react";
import { BackgroundShapes } from "@/components/shared/BackgroundShapes";
import { SplashScreen } from "@/components/vote/SplashScreen";

export const VotingPage = () => {
  const [selectedParticipant, setSelectedParticipant] = useState<{
    id: string;
    name: string;
    description: string;
  } | null>(null);

  const [participants, setParticipants] = useState<{
    id: string;
    name: string;
    description: string;
    imageUrl: string;
  }[]>([]);

  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch('/api/participants');
        const data = await response.json();
        setParticipants(data.participants);
      } catch (error) {
        console.error("Failed to fetch participants:", error);
        // Fallback to the imported participants if fetch fails
        setParticipants(participants);
      }
    };

    fetchParticipants();
  }, []);

  const handleVote = async (id: string) => {
    return new Promise(async (resolve) => {
      const response = await fetch(`/api/vote/${id}`, {
        method: 'POST'
      });
      if (!response.ok) {
        console.error("Failed to cast vote");
        return;
      }
      resolve(true);
      setHasVoted(true);
      window.location.href = '/voteresult';
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
    <div className="relative h-screen bg-gray-100 bg-main">
      <NavBar />
      <div className="pt-16">
        <BackgroundShapes />
        <div className="relative z-10 text-center">
          <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {
              hasVoted ? (
                <div className="col-span-1 p-6 text-center bg-white rounded-lg shadow-md sm:col-span-2 lg:col-span-3">
                  <p className="text-gray-500">Ja has votat. Gràcies per la teva participació!</p>
                </div>
              ) : (
                participants && participants.length > 0 ? (
                  participants.map((participant) => (
                    <VotingCard
                      key={participant.id}
                      participant={participant}
                      onVote={() => setSelectedParticipant(participant)}
                    />
                  ))
                ) : (
                  <div className="col-span-1 p-6 text-center bg-white rounded-lg shadow-md sm:col-span-2 lg:col-span-3">
                    <p className="text-gray-500">No participants available at the moment.</p>
                  </div>
                )
              )
            }
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

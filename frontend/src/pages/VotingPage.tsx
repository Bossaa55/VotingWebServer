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

  const handleVote = async (id: string) => {
    // Simulate an API call to cast a vote
    return new Promise((resolve) => {
      setTimeout(() => {
      console.log(`Voted for participant with ID: ${id}`);
      resolve(true);
      window.location.href = "/voteresult";
      }, 1000);
    });
  };

  const participants = [
    { id: "1", name: "John Doe", description: "A passionate developer.", imageUrl: "https://www.gravatar.com/avatar/1?d=identicon" },
    { id: "2", name: "Jane Smith", description: "An innovative designer.", imageUrl: "https://www.gravatar.com/avatar/2?d=identicon" },
    { id: "3", name: "Alice Johnson", description: "A creative thinker.", imageUrl: "https://www.gravatar.com/avatar/3?d=identicon" },
    { id: "4", name: "Bob Brown", description: "A tech enthusiast.", imageUrl: "https://www.gravatar.com/avatar/4?d=identicon" },
    { id: "5", name: "Charlie Davis", description: "A problem solver.", imageUrl: "https://www.gravatar.com/avatar/5?d=identicon" },
    { id: "6", name: "Diana Prince", description: "A visionary leader.", imageUrl: "https://www.gravatar.com/avatar/6?d=identicon" },
    { id: "7", name: "Ethan Hunt", description: "An adventurous spirit.", imageUrl: "https://www.gravatar.com/avatar/7?d=identicon" },
    { id: "8", name: "Fiona Apple", description: "A musical genius.", imageUrl: "https://www.gravatar.com/avatar/8?d=identicon" },
    { id: "9", name: "George Clooney", description: "A charismatic actor.", imageUrl: "https://www.gravatar.com/avatar/9?d=identicon" },
    { id: "10", name: "Hannah Montana", description: "A multi-talented artist.", imageUrl: "https://www.gravatar.com/avatar/10?d=identicon" },
  ];

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

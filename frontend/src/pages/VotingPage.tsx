import VoteConfirmModal from "@/components/VoteConfirmModal";
import { NavBar } from "../components/NavBar";
import { VotingCard } from "../components/VotingCard";
import { useState } from "react";

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
    { id: "1", name: "John Doe", description: "A passionate developer." },
    { id: "2", name: "Jane Smith", description: "An innovative designer." },
    { id: "3", name: "Alice Johnson", description: "A creative thinker." },
    { id: "4", name: "Bob Brown", description: "A tech enthusiast." },
    { id: "5", name: "Charlie Davis", description: "A problem solver." },
    { id: "6", name: "Diana Prince", description: "A visionary leader." },
    { id: "7", name: "Ethan Hunt", description: "An adventurous spirit." },
    { id: "8", name: "Fiona Apple", description: "A musical genius." },
    { id: "9", name: "George Clooney", description: "A charismatic actor." },
    {
      id: "10",
      name: "Hannah Montana",
      description: "A multi-talented artist.",
    },
  ];

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
          } }
          onClose={() => setSelectedParticipant(null)} 
          isOpen={!!selectedParticipant}
        />
      )}
    </div>
  );
};

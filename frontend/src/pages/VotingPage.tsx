import VoteConfirmModal from "@/components/vote/VoteConfirmModal";
import { NavBar } from "../components/shared/NavBar";
import { VotingCard } from "@/components/vote/VotingCard";
import { useEffect, useState } from "react";
import { BackgroundShapes } from "@/components/shared/BackgroundShapes";
import { SplashScreen } from "@/components/vote/SplashScreen";
import type { Participant } from "@/interface/Participant";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import confetti from "canvas-confetti";

const ParticipantsList = ({
  participants,
  setSelectedParticipant,
}: {
  participants: Participant[];
  setSelectedParticipant: (participant: Participant | null) => void;
}) => {
  return (
    <div className="relative z-10 text-center">
      <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {participants && participants.length > 0 ? (
          participants.map((participant) => (
            <VotingCard
              key={participant.id}
              participant={participant}
              onVote={() => setSelectedParticipant(participant)}
            />
          ))
        ) : (
          <div className="col-span-1 p-6 text-center bg-white rounded-lg shadow-md sm:col-span-2 lg:col-span-3">
            <p className="text-gray-500">
              No participants available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const VoteResultCard = ({
  participant,
}: {
  participant: Participant | null;
}) => {
  return (
    <Card className="w-full mx-4 shadow-md sm:w-100">
      <CardHeader className="flex flex-col items-center justify-between gap-4">
        <CardTitle className="text-2xl font-semibold">Vot Exitós</CardTitle>
        <svg
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
          className="my-5 size-32"
        >
          <circle fill="#05df72" cx="16" cy="16" r="14" />
          <circle
            fill="#05df72"
            className="bg-green-400 opacity-25"
            cx="16"
            cy="16"
            r="16"
          />
          <g
            fill="none"
            strokeWidth="1.5"
            stroke="#fff"
            transform="translate(4.37, 4.37) scale(0.97)"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m 4.5,12.75 6,6 9,-13.5"
              stroke="#fff"
            />
          </g>
        </svg>
        <CardDescription className="text-lg">
          Has votat per:
          <p className="text-xl font-medium text-violet-500">
            {participant?.name}
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-1">
        <p className="text-lg text-muted-foreground">
          Gràcies per la teva participació!
        </p>
        <p className="text-lg text-muted-foreground">
          El teu vot ha estat enregistrat amb èxit.
        </p>
      </CardContent>
    </Card>
  );
};

export const VotingPage = () => {
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);

  const [participants, setParticipants] = useState<Participant[]>([]);

  const [hasVoted, setHasVoted] = useState(false);
  const [votedParticipant, setVotedParticipant] = useState<Participant | null>(
    null
  );

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch("/api/participants");
        const data = await response.json();
        setParticipants(data.participants);
      } catch (error) {
        console.error("Failed to fetch participants:", error);
      }
    };

    const fetchVoteInfo = async () => {
      try {
        const response = await fetch(`/api/vote-info`);

        if (response.ok) {
          const data = await response.json();
          confetti();
          setVotedParticipant(data);
          setHasVoted(true);
        } else {
        }
      } catch (error) {
        console.error("Failed to fetch participants:", error);
      }
    };

    fetchVoteInfo();
    fetchParticipants();
  }, []);

  const handleVote = async (id: string) => {
    return new Promise(async (resolve) => {
      const response = await fetch(`/api/vote/${id}`, {
        method: "POST",
      });
      if (!response.ok) {
        console.error("Failed to cast vote");
        return;
      }
      resolve(true);
      setHasVoted(true);
      setVotedParticipant(participants.find((p) => p.id === id) || null);
      confetti();
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

  return isSplashVisible && !hasVoted ? (
    <SplashScreen />
  ) : (
    <div
      className={`relative ${
        hasVoted ? "h-dvh" : "h-screen"
      } bg-gray-100 bg-main`}
    >
      <NavBar />
      {!hasVoted ? (
        <div className="pt-16">
          <BackgroundShapes />

          <ParticipantsList
            participants={participants}
            setSelectedParticipant={setSelectedParticipant}
          />
        </div>
      ) : (
        <>
          <div className="pt-16">
            <BackgroundShapes />
          </div>
          <div className="w-full h-full fixed top-0 flex items-center justify-center">
            <VoteResultCard participant={votedParticipant} />
          </div>
        </>
      )}
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

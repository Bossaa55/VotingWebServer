import { motion } from "motion/react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { Participant } from "@/interface/Participant";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

export const VotingCard = ({
  participant,
  onVote,
}: {
  participant: Participant;
  onVote: (id: string) => void;
}) => {
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async () => {
    setIsVoting(true);
    try {
      await onVote(participant.id);
    } catch (error) {
      console.error("Failed to cast vote", error);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Card className="shadow-md">
        <CardHeader className="flex flex-col items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {participant.name}
          </CardTitle>
          <img
            src={participant.imageUrl}
            alt="Contestant"
            className="object-cover mr-4 rounded-full size-24 aspect-square"
          />
        </CardHeader>
        <CardContent>
          <Button onClick={handleVote} disabled={isVoting} className="w-full">
            {isVoting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Votant...
              </>
            ) : (
              "Votar"
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

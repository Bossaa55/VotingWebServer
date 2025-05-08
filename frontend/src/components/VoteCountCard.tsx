import type { Participant } from "@/interface/Participant";
import { Card } from "./ui/card";

export const VoteCoutCard = ({ participant }: { participant: Participant;}) => {
    return(
        <Card className="z-10">
            <div className="flex items-center px-6 gap-6">
                <img src="https://placehold.co/150" alt="Contestant" className="w-12 h-12 rounded-full" />
                <div className="flex justify-between w-full">
                    <span>{participant.name}</span>
                    <span>{participant.votes}</span>
                </div>
            </div>
        </Card>
    );
}
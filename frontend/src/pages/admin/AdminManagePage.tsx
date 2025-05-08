import { IconCard } from "@/components/admin/IconCard";
import { BackgroundShapes } from "@/components/shared/BackgroundShapes"
import { NavBar } from "@/components/shared/NavBar"
import { Card, CardContent } from "@/components/ui/card";
import type { Participant } from "@/interface/Participant";

const ParticipantCard = ({ participant }: { participant: Participant;}) => {
    return(
        <Card className="shadow-md w-96 z-10">
            <CardContent className="flex items-center px-4 gap-4 h-14">
                <img src="https://placehold.co/150" alt="Contestant" className="w-auto h-full rounded-full" />
                <div className="flex justify-between w-full">
                    <span className="text-xl">{participant.name}</span>
                    <button onClick={() => alert(`Edit ${participant.name}`)} className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.213l-4.5 1.125 1.125-4.5L16.862 3.487z" />
                        </svg>
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}

export const AdminManagePage = () => {
    const participants = [
        { id: "1", name: "John Doe", description: "A passionate developer." },
        { id: "2", name: "Jane Smith", description: "An innovative designer." },
        { id: "3", name: "Alice Johnson", description: "A creative thinker." },
      ];

    return(
        <div className="min-h-screen bg-gray-100 bg-main relative overflow-hidden">
            <NavBar />
            <div className="pt-16">
                <BackgroundShapes />
                <div className="flex flex-col gap-4 p-4">
                    {participants.map((participant) => (
                        <ParticipantCard
                        key={participant.id}
                        participant={participant}
                        />
                    ))}

                    <IconCard
                        title="Add Contestant"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="h-full stroke-violet-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>}
                        onClick={() => window.location.href = "/admin/manage/add"} description={""}                    />
                </div>
            </div>
        </div>
    )
}
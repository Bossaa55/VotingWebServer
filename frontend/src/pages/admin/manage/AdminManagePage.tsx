import { AdminNavBar } from "@/components/admin/AdminNavBar";
import { IconCard } from "@/components/admin/IconCard";
import { BackgroundShapes } from "@/components/shared/BackgroundShapes"
import { Card, CardContent } from "@/components/ui/card";
import type { Participant } from "@/interface/Participant";

const ParticipantCard = ({ participant }: { participant: Participant;}) => {
    return(
        <Card className="shadow-md w-96 z-10">
            <CardContent className="flex items-center px-4 gap-4 h-14">
                <img src={participant.imageUrl} alt="Contestant" className="w-auto h-full rounded-full" />
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
        { id: "1", name: "John Doe", description: "A passionate developer.", imageUrl: "https://www.gravatar.com/avatar/1?d=identicon", votes: Math.floor(Math.random() * 100) },
        { id: "2", name: "Jane Smith", description: "An innovative designer.", imageUrl: "https://www.gravatar.com/avatar/2?d=identicon", votes: Math.floor(Math.random() * 100) },
        { id: "3", name: "Alice Johnson", description: "A creative thinker.", imageUrl: "https://www.gravatar.com/avatar/3?d=identicon", votes: Math.floor(Math.random() * 100) },
        { id: "4", name: "Bob Brown", description: "A tech enthusiast.", imageUrl: "https://www.gravatar.com/avatar/4?d=identicon", votes: Math.floor(Math.random() * 100) },
      ];

    return(
        <div className="min-h-screen bg-gray-100 bg-main relative overflow-hidden">
            <AdminNavBar
                onBack={() => window.location.href = "/admin"}
            />

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
                        onClick={() => window.location.href = "/admin/manage/create"} description={""}                    />
                </div>
            </div>
        </div>
    )
}
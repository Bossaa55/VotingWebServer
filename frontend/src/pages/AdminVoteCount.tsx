import { BackgroundShapes } from "@/components/BackgroundShapes"
import { NavBar } from "@/components/NavBar"
import { VoteCoutCard } from "@/components/VoteCountCard";

export const AdminVoteCount = () => {
    const participants = [
        { id: "1", name: "John Doe", description: "A passionate developer.", votes: 10 },
        { id: "2", name: "Jane Smith", description: "An innovative designer.", votes: 10 },
        { id: "3", name: "Alice Johnson", description: "A creative thinker.", votes: 10 },
        { id: "4", name: "Bob Brown", description: "A tech enthusiast.", votes: 10 },
        { id: "5", name: "Charlie Davis", description: "A problem solver.", votes: 10 },
        { id: "6", name: "Diana Prince", description: "A visionary leader.", votes: 10 },
        { id: "7", name: "Ethan Hunt", description: "An adventurous spirit.", votes: 10 },
        { id: "8", name: "Fiona Apple", description: "A musical genius.", votes: 10 },
        { id: "9", name: "George Clooney", description: "A charismatic actor.", votes: 10 },
        {id: "10", name: "Hannah Montana", description: "A multi-talented artist.", votes: 10},
      ];

    return(
        <div className="min-h-screen bg-gray-100 bg-main relative overflow-hidden">
            <NavBar />
            <div className="pt-16">
                <BackgroundShapes />
                <div className="flex flex-col gap-4 p-4">
                    {participants.map((participant) => (
                        <VoteCoutCard
                        key={participant.id}
                        participant={participant}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
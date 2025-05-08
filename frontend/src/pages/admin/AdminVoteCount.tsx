import { BackgroundShapes } from "@/components/shared/BackgroundShapes"
import { VoteCoutCard } from "@/components/admin/VoteCountCard";
import { AdminNavBar } from "@/components/admin/AdminNavBar";

export const AdminVoteCount = () => {
    const participants = [
        { id: "1", name: "John Doe", description: "A passionate developer.", imageUrl: "https://www.gravatar.com/avatar/1?d=identicon", votes: Math.floor(Math.random() * 100) },
        { id: "2", name: "Jane Smith", description: "An innovative designer.", imageUrl: "https://www.gravatar.com/avatar/2?d=identicon", votes: Math.floor(Math.random() * 100) },
        { id: "3", name: "Alice Johnson", description: "A creative thinker.", imageUrl: "https://www.gravatar.com/avatar/3?d=identicon", votes: Math.floor(Math.random() * 100) },
        { id: "4", name: "Bob Brown", description: "A tech enthusiast.", imageUrl: "https://www.gravatar.com/avatar/4?d=identicon", votes: Math.floor(Math.random() * 100) },
        { id: "5", name: "Charlie Davis", description: "A problem solver.", imageUrl: "https://www.gravatar.com/avatar/5?d=identicon", votes: Math.floor(Math.random() * 100) },
        { id: "6", name: "Diana Prince", description: "A visionary leader.", imageUrl: "https://www.gravatar.com/avatar/6?d=identicon", votes: Math.floor(Math.random() * 100) },
        { id: "7", name: "Ethan Hunt", description: "An adventurous spirit.", imageUrl: "https://www.gravatar.com/avatar/7?d=identicon", votes: Math.floor(Math.random() * 100) },
        { id: "8", name: "Fiona Apple", description: "A musical genius.", imageUrl: "https://www.gravatar.com/avatar/8?d=identicon", votes: Math.floor(Math.random() * 100) },
        { id: "9", name: "George Clooney", description: "A charismatic actor.", imageUrl: "https://www.gravatar.com/avatar/9?d=identicon", votes: Math.floor(Math.random() * 100) },
        { id: "10", name: "Hannah Montana", description: "A multi-talented artist.", imageUrl: "https://www.gravatar.com/avatar/10?d=identicon", votes: Math.floor(Math.random() * 100) },
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
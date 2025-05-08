import { BackgroundShapes } from "@/components/shared/BackgroundShapes"
import { VoteCoutCard } from "@/components/admin/VoteCountCard";
import { AdminNavBar } from "@/components/admin/AdminNavBar";
import { participants } from "@/components/debug/data";

export const AdminVoteCount = () => {
    return(
        <div className="min-h-screen bg-gray-100 bg-main relative overflow-hidden">
            <AdminNavBar
                onBack={() => window.location.href = "/admin"}
            />
            <div className="pt-16">
                <BackgroundShapes />
                <div className="flex flex-col gap-4 p-4">
                    {participants
                        .sort((a, b) => b.votes - a.votes)
                        .map((participant) => (
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
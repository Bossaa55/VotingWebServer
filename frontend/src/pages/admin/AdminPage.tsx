import { IconCard } from "@/components/admin/IconCard";
import { BackgroundShapes } from "@/components/shared/BackgroundShapes";
import { NavBar } from "@/components/shared/NavBar";
import { Card } from "@/components/ui/card";
import { useState } from "react";

const CountdownCard = () => {
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    const startCountdown = () => {
        setTimeLeft(minutes * 60 + seconds);
    };

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMinutes(Number(e.target.value));
    };

    const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSeconds(Number(e.target.value));
    };

    return (
        <Card className="shadow-md w-96 z-10 px-4 flex flex-col justify-between">
            <h1 className="text-2xl font-semibold text-center">Procés de Votació</h1>
            <div className="flex items-center justify-center gap-2 mt-4">
                <input
                    type="number"
                    value={minutes}
                    onChange={handleMinutesChange}
                    className="w-16 p-2 text-xl text-center border rounded"
                    placeholder="Minutes"
                />
                <span>:</span>
                <input
                    type="number"
                    value={seconds}
                    onChange={handleSecondsChange}
                    className="w-16 p-2 text-xl text-center border rounded"
                    placeholder="Seconds"
                />
            </div>
            <button
                onClick={startCountdown}
                className="w-full py-2 text-white bg-violet-500 rounded hover:bg-blue-600"
            >
                Iniciar Compte Enrere
            </button>
            {timeLeft !== null && (
                <div className="mt-4 text-lg font-semibold">
                    Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}
                </div>
            )}
        </Card>
    );
};


export const AdminPage = () => {
    const goToManageParticipants = () => {
        window.location.href = "/admin/manage";
    }
    const goToVoteResults = () => {
        window.location.href = "/admin/votecount";
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-main">
            <BackgroundShapes />
            <NavBar />
            <div className="flex flex-col items-center justify-center w-full h-full gap-4">

                <CountdownCard />

                <IconCard
                    className="cursor-pointer"
                    title="Administrar Participants"
                    description="Add, remove or edit participants"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="h-full stroke-violet-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                        </svg>
                    }
                    onClick={goToManageParticipants}
                />
                <IconCard
                    className="cursor-pointer"
                    title="Results de Votacions"
                    description="View the vote results"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" className="h-full stroke-violet-500">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                        </svg>
                    }
                    onClick={goToVoteResults}
                />
            </div>
        </div>
    );
}
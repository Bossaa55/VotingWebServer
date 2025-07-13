import { AdminNavBar } from "@/components/admin/AdminNavBar";
import { IconCard } from "@/components/admin/IconCard";
import { BackgroundShapes } from "@/components/shared/BackgroundShapes";
import { Card, CardContent } from "@/components/ui/card";
import type { Participant } from "@/interface/Participant";
import { useEffect, useState } from "react";

const ParticipantCard = ({ participant }: { participant: Participant }) => {
  return (
    <Card className="z-10 py-2 shadow-md w-96">
      <CardContent className="flex items-center h-24 gap-4 px-4">
        <img
          src={participant.imageUrl}
          alt="Contestant"
          className="object-cover rounded-full size-16 aspect-square"
        />
        <div className="flex justify-between w-full">
          <span className="text-xl">{participant.name}</span>
          <a
            href={`/admin/manage/edit?p=${participant.id}`}
            className="text-gray-500 cursor-pointer hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.213l-4.5 1.125 1.125-4.5L16.862 3.487z"
              />
            </svg>
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export const AdminManagePage = () => {
  const [participants, setParticipants] = useState<Array<Participant> | null>(
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

    fetchParticipants();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-100 bg-main">
      <AdminNavBar onBack={() => (window.location.href = "/admin")} />
      <div className="pt-16">
        <BackgroundShapes />
        {participants === null ? (
          <div className="absolute top-0 left-0 flex items-center justify-center w-full h-screen">
            <div role="status">
              <svg
                aria-hidden="true"
                className="text-gray-300 size-16 animate-spin fill-violet-500"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 p-4">
            {participants != undefined &&
              participants.length > 0 &&
              participants.map((participant) => (
                <ParticipantCard
                  key={participant.id}
                  participant={participant}
                />
              ))}

            <IconCard
              className="cursor-pointer"
              title="Add Contestant"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  className="h-full stroke-violet-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              }
              onClick={() => (window.location.href = "/admin/manage/create")}
              description={""}
            />
          </div>
        )}
      </div>
    </div>
  );
};

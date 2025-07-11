import { Spinner } from "@/components/shared/Spinner";
import { Card } from "@/components/ui/card";
import type { Participant } from "@/interface/Participant";

const ParticipantItem = ({ participant, position }: { participant: Participant, position: number }) => {
  return (
    <li className="py-3 sm:py-4">
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <div className="inline-flex items-center w-4 text-base font-semibold text-gray-900 dark:text-white">
          {position}
        </div>
        <div className="shrink-0">
          <img
            className="w-8 h-8 rounded-full"
            src={participant.imageUrl}
            alt={participant.name}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
            {participant.name}
          </p>
        </div>
        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
          {participant.votes}
        </div>
      </div>
    </li>
  );
};

export const ParticipantListCard = ({
  participants,
}: {
  participants: Participant[] | null;
}) => {
  return (
    <Card className="z-10 flex flex-col items-center h-full col-span-2 row-span-5 px-4 py-1 overflow-y-auto">
      {participants === null ? (
        <div className="flex items-center justify-center w-full h-full">
          <Spinner />
        </div>
      ) : (
        <ul className="w-full divide-y divide-gray-200 dark:divide-gray-700">
          <li className="py-1">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="text-sm font-bold text-gray-900 truncate w-15">Posició</div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 truncate">Nom</p>
              </div>
              <div className="text-sm font-bold text-gray-900 truncate">Vots</div>
            </div>
          </li>
          {participants.map((participant, index) => (
            <ParticipantItem key={participant.id} participant={participant} position={index + 1} />
          ))}
        </ul>
      )}
    </Card>
  );
};

import { Spinner } from "@/components/shared/Spinner";
import { Card } from "@/components/ui/card";

export const TotalVotesCard = ({ totalVotes }: { totalVotes: number }) => {
  return (
    <Card className="z-10 flex flex-col items-center justify-center w-full h-full row-span-2 p-2 sm:p-4 place-self-end lg:w-100">
      {totalVotes < 0 ? (
        <Spinner />
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full space-y-1">
          <div className="flex items-center justify-center text-3xl rounded-full size-16 sm:size-20 bg-violet-500/30 text-violet-600">
            {totalVotes}
          </div>
          <h1 className="font-semibold text-center text-md sm:text-xl">Vots Totals</h1>
        </div>
      )}
    </Card>
  );
};
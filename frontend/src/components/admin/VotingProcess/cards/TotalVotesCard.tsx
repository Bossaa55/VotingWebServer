import { Spinner } from "@/components/shared/Spinner";
import { Card } from "@/components/ui/card";

export const TotalVotesCard = ({ totalVotes }: { totalVotes: number }) => {
  return (
    <Card className="z-10 flex flex-col items-center justify-center row-span-2 px-4">
      {totalVotes < 0 ? (
        <Spinner />
      ) : (
        <>
          <div className="flex items-center justify-center text-3xl rounded-full size-24 bg-violet-500/30 text-violet-600">
            {totalVotes}
          </div>
          <h1 className="text-xl font-semibold text-center">Vots Totals</h1>
        </>
      )}
    </Card>
  );
};
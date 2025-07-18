import { Spinner } from "@/components/shared/Spinner";
import { Card } from "@/components/ui/card";

export const CountdownCard = ({
  handleClick,
  timeLeft,
}: {
  handleClick: () => void;
  timeLeft: number;
}) => {
  return (
    <Card
      className="z-10 flex flex-col items-center justify-center w-full h-full row-span-2 px-4 place-self-start lg:w-100"
      onClick={handleClick}
    >
      {timeLeft < 0 ? (
        <Spinner />
      ) : (
        <>
          <div className="flex items-center justify-center h-24 px-5 text-3xl rounded">
            {`${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}`}
          </div>
          <h1 className="text-xl font-semibold text-center">Compte enrere</h1>
        </>
      )}
    </Card>
  );
};
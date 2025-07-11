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
      className="z-10 flex flex-col items-center row-span-2 px-4"
      onClick={handleClick}
    >
      <div className="flex items-center justify-center h-24 px-5 text-3xl rounded">
        {`${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}`}
      </div>
      <h1 className="text-xl font-semibold text-center">Compte enrere</h1>
    </Card>
  );
};
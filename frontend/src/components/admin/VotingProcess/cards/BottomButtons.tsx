import { Card } from "@/components/ui/card";

interface BottomButtonsProps {
  isRunning: boolean | null;
  resetButtonClick: () => void;
  startButtonClick: () => void;
  stopButtonClick: () => void;
}

export const BottomButtons = ({
  isRunning,
  resetButtonClick,
  startButtonClick,
  stopButtonClick,
}: BottomButtonsProps) => {
  return (
    <Card className="z-10 grid items-center w-full grid-cols-3 col-span-2 gap-3 px-4 py-3 sm:w-128 place-self-center">
      {isRunning ? (
        <button
          className="w-full col-span-3 py-2 text-white bg-red-500 rounded hover:bg-blue-600"
          onClick={stopButtonClick}
          disabled={isRunning === null}
        >
          Parar
        </button>
      ) : (
        <>
          <button
            className="w-full py-2 text-white bg-red-500 rounded hover:bg-blue-600"
            onClick={resetButtonClick}
            disabled={isRunning === null}
          >
            Reiniciar
          </button>
          <button
            className="w-full col-span-2 py-2 text-white rounded bg-violet-500 hover:bg-blue-600"
            onClick={startButtonClick}
            disabled={isRunning === null}
          >
            Iniciar
          </button>
        </>
      )}
    </Card>
  );
};
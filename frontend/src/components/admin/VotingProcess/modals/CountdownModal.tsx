import { Modal } from "@/components/shared/Modal";
import { useEffect, useState } from "react";

export const CountdownModal = ({
  timeLeft,
  isOpen,
  onClose,
  onConfirm,
}: {
  timeLeft: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (seconds: number) => void;
}) => {
  const [minutes, setMinutes] = useState(
    timeLeft ? Math.floor(timeLeft / 60) : 0
  );
  const [seconds, setSeconds] = useState(timeLeft ? timeLeft % 60 : 0);

  useEffect(() => {
    setMinutes(timeLeft ? Math.floor(timeLeft / 60) : 0);
    setSeconds(timeLeft ? timeLeft % 60 : 0);
  }, [timeLeft]);

  return (
    <Modal isOpen={isOpen}>
      <h2 className="mb-4 text-lg font-semibold text-center">
        Configurar Compte Enrere
      </h2>
      <div className="flex flex-row items-center justify-center gap-4 py-5 mb-4">
        <input
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          className="w-16 p-2 text-xl text-center border rounded"
          placeholder="Minutes"
        />
        <span>:</span>
        <input
          type="number"
          value={seconds}
          onChange={(e) => setSeconds(Number(e.target.value))}
          className="w-16 p-2 text-xl text-center border rounded"
          placeholder="Seconds"
        />
      </div>
      <div className="flex gap-4 mt-6">
        <button
          onClick={onClose}
          className="w-full text-gray-600 bg-gray-200 rounded-md"
        >
          Cancelar
        </button>
        <button
          onClick={() => {
            onConfirm(minutes * 60 + seconds);
          }}
          className="w-full px-5 py-2 text-white bg-purple-500 rounded-md"
        >
          Guardar
        </button>
      </div>
    </Modal>
  );
};

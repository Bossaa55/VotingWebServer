import { Modal } from "@/components/shared/Modal";

export const StartCountdownModal = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  return (
    <Modal isOpen={isOpen}>
      <h2 className="mb-4 text-lg font-semibold text-center">
        Segur que voleu iniciar el compte enrere?
      </h2>
      <div className="flex flex-row items-center justify-center gap-4 py-5 mb-4">
        <p className="text-center text-gray-700">
          El compte enrere iniciarà i els usuaris podran votar durant aquest temps.
        </p>
      </div>
      <div className="flex gap-4 mt-6">
        <button
          onClick={onClose}
          className="w-full text-gray-600 bg-gray-200 rounded-md"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="w-full px-5 py-2 text-white rounded-md bg-violet-500"
        >
          Confirmar
        </button>
      </div>
    </Modal>
  );
}
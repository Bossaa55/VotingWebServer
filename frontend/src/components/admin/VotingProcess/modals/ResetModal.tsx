import { Modal } from "@/components/shared/Modal";

export const ResetModal = ({
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
        Segur que voleu reiniciar les votacions?
      </h2>
      <div className="flex flex-row items-center justify-center gap-4 py-5 mb-4">
        <p className="text-center text-gray-700">
          Totes les votacions es reiniciaran i es perdran els resultats actuals.
        </p>
      </div>
      <div className="flex gap-4 mt-6">
        <button
          onClick={onClose}
          className="w-full text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="w-full px-5 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
        >
          Confirmar
        </button>
      </div>
    </Modal>
  );
};

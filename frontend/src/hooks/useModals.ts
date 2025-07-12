import { useState } from 'react';

export const useModals = () => {
  const [isCountdownModalOpen, setIsCountdownModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isStartCountdownModalOpen, setIsStartCountdownModalOpen] = useState(false);
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);

  return {
    isCountdownModalOpen,
    setIsCountdownModalOpen,
    isResetModalOpen,
    setIsResetModalOpen,
    isStartCountdownModalOpen,
    setIsStartCountdownModalOpen,
    isStopModalOpen,
    setIsStopModalOpen,
  };
};
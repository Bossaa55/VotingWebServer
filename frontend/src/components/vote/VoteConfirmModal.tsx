import React, { useEffect } from 'react';
import type { Participant } from "@/interface/Participant";
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface VoteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    participant: Participant;
}

const modalVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeInOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeInOut" } } 
};

const modalBackgroundVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } },
    exit: { opacity: 0, transition: { duration: 0.2, ease: "easeInOut" } } 
};

const VoteConfirmModal: React.FC<VoteConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    participant,
}) => {
    // Prevent background scrolling when the modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const [isVoting, setIsVoting] = React.useState(false);

    const handleConfirm = () => {
        setIsVoting(true);
        onConfirm();
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={modalBackgroundVariants}
                    className="fixed inset-0 z-50 flex items-center justify-center"
                >
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={modalVariants}
                        className="bg-white rounded-lg shadow-2xl p-6 m-4 relative z-10 w-full max-w-md"
                    >
                        <h2 className="text-center text-lg font-semibold mb-4">Confirmar Vot</h2>
                        <div className="flex flex-col items-center gap-4 mb-4">
                            <img
                                src={participant.imageUrl}
                                alt="Contestant"
                                className="w-24 h-24 rounded-full"
                            />
                            <p className="text-gray-700">
                                Estàs segur que vols votar a <span className="font-semibold">{participant.name}</span>?
                            </p>
                        </div>
                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={onClose}
                                className="w-full bg-gray-200 text-gray-600 rounded-md"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="w-full bg-purple-500 text-white px-5 py-2 rounded-md"
                            >
                                {isVoting ? (
                                <span className="flex items-center justify-center">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Confirmant...
                                </span>
                                ) : (
                                    'Confirmar')}   
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default VoteConfirmModal;

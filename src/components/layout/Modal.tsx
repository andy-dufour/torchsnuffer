import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-bg-secondary rounded-t-2xl sm:rounded-2xl w-full max-w-[480px] p-6 animate-[slide-up_300ms_ease-out] max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

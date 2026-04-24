import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ open, title, onClose, children, footer }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-ink/30 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-card shadow-card-hover w-full max-w-md border border-card-border"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-card-border">
          <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-tag text-gray-400 hover:text-gray-600 hover:bg-card transition-all duration-150"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && (
          <div className="px-6 pb-6 flex gap-3 justify-end">{footer}</div>
        )}
      </div>
    </div>
  );
}

interface ConfirmModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  children: ReactNode;
}

export function ConfirmModal({
  open,
  title,
  onClose,
  onConfirm,
  loading = false,
  children,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={onConfirm} loading={loading}>
            Confirmar
          </Button>
        </>
      }
    >
      {children}
    </Modal>
  );
}

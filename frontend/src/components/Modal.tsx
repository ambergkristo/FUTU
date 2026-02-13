import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  closeOnBackdrop?: boolean; // default true
  closeOnEsc?: boolean;      // default true
  maxWidthClassName?: string; // default "max-w-3xl"
  showCloseButton?: boolean;  // default true
};

const Modal: React.FC<ModalProps> = ({
  open,
  title,
  onClose,
  children,
  closeOnBackdrop = true,
  closeOnEsc = true,
  maxWidthClassName = "max-w-3xl",
  showCloseButton = true
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const previousScrollYRef = useRef(0);

  // Focus management
  useEffect(() => {
    if (open) {
      // Store current focus
      const activeElement = document.activeElement;
      previousFocusRef.current = activeElement instanceof HTMLElement ? activeElement : null;

      // Focus close button
      setTimeout(() => {
        if (showCloseButton) {
          closeButtonRef.current?.focus();
        }
      }, 100);

      // Prevent body scroll while preserving current scroll position.
      previousScrollYRef.current = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${previousScrollYRef.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
    } else {
      // Restore focus
      if (previousFocusRef.current) {
        previousFocusRef.current.focus({ preventScroll: true });
      }

      // Restore body scroll
      const topValue = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';

      const parsedTop = Number.parseInt(topValue || '0', 10);
      const restoreY = Number.isNaN(parsedTop) ? previousScrollYRef.current : Math.abs(parsedTop);
      window.scrollTo(0, restoreY);
    }

    return () => {
      if (!open) return;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
    };
  }, [open, showCloseButton]);

  // ESC key handler
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open && closeOnEsc) {
        onClose();
      }
    };

    if (open && closeOnEsc) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, closeOnEsc, onClose]);

  // Click outside handler
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (closeOnBackdrop && event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
            onClick={handleBackdropClick}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              duration: 0.2
            }}
            className={`relative w-full ${maxWidthClassName} max-h-[90vh] overflow-y-auto bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl shadow-2xl shadow-cyan-500/10`}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
                {title && (
                  <h2 className="text-2xl font-bold text-cyan-400">{title}</h2>
                )}
                {showCloseButton && (
                  <button
                    ref={closeButtonRef}
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors"
                    aria-label="Sulge"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className={title || showCloseButton ? "p-6" : "p-0"}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;

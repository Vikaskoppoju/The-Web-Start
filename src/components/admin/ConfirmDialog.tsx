"use client";
import { m, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  danger?: boolean;
}

export function ConfirmDialog({ open, title, message, confirmLabel = "Confirm", onConfirm, onCancel, loading, danger = true }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <m.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onCancel}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <m.div
              className="glass-strong rounded-2xl p-6 w-full max-w-sm border border-white/15 shadow-glass-lg"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <button onClick={onCancel} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${danger ? "bg-red-500/15" : "bg-purple-500/15"}`}>
                <AlertTriangle className={`w-6 h-6 ${danger ? "text-red-400" : "text-purple-400"}`} />
              </div>
              <h3 className="font-display font-bold text-white text-lg mb-2">{title}</h3>
              <p className="text-gray-400 text-sm mb-6">{message}</p>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={onCancel} className="flex-1 justify-center border border-white/10">Cancel</Button>
                <Button
                  onClick={onConfirm}
                  loading={loading}
                  className="flex-1 justify-center"
                  variant={danger ? "danger" : "primary"}
                >
                  {confirmLabel}
                </Button>
              </div>
            </m.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

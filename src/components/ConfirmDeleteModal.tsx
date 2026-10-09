'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  ticketNo: string;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export default function ConfirmDeleteModal({
  isOpen,
  ticketNo,
  onClose,
  onConfirm,
  title = 'ยืนยันการลบคำร้อง',
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 no-print"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150 p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Centered Trash Icon */}
        <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto mb-3 shadow-xs">
          <Trash2 className="w-7 h-7 text-rose-600" />
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 leading-tight">
          {title}
        </h3>

        {/* Ticket Badge */}
        {ticketNo && (
          <div className="inline-block px-3 py-1 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 font-bold font-eng text-xs mt-2.5">
            {ticketNo}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm shadow-rose-600/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>ยืนยันลบ</span>
          </button>
        </div>
      </div>
    </div>
  );
}

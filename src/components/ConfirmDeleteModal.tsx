'use client';

import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

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
  description = 'ระบบจะลบข้อมูลออกจากฐานข้อมูล และลบไฟล์รูปภาพใน Google Drive โดยอัตโนมัติเพื่อประหยัดเนื้อที่',
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 no-print"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Red Warning Accent */}
        <div className="bg-rose-50 border-b border-rose-100 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">{title}</h3>
              <p className="text-[11px] text-rose-600 font-semibold font-eng mt-0.5">{ticketNo}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-3 text-xs">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-start gap-2.5">
            <Trash2 className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
            <p className="text-slate-600 leading-relaxed text-[11px]">
              {description}
            </p>
          </div>

          <p className="text-slate-500 text-[11px]">
            ⚠️ การดำเนินการนี้<strong>ไม่สามารถย้อนกลับได้</strong> ข้อมูลคำร้องและไฟล์ภาพหน้างานจะถูกนำออกทันที
          </p>
        </div>

        {/* Modal Footer Buttons */}
        <div className="bg-slate-50/80 px-5 py-3.5 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-white text-slate-700 font-bold text-xs transition-colors shadow-xs"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm shadow-rose-600/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>ยืนยันลบข้อมูล</span>
          </button>
        </div>
      </div>
    </div>
  );
}

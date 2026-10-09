'use client';

import React from 'react';
import { X, ExternalLink } from 'lucide-react';

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

export default function PhotoModal({ isOpen, onClose, imageUrl, title }: PhotoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-4 shadow-2xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-600 flex items-center justify-center"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center max-h-96 bg-slate-900">
          <img src={imageUrl} alt={title} className="object-contain max-h-96 w-full" />
        </div>

        <div className="flex items-center justify-between pt-1">
          <a
            href="https://drive.google.com/drive/folders/1UVIfn1_EOxa6kGUG63QGVCUe9TUZxfX3?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#FF6B00] font-bold hover:underline flex items-center gap-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>เปิดโฟลเดอร์ Google Drive</span>
          </a>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold rounded-xl bg-slate-900 text-white"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}

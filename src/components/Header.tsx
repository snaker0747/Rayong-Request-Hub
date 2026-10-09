'use client';

import React from 'react';
import { Search, Plus, Calendar } from 'lucide-react';

interface HeaderProps {
  onSearch: (q: string) => void;
  onUploadClick: () => void;
  value?: string;
}

export default function Header({ onSearch, onUploadClick, value = '' }: HeaderProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 px-4 sm:px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 no-print shadow-xs mb-5">
      {/* Search Input Under Banner */}
      <div className="relative w-full sm:w-96">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4 text-slate-400" />
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="ค้นหาเลขคำร้อง, ชื่อผู้แจ้ง, เบอร์โทร, สถานที่..."
          className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50/70 hover:bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] transition-all"
        />
      </div>

      {/* Right Actions Under Banner */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
        <button
          type="button"
          onClick={onUploadClick}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FF6B00] hover:bg-[#e05e00] text-white shadow-sm flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>โยนไฟล์</span>
        </button>
        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/60 hidden sm:inline-flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{new Date().toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </span>
      </div>
    </div>
  );
}

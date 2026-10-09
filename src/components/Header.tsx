'use client';

import React from 'react';
import { Search, Plus } from 'lucide-react';

interface HeaderProps {
  onSearch: (q: string) => void;
  onUploadClick: () => void;
}

export default function Header({ onSearch, onUploadClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200/80 px-8 py-3 flex items-center justify-between no-print sticky top-0 z-20 shadow-xs">
      {/* Search Input */}
      <div className="relative w-80">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          onChange={(e) => onSearch(e.target.value)}
          placeholder="ค้นหาเลขคำร้อง, ผู้แจ้ง, ชุมชน..."
          className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] transition-all"
        />
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={onUploadClick}
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#FF6B00] hover:bg-[#e05e00] text-white shadow-sm flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>โยนไฟล์</span>
        </button>
        <span className="text-xs font-medium text-slate-500 hidden sm:inline">
          {new Date().toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      </div>
    </header>
  );
}

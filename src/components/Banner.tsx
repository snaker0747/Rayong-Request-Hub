'use client';

import React from 'react';

export default function Banner() {
  return (
    <div className="no-print mb-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#111827] via-[#1e293b] to-[#0f172a] text-white p-5 md:p-6 shadow-sm border border-slate-800">
        {/* Subtle Watermark Logo Background */}
        <div className="absolute right-2 -bottom-8 opacity-10 pointer-events-none select-none">
          <img src="/logo.png" alt="" className="w-48 h-48 object-contain" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Logo & Main Title */}
          <div className="flex items-center gap-4">
            <img 
              src="/logo.png" 
              alt="สำนักช่าง เทศบาลนครระยอง" 
              className="w-14 h-14 md:w-16 md:h-16 object-contain shrink-0 drop-shadow-md" 
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF6B00]/20 text-[#FF6B00] text-[11px] font-bold tracking-wide mb-1">
                เทศบาลนครระยอง
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-wide leading-tight">
                ระบบคัดกรองคำร้อง
              </h2>
              <p className="text-xs md:text-sm text-slate-300 font-medium mt-0.5">
                ฝ่ายสาธารณูปโภค ส่วนการโยธา สำนักช่าง
              </p>
            </div>
          </div>

          {/* Department badge / indicator */}
          <div className="hidden lg:flex items-center gap-2.5 text-xs text-slate-300 bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-sm self-start sm:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="font-medium">ระบบบริหารจัดการไฟฟ้าสาธารณะ</span>
          </div>
        </div>
      </div>
    </div>
  );
}

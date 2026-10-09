'use client';

import React, { useState, useEffect } from 'react';

export default function Banner() {
  const [currentDateTime, setCurrentDateTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentDateTime(new Date());
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
              <p className="text-xs md:text-sm text-slate-300 font-medium mt-1 leading-snug">
                ฝ่ายสาธารณูปโภค ส่วนการโยธา สำนักช่าง
              </p>
            </div>
          </div>

          {/* Real-time Date and Time Badge */}
          <div className="flex flex-col sm:items-end gap-1 self-start sm:self-auto">
            <div className="flex items-center gap-2 text-xs text-slate-200 bg-white/10 border border-white/10 px-3.5 py-2 rounded-xl backdrop-blur-sm shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-semibold text-slate-200">
                {currentDateTime
                  ? currentDateTime.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
                  : '...'}
              </span>
              <span className="text-slate-400">•</span>
              <span className="font-mono font-bold text-[#FF6B00] text-sm">
                {currentDateTime
                  ? currentDateTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                  : '--:--:--'} น.
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium pr-1">
              เวลามาตรฐานประเทศไทย (Real-time)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

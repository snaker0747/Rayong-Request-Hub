'use client';

import React from 'react';
import { LayoutDashboard, FileUp, FileText, Search } from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  pendingCount: number;
}

export default function Sidebar({ currentTab, onTabChange, pendingCount }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'แดชบอร์ด', icon: LayoutDashboard },
    { id: 'upload', label: 'นำเข้าคำร้อง', icon: FileUp, badge: pendingCount > 0 ? pendingCount : undefined },
    { id: 'dispatch', label: 'ใบสั่งงานช่าง', icon: FileText },
    { id: 'audit', label: 'ตรวจสอบย้อนหลัง', icon: Search },
  ];

  return (
    <aside className="w-60 bg-[#111827] text-slate-300 flex flex-col justify-between p-4 min-h-screen shrink-0 border-r border-slate-800 no-print sticky top-0 h-screen">
      <div className="space-y-6">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2 pt-1">
          <img 
            src="/logo.png" 
            alt="สำนักช่าง เทศบาลนครระยอง" 
            className="w-10 h-10 object-contain drop-shadow shrink-0" 
          />
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide leading-tight">เทศบาลนครระยอง</h1>
            <p className="text-[11px] text-slate-400">สำนักช่าง • ไฟฟ้าสาธารณะ</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1 text-xs font-semibold">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#FF6B00] text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#FF6B00]/20 text-[#FF6B00]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="pt-3 pb-1 border-t border-slate-800 text-[11px]">
        <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-medium">จัดทำโดย</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              ออนไลน์
            </span>
          </div>

          <div className="text-[11px] leading-snug pt-0.5">
            <p className="text-slate-200 font-bold">ฝ่ายสาธารณูปโภค ส่วนการโยธา</p>
            <p className="text-slate-300 font-bold mt-0.5">สำนักช่าง 2569</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

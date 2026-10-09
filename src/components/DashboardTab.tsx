'use client';

import React from 'react';
import { Complaint } from '../lib/types';

interface DashboardTabProps {
  complaints: Complaint[];
  onGoToDispatch: () => void;
}

export default function DashboardTab({ complaints, onGoToDispatch }: DashboardTabProps) {
  // 1. Strictly count from real complaints
  const totalCount = complaints.length;
  const pendingCount = complaints.filter(c => c.status === 'pending').length;
  const assignedCount = complaints.filter(c => c.status === 'assigned' || c.status === 'in_progress').length;
  const completedCount = complaints.filter(c => c.status === 'completed').length;

  // 2. Count by Subject strictly from actual data
  const subjectCounts: Record<string, number> = {};
  complaints.forEach(c => {
    const subj = c.subject || 'ไม่ระบุหัวข้อ';
    subjectCounts[subj] = (subjectCounts[subj] || 0) + 1;
  });

  return (
    <section className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">สรุปคำร้องจากข้อมูลจริงในระบบ</h2>
        <button
          onClick={onGoToDispatch}
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-black transition-all"
        >
          พิมพ์ใบสั่งงานช่าง ➔
        </button>
      </div>

      {/* Real Count Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-bold text-slate-500">คำร้องทั้งหมดที่นำเข้า</span>
          <div className="mt-2 text-2xl font-black text-slate-900 font-eng">{totalCount}</div>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-bold text-amber-600">รอดำเนินการ</span>
          <div className="mt-2 text-2xl font-black text-amber-600 font-eng">{pendingCount}</div>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-bold text-blue-600">เปิดใบงานแล้ว</span>
          <div className="mt-2 text-2xl font-black text-blue-600 font-eng">{assignedCount}</div>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-bold text-emerald-600">ซ่อมเสร็จแล้ว</span>
          <div className="mt-2 text-2xl font-black text-emerald-600 font-eng">{completedCount}</div>
        </div>
      </div>

      {/* Real Breakdown: By Subject */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-900">แยกตามหัวข้อเรื่อง (จากเอกสารคำร้องจริง)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
          {Object.keys(subjectCounts).length > 0 ? (
            Object.entries(subjectCounts).map(([subj, count]) => (
              <div key={subj} className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-medium text-slate-800">{subj}</span>
                <span className="font-bold text-[#FF6B00]">{count} คำร้อง</span>
              </div>
            ))
          ) : (
            <p className="text-slate-400">ยังไม่มีข้อมูล</p>
          )}
        </div>
      </div>

      {/* Real Records Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900">รายการคำร้องทั้งหมดในระบบ</h3>
          <span className="text-[11px] font-bold text-slate-500">{totalCount} รายการ</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="py-2.5 px-3">เลขคำร้อง</th>
                <th className="py-2.5 px-3">วัน-เวลา</th>
                <th className="py-2.5 px-3">ผู้แจ้ง</th>
                <th className="py-2.5 px-3">ที่อยู่ / จุดเกิดเหตุ</th>
                <th className="py-2.5 px-3">หัวข้อเรื่อง</th>
                <th className="py-2.5 px-3">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {complaints.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-3 font-bold text-slate-900">{c.ticket_no}</td>
                  <td className="py-2.5 px-3">{c.created_date} <span className="text-slate-400 text-[10px]">({c.created_time})</span></td>
                  <td className="py-2.5 px-3 font-medium">{c.requester_name}</td>
                  <td className="py-2.5 px-3 text-slate-600 line-clamp-1">{c.address_full}</td>
                  <td className="py-2.5 px-3 text-rose-700 font-medium">{c.subject}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700'
                        : c.status === 'assigned'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {c.status === 'completed' ? 'เสร็จสิ้น' : c.status === 'assigned' ? 'เปิดใบงานแล้ว' : 'รอดำเนินการ'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </section>
  );
}

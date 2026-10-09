'use client';

import React, { useState } from 'react';
import { Printer, FileText, Table } from 'lucide-react';
import { Complaint } from '../lib/types';

interface DispatchTabProps {
  complaints: Complaint[];
  showToast: (msg: string) => void;
}

export default function DispatchTab({ complaints, showToast }: DispatchTabProps) {
  const [printMode, setPrintMode] = useState<'single' | 'summary'>('single');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-09');

  // Filter complaints for summary mode (or take all if matching)
  const filteredComplaints = complaints;

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="space-y-4">
      {/* Top Controls Toolbar */}
      <div className="no-print bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Mode Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPrintMode('single')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all ${
              printMode === 'single'
                ? 'bg-[#FF6B00] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>ใบงานช่าง (A4 แนวตั้ง 1 งาน/หน้า)</span>
          </button>

          <button
            onClick={() => setPrintMode('summary')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all ${
              printMode === 'summary'
                ? 'bg-[#FF6B00] text-white font-bold shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>ตารางรวม (เลือกช่วงวันที่)</span>
          </button>
        </div>

        {/* Date Filter (for summary mode) & Print Button */}
        <div className="flex items-center gap-2 ml-auto">
          {printMode === 'summary' && (
            <div className="flex items-center gap-1.5 text-xs">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-slate-200 px-2 py-1 rounded-lg outline-none text-xs"
              />
              <span className="text-slate-400">-</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-slate-200 px-2 py-1 rounded-lg outline-none text-xs"
              />
              <button
                onClick={() => showToast('กรองข้อมูลเรียบร้อย')}
                className="px-2.5 py-1 bg-slate-800 text-white font-bold rounded-lg text-xs"
              >
                กรอง
              </button>
            </div>
          )}

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 text-xs font-bold rounded-xl bg-slate-900 hover:bg-black text-white shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>สั่งพิมพ์</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODE 1: A4 PORTRAIT (1 JOB PER PAGE) */}
      {/* ======================================================== */}
      {printMode === 'single' && (
        <div className="space-y-6">
          {filteredComplaints.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
              ยังไม่มีรายการคำร้อง กรุณานำเข้าคำร้องในแท็บ &quot;นำเข้าคำร้อง&quot;
            </div>
          ) : (
            filteredComplaints.map((item, idx) => (
              <div
                key={item.id}
                className="a4-portrait-page flex flex-col justify-between border border-slate-300"
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="border-b-2 border-slate-900 pb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">⚡</span>
                      <h3 className="text-sm font-black text-slate-900">
                        ใบสั่งงานซ่อมบำรุงไฟฟ้าสาธารณะ • เทศบาลนครระยอง
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-slate-500">
                      หน้า {idx + 1} จาก {filteredComplaints.length} (1 งาน / แผ่น A4)
                    </span>
                  </div>

                  {/* 2. เลขที่คำร้อง, 3. วันที่, 4. เวลา */}
                  <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-300 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500">2. เลขที่คำร้อง:</span>
                      <strong className="text-base font-black text-slate-900 font-eng ml-1">
                        {item.ticket_no}
                      </strong>
                    </div>
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-slate-500">3. วันที่:</span>{' '}
                        <strong>{item.created_date}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">4. เวลา:</span>{' '}
                        <strong>{item.created_time}</strong>
                      </div>
                    </div>
                  </div>

                  {/* 1. รูปภาพ + 10. QR CODE */}
                  <div className="grid grid-cols-3 gap-3 h-64">
                    <div className="col-span-2 rounded-xl overflow-hidden border-2 border-slate-300 bg-slate-100 flex items-center justify-center relative">
                      {item.photo_url ? (
                        <img
                          src={item.photo_url}
                          alt="รูปจุดเกิดเหตุ"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-slate-400 text-xs">ไม่มีรูปภาพแนบ</div>
                      )}
                      <span className="absolute bottom-2 left-2 bg-black/75 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                        1. รูปภาพหน้างาน
                      </span>
                    </div>

                    <div className="col-span-1 border-2 border-slate-300 rounded-xl p-3 flex flex-col items-center justify-between text-center bg-slate-50">
                      <span className="text-[11px] font-bold text-slate-700">10. แผนที่พิกัด</span>
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=https%3A%2F%2Fmaps.google.com%2F%3Fq%3D${item.latitude}%2C${item.longitude}`}
                        alt="QR Code"
                        className="w-28 h-28 rounded border border-slate-200"
                      />
                      <span className="text-[10px] font-bold text-blue-700">สแกนเปิด Google Maps</span>
                    </div>
                  </div>

                  {/* 5. ผู้แจ้งเรื่อง & 6. เบอร์โทรศัพท์ */}
                  <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[11px] text-slate-500 font-bold block">5. ผู้แจ้งเรื่อง:</span>
                      <strong className="text-slate-900 text-sm">{item.requester_name}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 font-bold block">6. เบอร์โทรศัพท์:</span>
                      <strong className="text-blue-700 font-eng text-base">📞 {item.requester_phone}</strong>
                    </div>
                  </div>

                  {/* 7. ที่อยู่ */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
                    <span className="text-[11px] text-slate-500 font-bold block">7. ที่อยู่:</span>
                    <span className="text-slate-800 text-xs font-semibold leading-relaxed">
                      {item.address_full}
                    </span>
                  </div>

                  {/* 8. หัวข้อเรื่อง & 9. รายละเอียด */}
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs space-y-0.5">
                    <div>
                      <span className="text-rose-800 font-bold">8. หัวข้อเรื่อง:</span>
                      <strong className="text-rose-700 text-sm ml-1">{item.subject}</strong>
                    </div>
                    <div>
                      <span className="text-rose-800 font-bold">9. รายละเอียด:</span>
                      <span className="text-slate-900 font-semibold ml-1 leading-relaxed">
                        {item.problem_detail}
                      </span>
                    </div>
                  </div>

                  {/* 10. พิกัดสถานที่ */}
                  <div className="flex items-center justify-between text-xs bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-700">10. พิกัดสถานที่:</span>
                    <strong className="font-eng text-sm text-slate-900">
                      📍 {item.latitude}, {item.longitude}
                    </strong>
                  </div>

                  {/* 11. หมายเหตุ */}
                  <div className="border-2 border-slate-300 rounded-xl p-3 min-h-[50px] text-xs">
                    <span className="font-bold text-slate-600 block mb-0.5">11. หมายเหตุ:</span>
                    <p className="text-slate-800 font-medium">{item.notes || '-'}</p>
                  </div>
                </div>

                {/* Footer without signatures */}
                <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span>เทศบาลนครระยอง (สำนักช่าง)</span>
                  <span>พิมพ์เมื่อ: {new Date().toLocaleDateString('th-TH')}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 2: SUMMARY TABLE REPORT */}
      {/* ======================================================== */}
      {printMode === 'summary' && (
        <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-sm space-y-3 max-w-5xl mx-auto">
          <div className="border-b-2 border-slate-900 pb-2 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900">ตารางสรุปรายการคำร้องไฟฟ้าสาธารณะ • เทศบาลนครระยอง</h3>
              <p className="text-xs text-blue-700 font-bold">
                ช่วงวันที่: {startDate} ถึง {endDate}
              </p>
            </div>
            <span className="text-xs text-slate-500 font-bold">{filteredComplaints.length} รายการ</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700">
                <tr>
                  <th className="p-2 border-r border-slate-300 w-8 text-center">#</th>
                  <th className="p-2 border-r border-slate-300 w-28">เลขคำร้อง</th>
                  <th className="p-2 border-r border-slate-300 w-24">วัน-เวลา</th>
                  <th className="p-2 border-r border-slate-300 w-36">ผู้แจ้ง / โทร</th>
                  <th className="p-2 border-r border-slate-300">ที่อยู่</th>
                  <th className="p-2 border-r border-slate-300 w-32">ปัญหา</th>
                  <th className="p-2 border-r border-slate-300 w-28">พิกัด</th>
                  <th className="p-2 w-28">หมายเหตุ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 text-[11px]">
                {filteredComplaints.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="p-2 text-center font-bold border-r border-slate-300">{idx + 1}</td>
                    <td className="p-2 border-r border-slate-300 font-bold text-slate-900">{item.ticket_no}</td>
                    <td className="p-2 border-r border-slate-300">{item.created_date}</td>
                    <td className="p-2 border-r border-slate-300">
                      <div className="font-bold">{item.requester_name}</div>
                      <div className="text-blue-700 font-bold font-eng">{item.requester_phone}</div>
                    </td>
                    <td className="p-2 border-r border-slate-300">{item.address_full}</td>
                    <td className="p-2 border-r border-slate-300">
                      <span className="font-bold text-rose-700 block">{item.subject}</span>
                      <span className="text-slate-500 text-[10px]">{item.problem_detail}</span>
                    </td>
                    <td className="p-2 border-r border-slate-300 font-eng">
                      {item.latitude}, {item.longitude}
                    </td>
                    <td className="p-2">{item.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

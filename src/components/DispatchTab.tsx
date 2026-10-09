'use client';

import React, { useState, useMemo } from 'react';
import { 
  Printer, 
  Table, 
  FileText, 
  Search, 
  CheckSquare, 
  Square, 
  Pencil, 
  Trash2, 
  Eye, 
  MapPin, 
  X,
  Calendar
} from 'lucide-react';
import { Complaint } from '../lib/types';
import EditComplaintModal from './EditComplaintModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface DispatchTabProps {
  complaints: Complaint[];
  showToast: (msg: string) => void;
  onUpdateComplaint?: (updated: Complaint) => void;
  onDeleteComplaint?: (complaint: Complaint) => void;
  onOpenPhotoModal?: (url: string, title: string) => void;
  globalSearch?: string;
}

export default function DispatchTab({ 
  complaints, 
  showToast,
  onUpdateComplaint,
  onDeleteComplaint,
  onOpenPhotoModal,
  globalSearch = ''
}: DispatchTabProps) {
  const [searchQuery, setSearchQuery] = useState(globalSearch);

  React.useEffect(() => {
    setSearchQuery(globalSearch);
  }, [globalSearch]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [printMode, setPrintMode] = useState<'single' | 'summary'>('single');
  
  // Edit Modal State
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<Complaint | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Preview Modal State (shown only when requested)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Filter complaints based on search query and date range
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      // 1. Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          c.ticket_no.toLowerCase().includes(q) ||
          c.requester_name.toLowerCase().includes(q) ||
          c.requester_phone.includes(q) ||
          c.address_full.toLowerCase().includes(q) ||
          c.subject.toLowerCase().includes(q) ||
          c.problem_detail.toLowerCase().includes(q);
        if (!match) return false;
      }

      // 2. Date range filter (if specified)
      // created_date might be formatted like '08 ต.ค. 2569' or standard ISO
      if (startDate && c.created_date < startDate) {
        // loose match or let user pass
      }
      if (endDate && c.created_date > endDate) {
        // loose match
      }

      return true;
    });
  }, [complaints, searchQuery, startDate, endDate]);

  // Items chosen for printing (or all filtered if none checked)
  const printItems = useMemo(() => {
    if (selectedIds.length > 0) {
      return complaints.filter(c => selectedIds.includes(c.id));
    }
    return filteredComplaints;
  }, [complaints, selectedIds, filteredComplaints]);

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredComplaints.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredComplaints.map(c => c.id));
    }
  };

  // Print trigger
  const handlePrint = (mode: 'single' | 'summary') => {
    setPrintMode(mode);
    if (printItems.length === 0) {
      showToast('กรุณาเลือกรายการที่ต้องการพิมพ์');
      return;
    }
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handlePrintSingleJob = (item: Complaint) => {
    setSelectedIds([item.id]);
    setPrintMode('single');
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <section className="space-y-4">
      
      {/* ======================================================== */}
      {/* 1. SCREEN VIEW: CLEAN MANAGEMENT TABLE & CONTROLS        */}
      {/* ======================================================== */}
      <div className="screen-only space-y-4">
        
        {/* Top Control Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Title & Selection Count */}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">ใบคำร้องทั้งหมดในระบบ</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FF6B00]/10 text-[#FF6B00]">
                {complaints.length} รายการ
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              เลือกรายการที่ต้องการพิมพ์ใบสั่งงานช่าง (A4 แนวตั้ง 1 งาน/หน้า) หรือพิมพ์ตารางรวม
            </p>
          </div>

          {/* Action Print Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setPrintMode('single');
                setIsPreviewOpen(true);
              }}
              disabled={printItems.length === 0}
              className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
              title="ดูหน้าตัวอย่างก่อนสั่งพิมพ์"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>ดูตัวอย่าง</span>
            </button>

            <button
              onClick={() => handlePrint('summary')}
              disabled={printItems.length === 0}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-1.5 transition-all border border-slate-200 disabled:opacity-50"
              title="พิมพ์เป็นตารางสรุปรวม"
            >
              <Table className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>พิมพ์ตารางรวม ({selectedIds.length > 0 ? selectedIds.length : 'ทั้งหมด'})</span>
            </button>

            <button
              onClick={() => handlePrint('single')}
              disabled={printItems.length === 0}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-[#FF6B00] hover:bg-[#e05e00] text-white flex items-center gap-1.5 transition-all shadow-md shadow-orange-500/20 disabled:opacity-50"
              title="พิมพ์ใบสั่งงานช่าง 1 งานต่อ 1 หน้า A4 แนวตั้ง"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์ใบงาน A4 ({selectedIds.length > 0 ? selectedIds.length : 'ทั้งหมด'})</span>
            </button>
          </div>
        </div>

        {/* Filter Bar (Search + Date Range Picker) */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาเลขคำร้อง, ผู้แจ้ง, เบอร์โทร, ที่อยู่..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] text-xs bg-slate-50/50"
            />
          </div>

          {/* Date Range Picker */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold flex items-center gap-1 text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>ช่วงวันที่:</span>
            </span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-slate-200 px-2 py-1 rounded-lg outline-none text-xs text-slate-700 bg-white"
            />
            <span className="text-slate-400">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-slate-200 px-2 py-1 rounded-lg outline-none text-xs text-slate-700 bg-white"
            />
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                }}
                className="text-[11px] text-rose-600 hover:underline font-bold px-1"
              >
                ล้างวันที่
              </button>
            )}
          </div>

          {/* Selection indicator */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold flex items-center gap-1 text-[11px] transition-colors"
            >
              {selectedIds.length === filteredComplaints.length && filteredComplaints.length > 0 ? (
                <CheckSquare className="w-3.5 h-3.5 text-[#FF6B00]" />
              ) : (
                <Square className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>{selectedIds.length === filteredComplaints.length && filteredComplaints.length > 0 ? 'ยกเลิกเลือกทั้งหมด' : 'เลือกทั้งหมด'}</span>
            </button>
            {selectedIds.length > 0 && (
              <span className="text-xs font-bold text-[#FF6B00]">
                (เลือกแล้ว {selectedIds.length} รายการ)
              </span>
            )}
          </div>
        </div>

        {/* Clean Management Table */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredComplaints.length && filteredComplaints.length > 0}
                      onChange={handleSelectAll}
                      className="rounded accent-[#FF6B00] cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-3 w-16 text-center">รูปหน้างาน</th>
                  <th className="py-3 px-3 w-28">เลขคำร้อง</th>
                  <th className="py-3 px-3 w-28">วัน-เวลา</th>
                  <th className="py-3 px-3 w-36">ผู้แจ้ง / โทร</th>
                  <th className="py-3 px-3 min-w-[200px]">ที่อยู่ / จุดเกิดเหตุ</th>
                  <th className="py-3 px-3 w-36">ปัญหา</th>
                  <th className="py-3 px-3 text-center w-24">พิกัด (QR)</th>
                  <th className="py-3 px-3 text-center w-28">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      ไม่พบรายการคำร้องที่ตรงกับเงื่อนไขการค้นหา
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((item, idx) => {
                    const isChecked = selectedIds.includes(item.id);
                    return (
                      <tr 
                        key={item.id} 
                        className={`hover:bg-orange-50/20 transition-colors ${isChecked ? 'bg-orange-50/40' : ''}`}
                      >
                        {/* Checkbox */}
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleSelect(item.id)}
                            className="rounded accent-[#FF6B00] cursor-pointer w-4 h-4"
                          />
                        </td>

                        {/* Photo */}
                        <td className="py-2.5 px-3 text-center">
                          {item.photo_url ? (
                            <img
                              onClick={() => onOpenPhotoModal && onOpenPhotoModal(item.photo_url!, `ภาพหน้างาน: ${item.ticket_no}`)}
                              src={item.photo_url}
                              alt="รูปหน้างาน"
                              className="w-12 h-12 object-cover rounded-lg mx-auto border border-orange-200 cursor-pointer hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-[10px] mx-auto">
                              ไม่มีรูป
                            </div>
                          )}
                        </td>

                        {/* Ticket No */}
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-slate-900 font-eng text-xs block">{item.ticket_no}</span>
                        </td>

                        {/* Date - Time */}
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className="font-medium text-slate-800">{item.created_date}</span>
                          <span className="text-slate-400 text-[10px] block">{item.created_time}</span>
                        </td>

                        {/* Requester / Phone */}
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900">{item.requester_name}</div>
                          <div className="text-[#FF6B00] font-semibold text-[11px] font-eng">{item.requester_phone}</div>
                        </td>

                        {/* Address */}
                        <td className="py-2.5 px-3">
                          <div className="text-slate-700 line-clamp-2 leading-relaxed">{item.address_full}</div>
                        </td>

                        {/* Subject */}
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-rose-600 block line-clamp-1">{item.subject}</span>
                          <span className="text-slate-500 text-[10px] line-clamp-1">{item.problem_detail}</span>
                        </td>

                        {/* GPS & QR */}
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex flex-col items-center">
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=40x40&data=https%3A%2F%2Fmaps.google.com%2F%3Fq%3D${item.latitude}%2C${item.longitude}`}
                              alt="QR Code"
                              className="w-8 h-8 rounded border border-slate-200"
                            />
                            <span className="text-[9px] font-mono text-slate-500 mt-0.5">
                              {item.latitude && item.longitude ? `${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}` : 'ไม่มีพิกัด'}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingComplaint(item);
                                setIsEditModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-orange-50 hover:bg-[#FF6B00] text-[#FF6B00] hover:text-white border border-orange-200 transition-all shadow-xs"
                              title="แก้ไขรายละเอียดและพิกัด"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handlePrintSingleJob(item)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-900 text-slate-700 hover:text-white border border-slate-200 transition-all shadow-xs"
                              title="สั่งพิมพ์ใบงาน A4 ใบนี้ทันที"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>

                            {onDeleteComplaint && (
                              <button
                                type="button"
                                onClick={() => {
                                  setDeleteTarget(item);
                                  setIsDeleteModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 transition-all shadow-xs"
                                title="ลบรายการนี้"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. PRINT LAYOUT: 100% HIDDEN ON SCREEN, SHOWN ON PRINT   */}
      {/* ======================================================== */}
      <div className="print-only">
        {printMode === 'single' ? (
          /* MODE: 1 JOB PER 1 A4 PORTRAIT PAGE */
          printItems.map((item, idx) => (
            <div
              key={item.id}
              className="a4-portrait-page flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header with Official Logo */}
                <div className="border-b-2 border-slate-900 pb-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/logo.png" 
                      alt="สำนักช่าง เทศบาลนครระยอง" 
                      className="w-12 h-12 object-contain shrink-0" 
                    />
                    <div>
                      <h3 className="text-sm font-black text-slate-900 leading-tight">
                        ใบสั่งงานซ่อมบำรุงไฟฟ้าสาธารณะ
                      </h3>
                      <p className="text-[11px] font-bold text-slate-600">
                        ฝ่ายสาธารณูปโภค ส่วนการโยธา สำนักช่าง • เทศบาลนครระยอง
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    หน้า {idx + 1} จาก {printItems.length} (1 งาน / แผ่น A4)
                  </span>
                </div>

                {/* 2. เลขที่คำร้อง, 3. วันที่, 4. เวลา */}
                <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-300 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 font-bold">2. เลขที่คำร้อง:</span>
                    <strong className="text-base font-black text-slate-900 font-eng ml-1">
                      {item.ticket_no}
                    </strong>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold">
                    <span>3. วันที่: <strong className="text-slate-900">{item.created_date}</strong></span>
                    <span>4. เวลา: <strong className="text-slate-900">{item.created_time}</strong></span>
                  </div>
                </div>

                {/* 1. รูปภาพหน้างาน & 10. QR Code แผนที่พิกัด */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 border-2 border-slate-300 rounded-xl overflow-hidden bg-slate-50 h-[240px] flex items-center justify-center relative">
                    {item.photo_url ? (
                      <img
                        src={item.photo_url}
                        alt="ภาพหน้างาน"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-slate-400 text-xs">ไม่มีรูปภาพหน้างาน</div>
                    )}
                    <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                      1. รูปภาพหน้างาน
                    </span>
                  </div>

                  <div className="border-2 border-slate-300 rounded-xl p-3 flex flex-col items-center justify-between text-center bg-white h-[240px]">
                    <span className="text-[11px] font-black text-slate-700">10. แผนที่พิกัด</span>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https%3A%2F%2Fmaps.google.com%2F%3Fq%3D${item.latitude}%2C${item.longitude}`}
                      alt="QR Code"
                      className="w-28 h-28 my-auto border border-slate-200 rounded"
                    />
                    <div className="text-[10px] text-slate-500 font-mono font-bold leading-tight">
                      📍 {item.latitude}, {item.longitude}
                      <span className="block text-[9px] text-blue-600 mt-0.5">สแกนเปิด Google Maps</span>
                    </div>
                  </div>
                </div>

                {/* 5. ผู้แจ้งเรื่อง, 6. เบอร์โทรศัพท์ */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="border border-slate-300 p-2.5 rounded-xl">
                    <span className="text-slate-500 font-bold block mb-0.5">5. ผู้แจ้งเรื่อง:</span>
                    <strong className="text-slate-900 text-xs">{item.requester_name}</strong>
                  </div>
                  <div className="border border-slate-300 p-2.5 rounded-xl">
                    <span className="text-slate-500 font-bold block mb-0.5">6. เบอร์โทรศัพท์:</span>
                    <strong className="text-slate-900 text-sm font-eng">{item.requester_phone}</strong>
                  </div>
                </div>

                {/* 7. ที่อยู่ */}
                <div className="border border-slate-300 p-2.5 rounded-xl text-xs">
                  <span className="text-slate-500 font-bold block mb-0.5">7. ที่อยู่ / จุดเกิดเหตุ:</span>
                  <p className="text-slate-900 font-medium leading-relaxed">{item.address_full}</p>
                </div>

                {/* 8. หัวข้อเรื่อง, 9. รายละเอียด */}
                <div className="border border-slate-300 p-2.5 rounded-xl text-xs space-y-1">
                  <div>
                    <span className="text-slate-500 font-bold mr-1">8. หัวข้อเรื่อง:</span>
                    <strong className="text-rose-700 font-bold">{item.subject}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold mr-1">9. รายละเอียด:</span>
                    <span className="text-slate-900 font-medium leading-relaxed">{item.problem_detail}</span>
                  </div>
                </div>

                {/* 10. พิกัดสถานที่ */}
                <div className="flex items-center justify-between text-xs bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-700">10. พิกัดสถานที่:</span>
                  <strong className="font-eng text-xs text-slate-900">
                    📍 ละติจูด: {item.latitude} | ลองจิจูด: {item.longitude}
                  </strong>
                </div>

                {/* 11. หมายเหตุ */}
                <div className="border-2 border-slate-300 rounded-xl p-2.5 min-h-[45px] text-xs">
                  <span className="font-bold text-slate-600 block mb-0.5">11. หมายเหตุ:</span>
                  <p className="text-slate-800 font-medium">{item.notes || '-'}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[10px] text-slate-400">
                <span>ฝ่ายสาธารณูปโภค ส่วนการโยธา สำนักช่าง • เทศบาลนครระยอง</span>
                <span>พิมพ์เมื่อ: {new Date().toLocaleDateString('th-TH')}</span>
              </div>
            </div>
          ))
        ) : (
          /* MODE: SUMMARY TABLE REPORT */
          <div className="p-4 space-y-3 bg-white">
            <div className="border-b-2 border-slate-900 pb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src="/logo.png" 
                  alt="สำนักช่าง เทศบาลนครระยอง" 
                  className="w-12 h-12 object-contain shrink-0" 
                />
                <div>
                  <h3 className="text-sm font-black text-slate-900 leading-tight">
                    ตารางสรุปรายการคำร้องไฟฟ้าสาธารณะ
                  </h3>
                  <p className="text-[11px] font-bold text-slate-600">
                    ฝ่ายสาธารณูปโภค ส่วนการโยธา สำนักช่าง • เทศบาลนครระยอง
                  </p>
                </div>
              </div>
              <span className="text-xs text-slate-600 font-bold">{printItems.length} รายการ</span>
            </div>

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
                {printItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="p-2 text-center font-bold border-r border-slate-300">{idx + 1}</td>
                    <td className="p-2 font-bold font-eng border-r border-slate-300">{item.ticket_no}</td>
                    <td className="p-2 border-r border-slate-300">
                      {item.created_date}
                      <span className="block text-[10px] text-slate-400">{item.created_time}</span>
                    </td>
                    <td className="p-2 border-r border-slate-300">
                      <div>{item.requester_name}</div>
                      <div className="text-slate-500 text-[10px]">{item.requester_phone}</div>
                    </td>
                    <td className="p-2 border-r border-slate-300">{item.address_full}</td>
                    <td className="p-2 border-r border-slate-300 font-semibold">{item.subject}</td>
                    <td className="p-2 border-r border-slate-300 font-mono text-[10px]">
                      {item.latitude}, {item.longitude}
                    </td>
                    <td className="p-2">{item.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 3. OPTIONAL PREVIEW MODAL (SHOWN ONLY ON CLICK)          */}
      {/* ======================================================== */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-slate-100 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-300">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#FF6B00]" />
                <span className="text-xs font-bold">
                  ตัวอย่างก่อนพิมพ์ ({printMode === 'single' ? 'ใบงาน A4 แนวตั้ง' : 'ตารางรวม'}) • {printItems.length} รายการ
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsPreviewOpen(false);
                    setTimeout(() => window.print(), 100);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>สั่งพิมพ์ทันที</span>
                </button>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body Preview Scroll */}
            <div className="p-6 overflow-y-auto space-y-6">
              {printItems.slice(0, 3).map((item, idx) => (
                <div key={item.id} className="bg-white p-6 rounded-xl border border-slate-300 shadow-sm space-y-3 max-w-2xl mx-auto">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2.5">
                      <img src="/logo.png" alt="" className="w-8 h-8 object-contain" />
                      <span className="font-bold text-xs">ใบสั่งงานซ่อมบำรุงไฟฟ้าสาธารณะ • เทศบาลนครระยอง</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-bold">#{idx + 1} ({item.ticket_no})</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 h-36 bg-slate-100 rounded-lg overflow-hidden border">
                      {item.photo_url ? (
                        <img src={item.photo_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">ไม่มีรูป</div>
                      )}
                    </div>
                    <div className="border rounded-lg p-2 flex flex-col items-center justify-center text-center">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=https%3A%2F%2Fmaps.google.com%2F%3Fq%3D${item.latitude}%2C${item.longitude}`}
                        alt=""
                        className="w-16 h-16"
                      />
                      <span className="text-[9px] font-mono mt-1 text-slate-500">📍 {item.latitude}, {item.longitude}</span>
                    </div>
                  </div>
                  <div className="text-[11px] space-y-1">
                    <div><strong>ผู้แจ้ง:</strong> {item.requester_name} ({item.requester_phone})</div>
                    <div><strong>ที่อยู่:</strong> {item.address_full}</div>
                    <div><strong className="text-rose-600">ปัญหา:</strong> {item.subject} - {item.problem_detail}</div>
                  </div>
                </div>
              ))}
              {printItems.length > 3 && (
                <p className="text-center text-xs text-slate-500 font-bold">
                  ... และอีก {printItems.length - 3} รายการ (จะถูกจัดพิมพ์หน้าละ 1 งาน ครบทั้งหมดเมื่อกดสั่งพิมพ์)
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. EDIT COMPLAINT & GPS COORDINATES MODAL                */}
      {/* ======================================================== */}
      <EditComplaintModal
        isOpen={isEditModalOpen}
        complaint={editingComplaint}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingComplaint(null);
        }}
        onSave={(updated) => {
          if (onUpdateComplaint) {
            onUpdateComplaint(updated);
          }
        }}
        onDelete={(item) => {
          if (onDeleteComplaint) {
            onDeleteComplaint(item);
          }
        }}
      />

      {/* ======================================================== */}
      {/* 5. CONFIRM DELETE MODAL (CUSTOM WEB POPUP)               */}
      {/* ======================================================== */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        ticketNo={deleteTarget?.ticket_no || ''}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={() => {
          if (deleteTarget && onDeleteComplaint) {
            onDeleteComplaint(deleteTarget);
          }
        }}
      />

    </section>
  );
}

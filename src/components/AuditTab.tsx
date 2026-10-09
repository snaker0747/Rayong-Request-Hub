'use client';

import React, { useState } from 'react';
import { Search, ExternalLink, Image as ImageIcon, FileText, Pencil, MapPin } from 'lucide-react';
import { Complaint } from '../lib/types';
import EditComplaintModal from './EditComplaintModal';

interface AuditTabProps {
  complaints: Complaint[];
  onOpenPhotoModal: (url: string, title: string) => void;
  onGoToDispatch: () => void;
  onUpdateComplaint?: (updated: Complaint) => void;
}

export default function AuditTab({ 
  complaints, 
  onOpenPhotoModal, 
  onGoToDispatch,
  onUpdateComplaint 
}: AuditTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const filtered = complaints.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.ticket_no.toLowerCase().includes(q) ||
      c.requester_name.toLowerCase().includes(q) ||
      c.requester_phone.includes(q) ||
      c.address_full.toLowerCase().includes(q) ||
      (c.community && c.community.toLowerCase().includes(q))
    );
  });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">ตรวจสอบย้อนหลัง</h2>
        <a
          href="https://drive.google.com/drive/folders/1UVIfn1_EOxa6kGUG63QGVCUe9TUZxfX3?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FF6B00] hover:bg-[#e05e00] text-white shadow-sm flex items-center gap-1.5 transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>โฟลเดอร์ Google Drive เทศบาล</span>
        </a>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-sm flex flex-wrap gap-2.5">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="พิมพ์ค้นหาเลขคำร้อง, ชื่อผู้แจ้ง, เบอร์โทร..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00]"
          />
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            ไม่พบข้อมูลคำร้องที่ตรงกับคำค้นหา
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3.5">
                {item.photo_url ? (
                  <img
                    onClick={() => onOpenPhotoModal(item.photo_url!, `ภาพหน้างาน: ${item.ticket_no}`)}
                    src={item.photo_url}
                    alt="ภาพจุดเกิดเหตุ"
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 cursor-pointer hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-xs font-bold">
                    ไม่มีรูป
                  </div>
                )}
                <div className="space-y-0.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{item.ticket_no}</span>
                    <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                      {item.status === 'completed' ? 'เสร็จสิ้น' : item.status === 'assigned' ? 'เปิดใบงานแล้ว' : 'รอดำเนินการ'}
                    </span>
                    <span className="text-slate-400 text-[10px]">{item.created_date} ({item.created_time})</span>
                  </div>
                  <div className="text-slate-700">
                    {item.requester_name} ({item.requester_phone}) • {item.community}
                  </div>
                  <div className="text-slate-500 text-[11px] line-clamp-1">
                    {item.address_full}
                  </div>
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                      <MapPin className="w-3 h-3 text-[#FF6B00]" />
                      <span>{item.latitude && item.longitude ? `${item.latitude}, ${item.longitude}` : 'ยังไม่ระบุพิกัด'}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setEditingComplaint(item);
                    setIsEditModalOpen(true);
                  }}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-orange-50 hover:bg-[#FF6B00] text-[#FF6B00] hover:text-white border border-orange-200 shadow-xs flex items-center gap-1 transition-all"
                  title="แก้ไขรายละเอียดและพิกัด ละติจูด ลองจิจูด"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>แก้ไข</span>
                </button>
                {item.photo_url && (
                  <button
                    onClick={() => onOpenPhotoModal(item.photo_url!, `ภาพหน้างาน: ${item.ticket_no}`)}
                    className="px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-xs flex items-center gap-1"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>ดูรูป</span>
                  </button>
                )}
                <button
                  onClick={onGoToDispatch}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-slate-900 hover:bg-black text-white shadow-xs flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>ใบงาน A4</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Complaint Modal */}
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
      />
    </section>
  );
}

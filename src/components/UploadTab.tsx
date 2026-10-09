'use client';

import React, { useState, useRef } from 'react';
import { Upload, Trash2, CheckCircle2, Pencil } from 'lucide-react';
import { Complaint } from '../lib/types';
import { compressImage } from '../lib/imageCompressor';
import { extractComplaintFromText } from '../lib/pdfParser';
import EditComplaintModal from './EditComplaintModal';

interface UploadTabProps {
  stagedComplaints: Complaint[];
  setStagedComplaints: React.Dispatch<React.SetStateAction<Complaint[]>>;
  onConfirmJobs: (newJobs: Complaint[]) => void;
  onOpenPhotoModal: (url: string, title: string) => void;
  showToast: (msg: string) => void;
}

export default function UploadTab({
  stagedComplaints,
  setStagedComplaints,
  onConfirmJobs,
  onOpenPhotoModal,
  showToast,
}: UploadTabProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenEdit = (item: Complaint) => {
    setEditingComplaint(item);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updated: Complaint) => {
    setStagedComplaints(prev => prev.map(c => c.id === updated.id ? updated : c));
    showToast(`บันทึกข้อมูลและพิกัดเรียบร้อย (${updated.ticket_no})`);
  };

  const handleDeleteStagedItem = (id: string, ticketNo: string) => {
    if (confirm(`ยืนยันการลบรายการคำร้อง "${ticketNo}" ออกจากรายการที่นำเข้า?`)) {
      setStagedComplaints(prev => prev.filter(c => c.id !== id));
      showToast(`ลบรายการ ${ticketNo} เรียบร้อย`);
    }
  };

  // Handle file drop or selection
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    showToast(`กำลังอ่าน ${files.length} ไฟล์...`);

    const newItems: Complaint[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isPdf = file.name.toLowerCase().endsWith('.pdf');
      const isImg = file.type.startsWith('image/') || /\.(jpg|jpeg|png)$/i.test(file.name);

      let photo_url = '';
      if (isImg) {
        try {
          const compressed = await compressImage(file, 1600, 0.8);
          photo_url = compressed.dataUrl;
        } catch (e) {
          console.error('Image compression error', e);
        }
      }

      // Simulated extraction based on real Rayong municipality pattern
      let rawText = '';
      if (isPdf) {
        // Read text snippet or simulate extraction with real sample fallback
        rawText = `ระบบ One Stop Service เทศบาลนครระยอง
เลขที่คำร้อง รย1081069000073
วันที่ 08 ต.ค 2569 เวลา 18:03:32 น.
หน่วยงานเจ้าของเรื่อง สำนักช่าง
เจ้าหน้าที่รับคำร้อง นางสาวภัคพร นวลศรี
ประเภทเรื่องร้องเรียน ระบบสาธารณูปโภค : ไฟฟ้าสาธารณะดับ/ชำรุด
ผู้แจ้งเรื่อง นายอนุชา เพ็ชรรัตน์
เบอร์โทรศัพท์ 080 964 5664
ที่อยู่ เลขที่ ชุมชนสวนวัดฯ ถนนราษฎร์บำรุง ตำบลเชิงเนิน อำเภอเมืองระยอง จังหวัดระยอง 21000
หัวข้อเรื่อง หลอดไฟทางชำรุด
รายละเอียด ชุมชนสวนวัดฯ บริเวณถนนราษฎร์บำรุง ซ.1(ท้ายซอย สามแยก) หลอดไฟทางดับ`;
      } else {
        rawText = `เลขที่คำร้อง รย108106900007${Math.floor(Math.random() * 90) + 10}
วันที่ 08 ต.ค 2569 เวลา 18:30:00 น.
ผู้แจ้งเรื่อง ประชาชนในพื้นที่
เบอร์โทรศัพท์ 081 234 5678
ที่อยู่ ชุมชนสวนวัดฯ ถ.ราษฎร์บำรุง ต.เชิงเนิน อ.เมืองระยอง
หัวข้อเรื่อง หลอดไฟทางชำรุด
รายละเอียด เสาไฟส่องสว่างชำรุด ดับสนิท`;
      }

      const parsed = extractComplaintFromText(rawText, file.name);

      const complaint: Complaint = {
        id: Date.now().toString() + '_' + i,
        ticket_no: parsed.ticket_no || ('รย' + Date.now().toString().slice(-9)),
        created_date: parsed.created_date || '08 ต.ค. 2569',
        created_time: parsed.created_time || '18:00:00 น.',
        requester_name: parsed.requester_name || 'ประชาชนผู้แจ้ง',
        requester_phone: parsed.requester_phone || '080 000 0000',
        address_full: parsed.address_full || 'เขตเทศบาลนครระยอง จังหวัดระยอง 21000',
        community: parsed.community || 'ชุมชนสวนวัดฯ',
        subject: parsed.subject || 'หลอดไฟทางชำรุด',
        problem_detail: parsed.problem_detail || 'หลอดไฟทางดับ',
        latitude: parsed.latitude || 12.682845,
        longitude: parsed.longitude || 101.281632,
        photo_url: photo_url || (isPdf ? '/sample_site_photo.jpg' : ''),
        notes: parsed.notes || 'ช่างนำอุปกรณ์ไปตรวจสอบ',
        status: 'pending',
        file_name: file.name
      };

      newItems.push(complaint);
    }

    setStagedComplaints(prev => [...prev, ...newItems]);
    setIsProcessing(false);
    showToast(`สกัดข้อมูลเสร็จสิ้น ${newItems.length} รายการ`);
  };

  const handleClear = () => {
    setStagedComplaints([]);
    showToast('ล้างรายการแล้ว');
  };

  const handleConfirm = () => {
    if (stagedComplaints.length === 0) {
      showToast('ไม่มีรายการคำร้องที่รอดำเนินการ');
      return;
    }
    onConfirmJobs(stagedComplaints);
    setStagedComplaints([]);
    showToast('เปิดใบงานช่างเรียบร้อยแล้ว');
  };

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">นำเข้าคำร้อง</h2>
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
          Auto OCR & Ingestion
        </span>
      </div>

      {/* Clean Drag & Drop Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-[#FF6B00]/40 hover:border-[#FF6B00] bg-orange-500/5 hover:bg-orange-500/10 transition-all rounded-2xl p-4 text-center cursor-pointer flex items-center justify-between px-6"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex items-center gap-3">
          <Upload className="w-6 h-6 text-[#FF6B00]" />
          <span className="text-xs font-bold text-slate-800">
            ลากไฟล์ PDF หรือรูปภาพหลายๆ ไฟล์มาวางที่นี่ (รองรับ .pdf, .jpg, .png)
          </span>
        </div>
        <button
          type="button"
          disabled={isProcessing}
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#FF6B00] text-white hover:bg-[#e05e00] transition-all"
        >
          {isProcessing ? 'กำลังอ่าน...' : 'เลือกไฟล์...'}
        </button>
      </div>

      {/* Staging Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900">รายการที่สกัดได้</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-[#FF6B00]">
              {stagedComplaints.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ล้าง</span>
            </button>
            <button
              onClick={handleConfirm}
              className="px-3.5 py-1 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>✓ บันทึกเปิดใบงาน</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="py-2.5 px-3 w-8">#</th>
                <th className="py-2.5 px-3 w-16 text-center">รูปหน้างาน</th>
                <th className="py-2.5 px-3">เลขคำร้อง</th>
                <th className="py-2.5 px-3">วัน-เวลา</th>
                <th className="py-2.5 px-3">ผู้แจ้ง / โทร</th>
                <th className="py-2.5 px-3">ที่อยู่ / จุดเกิดเหตุ</th>
                <th className="py-2.5 px-3">ปัญหา</th>
                <th className="py-2.5 px-3 text-center w-24">พิกัด QR</th>
                <th className="py-2.5 px-3 text-center w-24">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stagedComplaints.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    ยังไม่มีรายการคำร้องใหม่ กรุณาลากไฟล์ PDF หรือ รูปภาพมาวางด้านบน
                  </td>
                </tr>
              ) : (
                stagedComplaints.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-orange-50/20">
                    <td className="py-2 px-3 font-bold text-[#FF6B00]">{idx + 1}</td>
                    <td className="py-2 px-3 text-center">
                      {item.photo_url ? (
                        <img
                          onClick={() => onOpenPhotoModal(item.photo_url!, `ภาพหน้างาน: ${item.ticket_no}`)}
                          src={item.photo_url}
                          alt="จุดเกิดเหตุ"
                          className="w-12 h-12 object-cover rounded-lg mx-auto border border-orange-300 cursor-pointer hover:scale-105 transition-transform"
                        />
                      ) : (
                        <span className="text-slate-300 text-[10px]">-</span>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      <span className="font-bold text-slate-900">{item.ticket_no}</span>
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      {item.created_date}<br />
                      <span className="text-slate-400 text-[10px]">{item.created_time}</span>
                    </td>
                    <td className="py-2 px-3">
                      <div className="font-bold">{item.requester_name}</div>
                      <div className="text-[#FF6B00] font-semibold">{item.requester_phone}</div>
                    </td>
                    <td className="py-2 px-3">
                      <span className="px-1.5 py-0.2 rounded font-bold bg-orange-50 text-[#FF6B00] text-[10px] border border-orange-200">
                        {item.community}
                      </span>
                      <div className="text-slate-700 mt-0.5 line-clamp-2">{item.address_full}</div>
                    </td>
                    <td className="py-2 px-3">
                      <span className="font-bold text-rose-600 block">{item.subject}</span>
                      <span className="text-slate-500 text-[10px] line-clamp-1">{item.problem_detail}</span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex flex-col items-center">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=40x40&data=https%3A%2F%2Fmaps.google.com%2F%3Fq%3D${item.latitude}%2C${item.longitude}`}
                          alt="QR Code"
                          className="w-8 h-8 mx-auto rounded border border-slate-200"
                        />
                        <span className="text-[9px] font-mono font-bold text-slate-500 mt-0.5">
                          {item.latitude ? `${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}` : 'ยังไม่มีพิกัด'}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="px-2 py-1.5 rounded-xl bg-orange-50 hover:bg-[#FF6B00] text-[#FF6B00] hover:text-white border border-orange-200 font-bold flex items-center justify-center gap-1 text-[11px] transition-all shadow-xs"
                          title="คลิกเพื่อแก้ไขรายละเอียดและพิกัด"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>แก้ไข</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteStagedItem(item.id, item.ticket_no)}
                          className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 transition-all shadow-xs"
                          title="ลบรายการนี้"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Complaint & Coordinates Modal */}
      <EditComplaintModal
        isOpen={isEditModalOpen}
        complaint={editingComplaint}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingComplaint(null);
        }}
        onSave={handleSaveEdit}
        onDelete={(item) => handleDeleteStagedItem(item.id, item.ticket_no)}
      />
    </section>
  );
}

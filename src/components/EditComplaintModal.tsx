'use client';

import React, { useState, useEffect } from 'react';
import { X, MapPin, ExternalLink, Save, AlertCircle, Camera, Check } from 'lucide-react';
import { Complaint } from '../lib/types';
import { compressImage } from '../lib/imageCompressor';

interface EditComplaintModalProps {
  isOpen: boolean;
  complaint: Complaint | null;
  onClose: () => void;
  onSave: (updated: Complaint) => void;
}

export default function EditComplaintModal({
  isOpen,
  complaint,
  onClose,
  onSave,
}: EditComplaintModalProps) {
  const [formData, setFormData] = useState<Complaint | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (complaint) {
      setFormData({ ...complaint });
    }
  }, [complaint]);

  if (!isOpen || !formData) return null;

  const handleChange = (field: keyof Complaint, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleCoordinateChange = (field: 'latitude' | 'longitude', valStr: string) => {
    const num = parseFloat(valStr);
    handleChange(field, isNaN(num) ? 0 : num);
  };

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const compressed = await compressImage(file, 1600, 0.8);
      handleChange('photo_url', compressed.dataUrl);
    } catch (err) {
      console.error('Failed to compress image', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  const googleMapsUrl = `https://maps.google.com/?q=${formData.latitude || 0},${formData.longitude || 0}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto no-print">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[92vh] animate-in fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#111827] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FF6B00] flex items-center justify-center text-white font-bold">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold leading-tight">แก้ไขข้อมูลคำร้องและพิกัด</h3>
              <p className="text-[11px] text-slate-300">เลขคำร้อง: {formData.ticket_no}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* SECTION 1: พิกัดสถานที่ (ละติจูด, ลองจิจูด) - เน้นเด่นชัด */}
          <div className="bg-amber-50/60 border-2 border-amber-300/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-900 font-bold">
                <MapPin className="w-4 h-4 text-[#FF6B00]" />
                <span className="text-xs">พิกัดสถานที่ (ละติจูด, ลองจิจูด) สำหรับสร้าง QR Code นำทางช่าง</span>
              </div>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white text-slate-800 border border-amber-300 hover:bg-amber-100 text-[11px] font-bold shadow-xs transition-colors"
              >
                <ExternalLink className="w-3 h-3 text-[#FF6B00]" />
                <span>ทดสอบดูบน Google Maps</span>
              </a>
            </div>

            <p className="text-[11px] text-slate-600">
              💡 <strong>คำแนะนำ:</strong> หากในเอกสาร PDF เดิมไม่มีพิกัดระบุมา สามารถเปิด Google Maps ค้นหาจุดเกิดเหตุ แล้วคัดลอกตัวเลข <strong>ละติจูด (Lat)</strong> และ <strong>ลองจิจูด (Lng)</strong> มากรอกในช่องด้านล่างนี้ได้เลยครับ
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  ละติจูด (Latitude) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude ?? ''}
                  onChange={(e) => handleCoordinateChange('latitude', e.target.value)}
                  placeholder="เช่น 12.682845"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs font-semibold focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  ลองจิจูด (Longitude) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude ?? ''}
                  onChange={(e) => handleCoordinateChange('longitude', e.target.value)}
                  placeholder="เช่น 101.281632"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs font-semibold focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] outline-none"
                  required
                />
              </div>
            </div>

            {/* Live QR Code preview */}
            <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-amber-200 mt-2">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=https%3A%2F%2Fmaps.google.com%2F%3Fq%3D${formData.latitude}%2C${formData.longitude}`}
                alt="QR Preview"
                className="w-12 h-12 rounded border border-slate-200 shrink-0"
              />
              <div className="text-[11px]">
                <span className="font-bold text-slate-800">QR Code พิกัดจะอัปเดตอัตโนมัติ:</span>
                <p className="text-slate-500 font-mono text-[10px] break-all">
                  maps.google.com/?q={formData.latitude},{formData.longitude}
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2: ข้อมูลผู้แจ้งและคำร้อง */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">เลขที่คำร้อง</label>
              <input
                type="text"
                value={formData.ticket_no}
                onChange={(e) => handleChange('ticket_no', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono outline-none focus:border-[#FF6B00]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">วัน-เวลา แจ้งเรื่อง</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.created_date}
                  onChange={(e) => handleChange('created_date', e.target.value)}
                  placeholder="เช่น 08 ต.ค. 2569"
                  className="w-2/3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#FF6B00]"
                />
                <input
                  type="text"
                  value={formData.created_time}
                  onChange={(e) => handleChange('created_time', e.target.value)}
                  placeholder="เช่น 18:03:32 น."
                  className="w-1/3 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#FF6B00]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">ผู้แจ้งเรื่อง</label>
              <input
                type="text"
                value={formData.requester_name}
                onChange={(e) => handleChange('requester_name', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#FF6B00]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">เบอร์โทรศัพท์</label>
              <input
                type="text"
                value={formData.requester_phone}
                onChange={(e) => handleChange('requester_phone', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#FF6B00] text-[#FF6B00] font-bold"
              />
            </div>
          </div>

          {/* ชุมชน & ที่อยู่ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">ชุมชน</label>
              <input
                type="text"
                value={formData.community || ''}
                onChange={(e) => handleChange('community', e.target.value)}
                placeholder="เช่น ชุมชนสวนวัดฯ"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#FF6B00]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">ที่อยู่ / สถานที่เกิดเหตุ</label>
              <input
                type="text"
                value={formData.address_full}
                onChange={(e) => handleChange('address_full', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#FF6B00]"
              />
            </div>
          </div>

          {/* หัวข้อเรื่อง & รายละเอียดปัญหา */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">หัวข้อเรื่อง</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#FF6B00] font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">รายละเอียดปัญหา</label>
            <textarea
              rows={2}
              value={formData.problem_detail}
              onChange={(e) => handleChange('problem_detail', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#FF6B00]"
            />
          </div>

          {/* หมายเหตุสำหรับช่าง */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">หมายเหตุ (คำแนะนำช่าง)</label>
            <input
              type="text"
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="เช่น เสาไฟท้ายซอย ช่างเตรียมหลอด LED 50W ไปเปลี่ยน"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#FF6B00]"
            />
          </div>

          {/* รูปถ่ายหน้างาน */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">รูปถ่ายหน้างาน</label>
            <div className="flex items-center gap-3">
              {formData.photo_url ? (
                <img
                  src={formData.photo_url}
                  alt="รูปถ่ายหน้างาน"
                  className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0"
                />
              ) : (
                <div className="w-14 h-14 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 text-[10px] shrink-0">
                  ไม่มีรูป
                </div>
              )}
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  value={formData.photo_url || ''}
                  onChange={(e) => handleChange('photo_url', e.target.value)}
                  placeholder="URL รูปภาพหน้างาน หรืออัปโหลดใหม่"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl outline-none text-[11px]"
                />
                <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer text-[11px] font-semibold transition-colors">
                  <Camera className="w-3.5 h-3.5 text-[#FF6B00]" />
                  <span>{uploadingImage ? 'กำลังประมวลผลรูป...' : 'เลือกเปลี่ยนรูปถ่าย'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageFile}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>บันทึกข้อมูล</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

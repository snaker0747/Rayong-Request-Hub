export interface Complaint {
  id: string;
  ticket_no: string;          // 2. เลขที่คำร้อง (เช่น รย1081069000073)
  created_date: string;       // 3. วันที่ (เช่น 08 ต.ค. 2569)
  created_time: string;       // 4. เวลา (เช่น 18:03:32 น.)
  requester_name: string;     // 5. ผู้แจ้งเรื่อง (เช่น นายอนุชา เพ็ชรรัตน์)
  requester_phone: string;    // 6. เบอร์โทรศัพท์ (เช่น 080 964 5664)
  address_full: string;       // 7. ที่อยู่ (เช่น เลขที่ ชุมชนสวนวัดฯ ถนนราษฎร์บำรุง...)
  subject: string;            // 8. หัวข้อเรื่อง (เช่น หลอดไฟทางชำรุด)
  problem_detail: string;     // 9. รายละเอียด (เช่น ชุมชนสวนวัดฯ บริเวณถนนราษฎร์บำรุง ซ.1 ท้ายซอย หลอดไฟดับ)
  latitude: number;           // 10. ละติจูด
  longitude: number;          // 10. ลองจิจูด
  photo_url?: string;         // 1. รูปภาพหน้างาน
  notes?: string;             // 11. หมายเหตุ
  status: 'pending' | 'assigned' | 'in_progress' | 'completed';
  department?: string;
  officer_name?: string;
  community?: string;
  file_name?: string;
}

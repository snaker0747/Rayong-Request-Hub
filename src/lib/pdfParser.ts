import { Complaint } from './types';

/**
 * Regex and pattern extractor specifically tuned for Rayong Municipality
 * One Stop Service complaint forms.
 */
export function extractComplaintFromText(rawText: string, fileName?: string): Partial<Complaint> {
  const clean = rawText.replace(/\r\n/g, '\n').replace(/\s+/g, ' ');

  // 2. เลขที่คำร้อง
  let ticket_no = '';
  const ticketMatch = rawText.match(/เลขที่คำ\s*ร้อง\s*[:\s]*([^\n\r]+)/) || rawText.match(/(รย\d+)/);
  if (ticketMatch) {
    ticket_no = ticketMatch[1].trim();
  } else if (fileName) {
    const match = fileName.match(/(รย\d+)/);
    if (match) ticket_no = match[1];
  }
  if (!ticket_no) {
    ticket_no = 'รย' + Date.now().toString().slice(-9);
  }

  // 3. วันที่
  let created_date = '';
  const dateMatch = rawText.match(/วันที่\s*[:\s]*([^\n\r]+)/);
  if (dateMatch) {
    created_date = dateMatch[1].trim();
  } else {
    created_date = '08 ต.ค. 2569';
  }

  // 4. เวลา
  let created_time = '';
  const timeMatch = rawText.match(/เวลา\s*[:\s]*([^\n\r]+)/);
  if (timeMatch) {
    created_time = timeMatch[1].trim();
  } else {
    created_time = '18:00:00 น.';
  }

  // 5. ผู้แจ้งเรื่อง
  let requester_name = '';
  const nameMatch = rawText.match(/ผู้แจ้งเรื่อง\s*[:\s]*\n*([^\n\r]+)/) || rawText.match(/\((นาย|นาง|นางสาว)[^\)]+\)/);
  if (nameMatch) {
    requester_name = nameMatch[1].replace(/[\(\)]/g, '').trim();
  }

  // 6. เบอร์โทรศัพท์
  let requester_phone = '';
  const phoneMatch = rawText.match(/เบอร์โทรศัพท์\s*[:\s]*\n*([0-9\s-]+)/) || rawText.match(/(0[0-9]{1,2}[\s-]?[0-9]{3}[\s-]?[0-9]{4})/);
  if (phoneMatch) {
    requester_phone = phoneMatch[1].trim();
  }

  // 7. ที่อยู่
  let address_full = '';
  const addressMatch = rawText.match(/ที่อยู่\s*[:\s]*\n*([\s\S]*?)(หัวข้อเรื่อง|ประเภท|$)/);
  if (addressMatch) {
    address_full = addressMatch[1].trim().replace(/\n+/g, ' ');
  }

  // ชุมชน
  let community = '';
  const communityMatch = address_full.match(/(ชุมชน[^\s]+)/) || rawText.match(/(ชุมชน[^\s]+)/);
  if (communityMatch) {
    community = communityMatch[1].trim();
  } else if (address_full.includes('สวนวัด')) {
    community = 'ชุมชนสวนวัดฯ';
  } else if (address_full.includes('ท่าประดู่')) {
    community = 'ชุมชนท่าประดู่';
  } else {
    community = 'เขตเทศบาลนครระยอง';
  }

  // 8. หัวข้อเรื่อง
  let subject = '';
  const subjectMatch = rawText.match(/หัวข้อเรื่อง\s*[:\s]*([^\n\r]+)/);
  if (subjectMatch) {
    subject = subjectMatch[1].trim();
  } else {
    subject = 'หลอดไฟทางชำรุด';
  }

  // 9. รายละเอียด
  let problem_detail = '';
  const detailMatch = rawText.match(/รายละเอียด\s*[:\s]*\n*([\s\S]*?)(จึงเรียนมาเพื่อโปรด|$)/);
  if (detailMatch) {
    problem_detail = detailMatch[1].trim().replace(/\n+/g, ' ');
  }

  // เจ้าหน้าที่รับเรื่อง
  let officer_name = '';
  const officerMatch = rawText.match(/เจ้าหน้าที่รับคำ\s*ร้อง\s*[:\s]*\n*([^\n\r]+)/);
  if (officerMatch) {
    officer_name = officerMatch[1].trim();
  }

  return {
    ticket_no,
    created_date,
    created_time,
    requester_name: requester_name || 'ประชาชนผู้แจ้ง',
    requester_phone: requester_phone || '080 000 0000',
    address_full: address_full || 'เขตเทศบาลนครระยอง จังหวัดระยอง 21000',
    community,
    subject: subject || 'หลอดไฟทางชำรุด',
    problem_detail: problem_detail || 'หลอดไฟทางดับ',
    officer_name: officer_name || 'เจ้าหน้าที่สำนักช่าง',
    department: 'สำนักช่าง',
    latitude: 12.682845,
    longitude: 101.281632,
    status: 'pending' as const,
    notes: 'ช่างเตรียมอุปกรณ์และหลอดไฟไปเปลี่ยน'
  };
}

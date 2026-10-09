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
  const dateMatch = rawText.match(/วันที่\s*[:\s]*([0-9]{1,2}\s+[^\s0-9]+\s+[0-9]{4})/) || rawText.match(/วันที่\s*[:\s]*([^\n\r]+)/);
  if (dateMatch) {
    created_date = dateMatch[1].trim();
  } else {
    created_date = '08 ต.ค. 2569';
  }

  // 4. เวลา (ดึงเฉพาะรูปแบบเวลา hh:mm:ss น. เพื่อป้องกันข้อความอื่นปนเปื้อน)
  let created_time = '';
  const timeMatch = rawText.match(/เวลา\s*[:\s]*([0-9]{1,2}:[0-9]{2}(?::[0-9]{2})?\s*น\.?)/);
  if (timeMatch) {
    created_time = timeMatch[1].trim();
  } else {
    const timeFallback = rawText.match(/เวลา\s*[:\s]*([^\n\r]+)/);
    if (timeFallback) {
      created_time = timeFallback[1].trim().slice(0, 15);
    } else {
      created_time = '18:00:00 น.';
    }
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
  const addressMatch = rawText.match(/ที่อยู่\s*[:\s]*\n*([\s\S]*?)(?=หัวข้อเรื่อง|ประเภท|หมายเลขบัตร|$)/);
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
  const detailMatch = rawText.match(/รายละเอียด\s*[:\s]*\n*([\s\S]*?)(?=จึงเรียนมาเพื่อโปรด|เจ้าหน้าที่|หัวข้อ|$)/);
  if (detailMatch) {
    problem_detail = detailMatch[1].trim().replace(/\n+/g, ' ');
  }

  // 10. พิกัดสถานที่ (ละติจูด, ลองจิจูด) - ห้าม Gen พิกัดเอง! ถ้าไม่มีใน PDF ให้เป็น 0
  let latitude = 0;
  let longitude = 0;

  // ตรวจสอบพิกัดจากข้อความใน PDF เช่น "12.682845, 101.281632" หรือ "พิกัด: 12.xxx, 101.xxx" หรือ Google Maps link
  const coordRegex = /(?:พิกัด|ละติจูด|lat|latitude)?[:\s]*([1-9][0-9]?\.[0-9]{4,})[\s,]+(?:ลองจิจูด|lng|long|longitude)?[:\s]*([1-9][0-9]{1,2}\.[0-9]{4,})/i;
  const coordMatch = rawText.match(coordRegex);
  if (coordMatch) {
    const lat = parseFloat(coordMatch[1]);
    const lng = parseFloat(coordMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) {
      latitude = lat;
      longitude = lng;
    }
  } else {
    // ค้นหาจากลิงก์ Google Maps ในข้อความถ้ามี
    const mapUrlMatch = rawText.match(/maps\.google\.com[^\s]*[?&]q=([0-9]+\.[0-9]+),([0-9]+\.[0-9]+)/);
    if (mapUrlMatch) {
      const lat = parseFloat(mapUrlMatch[1]);
      const lng = parseFloat(mapUrlMatch[2]);
      if (!isNaN(lat) && !isNaN(lng)) {
        latitude = lat;
        longitude = lng;
      }
    }
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
    latitude,
    longitude,
    status: 'pending' as const,
    notes: 'ช่างเตรียมอุปกรณ์และหลอดไฟไปเปลี่ยน'
  };
}

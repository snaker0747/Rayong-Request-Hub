# Rayong Request Hub (ระบบคัดกรองคำร้องและจัดใบงานไฟฟ้าสาธารณะ เทศบาลนครระยอง)

ระบบเว็บแอปพลิเคชันคัดกรองคำร้องเรื่องร้องทุกข์ไฟฟ้าสาธารณะ เทศบาลนครระยอง จัดทำใบสั่งงานช่าง และระบบพิมพ์สรุปรายงานความคืบหน้า

---

## 🌟 ฟังก์ชันหลักของระบบ (Core Features)

1. **นำเข้าข้อมูลคำร้อง & สกัดข้อความอัตโนมัติ (Batch Import & Parser):**
   - รองรับการลากไฟล์ PDF จากระบบ One Stop Service (OSS) และรูปถ่ายหน้างานจริง
   - มีระบบดึงข้อมูลอัตโนมัติ (เลขที่คำร้อง, วันเวลา, ผู้แจ้ง, เบอร์โทร, พิกัด GPS, รายละเอียด)
   - บีบอัดรูปถ่ายหน้างานบน Browser ด้วย Canvas API ก่อนบันทึก ช่วยประหยัดพื้นที่และไม่กิน Bandwidth ของ Vercel / Supabase

2. **พิมพ์ใบสั่งงานช่างภาคสนาม (1 งาน / 1 หน้า A4 แนวตั้ง):**
   - แสดงข้อมูลตามแบบฟอร์มมาตรฐาน 11 หัวข้อสำคัญ:
     1. รูปภาพหน้างาน (ขยายใหญ่ คมชัด)
     2. เลขที่คำร้อง
     3. วันที่
     4. เวลา
     5. ผู้แจ้งเรื่อง
     6. เบอร์โทรศัพท์
     7. ที่อยู่
     8. หัวข้อเรื่อง
     9. รายละเอียด
     10. พิกัดสถานที่ (ละติจูด, ลองจิจูด) พร้อม QR Code สแกนนำทางผ่าน Google Maps
     11. หมายเหตุ
   - จัดหน้า A4 แนวตั้ง คมชัด ไม่ล้นหน้า ไร้ส่วนที่ไม่จำเป็น

3. **พิมพ์ตารางสรุปรายงานรวม (Summary Table Print):**
   - สามารถเลือกช่วงวันที่ (Date Range Picker) ก่อนสั่งพิมพ์สรุปรายการ
   - จัดรูปแบบตารางกระทัดรัด พร้อมช่องสำหรับลงบันทึกการทำงาน

4. **แดชบอร์ดสรุปผลจากข้อมูลจริง (Real Data Dashboard):**
   - แสดงจำนวนคำร้องจริง ยอดรอดำเนินการ เปิดใบงานแล้ว และซ่อมเสร็จแล้ว
   - สรุปสถิติแยกตามชุมชนและแยกตามหัวข้อเรื่องจากเอกสารคำร้องจริง

5. **ระบบค้นหาและประวัติ (Audit & Search):**
   - ค้นหาคำร้องย้อนหลังตามเลขที่คำร้อง ชื่อ หรือเบอร์โทร
   - ดูรูปถ่ายขนาดใหญ่ผ่าน Lightbox Modal

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend & Framework:** Next.js 14 (App Router), React, TypeScript
- **Styling:** Tailwind CSS, Lucide Icons
- **Database & Storage:** Supabase (PostgreSQL) พร้อม LocalStorage Fallback สำหรับทำงาน Offline
- **Cloud Architecture:** Vercel Hosting + Google Drive Photo Backup

---

## 🚀 วิธีการติดตั้งและรันในเครื่อง (Local Setup)

```bash
# 1. ติดตั้ง Dependencies
npm install

# 2. คัดลอกไฟล์ Environment Variables
cp .env.example .env.local

# 3. รันเซิร์ฟเวอร์สำหรับ Development
npm run dev
```

เปิดบราวเซอร์ที่ [http://localhost:3000](http://localhost:3000)

---

## 🗄️ การตั้งค่า Supabase Database

1. เข้าไปที่แดชบอร์ด [Supabase](https://supabase.com/) และสร้าง Project ใหม่
2. ไปที่เมนู **SQL Editor**
3. คัดลอกคำสั่ง SQL จากไฟล์ `supabase_schema.sql` ในโปรเจกต์นี้ วางและกด **Run**
4. นำ **Project URL** และ **Anon Key** จาก Settings > API มาใส่ใน `.env.local` หรือ Environment Variables บน Vercel:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

---

## 🌐 การนำขึ้น Vercel (Deployment)

1. Import Repository นี้เข้าไปใน [Vercel](https://vercel.com/)
2. ตั้งค่า Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
3. กด **Deploy** ใช้งานได้ทันที

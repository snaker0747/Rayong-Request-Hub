import { createClient } from '@supabase/supabase-js';
import { Complaint } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local storage storage key fallback
const LOCAL_STORAGE_KEY = 'rayong_complaints_data';

export async function fetchComplaints(): Promise<Complaint[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data && data.length > 0) {
        return data as Complaint[];
      }
    } catch (e) {
      console.warn('Supabase fetch failed, using local storage fallback', e);
    }
  }

  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
  }

  // Default initial sample data from the real municipality PDF & photo
  return getDefaultSamples();
}

export async function saveComplaints(complaints: Complaint[]): Promise<boolean> {
  // Always update local storage
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(complaints));
  }

  if (isSupabaseConfigured && supabase) {
    try {
      // Upsert into Supabase
      const { error } = await supabase
        .from('complaints')
        .upsert(complaints, { onConflict: 'ticket_no' });
      return !error;
    } catch (e) {
      console.error('Supabase save error', e);
    }
  }

  return true;
}

export function getDefaultSamples(): Complaint[] {
  return [
    {
      id: '1',
      ticket_no: 'รย1081069000073',
      created_date: '08 ต.ค. 2569',
      created_time: '18:03:32 น.',
      requester_name: 'นายอนุชา เพ็ชรรัตน์',
      requester_phone: '080 964 5664',
      address_full: 'เลขที่ ชุมชนสวนวัดฯ ถนนราษฎร์บำรุง ตำบลเชิงเนิน อำเภอเมืองระยอง จังหวัดระยอง 21000',
      subject: 'หลอดไฟทางชำรุด',
      problem_detail: 'ชุมชนสวนวัดฯ บริเวณถนนราษฎร์บำรุง ซ.1 (ท้ายซอย สามแยก) หลอดไฟทางดับ',
      latitude: 12.682845,
      longitude: 101.281632,
      photo_url: '/sample_site_photo.jpg',
      notes: 'เสาไฟท้ายซอย 1 ติดป้ายซอย ช่างนำหลอด LED 50W ไปเปลี่ยน',
      status: 'assigned',
      community: 'ชุมชนสวนวัดฯ',
      officer_name: 'นางสาวภัคพร นวลศรี'
    },
    {
      id: '2',
      ticket_no: 'รย1081069000074',
      created_date: '08 ต.ค. 2569',
      created_time: '18:45:10 น.',
      requester_name: 'นางสมพร จันทร์เพ็ชร',
      requester_phone: '081 234 5678',
      address_full: 'เลขที่ ชุมชนสวนวัดฯ ถนนสุขุมวิท ซอยสวนวัด 4 ตำบลเชิงเนิน อำเภอเมืองระยอง จังหวัดระยอง 21000',
      subject: 'โคมไฟกิ่งกระพริบ',
      problem_detail: 'ถนนสุขุมวิท ซอยสวนวัด 4 หน้าศาลพระภูมิ โคมไฟกิ่งติดๆ ดับๆ ตลอดคืน',
      latitude: 12.684120,
      longitude: 101.284510,
      photo_url: '',
      notes: 'เสาสูง 6 เมตร ช่างเตรียมรถกระเช้าและเปลี่ยนสวิตช์แสงแดดใหม่',
      status: 'assigned',
      community: 'ชุมชนสวนวัดฯ',
      officer_name: 'นางสาวภัคพร นวลศรี'
    },
    {
      id: '3',
      ticket_no: 'รย1081069000075',
      created_date: '08 ต.ค. 2569',
      created_time: '19:10:02 น.',
      requester_name: 'นายวีระชาติ ทับทิม',
      requester_phone: '089 998 8776',
      address_full: 'เลขที่ ชุมชนท่าประดู่ ถนนยมจินดา ตำบลท่าประดู่ อำเภอเมืองระยอง จังหวัดระยอง 21000',
      subject: 'สายไฟหย่อนต่ำ',
      problem_detail: 'ถนนยมจินดา ตรงข้ามร้านขนมไทยโบราณ สายไฟพาดกิ่งไม้หย่อนต่ำอันตราย',
      latitude: 12.681120,
      longitude: 101.278910,
      photo_url: '',
      notes: 'ดึงสายไฟให้ตึง และประสานตัดแต่งกิ่งไม้',
      status: 'pending',
      community: 'ชุมชนท่าประดู่',
      officer_name: 'นางสาวภัคพร นวลศรี'
    }
  ];
}

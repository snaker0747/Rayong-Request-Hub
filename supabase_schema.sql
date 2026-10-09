-- SQL Schema for Rayong Lighting Complaints System (เทศบาลนครระยอง)
-- Run this in Supabase SQL Editor

-- 1. Create table for complaints
CREATE TABLE IF NOT EXISTS complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_no VARCHAR(50) UNIQUE NOT NULL,
  created_date VARCHAR(50) NOT NULL,
  created_time VARCHAR(50),
  department VARCHAR(100) DEFAULT 'สำนักช่าง',
  officer_name VARCHAR(100),
  category VARCHAR(100) DEFAULT 'ระบบสาธารณูปโภค : ไฟฟ้าสาธารณะดับ/ชำรุด',
  requester_name VARCHAR(100),
  requester_phone VARCHAR(50),
  requester_id_card VARCHAR(50),
  address_full TEXT,
  community VARCHAR(100),
  road_subsoi TEXT,
  subject VARCHAR(200),
  problem_detail TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  photo_url TEXT,
  gdrive_file_id VARCHAR(100),
  gdrive_folder_url TEXT DEFAULT 'https://drive.google.com/drive/folders/1UVIfn1_EOxa6kGUG63QGVCUe9TUZxfX3?usp=sharing',
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'assigned', 'in_progress', 'completed'
  assigned_crew VARCHAR(100),
  technician_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create index for fast searching
CREATE INDEX IF NOT EXISTS idx_complaints_ticket_no ON complaints(ticket_no);
CREATE INDEX IF NOT EXISTS idx_complaints_community ON complaints(community);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON complaints(created_at);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

-- 4. Create public policy for reading and inserting complaints
CREATE POLICY "Allow public read access" ON complaints FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON complaints FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON complaints FOR UPDATE USING (true);

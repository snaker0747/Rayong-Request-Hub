import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ระบบคัดกรองคำร้องและจัดใบงานไฟฟ้าสาธารณะ - เทศบาลนครระยอง',
  description: 'ระบบคัดกรองคำร้อง One Stop Service สำนักช่าง เทศบาลนครระยอง',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-[#F8F9FB] text-slate-800 antialiased flex flex-row">
        {children}
      </body>
    </html>
  );
}

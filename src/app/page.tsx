'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Banner from '../components/Banner';
import DashboardTab from '../components/DashboardTab';
import UploadTab from '../components/UploadTab';
import DispatchTab from '../components/DispatchTab';
import AuditTab from '../components/AuditTab';
import PhotoModal from '../components/PhotoModal';
import { Complaint } from '../lib/types';
import { fetchComplaints, saveComplaints } from '../lib/supabase';

export default function Home() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'upload' | 'dispatch' | 'audit'>('dashboard');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stagedComplaints, setStagedComplaints] = useState<Complaint[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Photo Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  // Initial load
  useEffect(() => {
    async function loadData() {
      const data = await fetchComplaints();
      setComplaints(data);
    }
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleOpenPhoto = (url: string, title: string) => {
    setModalImage(url);
    setModalTitle(title);
    setModalOpen(true);
  };

  const handleConfirmJobs = async (newJobs: Complaint[]) => {
    const updated = [...newJobs, ...complaints];
    setComplaints(updated);
    await saveComplaints(updated);
    showToast(`เปิดใบงานสำเร็จ ${newJobs.length} รายการ`);
    setTimeout(() => {
      setCurrentTab('dispatch');
    }, 500);
  };

  const handleUpdateComplaint = async (updated: Complaint) => {
    const list = complaints.map(c => c.id === updated.id ? updated : c);
    setComplaints(list);
    await saveComplaints(list);
    showToast(`อัปเดตข้อมูลและพิกัดเรียบร้อย (${updated.ticket_no})`);
  };

  const pendingCount = stagedComplaints.length;

  return (
    <>
      {/* 1. Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab as any)}
        pendingCount={pendingCount}
      />

      {/* 2. Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Header */}
        <Header
          onSearch={(q) => {
            if (q.trim()) {
              setCurrentTab('audit');
            }
          }}
          onUploadClick={() => setCurrentTab('upload')}
        />

        {/* Content Body */}
        <main className="p-6 flex-1 max-w-7xl w-full mx-auto">
          {/* Banner */}
          <Banner />

          {currentTab === 'dashboard' && (
            <DashboardTab
              complaints={complaints}
              onGoToDispatch={() => setCurrentTab('dispatch')}
            />
          )}

          {currentTab === 'upload' && (
            <UploadTab
              stagedComplaints={stagedComplaints}
              setStagedComplaints={setStagedComplaints}
              onConfirmJobs={handleConfirmJobs}
              onOpenPhotoModal={handleOpenPhoto}
              showToast={showToast}
            />
          )}

          {currentTab === 'dispatch' && (
            <DispatchTab
              complaints={complaints}
              showToast={showToast}
            />
          )}

          {currentTab === 'audit' && (
            <AuditTab
              complaints={complaints}
              onOpenPhotoModal={handleOpenPhoto}
              onGoToDispatch={() => setCurrentTab('dispatch')}
              onUpdateComplaint={handleUpdateComplaint}
            />
          )}
        </main>
      </div>

      {/* 3. Photo Modal */}
      <PhotoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        imageUrl={modalImage}
        title={modalTitle}
      />

      {/* 4. Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 z-50 animate-bounce">
          <span className="text-emerald-400">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}

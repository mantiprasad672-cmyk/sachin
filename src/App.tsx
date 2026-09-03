import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { RegistrationForm } from './components/registration/RegistrationForm';
import { RegistrationSuccess } from './components/registration/RegistrationSuccess';
import { AdminPanel } from './components/admin/AdminPanel';
import { MemberDashboard } from './components/dashboard/MemberDashboard';
import { MemberRegistration, NotificationItem } from './types';
import { storageService } from './services/storageService';
import { ShieldCheck, ArrowRight, Building2, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'form' | 'admin' | 'dashboard' | 'success'>('form');
  const [members, setMembers] = useState<MemberRegistration[]>([]);
  const [selectedMember, setSelectedMember] = useState<MemberRegistration | null>(null);
  const [latestRegistration, setLatestRegistration] = useState<MemberRegistration | null>(null);
  const [editingRegistrationData, setEditingRegistrationData] = useState<Partial<MemberRegistration> | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Refresh data from storage
  const reloadData = () => {
    const list = storageService.getMembers();
    setMembers(list);
    setNotifications(storageService.getNotifications());
    if (!selectedMember && list.length > 0) {
      setSelectedMember(list[0]);
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  // When a new registration is submitted
  const handleRegistrationSuccess = (newReg: MemberRegistration) => {
    setLatestRegistration(newReg);
    setSelectedMember(newReg);
    reloadData();
    setCurrentView('success');
  };

  // Quick Approve newly submitted application from the success screen
  const handleQuickApprove = () => {
    if (!latestRegistration) return;
    storageService.approveMember(latestRegistration.id, 'Super Admin (One-Click Demo)');
    reloadData();
    const updated = storageService.getMemberById(latestRegistration.id);
    if (updated) {
      setLatestRegistration(updated);
      setSelectedMember(updated);
    }
  };

  // Edit newly submitted or existing member
  const handleEditRegistration = () => {
    if (latestRegistration) {
      setEditingRegistrationData(latestRegistration);
      setCurrentView('form');
    }
  };

  const handleOpenNewRegistration = () => {
    setEditingRegistrationData(null);
    setCurrentView('form');
  };

  const handleMarkNotificationsRead = () => {
    storageService.markNotificationsRead();
    setNotifications(storageService.getNotifications());
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'form') {
            setEditingRegistrationData(null);
          }
          setCurrentView(view);
        }}
        members={members}
        selectedMember={selectedMember}
        onSelectMember={(m) => {
          setSelectedMember(m);
        }}
        notifications={notifications}
        onMarkNotificationsRead={handleMarkNotificationsRead}
      />

      {/* Main Viewport */}
      <main className="flex-1">
        {/* Quick Testing Bar for User Experience */}
        <div className="no-print bg-slate-900 text-slate-300 px-4 py-2 text-xs border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="font-semibold text-white">Smart Society Management:</span>
              <span className="hidden sm:inline text-slate-400">
                Complete Registration Flow (Enrollment → Validation → Admin Review → Member Portal)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-400">Quick Demo Switch:</span>
              <button
                onClick={() => {
                  setEditingRegistrationData(null);
                  setCurrentView('form');
                }}
                className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  currentView === 'form' ? 'bg-blue-600 text-white shadow-xs' : 'hover:text-white'
                }`}
              >
                1. Registration
              </button>
              <button
                onClick={() => setCurrentView('admin')}
                className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  currentView === 'admin' ? 'bg-blue-600 text-white shadow-xs' : 'hover:text-white'
                }`}
              >
                2. Admin Hub
              </button>
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  currentView === 'dashboard' ? 'bg-blue-600 text-white shadow-xs' : 'hover:text-white'
                }`}
              >
                3. Resident Portal
              </button>
            </div>
          </div>
        </div>

        {/* Views */}
        {currentView === 'form' && (
          <RegistrationForm
            onSuccess={handleRegistrationSuccess}
            initialData={editingRegistrationData}
          />
        )}

        {currentView === 'success' && latestRegistration && (
          <RegistrationSuccess
            registration={latestRegistration}
            onGoToDashboard={() => setCurrentView('dashboard')}
            onEditRegistration={handleEditRegistration}
            onQuickApprove={handleQuickApprove}
            onNewRegistration={handleOpenNewRegistration}
          />
        )}

        {currentView === 'admin' && (
          <AdminPanel
            members={members}
            onRefresh={reloadData}
            onOpenDashboardForMember={(m) => {
              setSelectedMember(m);
              setCurrentView('dashboard');
            }}
          />
        )}

        {currentView === 'dashboard' && (
          selectedMember ? (
            <MemberDashboard
              member={selectedMember}
              onUpdateMember={(updated) => {
                storageService.updateMember(updated.id, updated);
                setSelectedMember(updated);
                reloadData();
              }}
              onOpenRegistration={handleOpenNewRegistration}
            />
          ) : (
            <div className="max-w-md mx-auto my-16 text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 text-base">No Member Profile Selected</h3>
              <p className="text-xs text-slate-600 mt-1 mb-4">
                Please submit a registration or choose an existing approved resident from the demo switcher.
              </p>
              <button
                onClick={handleOpenNewRegistration}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
              >
                Open Registration Form
              </button>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 py-6 mt-12 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-800">
              Greenfield Heights Co-operative Housing Society Ltd.
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-700">
            <span>Registration Form ISO 27001 Certified</span>
            <span>•</span>
            <span>Security Bylaws & Fire Safety Compliant</span>
            <span>•</span>
            <span>Version 2.4</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  UserCheck,
  FileText,
  Bell,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { MemberRegistration, NotificationItem } from '../types';

interface NavbarProps {
  currentView: 'form' | 'admin' | 'dashboard' | 'success';
  onNavigate: (view: 'form' | 'admin' | 'dashboard') => void;
  members: MemberRegistration[];
  selectedMember: MemberRegistration | null;
  onSelectMember: (member: MemberRegistration) => void;
  notifications: NotificationItem[];
  onMarkNotificationsRead: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  members,
  selectedMember,
  onSelectMember,
  notifications,
  onMarkNotificationsRead,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingCount = members.filter((m) => m.status === 'Pending Approval').length;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Society Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('form')}
              className="flex items-center gap-3 text-left group focus:outline-none"
              id="brand-logo-btn"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">
                    Greenfield Heights
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    Smart Society
                  </span>
                </div>
                <p className="text-xs text-slate-700 hidden sm:block">
                  Co-operative Housing Society Ltd. • Reg #CHS-2021-984
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              id="nav-registration-btn"
              onClick={() => onNavigate('form')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'form' || currentView === 'success'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200/60 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Registration Form</span>
            </button>

            <button
              id="nav-admin-btn"
              onClick={() => onNavigate('admin')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                currentView === 'admin'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Panel</span>
              {pendingCount > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-xs font-bold ${
                    currentView === 'admin'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-amber-500 text-white'
                  }`}
                >
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              id="nav-dashboard-btn"
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200/60 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Resident Dashboard</span>
            </button>
          </nav>

          {/* Right Side: Account Switcher & Notifications */}
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <div className="relative">
              <button
                id="notification-bell-btn"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications && unreadNotificationsCount > 0) {
                    onMarkNotificationsRead();
                  }
                }}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in-50 duration-150">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">System Notifications</span>
                    <span className="text-xs text-slate-700">{notifications.length} alerts</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-700">No new notifications</div>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif.id} className="p-3 hover:bg-slate-50 transition-colors">
                          <div className="flex items-start gap-2">
                            {notif.type === 'success' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-900">{notif.title}</p>
                              <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{notif.message}</p>
                              <p className="text-[10px] text-slate-600 mt-1">
                                {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                id="account-switcher-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-100 transition-all text-xs font-medium text-slate-700"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                  {selectedMember ? selectedMember.fullName.charAt(0) : 'R'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="font-semibold text-slate-900 leading-tight">
                    {selectedMember ? selectedMember.fullName.split(' ')[0] : 'Resident'}
                  </div>
                  <div className="text-[10px] text-slate-700 leading-none">
                    {selectedMember ? `${selectedMember.buildingWing} #${selectedMember.flatNumber}` : 'Demo Profile'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
              </button>

              {/* User switcher dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-800">Switch Demo Account / View</p>
                    <p className="text-[11px] text-slate-600">Quickly test approvals and resident views</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => {
                        onNavigate('admin');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-slate-100 flex items-center gap-2.5 text-xs text-slate-800"
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
                        A
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900">Ramesh Mehta (Admin)</div>
                        <div className="text-[10px] text-slate-700">Managing Committee President</div>
                      </div>
                    </button>

                    <div className="border-t border-slate-100 my-1 pt-1">
                      <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                        Registered Residents:
                      </p>
                      {members.slice(0, 3).map((m) => (
                        <button
                          key={m.id}
                          onClick={() => {
                            onSelectMember(m);
                            onNavigate('dashboard');
                            setShowUserMenu(false);
                          }}
                          className={`w-full text-left p-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-xs transition-colors ${
                            selectedMember?.id === m.id ? 'bg-blue-50 text-blue-900 font-medium' : 'text-slate-700'
                          }`}
                        >
                          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-medium text-[10px]">
                            {m.fullName.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="truncate font-medium">{m.fullName}</div>
                            <div className="text-[10px] text-slate-700 flex items-center gap-1.5">
                              <span>{m.buildingWing} #{m.flatNumber}</span>
                              <span>•</span>
                              <span className={m.status === 'Approved' ? 'text-blue-600 font-medium' : 'text-amber-600 font-medium'}>
                                {m.status}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          onNavigate('form');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-semibold flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span>+ Open New Registration Form</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <button
            onClick={() => {
              onNavigate('form');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between p-2.5 rounded-lg text-sm font-medium ${
              currentView === 'form' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" /> Registration Form
            </span>
          </button>
          <button
            onClick={() => {
              onNavigate('admin');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between p-2.5 rounded-lg text-sm font-medium ${
              currentView === 'admin' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Admin Panel
            </span>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-amber-400 text-slate-950 font-bold">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              onNavigate('dashboard');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between p-2.5 rounded-lg text-sm font-medium ${
              currentView === 'dashboard' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" /> Resident Dashboard
            </span>
          </button>
        </div>
      )}
    </header>
  );
};

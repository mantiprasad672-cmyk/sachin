import React, { useState } from 'react';
import {
  Shield,
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  UserX,
  UserCheck,
  Building,
  Users,
  Car,
  Dog,
  FileText,
  History,
  AlertTriangle,
  ChevronRight,
  X,
  Phone,
  Mail,
  Home,
  Check,
} from 'lucide-react';
import {
  MemberRegistration,
  BuildingWing,
  MemberType,
  RegistrationStatus,
  AuditLog,
} from '../../types';
import { storageService } from '../../services/storageService';
import { ReceiptModal } from '../registration/ReceiptModal';

interface AdminPanelProps {
  members: MemberRegistration[];
  onRefresh: () => void;
  onOpenDashboardForMember: (member: MemberRegistration) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  members,
  onRefresh,
  onOpenDashboardForMember,
}) => {
  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWing, setSelectedWing] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [flatFilter, setFlatFilter] = useState('');

  // Selected Member for Modal View / Edit
  const [viewingMember, setViewingMember] = useState<MemberRegistration | null>(null);
  const [editingMember, setEditingMember] = useState<MemberRegistration | null>(null);
  const [rejectModalMember, setRejectModalMember] = useState<MemberRegistration | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showReceiptMember, setShowReceiptMember] = useState<MemberRegistration | null>(null);

  // Tab: Members list vs Audit Logs
  const [adminTab, setAdminTab] = useState<'members' | 'audit'>('members');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(storageService.getAuditLogs());

  // Metrics
  const totalCount = members.length;
  const approvedCount = members.filter((m) => m.status === 'Approved').length;
  const pendingCount = members.filter((m) => m.status === 'Pending Approval').length;
  const totalVehicles = members.reduce((acc, m) => acc + (m.vehicles?.length || 0), 0);

  // Filtered members
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.contactPhone.includes(searchTerm) ||
      m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.flatNumber.includes(searchTerm);

    const matchesWing = selectedWing === 'All' || m.buildingWing === selectedWing;
    const matchesType = selectedType === 'All' || m.memberType === selectedType;
    const matchesStatus = selectedStatus === 'All' || m.status === selectedStatus;
    const matchesFlat = !flatFilter || m.flatNumber.includes(flatFilter.trim());

    return matchesSearch && matchesWing && matchesType && matchesStatus && matchesFlat;
  });

  // Action Handlers
  const handleApprove = (id: string) => {
    storageService.approveMember(id, 'Super Admin (Managing Committee)');
    onRefresh();
    setAuditLogs(storageService.getAuditLogs());
    if (viewingMember && viewingMember.id === id) {
      setViewingMember(storageService.getMemberById(id) || null);
    }
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalMember) return;
    storageService.rejectMember(
      rejectModalMember.id,
      rejectionReason.trim() || 'Incomplete identity verification documents.',
      'Super Admin'
    );
    setRejectModalMember(null);
    setRejectionReason('');
    onRefresh();
    setAuditLogs(storageService.getAuditLogs());
    if (viewingMember && viewingMember.id === rejectModalMember.id) {
      setViewingMember(storageService.getMemberById(rejectModalMember.id) || null);
    }
  };

  const handleToggleActive = (id: string) => {
    storageService.toggleMemberStatus(id, 'Super Admin');
    onRefresh();
    setAuditLogs(storageService.getAuditLogs());
    if (viewingMember && viewingMember.id === id) {
      setViewingMember(storageService.getMemberById(id) || null);
    }
  };

  const handleExportCSV = () => {
    const csvContent = storageService.exportMembersCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Society_Members_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    storageService.updateMember(editingMember.id, editingMember);
    setEditingMember(null);
    onRefresh();
    setAuditLogs(storageService.getAuditLogs());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-900 text-blue-400">
              Administrative Control Hub
            </span>
            <span className="text-xs text-slate-500">Greenfield Heights CHS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Society Members & Applications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Review resident registrations, manage apartments, approve gate access, and track compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab Switcher: Members vs Audit Logs */}
          <div className="bg-slate-100 border border-slate-200 p-1 rounded-lg flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setAdminTab('members')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                adminTab === 'members'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Registered Members ({members.length})
            </button>
            <button
              onClick={() => {
                setAdminTab('audit');
                setAuditLogs(storageService.getAuditLogs());
              }}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                adminTab === 'audit'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Audit Logs</span>
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            id="export-csv-btn"
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Enrolled</span>
            <Users className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{totalCount}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Society residents logged</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-blue-200 bg-blue-50/20 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Approved Members</span>
            <CheckCircle className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-800 mt-2">{approvedCount}</div>
          <p className="text-[11px] text-blue-700 mt-0.5">Verified active residents</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-amber-200 bg-amber-50/40 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Pending Approvals</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-800 mt-2">{pendingCount}</div>
          <p className="text-[11px] text-amber-700 mt-0.5">Requires committee review</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vehicles Registered</span>
            <Car className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{totalVehicles}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">RFID parking tags active</p>
        </div>
      </div>

      {adminTab === 'audit' ? (
        /* AUDIT LOGS VIEW */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-slate-700" />
              <h3 className="font-bold text-sm text-slate-900">Security & Governance Audit Trail</h3>
            </div>
            <span className="text-xs text-slate-500">{auditLogs.length} events recorded</span>
          </div>
          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                  LOG
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{log.details}</p>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                    <span>Actor: <strong className="font-semibold text-slate-800">{log.actorName}</strong> ({log.actorRole})</span>
                    <span>•</span>
                    <span>Target: <code className="bg-slate-100 px-1.5 py-0.5 rounded">{log.targetId}</code></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* MEMBERS TABLE VIEW */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Search & Filter Bar */}
          <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search member by name, flat, phone, email, or application ID..."
                className="w-full pl-9 pr-3 py-2 bg-white rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedWing}
                onChange={(e) => setSelectedWing(e.target.value)}
                className="px-2.5 py-2 bg-white rounded-lg border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="All">All Wings</option>
                <option value="Wing A">Wing A</option>
                <option value="Wing B">Wing B</option>
                <option value="Wing C">Wing C</option>
                <option value="Wing D">Wing D</option>
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-2.5 py-2 bg-white rounded-lg border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="All">All Types</option>
                <option value="Owner">Owner</option>
                <option value="Tenant">Tenant</option>
                <option value="Family Member">Family Member</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-2.5 py-2 bg-white rounded-lg border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="All">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="Rejected">Rejected</option>
                <option value="Deactivated">Deactivated</option>
              </select>
            </div>
          </div>

          {/* Members Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Resident Member</th>
                  <th className="py-3 px-4">Flat / Wing</th>
                  <th className="py-3 px-4">Member Type</th>
                  <th className="py-3 px-4">Vehicles / Pets</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 italic">
                      No members match the current filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">
                            {m.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{m.fullName}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <span>{m.contactPhone}</span>
                              <span>•</span>
                              <span className="truncate max-w-[120px]">{m.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Flat & Wing */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900">{m.buildingWing}</span>
                        <span className="block text-[11px] text-slate-500 font-mono">
                          Flat #{m.flatNumber}
                        </span>
                      </td>

                      {/* Member Type */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                            m.memberType === 'Owner'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {m.memberType}
                        </span>
                      </td>

                      {/* Vehicles & Pets */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <span className="flex items-center gap-1 font-medium">
                            <Car className="w-3.5 h-3.5 text-blue-500" />
                            {m.vehicles?.length || 0}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-medium">
                            <Dog className="w-3.5 h-3.5 text-amber-500" />
                            {m.hasPets ? m.pets.length : 0}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            m.status === 'Approved'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : m.status === 'Pending Approval'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : m.status === 'Rejected'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {m.status === 'Approved' && <CheckCircle className="w-3 h-3" />}
                          {m.status === 'Pending Approval' && <Clock className="w-3 h-3" />}
                          {m.status}
                        </span>
                      </td>

                      {/* Submitted Date */}
                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(m.submittedAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View details */}
                          <button
                            onClick={() => setViewingMember(m)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="View full profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Quick Approve / Reject if Pending */}
                          {m.status === 'Pending Approval' && (
                            <>
                              <button
                                onClick={() => handleApprove(m.id)}
                                className="p-1.5 rounded-lg text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                                title="Approve application"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setRejectModalMember(m)}
                                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                                title="Reject application"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {/* Edit member */}
                          <button
                            onClick={() => setEditingMember(m)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="Edit details"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Switch to Resident Dashboard */}
                          <button
                            onClick={() => onOpenDashboardForMember(m)}
                            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors"
                            title="Open in resident dashboard"
                          >
                            View Dashboard
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MEMBER DETAIL MODAL */}
      {viewingMember && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden">
            {/* Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-blue-400 font-bold">{viewingMember.id}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {viewingMember.buildingWing} Flat #{viewingMember.flatNumber}
                  </span>
                </div>
                <h3 className="text-lg font-bold mt-0.5">{viewingMember.fullName}</h3>
              </div>
              <button
                onClick={() => setViewingMember(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
              {/* Status Banner */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-500 font-medium">Status: </span>
                  <span className="font-bold text-slate-900">{viewingMember.status}</span>
                  {viewingMember.reviewedBy && (
                    <span className="text-slate-500 text-[11px] block">
                      Reviewed by: {viewingMember.reviewedBy}
                    </span>
                  )}
                  {viewingMember.rejectionReason && (
                    <span className="text-rose-600 text-[11px] font-medium block">
                      Rejection Reason: {viewingMember.rejectionReason}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {viewingMember.status === 'Pending Approval' && (
                    <>
                      <button
                        onClick={() => handleApprove(viewingMember.id)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs"
                      >
                        Approve Application
                      </button>
                      <button
                        onClick={() => setRejectModalMember(viewingMember)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setShowReceiptMember(viewingMember)}
                    className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg font-semibold"
                  >
                    View Official Receipt
                  </button>
                </div>
              </div>

              {/* Personal & Emergency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Personal & Contact
                  </h4>
                  <div className="space-y-1.5">
                    <div>Phone: <strong className="text-slate-800">{viewingMember.contactPhone}</strong></div>
                    <div>Email: <strong className="text-slate-800">{viewingMember.email}</strong></div>
                    <div>Member Type: <strong className="text-slate-800">{viewingMember.memberType}</strong></div>
                    <div>Building: <strong className="text-slate-800">{viewingMember.buildingWing}</strong></div>
                    <div>Flat: <strong className="text-slate-800">{viewingMember.flatNumber}</strong></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Emergency Contact
                  </h4>
                  <div className="space-y-1.5">
                    <div>Name: <strong className="text-slate-800">{viewingMember.emergencyContact?.name}</strong></div>
                    <div>Relation: <strong className="text-slate-800">{viewingMember.emergencyContact?.relationship}</strong></div>
                    <div>Phone: <strong className="text-slate-800">{viewingMember.emergencyContact?.phone}</strong></div>
                    {viewingMember.emergencyContact?.alternatePhone && (
                      <div>Alt Phone: <strong className="text-slate-800">{viewingMember.emergencyContact.alternatePhone}</strong></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Family Members */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Family Members ({viewingMember.familyMembers?.length || 0})
                </h4>
                {viewingMember.familyMembers && viewingMember.familyMembers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {viewingMember.familyMembers.map((fam, i) => (
                      <div key={i} className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="font-bold text-slate-900">{fam.fullName}</span>
                        <span className="text-slate-500 block text-[11px]">
                          {fam.relation} • {fam.age} years old
                        </span>
                        {fam.contactNumber && (
                          <span className="text-slate-500 text-[11px] block">{fam.contactNumber}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">No co-residents specified.</p>
                )}
              </div>

              {/* Vehicles */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Vehicles ({viewingMember.vehicles?.length || 0})
                </h4>
                {viewingMember.vehicles && viewingMember.vehicles.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {viewingMember.vehicles.map((v, i) => (
                      <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="font-bold text-slate-900">{v.registrationNumber}</div>
                        <div className="text-[11px] text-slate-500">
                          {v.make} {v.model} ({v.type}) • Color: {v.color}
                        </div>
                        <div className="text-[11px] font-medium text-blue-700 mt-0.5">
                          Parking Slot: {v.parkingSlot || 'Unassigned'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">No vehicles registered.</p>
                )}
              </div>

              {/* Pets */}
              {viewingMember.hasPets && (
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40">
                  <h4 className="font-bold text-amber-900 uppercase tracking-wider mb-2">Pets</h4>
                  {viewingMember.pets?.map((pet, i) => (
                    <div key={i} className="text-slate-800">
                      <strong>{pet.name}</strong> ({pet.type} - {pet.breed}, {pet.age}) • Vaccination: {pet.vaccinationStatus}
                      {pet.additionalInfo && <p className="text-[11px] text-slate-500">{pet.additionalInfo}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* Tenant Details */}
              {viewingMember.tenantDetails?.isRenting && (
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2">Tenancy Information</h4>
                  <div className="grid grid-cols-2 gap-2 text-slate-800">
                    <div>Tenant Name: <strong>{viewingMember.tenantDetails.tenantFullName}</strong></div>
                    <div>Period: <strong>{viewingMember.tenantDetails.rentalStartDate} to {viewingMember.tenantDetails.rentalEndDate}</strong></div>
                    <div>Owner Name: <strong>{viewingMember.tenantDetails.ownerName}</strong></div>
                    <div>Owner Contact: <strong>{viewingMember.tenantDetails.ownerContactNumber}</strong></div>
                  </div>
                </div>
              )}

              {/* Documents */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Uploaded Documents ({viewingMember.documents?.length || 0})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {viewingMember.documents?.map((doc, i) => (
                    <div key={i} className="p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                        <div className="truncate">
                          <p className="font-semibold text-slate-900 truncate">{doc.fileName}</p>
                          <p className="text-[10px] text-slate-500">{doc.category}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium shrink-0">Verified</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleToggleActive(viewingMember.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors ${
                  viewingMember.status === 'Deactivated'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                }`}
              >
                {viewingMember.status === 'Deactivated' ? 'Reactivate Member' : 'Deactivate Member'}
              </button>
              <button
                onClick={() => setViewingMember(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold text-xs"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MEMBER MODAL */}
      {editingMember && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">Edit Member Details</h3>
            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingMember.fullName}
                  onChange={(e) => setEditingMember({ ...editingMember, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Building Wing</label>
                  <select
                    value={editingMember.buildingWing}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, buildingWing: e.target.value as BuildingWing })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="Wing A">Wing A</option>
                    <option value="Wing B">Wing B</option>
                    <option value="Wing C">Wing C</option>
                    <option value="Wing D">Wing D</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Flat Number</label>
                  <input
                    type="text"
                    value={editingMember.flatNumber}
                    onChange={(e) => setEditingMember({ ...editingMember, flatNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={editingMember.contactPhone}
                    onChange={(e) => setEditingMember({ ...editingMember, contactPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Member Type</label>
                  <select
                    value={editingMember.memberType}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, memberType: e.target.value as MemberType })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="Owner">Owner</option>
                    <option value="Tenant">Tenant</option>
                    <option value="Family Member">Family Member</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editingMember.email}
                  onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectModalMember && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6">
            <h3 className="text-base font-bold text-rose-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              Reject Registration Application
            </h3>
            <p className="text-xs text-slate-700 mb-4">
              Please state the reason for rejecting {rejectModalMember.fullName}'s application for Flat{' '}
              {rejectModalMember.buildingWing} #{rejectModalMember.flatNumber}.
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-4 text-xs">
              <textarea
                rows={3}
                required
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Identity document unreadable, lease deed expired, duplicate vehicle registration..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectModalMember(null)}
                  className="px-3 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptMember && (
        <ReceiptModal member={showReceiptMember} onClose={() => setShowReceiptMember(null)} />
      )}
    </div>
  );
};

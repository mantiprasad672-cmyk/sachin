import React, { useState } from 'react';
import {
  User,
  Users,
  Car,
  Dog,
  KeyRound,
  FileCheck2,
  DollarSign,
  AlertCircle,
  Bell,
  Calendar,
  Layers,
  PhoneCall,
  Plus,
  CheckCircle,
  Clock,
  Printer,
  Shield,
  Send,
  Ticket,
  MapPin,
  QrCode,
  ShieldCheck,
  Check,
  CreditCard,
  Edit,
} from 'lucide-react';
import {
  MemberRegistration,
  MaintenanceBill,
  Complaint,
  SocietyNotice,
  CommunityEvent,
  FacilityBooking,
  VisitorPass,
} from '../../types';
import { storageService } from '../../services/storageService';
import { ReceiptModal } from '../registration/ReceiptModal';

interface MemberDashboardProps {
  member: MemberRegistration;
  onUpdateMember: (updated: MemberRegistration) => void;
  onOpenRegistration: () => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({
  member,
  onUpdateMember,
  onOpenRegistration,
}) => {
  // Active Tab
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'family'
    | 'vehicles'
    | 'pets'
    | 'tenant'
    | 'emergency'
    | 'documents'
    | 'maintenance'
    | 'complaints'
    | 'notices'
    | 'events'
    | 'facilities'
    | 'visitors'
  >('overview');

  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Maintenance Bills
  const [bills, setBills] = useState<MaintenanceBill[]>(storageService.getBills(member.id));
  const [payingBillId, setPayingBillId] = useState<string | null>(null);

  // Complaints
  const [complaints, setComplaints] = useState<Complaint[]>(storageService.getComplaints(member.id));
  const [showNewComplaintModal, setShowNewComplaintModal] = useState(false);
  const [newComplaintTitle, setNewComplaintTitle] = useState('');
  const [newComplaintCategory, setNewComplaintCategory] = useState<Complaint['category']>('Plumbing');
  const [newComplaintPriority, setNewComplaintPriority] = useState<Complaint['priority']>('Medium');
  const [newComplaintDesc, setNewComplaintDesc] = useState('');

  // Notices
  const [notices] = useState<SocietyNotice[]>(storageService.getNotices());

  // Events
  const [events, setEvents] = useState<CommunityEvent[]>(storageService.getEvents());

  // Facility Bookings
  const [facilityBookings, setFacilityBookings] = useState<FacilityBooking[]>(
    storageService.getFacilityBookings(member.id)
  );
  const [showBookFacilityModal, setShowBookFacilityModal] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<FacilityBooking['facilityName']>('Clubhouse Hall');
  const [facilityDate, setFacilityDate] = useState('');
  const [facilitySlot, setFacilitySlot] = useState('06:00 PM - 09:00 PM');
  const [facilityGuests, setFacilityGuests] = useState(15);

  // Visitors
  const [visitors, setVisitors] = useState<VisitorPass[]>(storageService.getVisitors(member.id));
  const [showNewVisitorModal, setShowNewVisitorModal] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorPurpose, setVisitorPurpose] = useState<VisitorPass['purpose']>('Guest');
  const [visitorDate, setVisitorDate] = useState(new Date().toISOString().split('T')[0]);

  // Handle Pay Bill
  const handlePayBill = (billId: string) => {
    setPayingBillId(billId);
    setTimeout(() => {
      storageService.payBill(billId);
      setBills(storageService.getBills(member.id));
      setPayingBillId(null);
    }, 600);
  };

  // Handle Create Complaint
  const handleCreateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComplaintTitle.trim() || !newComplaintDesc.trim()) return;

    storageService.addComplaint({
      memberId: member.id,
      memberName: member.fullName,
      flatNumber: `${member.buildingWing} ${member.flatNumber}`,
      title: newComplaintTitle.trim(),
      category: newComplaintCategory,
      priority: newComplaintPriority,
      description: newComplaintDesc.trim(),
    });

    setComplaints(storageService.getComplaints(member.id));
    setShowNewComplaintModal(false);
    setNewComplaintTitle('');
    setNewComplaintDesc('');
  };

  // Handle Book Facility
  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facilityDate) return;

    storageService.bookFacility({
      memberId: member.id,
      memberName: member.fullName,
      flatNumber: `${member.buildingWing} ${member.flatNumber}`,
      facilityName: selectedFacility,
      date: facilityDate,
      timeSlot: facilitySlot,
      guestsCount: facilityGuests,
    });

    setFacilityBookings(storageService.getFacilityBookings(member.id));
    setShowBookFacilityModal(false);
  };

  // Handle Add Visitor
  const handleAddVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) return;

    storageService.addVisitor({
      memberId: member.id,
      flatNumber: `${member.buildingWing} ${member.flatNumber}`,
      visitorName: visitorName.trim(),
      phone: visitorPhone.trim(),
      purpose: visitorPurpose,
      expectedDate: visitorDate,
    });

    setVisitors(storageService.getVisitors(member.id));
    setShowNewVisitorModal(false);
    setVisitorName('');
    setVisitorPhone('');
  };

  // Handle Event RSVP
  const handleToggleRsvp = (eventId: string) => {
    storageService.toggleEventRsvp(eventId);
    setEvents(storageService.getEvents());
  };

  const pendingBillsCount = bills.filter((b) => b.status === 'Pending').length;
  const openComplaintsCount = complaints.filter((c) => c.status !== 'Resolved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      {/* Resident Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              {member.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{member.fullName}</h1>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    member.status === 'Approved'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {member.status}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {member.memberType}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                <span className="font-semibold text-slate-900">
                  {member.buildingWing} - Flat #{member.flatNumber}
                </span>
                <span>•</span>
                <span>App ID: {member.id}</span>
                <span>•</span>
                <span>{member.contactPhone}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowReceiptModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Registration Receipt</span>
            </button>
            <button
              onClick={() => setShowNewVisitorModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>+ Pre-Approve Visitor</span>
            </button>
            <button
              onClick={() => setShowNewComplaintModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Ticket className="w-3.5 h-3.5 text-blue-400" />
              <span>Raise Ticket</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-1.5 shadow-2xs overflow-x-auto scrollbar-none flex items-center gap-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 rounded-lg transition-all shrink-0 ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Overview
        </button>

        <button
          onClick={() => setActiveTab('family')}
          className={`px-3.5 py-2 rounded-lg transition-all shrink-0 ${
            activeTab === 'family'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Family Members ({member.familyMembers?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('vehicles')}
          className={`px-3.5 py-2 rounded-lg transition-all shrink-0 ${
            activeTab === 'vehicles'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Vehicles & Parking ({member.vehicles?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('maintenance')}
          className={`px-3.5 py-2 rounded-lg transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'maintenance'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>Maintenance</span>
          {pendingBillsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('complaints')}
          className={`px-3.5 py-2 rounded-lg transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'complaints'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>Complaints</span>
          {openComplaintsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 text-[10px]">
              {openComplaintsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('notices')}
          className={`px-3.5 py-2 rounded-lg transition-all shrink-0 ${
            activeTab === 'notices'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Notices ({notices.length})
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`px-3.5 py-2 rounded-lg transition-all shrink-0 ${
            activeTab === 'events'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Events
        </button>

        <button
          onClick={() => setActiveTab('facilities')}
          className={`px-3.5 py-2 rounded-lg transition-all shrink-0 ${
            activeTab === 'facilities'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Facility Booking
        </button>

        <button
          onClick={() => setActiveTab('visitors')}
          className={`px-3.5 py-2 rounded-lg transition-all shrink-0 ${
            activeTab === 'visitors'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Visitor Passes
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`px-3.5 py-2 rounded-lg transition-all shrink-0 ${
            activeTab === 'documents'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Documents ({member.documents?.length || 0})
        </button>
      </div>

      {/* ==================== TAB 1: OVERVIEW ==================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Current Maintenance Due
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {pendingBillsCount > 0 ? '₹4,850' : '₹0.00 (All Clear)'}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {pendingBillsCount > 0 ? 'Due by 15th September' : 'No outstanding dues'}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Assigned Parking Slot
              </span>
              <div className="text-xl font-bold text-blue-700 mt-1">
                {member.vehicles?.[0]?.parkingSlot || 'P-Allotment on Entry'}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {member.vehicles?.length || 0} vehicle(s) authorized
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Helpdesk Tickets
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {complaints.length} Total
              </div>
              <p className="text-[11px] text-blue-700 mt-0.5">
                {complaints.filter((c) => c.status === 'Resolved').length} resolved
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Active Visitor Passes
              </span>
              <div className="text-2xl font-black text-blue-800 mt-1">
                {visitors.filter((v) => v.status === 'Pre-Approved').length} Pass(es)
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Automated boom barrier OTP</p>
            </div>
          </div>

          {/* Quick Notice Banner */}
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block text-sm">
                  {notices[0]?.title || 'AGM Notice'}
                </span>
                <p className="text-slate-600 mt-0.5 line-clamp-1">{notices[0]?.content}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('notices')}
              className="px-3 py-1.5 bg-white text-blue-800 font-semibold rounded-lg border border-blue-200 shadow-2xs hover:bg-blue-50 shrink-0"
            >
              Read Notice
            </button>
          </div>

          {/* Detailed Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Details Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs text-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                Profile Information
              </h3>
              <div className="divide-y divide-slate-100">
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Resident Name:</span>
                  <span className="font-bold text-slate-900">{member.fullName}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Flat & Wing:</span>
                  <span className="font-semibold text-slate-900">
                    {member.buildingWing}, Flat {member.flatNumber}
                  </span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Mobile Phone:</span>
                  <span className="font-medium text-slate-900">{member.contactPhone}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Email Address:</span>
                  <span className="font-medium text-slate-900">{member.email}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Member Type:</span>
                  <span className="font-semibold text-blue-700">{member.memberType}</span>
                </div>
              </div>
            </div>

            {/* Emergency Contacts Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs text-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-rose-600" />
                Emergency Contact
              </h3>
              <div className="divide-y divide-slate-100">
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Contact Person:</span>
                  <span className="font-bold text-slate-900">{member.emergencyContact.name}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Relationship:</span>
                  <span className="font-medium text-slate-900">{member.emergencyContact.relationship}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Primary Contact:</span>
                  <span className="font-semibold text-slate-900">{member.emergencyContact.phone}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Alternate Phone:</span>
                  <span className="font-medium text-slate-900">
                    {member.emergencyContact.alternatePhone || 'Not specified'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: FAMILY MEMBERS ==================== */}
      {activeTab === 'family' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Registered Family Members</h3>
              <p className="text-xs text-slate-500">Authorized co-residents residing at Flat {member.flatNumber}.</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-full text-slate-700">
              Total: {member.familyMembers?.length || 0}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {member.familyMembers && member.familyMembers.length > 0 ? (
              member.familyMembers.map((fam, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{fam.fullName}</span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-semibold">
                      {fam.relation}
                    </span>
                  </div>
                  <p className="text-slate-500">Age: {fam.age} years</p>
                  {fam.contactNumber && <p className="text-slate-700 font-medium">{fam.contactNumber}</p>}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No co-residents added during registration.</p>
            )}
          </div>
        </div>
      )}

      {/* ==================== TAB 3: VEHICLES & PARKING ==================== */}
      {activeTab === 'vehicles' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Registered Vehicles & Stilt Parking</h3>
              <p className="text-xs text-slate-500">RFID automated sensor gate passes enabled for this flat.</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
              {member.vehicles?.length || 0} Vehicle(s)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {member.vehicles && member.vehicles.length > 0 ? (
              member.vehicles.map((v, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-base text-slate-900">
                      {v.registrationNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[11px] font-semibold">
                      {v.type}
                    </span>
                  </div>
                  <p className="text-slate-500">
                    {v.make} {v.model} • Color: {v.color || 'Standard'}
                  </p>
                  <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500">Allotted Parking Bay:</span>
                    <span className="font-bold text-blue-800">{v.parkingSlot || 'P-A402'}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No vehicles registered.</p>
            )}
          </div>
        </div>
      )}

      {/* ==================== TAB 4: MAINTENANCE & DUES ==================== */}
      {activeTab === 'maintenance' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Society Maintenance & CAM Invoices</h3>
              <p className="text-xs text-slate-500">Review monthly maintenance dues and download receipts.</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {bills.map((bill) => (
              <div
                key={bill.id}
                className={`p-4 rounded-xl border transition-all ${
                  bill.status === 'Pending'
                    ? 'border-amber-300 bg-amber-50/40'
                    : 'border-slate-200 bg-slate-50/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{bill.billMonth}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          bill.status === 'Paid'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {bill.status}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Invoice #{bill.id} • Due by {bill.dueDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-slate-900">₹{bill.amount.toLocaleString()}</span>
                    {bill.status === 'Pending' ? (
                      <button
                        onClick={() => handlePayBill(bill.id)}
                        disabled={payingBillId === bill.id}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>{payingBillId === bill.id ? 'Processing...' : 'Pay Online'}</span>
                      </button>
                    ) : (
                      <span className="text-blue-700 text-[11px] font-semibold flex items-center gap-1">
                        <Check className="w-4 h-4" /> Paid on {bill.paidOn}
                      </span>
                    )}
                  </div>
                </div>

                {/* Breakdown */}
                <div className="pt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  {bill.breakdown.map((item, idx) => (
                    <div key={idx} className="p-2 bg-white rounded-lg border border-slate-100">
                      <span className="text-slate-500 block truncate">{item.item}</span>
                      <span className="font-bold text-slate-900">₹{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 5: COMPLAINTS & HELPDESK ==================== */}
      {activeTab === 'complaints' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Resident Helpdesk & Service Tickets</h3>
              <p className="text-xs text-slate-500">Track plumbing, electrical, carpentry and security requests.</p>
            </div>
            <button
              onClick={() => setShowNewComplaintModal(true)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-blue-400" />
              <span>Raise New Ticket</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {complaints.length === 0 ? (
              <p className="py-6 text-center text-slate-500 italic">No tickets raised.</p>
            ) : (
              complaints.map((c) => (
                <div key={c.id} className="py-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{c.title}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'Resolved'
                          ? 'bg-blue-50 text-blue-700'
                          : c.status === 'In Progress'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p className="text-slate-600">{c.description}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                    <span>Category: <strong className="text-slate-700">{c.category}</strong></span>
                    <span>•</span>
                    <span>Priority: <strong className="text-slate-700">{c.priority}</strong></span>
                    <span>•</span>
                    <span>Created: {new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  {c.resolutionNote && (
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-900 text-[11px] font-medium mt-1">
                      Resolution Note: {c.resolutionNote}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ==================== TAB 6: NOTICES ==================== */}
      {activeTab === 'notices' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900">Official Society Circulars & Notices</h3>
          <div className="space-y-3 text-xs">
            {notices.map((not) => (
              <div key={not.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {not.pinned && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold">
                        PINNED
                      </span>
                    )}
                    <span className="font-bold text-slate-900 text-sm">{not.title}</span>
                  </div>
                  <span className="text-slate-500 text-[11px]">{not.date}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{not.content}</p>
                <p className="text-[11px] text-slate-500 font-medium">Issued by: {not.author}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 7: COMMUNITY EVENTS ==================== */}
      {activeTab === 'events' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900">Upcoming Community Events & Festivals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {events.map((evt) => (
              <div key={evt.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{evt.title}</span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold text-[10px]">
                    {evt.date}
                  </span>
                </div>
                <p className="text-slate-600">{evt.description}</p>
                <div className="space-y-1 text-slate-500 text-[11px]">
                  <div>Time: {evt.time}</div>
                  <div>Venue: {evt.venue}</div>
                  <div>Registered Residents: {evt.attendeesCount}</div>
                </div>
                <button
                  onClick={() => handleToggleRsvp(evt.id)}
                  className={`w-full py-2 rounded-lg font-bold text-xs transition-colors ${
                    evt.isRegistered
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {evt.isRegistered ? '✓ You are Registered (Click to Cancel)' : 'Register / RSVP Now'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 8: FACILITY BOOKING ==================== */}
      {activeTab === 'facilities' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Facility & Amenities Reservations</h3>
              <p className="text-xs text-slate-500">Book Clubhouse banquet, tennis court, gym slot or pool.</p>
            </div>
            <button
              onClick={() => setShowBookFacilityModal(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
            >
              + Reserve Amenity
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {facilityBookings.length === 0 ? (
              <p className="py-6 text-center text-slate-500 italic">No facility bookings made.</p>
            ) : (
              facilityBookings.map((b) => (
                <div key={b.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">{b.facilityName}</span>
                    <span className="text-slate-500 text-[11px]">
                      Date: {b.date} • Slot: {b.timeSlot} • Guests: {b.guestsCount}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px]">
                    {b.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ==================== TAB 9: VISITOR MANAGEMENT ==================== */}
      {activeTab === 'visitors' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Gate Visitor Passes & Delivery Authorizations</h3>
              <p className="text-xs text-slate-500">Pre-approved visitors bypass security questioning with quick OTP.</p>
            </div>
            <button
              onClick={() => setShowNewVisitorModal(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
            >
              + Pre-Approve Visitor
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {visitors.map((v) => (
              <div key={v.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{v.visitorName}</span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      v.status === 'Pre-Approved'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {v.status}
                  </span>
                </div>
                <p className="text-slate-500">
                  Purpose: {v.purpose} • Date: {v.expectedDate}
                </p>
                <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-500">Security Entry OTP:</span>
                  <span className="font-mono font-black text-blue-800 text-sm">{v.entryCode}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 10: DOCUMENTS ==================== */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900">Submitted & Official Documents</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {member.documents?.map((doc) => (
              <div key={doc.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block truncate">{doc.fileName}</span>
                  <span className="text-slate-500 text-[11px]">{doc.category}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-semibold">
                  Verified
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NEW COMPLAINT MODAL */}
      {showNewComplaintModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-xs">
            <h3 className="text-base font-bold text-slate-900 mb-3">Raise Helpdesk Ticket</h3>
            <form onSubmit={handleCreateComplaint} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Issue Title</label>
                <input
                  type="text"
                  required
                  value={newComplaintTitle}
                  onChange={(e) => setNewComplaintTitle(e.target.value)}
                  placeholder="e.g. Water leakage in master bathroom pipeline"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newComplaintCategory}
                    onChange={(e) => setNewComplaintCategory(e.target.value as Complaint['category'])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  >
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Security">Security</option>
                    <option value="Cleanliness">Cleanliness</option>
                    <option value="Parking">Parking</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newComplaintPriority}
                    onChange={(e) => setNewComplaintPriority(e.target.value as Complaint['priority'])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High (Urgent)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  required
                  value={newComplaintDesc}
                  onChange={(e) => setNewComplaintDesc(e.target.value)}
                  placeholder="Explain the problem and preferred technician visit timings..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewComplaintModal(false)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-xs"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BOOK FACILITY MODAL */}
      {showBookFacilityModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-xs">
            <h3 className="text-base font-bold text-slate-900 mb-3">Reserve Society Facility</h3>
            <form onSubmit={handleCreateBooking} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Facility Name</label>
                <select
                  value={selectedFacility}
                  onChange={(e) => setSelectedFacility(e.target.value as FacilityBooking['facilityName'])}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                >
                  <option value="Clubhouse Hall">Clubhouse Hall (Banquet)</option>
                  <option value="Tennis Court">Tennis Court (Floodlit)</option>
                  <option value="Swimming Pool">Swimming Pool</option>
                  <option value="Gym">Fitness Gym</option>
                  <option value="Badminton Court">Badminton Court</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={facilityDate}
                  onChange={(e) => setFacilityDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Time Slot</label>
                <select
                  value={facilitySlot}
                  onChange={(e) => setFacilitySlot(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                >
                  <option value="07:00 AM - 10:00 AM">07:00 AM - 10:00 AM</option>
                  <option value="11:00 AM - 03:00 PM">11:00 AM - 03:00 PM</option>
                  <option value="04:00 PM - 07:00 PM">04:00 PM - 07:00 PM</option>
                  <option value="07:00 PM - 11:00 PM">07:00 PM - 11:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expected Guests</label>
                <input
                  type="number"
                  min="1"
                  max="150"
                  value={facilityGuests}
                  onChange={(e) => setFacilityGuests(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBookFacilityModal(false)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW VISITOR MODAL */}
      {showNewVisitorModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-xs">
            <h3 className="text-base font-bold text-slate-900 mb-3">Pre-Approve Visitor Pass</h3>
            <form onSubmit={handleAddVisitor} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Visitor Full Name</label>
                <input
                  type="text"
                  required
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="e.g. Ramesh Kulkarni / Swiggy Delivery"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  placeholder="+91..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Purpose</label>
                  <select
                    value={visitorPurpose}
                    onChange={(e) => setVisitorPurpose(e.target.value as VisitorPass['purpose'])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  >
                    <option value="Guest">Guest / Friend</option>
                    <option value="Delivery">Delivery / Courier</option>
                    <option value="Service Provider">Service Provider / Cab</option>
                    <option value="Cab">Cab Pickup</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expected Date</label>
                  <input
                    type="date"
                    required
                    value={visitorDate}
                    onChange={(e) => setVisitorDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewVisitorModal(false)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Generate Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {showReceiptModal && (
        <ReceiptModal member={member} onClose={() => setShowReceiptModal(false)} />
      )}
    </div>
  );
};

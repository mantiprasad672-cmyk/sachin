import React from 'react';
import {
  X,
  Printer,
  CheckCircle2,
  Building2,
  Shield,
  Car,
  Users,
  PhoneCall,
  FileCheck,
  Calendar,
} from 'lucide-react';
import { MemberRegistration } from '../../types';

interface ReceiptModalProps {
  member: MemberRegistration;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ member, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden receipt-card print:border-none print:shadow-none">
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-sm sm:text-base">Official Registration Acknowledgment</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              id="print-receipt-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              id="close-receipt-modal-btn"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-800">
          {/* Header */}
          <div className="border-b-2 border-slate-800 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    GREENFIELD HEIGHTS SMART SOCIETY
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">
                    Co-operative Housing Society Ltd. • Reg No: BOM/HSG/2021/984
                  </p>
                  <p className="text-xs text-slate-500">
                    Sector 18, Palm Expressway, Smart City • Contact: contact@greenfieldheights.org
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="text-right">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    member.status === 'Approved'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : member.status === 'Pending Approval'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {member.status}
                </span>
                <p className="text-[11px] text-slate-500 mt-1">Application Ref Slip</p>
              </div>
            </div>
          </div>

          {/* Reference Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 font-medium block">Application ID</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{member.id}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Flat Number</span>
              <span className="font-bold text-slate-900 text-sm">
                {member.buildingWing} - #{member.flatNumber}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Member Category</span>
              <span className="font-semibold text-blue-700 text-sm">{member.memberType}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Submission Date</span>
              <span className="font-medium text-slate-900 text-sm">
                {new Date(member.submittedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Section 1: Member & Emergency Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5 mb-3">
                <Shield className="w-4 h-4 text-blue-600" />
                Primary Member Details
              </h4>
              <dl className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <dt className="text-slate-500">Full Name:</dt>
                  <dd className="font-semibold text-slate-900">{member.fullName}</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <dt className="text-slate-500">Phone Number:</dt>
                  <dd className="font-medium text-slate-900">{member.contactPhone}</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <dt className="text-slate-500">Email Address:</dt>
                  <dd className="font-medium text-slate-900 truncate max-w-[200px]">{member.email}</dd>
                </div>
                <div className="flex justify-between py-1">
                  <dt className="text-slate-500">Allotted Flat:</dt>
                  <dd className="font-semibold text-slate-900">
                    {member.buildingWing}, Unit {member.flatNumber}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5 mb-3">
                <PhoneCall className="w-4 h-4 text-rose-600" />
                Emergency Contact
              </h4>
              <dl className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <dt className="text-slate-500">Contact Person:</dt>
                  <dd className="font-semibold text-slate-900">{member.emergencyContact.name}</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <dt className="text-slate-500">Relationship:</dt>
                  <dd className="font-medium text-slate-900">{member.emergencyContact.relationship}</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <dt className="text-slate-500">Primary Phone:</dt>
                  <dd className="font-medium text-slate-900">{member.emergencyContact.phone}</dd>
                </div>
                <div className="flex justify-between py-1">
                  <dt className="text-slate-500">Alt Phone:</dt>
                  <dd className="font-medium text-slate-900">{member.emergencyContact.alternatePhone || 'N/A'}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Section 2: Family & Vehicles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Family Members */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5 mb-2">
                <Users className="w-4 h-4 text-blue-600" />
                Co-Residents & Family ({member.familyMembers?.length || 0})
              </h4>
              {member.familyMembers && member.familyMembers.length > 0 ? (
                <div className="divide-y divide-slate-100 text-xs">
                  {member.familyMembers.map((fam, idx) => (
                    <div key={idx} className="py-1.5 flex items-center justify-between">
                      <span className="font-medium text-slate-900">{fam.fullName}</span>
                      <span className="text-slate-500">
                        {fam.relation} • {fam.age} yrs
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No additional family registered.</p>
              )}
            </div>

            {/* Vehicles */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5 mb-2">
                <Car className="w-4 h-4 text-blue-600" />
                Registered Vehicles ({member.vehicles?.length || 0})
              </h4>
              {member.vehicles && member.vehicles.length > 0 ? (
                <div className="divide-y divide-slate-100 text-xs">
                  {member.vehicles.map((v, idx) => (
                    <div key={idx} className="py-1.5 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-900">{v.registrationNumber}</span>
                        <span className="text-[11px] text-slate-500 block">
                          {v.make} {v.model} ({v.type})
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono text-[11px] text-slate-700">
                        Slot: {v.parkingSlot || 'Assigned on Entry'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No vehicles registered.</p>
              )}
            </div>
          </div>

          {/* Tenant Details if applicable */}
          {member.tenantDetails?.isRenting && (
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 text-xs">
              <h4 className="font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-700" />
                Tenancy & Lease Details
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <span className="text-amber-700 block">Tenant Name:</span>
                  <span className="font-medium text-slate-900">{member.tenantDetails.tenantFullName}</span>
                </div>
                <div>
                  <span className="text-amber-700 block">Rental Tenure:</span>
                  <span className="font-medium text-slate-900">
                    {member.tenantDetails.rentalStartDate} to {member.tenantDetails.rentalEndDate}
                  </span>
                </div>
                <div>
                  <span className="text-amber-700 block">Flat Owner:</span>
                  <span className="font-medium text-slate-900">{member.tenantDetails.ownerName}</span>
                </div>
                <div>
                  <span className="text-amber-700 block">Owner Contact:</span>
                  <span className="font-medium text-slate-900">{member.tenantDetails.ownerContactNumber}</span>
                </div>
              </div>
            </div>
          )}

          {/* Documents Checklist */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs">
            <h4 className="font-bold text-slate-700 uppercase tracking-wider mb-2">
              Submitted Document Repository
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {member.documents && member.documents.length > 0 ? (
                member.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="font-medium truncate">{doc.category}:</span>
                    <span className="text-slate-500 truncate">{doc.fileName}</span>
                  </div>
                ))
              ) : (
                <span className="text-slate-500 italic">Self-declaration verified documents.</span>
              )}
            </div>
          </div>

          {/* Footer & Signature Seal */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-end justify-between gap-6 text-xs text-slate-500">
            <div>
              <p className="font-mono text-[11px] text-slate-500">Digital Seal Hash: SHA256-GH-{member.id}-VERIFIED</p>
              <p className="text-[11px] mt-0.5">
                Printed on: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
              </p>
            </div>
            <div className="text-center sm:text-right">
              <div className="w-44 border-b border-slate-400 mb-1 inline-block" />
              <p className="font-bold text-slate-900">Authorized Society Officer</p>
              <p className="text-[10px] text-slate-500">Greenfield Heights Management Office</p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer (no-print) */}
        <div className="no-print bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  CheckCircle,
  FileText,
  LayoutDashboard,
  Printer,
  ShieldCheck,
  Mail,
  Home,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { MemberRegistration } from '../../types';
import { ReceiptModal } from './ReceiptModal';

interface RegistrationSuccessProps {
  registration: MemberRegistration;
  onGoToDashboard: () => void;
  onEditRegistration: () => void;
  onQuickApprove: () => void;
  onNewRegistration: () => void;
}

export const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({
  registration,
  onGoToDashboard,
  onEditRegistration,
  onQuickApprove,
  onNewRegistration,
}) => {
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [approvedState, setApprovedState] = useState(registration.status === 'Approved');

  const handleApprove = () => {
    onQuickApprove();
    setApprovedState(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      {/* Success Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Top Header Banner */}
        <div className="bg-slate-900 p-6 sm:p-8 text-white text-center relative overflow-hidden border-b border-slate-800">
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="inline-flex p-3 bg-blue-500/20 rounded-xl backdrop-blur-md mb-4 ring-8 ring-blue-500/10">
            <CheckCircle className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Registration Successful!</h1>
          <p className="text-slate-400 text-sm mt-1.5 max-w-md mx-auto">
            Your society member registration application has been logged into the Greenfield Heights digital repository.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Registration Details Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Primary Member Name
              </span>
              <span className="text-base font-bold text-slate-900 mt-0.5 block">{registration.fullName}</span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Flat & Wing Number
              </span>
              <span className="text-base font-bold text-slate-900 mt-0.5 block">
                {registration.buildingWing} - Flat #{registration.flatNumber}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Application ID
              </span>
              <span className="text-sm font-mono font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200 inline-block mt-0.5">
                {registration.id}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Registration Date & Time
              </span>
              <span className="text-sm font-medium text-slate-900 mt-0.5 block">
                {new Date(registration.submittedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          {/* Email / Notification Confirmation Notice */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-slate-800">
            <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block text-slate-900">Email Confirmation Dispatched</span>
              <p className="text-slate-600 mt-0.5">
                A registration acknowledgment copy along with receipt guidelines has been transmitted to{' '}
                <strong className="font-semibold text-slate-900">{registration.email}</strong> and SMS confirmation to{' '}
                <strong className="font-semibold text-slate-900">{registration.contactPhone}</strong>.
              </p>
            </div>
          </div>

          {/* Status & Next Steps */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Application Status</span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  approvedState
                    ? 'bg-blue-50 text-blue-800 border border-blue-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                {approvedState ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    Approved by Committee
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    Pending Society Admin Review
                  </>
                )}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {approvedState
                ? 'Your registration has been approved. You now have full access to Maintenance, Visitor Passes, Amenities, and Notices in your Resident Dashboard.'
                : 'The society verification officer will review your submitted proof documents within 24-48 hours. For instant testing in this demo environment, click "Instant Admin Approval" below.'}
            </p>

            {/* Quick Demo Approval Helper */}
            {!approvedState && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Want to test the full approved flow immediately?</span>
                <button
                  onClick={handleApprove}
                  id="quick-demo-approve-btn"
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Instant Admin Approval (Demo)</span>
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              onClick={() => setShowReceiptModal(true)}
              id="download-receipt-btn"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-800 font-semibold text-xs rounded-lg shadow-2xs transition-all"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Download / Print Receipt</span>
            </button>

            <button
              onClick={onEditRegistration}
              id="edit-profile-btn"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-800 font-semibold text-xs rounded-lg shadow-2xs transition-all"
            >
              <FileText className="w-4 h-4 text-slate-600" />
              <span>Edit / Review Info</span>
            </button>

            <button
              onClick={onGoToDashboard}
              id="go-to-dashboard-btn"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-xs shadow-blue-600/20 transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Register another option */}
          <div className="text-center pt-2">
            <button
              onClick={onNewRegistration}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 hover:underline inline-flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Register another flat or member</span>
            </button>
          </div>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      {showReceiptModal && (
        <ReceiptModal member={registration} onClose={() => setShowReceiptModal(false)} />
      )}
    </div>
  );
};

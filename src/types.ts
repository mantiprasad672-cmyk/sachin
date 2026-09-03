export type MemberType = 'Owner' | 'Tenant' | 'Family Member';
export type BuildingWing = 'Wing A' | 'Wing B' | 'Wing C' | 'Wing D';
export type RegistrationStatus = 'Pending Approval' | 'Approved' | 'Rejected' | 'Deactivated';

export interface FamilyMember {
  id: string;
  fullName: string;
  age: number | string;
  relation: string;
  contactNumber?: string;
}

export type VehicleType = 'Car' | 'Bike' | 'Scooter' | 'Other';

export interface Vehicle {
  id: string;
  type: VehicleType;
  make: string;
  model: string;
  color: string;
  registrationNumber: string;
  parkingSlot: string;
}

export type PetType = 'Dog' | 'Cat' | 'Bird' | 'Fish' | 'Other';
export type VaccinationStatus = 'Up to date' | 'Pending' | 'Not vaccinated';

export interface Pet {
  id: string;
  name: string;
  type: PetType;
  breed: string;
  age: string;
  vaccinationStatus: VaccinationStatus;
  additionalInfo?: string;
}

export interface TenantDetails {
  isRenting: boolean;
  tenantFullName: string;
  tenantPhone: string;
  tenantEmail: string;
  rentalStartDate: string;
  rentalEndDate: string;
  ownerName: string;
  ownerContactNumber: string;
  documentName?: string;
  documentUrl?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  alternatePhone?: string;
}

export interface AdditionalInfo {
  specialRequests: string;
  societyManagementPreferences: string[];
  additionalComments: string;
}

export type DocumentCategory = 
  | 'Identity Proof' 
  | 'Address Proof' 
  | 'Ownership Proof' 
  | 'Tenant Agreement' 
  | 'Vehicle Documents' 
  | 'Other Society Documents';

export interface UploadedDocument {
  id: string;
  category: DocumentCategory;
  fileName: string;
  fileType: string;
  fileSize: number; // in bytes
  uploadDate: string;
  fileData?: string; // base64 or preview data
}

export interface ConsentDeclaration {
  confirmCorrect: boolean;
  agreeRules: boolean;
  agreeDataUse: boolean;
}

export interface MemberRegistration {
  id: string;
  status: RegistrationStatus;
  submittedAt: string;
  approvedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  
  // Section 1: Personal
  fullName: string;
  flatNumber: string;
  buildingWing: BuildingWing;
  contactPhone: string;
  email: string;
  memberType: MemberType;

  // Section 2: Family
  numberOfFamilyMembers: number;
  familyMembers: FamilyMember[];

  // Section 3: Emergency
  emergencyContact: EmergencyContact;

  // Section 4: Vehicles
  vehicles: Vehicle[];

  // Section 5: Pets
  hasPets: boolean;
  pets: Pet[];

  // Section 6: Tenant Details
  tenantDetails?: TenantDetails;

  // Section 7: Additional Info
  additionalInfo: AdditionalInfo;

  // Section 8: Documents
  documents: UploadedDocument[];

  // Section 9: Consent
  declarations: ConsentDeclaration;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member';
  flatNumber?: string;
  buildingWing?: BuildingWing;
  memberId?: string;
  avatarUrl?: string;
}

export interface MaintenanceBill {
  id: string;
  memberId: string;
  flatNumber: string;
  buildingWing: BuildingWing;
  billMonth: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  paidOn?: string;
  receiptNumber?: string;
  breakdown: { item: string; amount: number }[];
}

export interface Complaint {
  id: string;
  memberId: string;
  memberName: string;
  flatNumber: string;
  title: string;
  category: 'Plumbing' | 'Electrical' | 'Security' | 'Cleanliness' | 'Parking' | 'Other';
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  resolvedAt?: string;
  resolutionNote?: string;
}

export interface SocietyNotice {
  id: string;
  title: string;
  content: string;
  category: 'General' | 'Urgent' | 'Maintenance' | 'Event' | 'Billing';
  date: string;
  author: string;
  pinned: boolean;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  attendeesCount: number;
  isRegistered?: boolean;
}

export interface FacilityBooking {
  id: string;
  memberId: string;
  memberName: string;
  flatNumber: string;
  facilityName: 'Clubhouse Hall' | 'Tennis Court' | 'Swimming Pool' | 'Gym' | 'Badminton Court';
  date: string;
  timeSlot: string;
  guestsCount: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  createdAt: string;
}

export interface VisitorPass {
  id: string;
  memberId: string;
  flatNumber: string;
  visitorName: string;
  phone: string;
  purpose: 'Guest' | 'Delivery' | 'Service Provider' | 'Cab';
  expectedDate: string;
  entryCode: string;
  status: 'Pre-Approved' | 'Checked In' | 'Checked Out';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  targetId: string;
  details: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'success' | 'info' | 'warning' | 'error';
}

import {
  MemberRegistration,
  UserAccount,
  MaintenanceBill,
  Complaint,
  SocietyNotice,
  CommunityEvent,
  FacilityBooking,
  VisitorPass,
  AuditLog,
  NotificationItem,
} from '../types';

const STORAGE_KEYS = {
  MEMBERS: 'smart_society_members_v1',
  CURRENT_USER: 'smart_society_user_v1',
  DRAFT_REGISTRATION: 'smart_society_draft_v1',
  BILLS: 'smart_society_bills_v1',
  COMPLAINTS: 'smart_society_complaints_v1',
  NOTICES: 'smart_society_notices_v1',
  EVENTS: 'smart_society_events_v1',
  FACILITY_BOOKINGS: 'smart_society_facility_v1',
  VISITORS: 'smart_society_visitors_v1',
  AUDIT_LOGS: 'smart_society_audit_logs_v1',
  NOTIFICATIONS: 'smart_society_notifications_v1',
};

// Seed data
const INITIAL_MEMBERS: MemberRegistration[] = [
  {
    id: 'REG-2026-A402-8821',
    status: 'Approved',
    submittedAt: '2026-08-15T10:30:00.000Z',
    approvedAt: '2026-08-16T14:20:00.000Z',
    reviewedBy: 'Super Admin (Ramesh Mehta)',
    fullName: 'Rajesh Sharma',
    flatNumber: '402',
    buildingWing: 'Wing A',
    contactPhone: '+91 98201 45892',
    email: 'rajesh.sharma@example.com',
    memberType: 'Owner',
    numberOfFamilyMembers: 3,
    familyMembers: [
      { id: 'fam-1', fullName: 'Sunita Sharma', age: 38, relation: 'Spouse', contactNumber: '+91 98201 45893' },
      { id: 'fam-2', fullName: 'Aarav Sharma', age: 14, relation: 'Son' },
      { id: 'fam-3', fullName: 'Kavita Sharma', age: 67, relation: 'Mother' },
    ],
    emergencyContact: {
      name: 'Dr. Alok Verma',
      relationship: 'Brother-in-law',
      phone: '+91 98765 43210',
      alternatePhone: '+91 98765 43211',
    },
    vehicles: [
      {
        id: 'veh-1',
        type: 'Car',
        make: 'Honda',
        model: 'City ZX',
        color: 'Pearl White',
        registrationNumber: 'MH-02-CP-8842',
        parkingSlot: 'P-A402',
      },
      {
        id: 'veh-2',
        type: 'Scooter',
        make: 'TVS',
        model: 'Jupiter 125',
        color: 'Matte Grey',
        registrationNumber: 'MH-02-EX-1904',
        parkingSlot: 'B-A402',
      },
    ],
    hasPets: true,
    pets: [
      {
        id: 'pet-1',
        name: 'Bruno',
        type: 'Dog',
        breed: 'Golden Retriever',
        age: '3 years',
        vaccinationStatus: 'Up to date',
        additionalInfo: 'Microchipped, very friendly with children.',
      },
    ],
    additionalInfo: {
      specialRequests: 'Elderly mother visits garden every evening; requesting accessible ramp near Tower A lift.',
      societyManagementPreferences: ['Email announcements', 'EV charging station interest', 'Intercom calls'],
      additionalComments: 'Happy to contribute to the Society Cultural & Sports committee.',
    },
    documents: [
      {
        id: 'doc-1',
        category: 'Identity Proof',
        fileName: 'Aadhaar_RajeshSharma_masked.pdf',
        fileType: 'application/pdf',
        fileSize: 420000,
        uploadDate: '2026-08-15',
      },
      {
        id: 'doc-2',
        category: 'Ownership Proof',
        fileName: 'Flat_402_SaleDeed_Registered.pdf',
        fileType: 'application/pdf',
        fileSize: 1850000,
        uploadDate: '2026-08-15',
      },
      {
        id: 'doc-3',
        category: 'Vehicle Documents',
        fileName: 'HondaCity_RC_Book.pdf',
        fileType: 'application/pdf',
        fileSize: 610000,
        uploadDate: '2026-08-15',
      },
    ],
    declarations: {
      confirmCorrect: true,
      agreeRules: true,
      agreeDataUse: true,
    },
  },
  {
    id: 'REG-2026-B204-5519',
    status: 'Pending Approval',
    submittedAt: '2026-08-28T16:45:00.000Z',
    fullName: 'Priya Mukherjee',
    flatNumber: '204',
    buildingWing: 'Wing B',
    contactPhone: '+91 97112 33445',
    email: 'priya.mukherjee@example.com',
    memberType: 'Tenant',
    numberOfFamilyMembers: 1,
    familyMembers: [
      { id: 'fam-4', fullName: 'Ananya Mukherjee', age: 26, relation: 'Sister', contactNumber: '+91 97112 99887' },
    ],
    emergencyContact: {
      name: 'Subhash Mukherjee',
      relationship: 'Father',
      phone: '+91 94330 12345',
    },
    vehicles: [
      {
        id: 'veh-3',
        type: 'Car',
        make: 'Hyundai',
        model: 'i20 Asta',
        color: 'Fiery Red',
        registrationNumber: 'MH-02-DL-3301',
        parkingSlot: 'P-B204',
      },
    ],
    hasPets: false,
    pets: [],
    tenantDetails: {
      isRenting: true,
      tenantFullName: 'Priya Mukherjee',
      tenantPhone: '+91 97112 33445',
      tenantEmail: 'priya.mukherjee@example.com',
      rentalStartDate: '2026-09-01',
      rentalEndDate: '2027-08-31',
      ownerName: 'Vikram Joshi (Flat Owner)',
      ownerContactNumber: '+91 98200 11223',
      documentName: 'Registered_Rent_Agreement_B204.pdf',
    },
    additionalInfo: {
      specialRequests: 'Working from home; requires high-speed fiber optic connection pass for technician.',
      societyManagementPreferences: ['Clubhouse access', 'SMS alerts for delivery'],
      additionalComments: 'Submitted police verification copy along with rental agreement.',
    },
    documents: [
      {
        id: 'doc-4',
        category: 'Tenant Agreement',
        fileName: 'Rental_Agreement_B204_Stamped.pdf',
        fileType: 'application/pdf',
        fileSize: 1240000,
        uploadDate: '2026-08-28',
      },
      {
        id: 'doc-5',
        category: 'Identity Proof',
        fileName: 'Passport_PriyaMukherjee.pdf',
        fileType: 'application/pdf',
        fileSize: 520000,
        uploadDate: '2026-08-28',
      },
    ],
    declarations: {
      confirmCorrect: true,
      agreeRules: true,
      agreeDataUse: true,
    },
  },
  {
    id: 'REG-2026-C101-4402',
    status: 'Approved',
    submittedAt: '2026-07-10T09:15:00.000Z',
    approvedAt: '2026-07-11T11:00:00.000Z',
    reviewedBy: 'Super Admin (Ramesh Mehta)',
    fullName: 'Amitabh Sen',
    flatNumber: '101',
    buildingWing: 'Wing C',
    contactPhone: '+91 98300 45678',
    email: 'amitabh.sen@example.com',
    memberType: 'Owner',
    numberOfFamilyMembers: 2,
    familyMembers: [
      { id: 'fam-5', fullName: 'Meenakshi Sen', age: 45, relation: 'Spouse', contactNumber: '+91 98300 45679' },
      { id: 'fam-6', fullName: 'Rohan Sen', age: 19, relation: 'Son' },
    ],
    emergencyContact: {
      name: 'Debabrata Sen',
      relationship: 'Brother',
      phone: '+91 98311 22334',
    },
    vehicles: [
      {
        id: 'veh-4',
        type: 'Car',
        make: 'Tata',
        model: 'Nexon EV',
        color: 'Teal Blue',
        registrationNumber: 'MH-02-EV-7721',
        parkingSlot: 'P-C101 (EV Slot)',
      },
    ],
    hasPets: true,
    pets: [
      {
        id: 'pet-2',
        name: 'Milo',
        type: 'Cat',
        breed: 'Persian',
        age: '2 years',
        vaccinationStatus: 'Up to date',
        additionalInfo: 'Strictly indoor cat, rabies vaccinated.',
      },
    ],
    additionalInfo: {
      specialRequests: 'EV charging box installation already coordinated with society electrical supervisor.',
      societyManagementPreferences: ['Solar initiative', 'Recycling drive', 'Intercom access'],
      additionalComments: 'Available on weekends for society tree plantation drives.',
    },
    documents: [
      {
        id: 'doc-6',
        category: 'Ownership Proof',
        fileName: 'Allotment_Letter_C101.pdf',
        fileType: 'application/pdf',
        fileSize: 980000,
        uploadDate: '2026-07-10',
      },
    ],
    declarations: {
      confirmCorrect: true,
      agreeRules: true,
      agreeDataUse: true,
    },
  },
];

const INITIAL_NOTICES: SocietyNotice[] = [
  {
    id: 'not-1',
    title: 'Annual General Meeting (AGM) 2026 - Notice & Agenda',
    content: 'All registered owners and residents are cordially invited to the 12th AGM scheduled for Sunday, September 14th, 2026 at 10:30 AM in the Grand Clubhouse. Key agenda includes solar terrace installation, audited balance sheets, and security automation review.',
    category: 'Urgent',
    date: '2026-09-01',
    author: 'Managing Committee Secretary',
    pinned: true,
  },
  {
    id: 'not-2',
    title: 'Scheduled Water Tank Cleaning - Tower A & B',
    content: 'Underground and overhead water storage tanks for Wing A & Wing B will undergo deep microbial cleaning on Friday, Sept 5th, from 10:00 AM to 4:00 PM. Please store sufficient potable water in advance.',
    category: 'Maintenance',
    date: '2026-08-30',
    author: 'Facilities Manager',
    pinned: false,
  },
  {
    id: 'not-3',
    title: 'Ganpati & Diwali Festivity Committee Registrations Open',
    content: 'Residents and youth volunteers interested in organizing cultural programs, children sports, and festive food stalls are requested to enroll via the dashboard or submit their names at the Management Office.',
    category: 'Event',
    date: '2026-08-25',
    author: 'Cultural Secretary',
    pinned: false,
  },
];

const INITIAL_BILLS: MaintenanceBill[] = [
  {
    id: 'INV-2026-09-A402',
    memberId: 'REG-2026-A402-8821',
    flatNumber: '402',
    buildingWing: 'Wing A',
    billMonth: 'September 2026',
    amount: 4850,
    dueDate: '2026-09-15',
    status: 'Pending',
    breakdown: [
      { item: 'Society Common Area Maintenance (CAM)', amount: 3200 },
      { item: 'Sinking & Reserve Fund', amount: 650 },
      { item: 'Covered Stilt Parking Charges (P-A402)', amount: 600 },
      { item: 'Security & CCTV Surveillance Share', amount: 400 },
    ],
  },
  {
    id: 'INV-2026-08-A402',
    memberId: 'REG-2026-A402-8821',
    flatNumber: '402',
    buildingWing: 'Wing A',
    billMonth: 'August 2026',
    amount: 4850,
    dueDate: '2026-08-15',
    status: 'Paid',
    paidOn: '2026-08-12',
    receiptNumber: 'RCP-2026-08-9912',
    breakdown: [
      { item: 'Society Common Area Maintenance (CAM)', amount: 3200 },
      { item: 'Sinking & Reserve Fund', amount: 650 },
      { item: 'Covered Stilt Parking Charges (P-A402)', amount: 600 },
      { item: 'Security & CCTV Surveillance Share', amount: 400 },
    ],
  },
  {
    id: 'INV-2026-09-C101',
    memberId: 'REG-2026-C101-4402',
    flatNumber: '101',
    buildingWing: 'Wing C',
    billMonth: 'September 2026',
    amount: 5150,
    dueDate: '2026-09-15',
    status: 'Paid',
    paidOn: '2026-09-01',
    receiptNumber: 'RCP-2026-09-1002',
    breakdown: [
      { item: 'Society Common Area Maintenance (CAM)', amount: 3200 },
      { item: 'Sinking & Reserve Fund', amount: 650 },
      { item: 'EV Dedicated Charging Slot Infra', amount: 900 },
      { item: 'Security & CCTV Surveillance Share', amount: 400 },
    ],
  },
];

const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'CMP-2026-104',
    memberId: 'REG-2026-A402-8821',
    memberName: 'Rajesh Sharma',
    flatNumber: '402',
    title: 'Intercom unit buzzing on incoming gate calls',
    category: 'Electrical',
    description: 'The intercom hand piece makes a high-pitched buzz when the main security booth dials flat 402. Audio cuts intermittently.',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: '2026-08-29T11:20:00.000Z',
    resolutionNote: 'Technician Mr. Santosh assigned for visit on Sept 3rd.',
  },
  {
    id: 'CMP-2026-089',
    memberId: 'REG-2026-A402-8821',
    memberName: 'Rajesh Sharma',
    flatNumber: '402',
    title: 'Corridor motion sensor light replaced',
    category: 'Electrical',
    description: '4th floor corridor light near lift lobby was flickering.',
    priority: 'Low',
    status: 'Resolved',
    createdAt: '2026-08-10T14:10:00.000Z',
    resolvedAt: '2026-08-11T16:00:00.000Z',
    resolutionNote: 'LED fixture driver replaced with new Philips 18W unit.',
  },
];

const INITIAL_EVENTS: CommunityEvent[] = [
  {
    id: 'evt-1',
    title: 'Monsoon Badminton Tournament 2026',
    description: 'Men, Women & Junior singles and doubles championships at Clubhouse Indoor Courts. Refreshments and trophies for winners.',
    date: '2026-09-19',
    time: '08:00 AM - 05:00 PM',
    venue: 'Indoor Sports Arena',
    attendeesCount: 38,
    isRegistered: true,
  },
  {
    id: 'evt-2',
    title: 'Community Health & Cardiac Screening Camp',
    description: 'Complimentary ECG, blood sugar, lipid profile, and eye checkups in association with Apollo Clinic.',
    date: '2026-09-26',
    time: '09:00 AM - 02:00 PM',
    venue: 'Multipurpose Banquet Hall',
    attendeesCount: 64,
    isRegistered: false,
  },
];

const INITIAL_FACILITIES: FacilityBooking[] = [
  {
    id: 'FB-9021',
    memberId: 'REG-2026-A402-8821',
    memberName: 'Rajesh Sharma',
    flatNumber: '402',
    facilityName: 'Clubhouse Hall',
    date: '2026-09-20',
    timeSlot: '06:00 PM - 10:00 PM',
    guestsCount: 25,
    status: 'Confirmed',
    createdAt: '2026-08-20T12:00:00.000Z',
  },
];

const INITIAL_VISITORS: VisitorPass[] = [
  {
    id: 'VIS-701',
    memberId: 'REG-2026-A402-8821',
    flatNumber: '402',
    visitorName: 'Sanjay Deshmukh (Guest)',
    phone: '+91 98220 54321',
    purpose: 'Guest',
    expectedDate: '2026-09-03',
    entryCode: '7492',
    status: 'Pre-Approved',
  },
  {
    id: 'VIS-698',
    memberId: 'REG-2026-A402-8821',
    flatNumber: '402',
    visitorName: 'Amazon Prime Courier (Delivery)',
    phone: '+91 91234 56780',
    purpose: 'Delivery',
    expectedDate: '2026-09-02',
    entryCode: '1092',
    status: 'Checked Out',
  },
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-1',
    timestamp: '2026-08-16T14:20:00.000Z',
    actorName: 'Ramesh Mehta (Super Admin)',
    actorRole: 'Admin',
    action: 'MEMBER_APPROVED',
    targetId: 'REG-2026-A402-8821',
    details: 'Verified registered sale deed & identity proof. Flat 402 owner status confirmed.',
  },
  {
    id: 'aud-2',
    timestamp: '2026-08-28T16:45:00.000Z',
    actorName: 'System Gateway',
    actorRole: 'System',
    action: 'REGISTRATION_SUBMITTED',
    targetId: 'REG-2026-B204-5519',
    details: 'Tenant registration application submitted by Priya Mukherjee for Wing B, Flat 204.',
  },
];

export const storageService = {
  // Members
  getMembers(): MemberRegistration[] {
    const raw = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(INITIAL_MEMBERS));
      return INITIAL_MEMBERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_MEMBERS;
    }
  },

  getMemberById(id: string): MemberRegistration | undefined {
    const members = this.getMembers();
    return members.find((m) => m.id === id);
  },

  saveMemberRegistration(data: Omit<MemberRegistration, 'id' | 'status' | 'submittedAt'>): MemberRegistration {
    const members = this.getMembers();
    const wingLetter = data.buildingWing.replace('Wing ', '').trim();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `REG-2026-${wingLetter}${data.flatNumber.trim()}-${randomSuffix}`;

    const newRecord: MemberRegistration = {
      ...data,
      id: newId,
      status: 'Pending Approval',
      submittedAt: new Date().toISOString(),
    };

    const updated = [newRecord, ...members];
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(updated));

    // Audit log
    this.logAction(
      'Applicant Self-Service',
      'Resident',
      'REGISTRATION_SUBMITTED',
      newId,
      `New registration submitted for Flat ${data.buildingWing} ${data.flatNumber} (${data.memberType})`
    );

    // Notification
    this.addNotification({
      title: 'Registration Application Received',
      message: `Application ${newId} submitted for Flat ${data.buildingWing} ${data.flatNumber}. Society administration will review within 24-48 hours.`,
      type: 'info',
    });

    // Clear draft
    this.clearDraftRegistration();

    return newRecord;
  },

  updateMember(id: string, updates: Partial<MemberRegistration>): MemberRegistration | null {
    const members = this.getMembers();
    const index = members.findIndex((m) => m.id === id);
    if (index === -1) return null;

    members[index] = { ...members[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));

    this.logAction(
      'Society Administrator',
      'Admin',
      'MEMBER_UPDATED',
      id,
      `Updated details for Flat ${members[index].buildingWing} ${members[index].flatNumber}`
    );

    return members[index];
  },

  approveMember(id: string, adminName: string = 'Super Admin'): boolean {
    const members = this.getMembers();
    const member = members.find((m) => m.id === id);
    if (!member) return false;

    member.status = 'Approved';
    member.approvedAt = new Date().toISOString();
    member.reviewedBy = adminName;
    delete member.rejectionReason;

    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));

    this.logAction(
      adminName,
      'Admin',
      'MEMBER_APPROVED',
      id,
      `Approved member registration for ${member.fullName} (${member.buildingWing} ${member.flatNumber})`
    );

    this.addNotification({
      title: 'Registration Approved!',
      message: `Registration ${id} for Flat ${member.buildingWing} ${member.flatNumber} has been verified and approved.`,
      type: 'success',
    });

    return true;
  },

  rejectMember(id: string, reason: string, adminName: string = 'Super Admin'): boolean {
    const members = this.getMembers();
    const member = members.find((m) => m.id === id);
    if (!member) return false;

    member.status = 'Rejected';
    member.rejectionReason = reason;
    member.reviewedBy = adminName;

    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));

    this.logAction(
      adminName,
      'Admin',
      'MEMBER_REJECTED',
      id,
      `Rejected registration for ${member.fullName}. Reason: ${reason}`
    );

    this.addNotification({
      title: 'Registration Action Required',
      message: `Registration ${id} requires corrections: ${reason}`,
      type: 'warning',
    });

    return true;
  },

  toggleMemberStatus(id: string, adminName: string = 'Super Admin'): boolean {
    const members = this.getMembers();
    const member = members.find((m) => m.id === id);
    if (!member) return false;

    if (member.status === 'Deactivated') {
      member.status = 'Approved';
      this.logAction(adminName, 'Admin', 'MEMBER_REACTIVATED', id, `Reactivated account for Flat ${member.flatNumber}`);
    } else {
      member.status = 'Deactivated';
      this.logAction(adminName, 'Admin', 'MEMBER_DEACTIVATED', id, `Deactivated account for Flat ${member.flatNumber}`);
    }

    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
    return true;
  },

  // Draft Management
  saveDraftRegistration(draftData: Partial<MemberRegistration>): void {
    localStorage.setItem(STORAGE_KEYS.DRAFT_REGISTRATION, JSON.stringify({
      data: draftData,
      updatedAt: new Date().toISOString(),
    }));
  },

  getDraftRegistration(): { data: Partial<MemberRegistration>; updatedAt: string } | null {
    const raw = localStorage.getItem(STORAGE_KEYS.DRAFT_REGISTRATION);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  clearDraftRegistration(): void {
    localStorage.removeItem(STORAGE_KEYS.DRAFT_REGISTRATION);
  },

  // Duplicate Checks
  checkDuplicateEmail(email: string, excludeId?: string): boolean {
    if (!email) return false;
    const cleanEmail = email.trim().toLowerCase();
    const members = this.getMembers();
    return members.some((m) => m.id !== excludeId && m.email.trim().toLowerCase() === cleanEmail);
  },

  checkDuplicatePhone(phone: string, excludeId?: string): boolean {
    if (!phone) return false;
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 8) return false;
    const members = this.getMembers();
    return members.some((m) => {
      if (m.id === excludeId) return false;
      const otherPhone = m.contactPhone.replace(/[^0-9]/g, '');
      return otherPhone === cleanPhone;
    });
  },

  checkDuplicateVehicleReg(regNumber: string, excludeMemberId?: string): boolean {
    if (!regNumber) return false;
    const cleanReg = regNumber.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (cleanReg.length < 4) return false;
    const members = this.getMembers();
    for (const m of members) {
      if (m.id === excludeMemberId) continue;
      for (const v of m.vehicles) {
        if (v.registrationNumber.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() === cleanReg) {
          return true;
        }
      }
    }
    return false;
  },

  // Bills
  getBills(memberId?: string): MaintenanceBill[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BILLS);
    let bills: MaintenanceBill[] = INITIAL_BILLS;
    if (raw) {
      try {
        bills = JSON.parse(raw);
      } catch {
        bills = INITIAL_BILLS;
      }
    } else {
      localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(INITIAL_BILLS));
    }
    return memberId ? bills.filter((b) => b.memberId === memberId) : bills;
  },

  payBill(billId: string): boolean {
    const bills = this.getBills();
    const bill = bills.find((b) => b.id === billId);
    if (!bill) return false;

    bill.status = 'Paid';
    bill.paidOn = new Date().toISOString().split('T')[0];
    bill.receiptNumber = `RCP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));

    this.addNotification({
      title: 'Maintenance Bill Payment Successful',
      message: `Payment of ₹${bill.amount.toLocaleString()} for ${bill.billMonth} received. Receipt #${bill.receiptNumber}.`,
      type: 'success',
    });

    return true;
  },

  // Complaints
  getComplaints(memberId?: string): Complaint[] {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
    let list: Complaint[] = INITIAL_COMPLAINTS;
    if (raw) {
      try {
        list = JSON.parse(raw);
      } catch {
        list = INITIAL_COMPLAINTS;
      }
    } else {
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(INITIAL_COMPLAINTS));
    }
    return memberId ? list.filter((c) => c.memberId === memberId) : list;
  },

  addComplaint(data: Omit<Complaint, 'id' | 'status' | 'createdAt'>): Complaint {
    const list = this.getComplaints();
    const newComplaint: Complaint = {
      ...data,
      id: `CMP-2026-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Open',
      createdAt: new Date().toISOString(),
    };
    const updated = [newComplaint, ...list];
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(updated));

    this.addNotification({
      title: 'Helpdesk Ticket Raised',
      message: `Ticket #${newComplaint.id} for "${newComplaint.title}" created. Society maintenance staff will review.`,
      type: 'info',
    });

    return newComplaint;
  },

  updateComplaintStatus(id: string, status: Complaint['status'], resolutionNote?: string): boolean {
    const list = this.getComplaints();
    const item = list.find((c) => c.id === id);
    if (!item) return false;
    item.status = status;
    if (status === 'Resolved') {
      item.resolvedAt = new Date().toISOString();
    }
    if (resolutionNote) {
      item.resolutionNote = resolutionNote;
    }
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(list));
    return true;
  },

  // Notices
  getNotices(): SocietyNotice[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTICES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(INITIAL_NOTICES));
      return INITIAL_NOTICES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_NOTICES;
    }
  },

  addNotice(notice: Omit<SocietyNotice, 'id' | 'date'>): SocietyNotice {
    const notices = this.getNotices();
    const newNotice: SocietyNotice = {
      ...notice,
      id: `not-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    const updated = [newNotice, ...notices];
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(updated));
    return newNotice;
  },

  // Events
  getEvents(): CommunityEvent[] {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
      return INITIAL_EVENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_EVENTS;
    }
  },

  toggleEventRsvp(eventId: string): boolean {
    const events = this.getEvents();
    const event = events.find((e) => e.id === eventId);
    if (!event) return false;
    event.isRegistered = !event.isRegistered;
    event.attendeesCount += event.isRegistered ? 1 : -1;
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    return true;
  },

  // Facility Bookings
  getFacilityBookings(memberId?: string): FacilityBooking[] {
    const raw = localStorage.getItem(STORAGE_KEYS.FACILITY_BOOKINGS);
    let list: FacilityBooking[] = INITIAL_FACILITIES;
    if (raw) {
      try {
        list = JSON.parse(raw);
      } catch {
        list = INITIAL_FACILITIES;
      }
    } else {
      localStorage.setItem(STORAGE_KEYS.FACILITY_BOOKINGS, JSON.stringify(INITIAL_FACILITIES));
    }
    return memberId ? list.filter((f) => f.memberId === memberId) : list;
  },

  bookFacility(data: Omit<FacilityBooking, 'id' | 'status' | 'createdAt'>): FacilityBooking {
    const list = this.getFacilityBookings();
    const newBooking: FacilityBooking = {
      ...data,
      id: `FB-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };
    const updated = [newBooking, ...list];
    localStorage.setItem(STORAGE_KEYS.FACILITY_BOOKINGS, JSON.stringify(updated));

    this.addNotification({
      title: 'Facility Booking Confirmed',
      message: `${newBooking.facilityName} booked for ${newBooking.date} (${newBooking.timeSlot}). Booking ID #${newBooking.id}.`,
      type: 'success',
    });

    return newBooking;
  },

  // Visitors
  getVisitors(memberId?: string): VisitorPass[] {
    const raw = localStorage.getItem(STORAGE_KEYS.VISITORS);
    let list: VisitorPass[] = INITIAL_VISITORS;
    if (raw) {
      try {
        list = JSON.parse(raw);
      } catch {
        list = INITIAL_VISITORS;
      }
    } else {
      localStorage.setItem(STORAGE_KEYS.VISITORS, JSON.stringify(INITIAL_VISITORS));
    }
    return memberId ? list.filter((v) => v.memberId === memberId) : list;
  },

  addVisitor(data: Omit<VisitorPass, 'id' | 'entryCode' | 'status'>): VisitorPass {
    const list = this.getVisitors();
    const newPass: VisitorPass = {
      ...data,
      id: `VIS-${Math.floor(100 + Math.random() * 900)}`,
      entryCode: Math.floor(1000 + Math.random() * 9000).toString(),
      status: 'Pre-Approved',
    };
    const updated = [newPass, ...list];
    localStorage.setItem(STORAGE_KEYS.VISITORS, JSON.stringify(updated));

    this.addNotification({
      title: 'Visitor Pass Generated',
      message: `Pre-approved pass #${newPass.id} generated for ${newPass.visitorName}. Security OTP Code: ${newPass.entryCode}.`,
      type: 'info',
    });

    return newPass;
  },

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  },

  logAction(actorName: string, actorRole: string, action: string, targetId: string, details: string): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName,
      actorRole,
      action,
      targetId,
      details,
    };
    const updated = [newLog, ...logs.slice(0, 99)];
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updated));
  },

  // Notifications
  getNotifications(): NotificationItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  addNotification(item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): void {
    const current = this.getNotifications();
    const newItem: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    const updated = [newItem, ...current.slice(0, 20)];
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  },

  markNotificationsRead(): void {
    const current = this.getNotifications();
    const updated = current.map((n) => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  },

  // CSV Export
  exportMembersCSV(): string {
    const members = this.getMembers();
    const headers = [
      'Application_ID',
      'Status',
      'Full_Name',
      'Wing',
      'Flat_Number',
      'Member_Type',
      'Phone',
      'Email',
      'Family_Count',
      'Vehicles_Count',
      'Has_Pets',
      'Emergency_Contact',
      'Submitted_Date',
    ];

    const rows = members.map((m) => [
      `"${m.id}"`,
      `"${m.status}"`,
      `"${m.fullName.replace(/"/g, '""')}"`,
      `"${m.buildingWing}"`,
      `"${m.flatNumber}"`,
      `"${m.memberType}"`,
      `"${m.contactPhone}"`,
      `"${m.email}"`,
      m.familyMembers?.length || 0,
      m.vehicles?.length || 0,
      m.hasPets ? 'Yes' : 'No',
      `"${m.emergencyContact?.name || ''} (${m.emergencyContact?.phone || ''})"`,
      `"${m.submittedAt}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  },
};

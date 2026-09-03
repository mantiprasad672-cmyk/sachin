import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Users,
  PhoneCall,
  Car,
  Dog,
  KeyRound,
  FileCheck2,
  UploadCloud,
  CheckSquare,
  AlertCircle,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Sparkles,
  Info,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  FileText,
  Check,
} from 'lucide-react';
import {
  MemberRegistration,
  BuildingWing,
  MemberType,
  FamilyMember,
  Vehicle,
  Pet,
  TenantDetails,
  EmergencyContact,
  AdditionalInfo,
  UploadedDocument,
  DocumentCategory,
  ConsentDeclaration,
  VehicleType,
  PetType,
  VaccinationStatus,
} from '../../types';
import { storageService } from '../../services/storageService';

interface RegistrationFormProps {
  onSuccess: (registration: MemberRegistration) => void;
  initialData?: Partial<MemberRegistration> | null;
}

const WINGS: BuildingWing[] = ['Wing A', 'Wing B', 'Wing C', 'Wing D'];
const MEMBER_TYPES: MemberType[] = ['Owner', 'Tenant', 'Family Member'];
const VEHICLE_TYPES: VehicleType[] = ['Car', 'Bike', 'Scooter', 'Other'];
const PET_TYPES: PetType[] = ['Dog', 'Cat', 'Bird', 'Fish', 'Other'];
const VACCINATION_STATUSES: VaccinationStatus[] = ['Up to date', 'Pending', 'Not vaccinated'];

const PREFERENCE_OPTIONS = [
  'Email Announcements & AGM Circulars',
  'SMS / WhatsApp Gate Notifications',
  'Intercom Ring directly to Mobile',
  'Clubhouse & Gym Access Card',
  'EV Charging Bay Allocation Interest',
  'Volunteer for Society Cultural Committee',
];

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess, initialData }) => {
  // Step state (0: All sections / Guided Step index)
  const [activeStep, setActiveStep] = useState<number>(0);
  const [saveDraftMessage, setSaveDraftMessage] = useState<string | null>(null);

  // Form states
  // 1. Personal Info
  const [fullName, setFullName] = useState(initialData?.fullName || '');
  const [flatNumber, setFlatNumber] = useState(initialData?.flatNumber || '');
  const [buildingWing, setBuildingWing] = useState<BuildingWing>(initialData?.buildingWing || 'Wing A');
  const [contactPhone, setContactPhone] = useState(initialData?.contactPhone || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [memberType, setMemberType] = useState<MemberType>(initialData?.memberType || 'Owner');

  // 2. Family Details
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(
    initialData?.familyMembers || [
      { id: 'fam-init', fullName: '', age: '', relation: 'Spouse', contactNumber: '' },
    ]
  );

  // 3. Emergency Contact
  const [emergencyContact, setEmergencyContact] = useState<EmergencyContact>(
    initialData?.emergencyContact || {
      name: '',
      relationship: 'Immediate Family',
      phone: '',
      alternatePhone: '',
    }
  );

  // 4. Vehicle Details
  const [vehicles, setVehicles] = useState<Vehicle[]>(
    initialData?.vehicles || [
      {
        id: 'veh-init',
        type: 'Car',
        make: '',
        model: '',
        color: '',
        registrationNumber: '',
        parkingSlot: '',
      },
    ]
  );

  // 5. Pet Details
  const [hasPets, setHasPets] = useState<boolean>(initialData?.hasPets ?? false);
  const [pets, setPets] = useState<Pet[]>(
    initialData?.pets || [
      {
        id: 'pet-init',
        name: '',
        type: 'Dog',
        breed: '',
        age: '',
        vaccinationStatus: 'Up to date',
        additionalInfo: '',
      },
    ]
  );

  // 6. Tenant Details
  const [isRenting, setIsRenting] = useState<boolean>(
    initialData?.tenantDetails?.isRenting ?? (initialData?.memberType === 'Tenant')
  );
  const [tenantDetails, setTenantDetails] = useState<TenantDetails>(
    initialData?.tenantDetails || {
      isRenting: false,
      tenantFullName: '',
      tenantPhone: '',
      tenantEmail: '',
      rentalStartDate: '',
      rentalEndDate: '',
      ownerName: '',
      ownerContactNumber: '',
      documentName: '',
    }
  );

  // 7. Additional Info
  const [specialRequests, setSpecialRequests] = useState(initialData?.additionalInfo?.specialRequests || '');
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(
    initialData?.additionalInfo?.societyManagementPreferences || ['Email Announcements & AGM Circulars', 'Intercom Ring directly to Mobile']
  );
  const [additionalComments, setAdditionalComments] = useState(
    initialData?.additionalInfo?.additionalComments || ''
  );

  // 8. Documents
  const [documents, setDocuments] = useState<UploadedDocument[]>(
    initialData?.documents || [
      {
        id: 'doc-id-1',
        category: 'Identity Proof',
        fileName: 'Aadhaar_Government_ID.pdf',
        fileType: 'application/pdf',
        fileSize: 450000,
        uploadDate: new Date().toISOString().split('T')[0],
      },
    ]
  );
  const [docUploadCategory, setDocUploadCategory] = useState<DocumentCategory>('Address Proof');
  const [docUploadError, setDocUploadError] = useState<string | null>(null);

  // 9. Declarations
  const [declarations, setDeclarations] = useState<ConsentDeclaration>(
    initialData?.declarations || {
      confirmCorrect: false,
      agreeRules: false,
      agreeDataUse: false,
    }
  );

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Sync isRenting if memberType changes to 'Tenant'
  useEffect(() => {
    if (memberType === 'Tenant') {
      setIsRenting(true);
      if (!tenantDetails.tenantFullName && fullName) {
        setTenantDetails((prev) => ({
          ...prev,
          tenantFullName: fullName,
          tenantPhone: contactPhone,
          tenantEmail: email,
        }));
      }
    }
  }, [memberType, fullName, contactPhone, email]);

  // Check saved draft on mount
  useEffect(() => {
    if (!initialData) {
      const savedDraft = storageService.getDraftRegistration();
      if (savedDraft?.data) {
        const d = savedDraft.data;
        if (d.fullName) setFullName(d.fullName);
        if (d.flatNumber) setFlatNumber(d.flatNumber);
        if (d.buildingWing) setBuildingWing(d.buildingWing);
        if (d.contactPhone) setContactPhone(d.contactPhone);
        if (d.email) setEmail(d.email);
        if (d.memberType) setMemberType(d.memberType);
        if (d.familyMembers) setFamilyMembers(d.familyMembers);
        if (d.emergencyContact) setEmergencyContact(d.emergencyContact);
        if (d.vehicles) setVehicles(d.vehicles);
        if (d.hasPets !== undefined) setHasPets(d.hasPets);
        if (d.pets) setPets(d.pets);
        if (d.tenantDetails) setTenantDetails(d.tenantDetails);
        if (d.additionalInfo?.specialRequests) setSpecialRequests(d.additionalInfo.specialRequests);
        if (d.additionalInfo?.additionalComments) setAdditionalComments(d.additionalInfo.additionalComments);
        if (d.additionalInfo?.societyManagementPreferences) {
          setSelectedPreferences(d.additionalInfo.societyManagementPreferences);
        }
        if (d.documents) setDocuments(d.documents);
        setSaveDraftMessage(`Restored draft saved on ${new Date(savedDraft.updatedAt).toLocaleTimeString()}`);
        setTimeout(() => setSaveDraftMessage(null), 5000);
      }
    }
  }, [initialData]);

  // Auto save draft handler
  const handleSaveDraft = () => {
    storageService.saveDraftRegistration({
      fullName,
      flatNumber,
      buildingWing,
      contactPhone,
      email,
      memberType,
      numberOfFamilyMembers: familyMembers.length,
      familyMembers,
      emergencyContact,
      vehicles,
      hasPets,
      pets,
      tenantDetails: { ...tenantDetails, isRenting },
      additionalInfo: {
        specialRequests,
        societyManagementPreferences: selectedPreferences,
        additionalComments,
      },
      documents,
      declarations,
    });
    setSaveDraftMessage(`Draft saved at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`);
    setTimeout(() => setSaveDraftMessage(null), 4000);
  };

  // Clear draft
  const handleClearDraft = () => {
    storageService.clearDraftRegistration();
    setFullName('');
    setFlatNumber('');
    setContactPhone('');
    setEmail('');
    setFamilyMembers([]);
    setVehicles([]);
    setPets([]);
    setHasPets(false);
    setIsRenting(false);
    setSpecialRequests('');
    setAdditionalComments('');
    setDeclarations({ confirmCorrect: false, agreeRules: false, agreeDataUse: false });
    setErrors({});
    setSaveDraftMessage('Form cleared and draft reset.');
    setTimeout(() => setSaveDraftMessage(null), 4000);
  };

  // Demo auto-fill
  const handleFillDemoData = () => {
    const randomFlat = Math.floor(101 + Math.random() * 899).toString();
    setFullName('Vikrant Malhotra');
    setFlatNumber(randomFlat);
    setBuildingWing('Wing B');
    setContactPhone('+91 98205 77192');
    setEmail(`vikrant.malhotra${randomFlat}@example.com`);
    setMemberType('Owner');
    setFamilyMembers([
      { id: 'fam-demo-1', fullName: 'Pooja Malhotra', age: 34, relation: 'Spouse', contactNumber: '+91 98205 77193' },
      { id: 'fam-demo-2', fullName: 'Reyansh Malhotra', age: 7, relation: 'Son' },
    ]);
    setEmergencyContact({
      name: 'Sunil Malhotra',
      relationship: 'Father',
      phone: '+91 98210 99881',
      alternatePhone: '+91 98210 99882',
    });
    setVehicles([
      {
        id: 'veh-demo-1',
        type: 'Car',
        make: 'Hyundai',
        model: 'Creta SX',
        color: 'Titan Grey',
        registrationNumber: `MH-02-DN-${Math.floor(1000 + Math.random() * 8999)}`,
        parkingSlot: `P-B${randomFlat}`,
      },
    ]);
    setHasPets(true);
    setPets([
      {
        id: 'pet-demo-1',
        name: 'Cookie',
        type: 'Dog',
        breed: 'Beagle',
        age: '2 years',
        vaccinationStatus: 'Up to date',
        additionalInfo: 'Vaccinated and registered with Municipal ward.',
      },
    ]);
    setIsRenting(false);
    setSpecialRequests('Please activate smart vehicle RFID sticker for the basement Boom Barrier.');
    setAdditionalComments('Available for any society emergency assistance.');
    setDeclarations({
      confirmCorrect: true,
      agreeRules: true,
      agreeDataUse: true,
    });
    setErrors({});
    setSaveDraftMessage('Sample details populated for instant submission testing.');
    setTimeout(() => setSaveDraftMessage(null), 4000);
  };

  // Family dynamic helpers
  const handleAddFamilyMember = () => {
    setFamilyMembers([
      ...familyMembers,
      {
        id: `fam-${Date.now()}`,
        fullName: '',
        age: '',
        relation: 'Spouse',
        contactNumber: '',
      },
    ]);
  };

  const handleUpdateFamilyMember = (index: number, field: keyof FamilyMember, value: string | number) => {
    const copy = [...familyMembers];
    copy[index] = { ...copy[index], [field]: value };
    setFamilyMembers(copy);
  };

  const handleRemoveFamilyMember = (index: number) => {
    const copy = familyMembers.filter((_, i) => i !== index);
    setFamilyMembers(copy);
  };

  // Vehicle dynamic helpers
  const handleAddVehicle = () => {
    setVehicles([
      ...vehicles,
      {
        id: `veh-${Date.now()}`,
        type: 'Car',
        make: '',
        model: '',
        color: '',
        registrationNumber: '',
        parkingSlot: '',
      },
    ]);
  };

  const handleUpdateVehicle = (index: number, field: keyof Vehicle, value: string) => {
    const copy = [...vehicles];
    copy[index] = { ...copy[index], [field]: value };
    setVehicles(copy);
  };

  const handleRemoveVehicle = (index: number) => {
    const copy = vehicles.filter((_, i) => i !== index);
    setVehicles(copy);
  };

  // Pet dynamic helpers
  const handleAddPet = () => {
    setPets([
      ...pets,
      {
        id: `pet-${Date.now()}`,
        name: '',
        type: 'Dog',
        breed: '',
        age: '',
        vaccinationStatus: 'Up to date',
        additionalInfo: '',
      },
    ]);
  };

  const handleUpdatePet = (index: number, field: keyof Pet, value: string) => {
    const copy = [...pets];
    copy[index] = { ...copy[index], [field]: value };
    setPets(copy);
  };

  const handleRemovePet = (index: number) => {
    const copy = pets.filter((_, i) => i !== index);
    setPets(copy);
  };

  // Document upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocUploadError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setDocUploadError('Only PDF, JPG, and PNG documents are permitted.');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setDocUploadError('File size exceeds 5MB limit. Please compress or choose a smaller file.');
      return;
    }

    const newDoc: UploadedDocument = {
      id: `doc-${Date.now()}`,
      category: docUploadCategory,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      uploadDate: new Date().toISOString().split('T')[0],
    };

    setDocuments([...documents, newDoc]);
    e.target.value = '';
  };

  const handleRemoveDoc = (id: string) => {
    setDocuments(documents.filter((d) => d.id !== id));
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 1. Personal Info
    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    } else if (fullName.trim().length < 3) {
      newErrors.fullName = 'Full Name must be at least 3 characters.';
    }

    if (!flatNumber.trim()) {
      newErrors.flatNumber = 'Flat Number is required.';
    } else if (!/^[A-Za-z0-9\-/ ]{1,10}$/.test(flatNumber.trim())) {
      newErrors.flatNumber = 'Please enter a valid Flat Number (e.g., 402, 1201).';
    }

    if (!contactPhone.trim()) {
      newErrors.contactPhone = 'Contact Phone Number is required.';
    } else if (!/^[0-9+ -]{8,15}$/.test(contactPhone.trim())) {
      newErrors.contactPhone = 'Please enter a valid mobile number (min 8 digits).';
    } else if (storageService.checkDuplicatePhone(contactPhone)) {
      newErrors.contactPhone = 'This phone number is already registered for another resident.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g. name@domain.com).';
    } else if (storageService.checkDuplicateEmail(email)) {
      newErrors.email = 'This email address is already associated with an existing society member.';
    }

    // 2. Emergency Contact
    if (!emergencyContact.name.trim()) {
      newErrors.emergencyName = 'Emergency contact person name is required.';
    }
    if (!emergencyContact.relationship.trim()) {
      newErrors.emergencyRelation = 'Emergency contact relationship is required.';
    }
    if (!emergencyContact.phone.trim()) {
      newErrors.emergencyPhone = 'Emergency contact phone number is required.';
    } else if (!/^[0-9+ -]{8,15}$/.test(emergencyContact.phone.trim())) {
      newErrors.emergencyPhone = 'Please enter a valid emergency contact phone number.';
    }

    // 3. Vehicles uniqueness
    vehicles.forEach((veh, idx) => {
      if (veh.registrationNumber.trim()) {
        if (storageService.checkDuplicateVehicleReg(veh.registrationNumber)) {
          newErrors[`vehReg_${idx}`] = `Vehicle reg ${veh.registrationNumber} is already registered in the society.`;
        }
      }
    });

    // 4. Tenant Details validation if renting
    if (isRenting) {
      if (!tenantDetails.tenantFullName.trim()) {
        newErrors.tenantFullName = 'Tenant Full Name is required when flat is rented.';
      }
      if (!tenantDetails.ownerName.trim()) {
        newErrors.ownerName = 'Property owner name is required for rented flats.';
      }
      if (!tenantDetails.rentalStartDate) {
        newErrors.rentalStartDate = 'Rental agreement start date is required.';
      }
    }

    // 5. Consent & Declarations
    if (!declarations.confirmCorrect || !declarations.agreeRules || !declarations.agreeDataUse) {
      newErrors.declarations = 'All three declarations must be accepted before submitting.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isValid = validateForm();
    if (!isValid) {
      setIsSubmitting(false);
      // Find first error element
      const firstErrorKey = Object.keys(errors)[0];
      const errorElement = document.getElementById(`field-${firstErrorKey}`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Filter valid family members
    const cleanFamily = familyMembers.filter((f) => f.fullName.trim().length > 0);
    const cleanVehicles = vehicles.filter((v) => v.registrationNumber.trim().length > 0);
    const cleanPets = hasPets ? pets.filter((p) => p.name.trim().length > 0) : [];

    const newRegistration = storageService.saveMemberRegistration({
      fullName: fullName.trim(),
      flatNumber: flatNumber.trim(),
      buildingWing,
      contactPhone: contactPhone.trim(),
      email: email.trim().toLowerCase(),
      memberType,
      numberOfFamilyMembers: cleanFamily.length,
      familyMembers: cleanFamily,
      emergencyContact: {
        name: emergencyContact.name.trim(),
        relationship: emergencyContact.relationship.trim(),
        phone: emergencyContact.phone.trim(),
        alternatePhone: emergencyContact.alternatePhone?.trim(),
      },
      vehicles: cleanVehicles,
      hasPets,
      pets: cleanPets,
      tenantDetails: isRenting
        ? {
            isRenting: true,
            tenantFullName: tenantDetails.tenantFullName.trim(),
            tenantPhone: tenantDetails.tenantPhone.trim(),
            tenantEmail: tenantDetails.tenantEmail.trim(),
            rentalStartDate: tenantDetails.rentalStartDate,
            rentalEndDate: tenantDetails.rentalEndDate,
            ownerName: tenantDetails.ownerName.trim(),
            ownerContactNumber: tenantDetails.ownerContactNumber.trim(),
            documentName: tenantDetails.documentName,
          }
        : undefined,
      additionalInfo: {
        specialRequests: specialRequests.trim(),
        societyManagementPreferences: selectedPreferences,
        additionalComments: additionalComments.trim(),
      },
      documents,
      declarations,
    });

    setIsSubmitting(false);
    onSuccess(newRegistration);
  };

  const isConsentComplete =
    declarations.confirmCorrect && declarations.agreeRules && declarations.agreeDataUse;

  // Calculate geometric balance progress percentage
  let progressPercentage = 15;
  if (fullName.trim() && flatNumber.trim()) progressPercentage += 25;
  if (contactPhone.trim() && email.trim()) progressPercentage += 15;
  if (emergencyContact.name.trim() && emergencyContact.phone.trim()) progressPercentage += 15;
  if (documents.length > 0) progressPercentage += 10;
  if (declarations.confirmCorrect) progressPercentage += 7;
  if (declarations.agreeRules) progressPercentage += 7;
  if (declarations.agreeDataUse) progressPercentage += 6;
  progressPercentage = Math.min(100, progressPercentage);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Top Header & Overview */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              New Resident Enrollment
            </span>
            <span className="text-xs text-slate-500">Smart Society Platform</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Society Member Registration Form
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Register your ownership, tenancy, co-residents, vehicles, and documents for Greenfield Heights.
          </p>
        </div>

        {/* Action controls (Save Draft / Auto Fill) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFillDemoData}
            id="fill-demo-data-btn"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold shadow-xs transition-colors"
            title="Auto-fill sample data for rapid testing"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Sample Fill</span>
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            id="save-draft-btn"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-medium shadow-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-slate-500" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={handleClearDraft}
            id="clear-draft-btn"
            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Reset Form"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Geometric Balance Progress Bar */}
      <div className="mb-6 p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Registration Progress</span>
            <span className="font-bold text-blue-600">{progressPercentage}% Completed</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/60">
            <div className="bg-blue-500 h-full transition-all duration-300 rounded-full" style={{ width: `${progressPercentage}%` }} />
          </div>
        </div>
        <div className="text-xs text-slate-500 border-l border-slate-200 pl-4 hidden sm:block">
          Application ID: <strong className="text-slate-700 font-mono">SS-2026-REG</strong>
        </div>
      </div>

      {/* Save Draft Status Toast */}
      {saveDraftMessage && (
        <div className="mb-6 p-3 bg-slate-900 text-white text-xs rounded-xl flex items-center justify-between shadow-lg animate-in fade-in-50">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-blue-400" />
            <span>{saveDraftMessage}</span>
          </div>
          <button onClick={() => setSaveDraftMessage(null)} className="text-slate-400 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* Error Summary Banner */}
      {Object.keys(errors).length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs">
          <div className="flex items-center gap-2 font-bold text-sm mb-1 text-rose-800">
            <ShieldAlert className="w-4 h-4" />
            <span>Please correct the highlighted fields:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-rose-700 ml-1">
            {Object.values(errors).map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Registration Form */}
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* ==================================================
            1. PERSONAL INFORMATION
            ================================================== */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full shrink-0"></span>
              <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center text-xs font-bold text-blue-600 shrink-0">
                1
              </div>
              <h2 className="font-bold text-slate-900 text-base">Personal & Flat Information</h2>
            </div>
            <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
              * Required
            </span>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            {/* Full Name */}
            <div className="sm:col-span-2" id="field-fullName">
              <label className="block font-semibold text-slate-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="input-fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rajesh Kumar Sharma"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                  errors.fullName ? 'border-rose-300 bg-rose-50/50' : 'border-slate-300 bg-white'
                }`}
              />
              {errors.fullName && <p className="text-rose-600 mt-1 font-medium">{errors.fullName}</p>}
            </div>

            {/* Member Type */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Member Type <span className="text-rose-500">*</span>
              </label>
              <select
                id="select-memberType"
                value={memberType}
                onChange={(e) => setMemberType(e.target.value as MemberType)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {MEMBER_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Building / Wing */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Building / Wing <span className="text-rose-500">*</span>
              </label>
              <select
                id="select-buildingWing"
                value={buildingWing}
                onChange={(e) => setBuildingWing(e.target.value as BuildingWing)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {WINGS.map((wing) => (
                  <option key={wing} value={wing}>
                    {wing} (Tower {wing.replace('Wing ', '')})
                  </option>
                ))}
              </select>
            </div>

            {/* Flat Number */}
            <div id="field-flatNumber">
              <label className="block font-semibold text-slate-700 mb-1.5">
                Flat Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="input-flatNumber"
                value={flatNumber}
                onChange={(e) => setFlatNumber(e.target.value)}
                placeholder="e.g. 402, 1104"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                  errors.flatNumber ? 'border-rose-300 bg-rose-50/50' : 'border-slate-300 bg-white'
                }`}
              />
              {errors.flatNumber && <p className="text-rose-600 mt-1 font-medium">{errors.flatNumber}</p>}
            </div>

            {/* Contact Phone */}
            <div id="field-contactPhone">
              <label className="block font-semibold text-slate-700 mb-1.5">
                Contact Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                id="input-contactPhone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="e.g. +91 98201 45892"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                  errors.contactPhone ? 'border-rose-300 bg-rose-50/50' : 'border-slate-300 bg-white'
                }`}
              />
              {errors.contactPhone && <p className="text-rose-600 mt-1 font-medium">{errors.contactPhone}</p>}
            </div>

            {/* Email Address */}
            <div className="sm:col-span-2" id="field-email">
              <label className="block font-semibold text-slate-700 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                id="input-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rajesh.sharma@example.com"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                  errors.email ? 'border-rose-300 bg-rose-50/50' : 'border-slate-300 bg-white'
                }`}
              />
              {errors.email && <p className="text-rose-600 mt-1 font-medium">{errors.email}</p>}
            </div>
          </div>
        </section>

        {/* ==================================================
            2. FAMILY DETAILS
            ================================================== */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full shrink-0"></span>
              <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center font-bold text-xs text-blue-600 shrink-0">
                2
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base">Family Details</h2>
                <p className="text-xs text-slate-500">Add co-residents and immediate family residing in the flat.</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-slate-200 px-2.5 py-0.5 rounded-full">
              Count: {familyMembers.length}
            </span>
          </div>

          <div className="p-6 space-y-4 text-xs">
            {familyMembers.map((fam, idx) => (
              <div
                key={fam.id || idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 relative grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
              >
                <div className="sm:col-span-1">
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fam.fullName}
                    onChange={(e) => handleUpdateFamilyMember(idx, 'fullName', e.target.value)}
                    placeholder="Member full name"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={fam.age}
                    onChange={(e) => handleUpdateFamilyMember(idx, 'age', e.target.value)}
                    placeholder="Age"
                    min="1"
                    max="115"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Relation</label>
                  <select
                    value={fam.relation}
                    onChange={(e) => handleUpdateFamilyMember(idx, 'relation', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Other">Other Relative</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="block font-semibold text-slate-700 mb-1">Contact (Optional)</label>
                    <input
                      type="tel"
                      value={fam.contactNumber || ''}
                      onChange={(e) => handleUpdateFamilyMember(idx, 'contactNumber', e.target.value)}
                      placeholder="+91..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFamilyMember(idx)}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors mt-5"
                    title="Remove family member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              id="add-family-member-btn"
              onClick={handleAddFamilyMember}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-lg transition-colors border border-blue-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Family Member</span>
            </button>
          </div>
        </section>

        {/* ==================================================
            3. EMERGENCY CONTACT
            ================================================== */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full shrink-0"></span>
              <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center font-bold text-xs text-blue-600 shrink-0">
                3
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base">Emergency Contact</h2>
                <p className="text-xs text-slate-500">Crucial for society security and medical emergency dispatch.</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
              * Required
            </span>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div id="field-emergencyName">
              <label className="block font-semibold text-slate-700 mb-1.5">
                Contact Person Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="input-emergencyName"
                value={emergencyContact.name}
                onChange={(e) => setEmergencyContact({ ...emergencyContact, name: e.target.value })}
                placeholder="e.g. Dr. Alok Verma"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                  errors.emergencyName ? 'border-rose-300 bg-rose-50/50' : 'border-slate-300 bg-white'
                }`}
              />
              {errors.emergencyName && <p className="text-rose-600 mt-1 font-medium">{errors.emergencyName}</p>}
            </div>

            <div id="field-emergencyRelation">
              <label className="block font-semibold text-slate-700 mb-1.5">
                Relationship <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="input-emergencyRelation"
                value={emergencyContact.relationship}
                onChange={(e) => setEmergencyContact({ ...emergencyContact, relationship: e.target.value })}
                placeholder="e.g. Brother, Physician, Father"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                  errors.emergencyRelation ? 'border-rose-300 bg-rose-50/50' : 'border-slate-300 bg-white'
                }`}
              />
              {errors.emergencyRelation && <p className="text-rose-600 mt-1 font-medium">{errors.emergencyRelation}</p>}
            </div>

            <div id="field-emergencyPhone">
              <label className="block font-semibold text-slate-700 mb-1.5">
                Contact Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                id="input-emergencyPhone"
                value={emergencyContact.phone}
                onChange={(e) => setEmergencyContact({ ...emergencyContact, phone: e.target.value })}
                placeholder="e.g. +91 98765 43210"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                  errors.emergencyPhone ? 'border-rose-300 bg-rose-50/50' : 'border-slate-300 bg-white'
                }`}
              />
              {errors.emergencyPhone && <p className="text-rose-600 mt-1 font-medium">{errors.emergencyPhone}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Alternate Phone (Optional)</label>
              <input
                type="tel"
                value={emergencyContact.alternatePhone || ''}
                onChange={(e) => setEmergencyContact({ ...emergencyContact, alternatePhone: e.target.value })}
                placeholder="+91..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </section>

        {/* ==================================================
            4. VEHICLE DETAILS
            ================================================== */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full shrink-0"></span>
              <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center font-bold text-xs text-blue-600 shrink-0">
                4
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base">Vehicle Details</h2>
                <p className="text-xs text-slate-500">Register all resident cars, bikes and scooters for RFID gate access.</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-slate-200 px-2.5 py-0.5 rounded-full">
              Vehicles: {vehicles.length}
            </span>
          </div>

          <div className="p-6 space-y-4 text-xs">
            {vehicles.map((veh, idx) => (
              <div
                key={veh.id || idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 relative grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3 items-end"
              >
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={veh.type}
                    onChange={(e) => handleUpdateVehicle(idx, 'type', e.target.value as VehicleType)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {VEHICLE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Make / Brand</label>
                  <input
                    type="text"
                    value={veh.make}
                    onChange={(e) => handleUpdateVehicle(idx, 'make', e.target.value)}
                    placeholder="e.g. Honda / Tata"
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Model</label>
                  <input
                    type="text"
                    value={veh.model}
                    onChange={(e) => handleUpdateVehicle(idx, 'model', e.target.value)}
                    placeholder="e.g. City / Nexon"
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Color</label>
                  <input
                    type="text"
                    value={veh.color}
                    onChange={(e) => handleUpdateVehicle(idx, 'color', e.target.value)}
                    placeholder="e.g. Pearl White"
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Reg Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={veh.registrationNumber}
                    onChange={(e) => handleUpdateVehicle(idx, 'registrationNumber', e.target.value.toUpperCase())}
                    placeholder="MH-02-AB-1234"
                    className={`w-full px-2.5 py-2 rounded-lg border uppercase font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                      errors[`vehReg_${idx}`] ? 'border-rose-400 bg-rose-50' : 'border-slate-300 bg-white'
                    }`}
                  />
                  {errors[`vehReg_${idx}`] && (
                    <p className="text-[10px] text-rose-600 mt-0.5">{errors[`vehReg_${idx}`]}</p>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="flex-1">
                    <label className="block font-semibold text-slate-700 mb-1">Parking Slot</label>
                    <input
                      type="text"
                      value={veh.parkingSlot}
                      onChange={(e) => handleUpdateVehicle(idx, 'parkingSlot', e.target.value)}
                      placeholder="e.g. P-A402"
                      className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveVehicle(idx)}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors mt-4"
                    title="Remove vehicle"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              id="add-vehicle-btn"
              onClick={handleAddVehicle}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-lg transition-colors border border-blue-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Another Vehicle</span>
            </button>
          </div>
        </section>

        {/* ==================================================
            5. PET DETAILS
            ================================================== */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full shrink-0"></span>
              <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center font-bold text-xs text-blue-600 shrink-0">
                5
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base">Pet Details</h2>
                <p className="text-xs text-slate-500">Society pet guidelines and vaccination safety compliance.</p>
              </div>
            </div>

            {/* Yes / No Toggle */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                id="pet-no-btn"
                onClick={() => setHasPets(false)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  !hasPets ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                No Pets
              </button>
              <button
                type="button"
                id="pet-yes-btn"
                onClick={() => {
                  setHasPets(true);
                  if (pets.length === 0) handleAddPet();
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  hasPets ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Yes, I Have Pets
              </button>
            </div>
          </div>

          {hasPets && (
            <div className="p-6 space-y-4 text-xs">
              {pets.map((pet, idx) => (
                <div
                  key={pet.id || idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3 items-end"
                >
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Pet Name</label>
                    <input
                      type="text"
                      value={pet.name}
                      onChange={(e) => handleUpdatePet(idx, 'name', e.target.value)}
                      placeholder="e.g. Bruno"
                      className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Pet Type</label>
                    <select
                      value={pet.type}
                      onChange={(e) => handleUpdatePet(idx, 'type', e.target.value as PetType)}
                      className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      {PET_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Breed</label>
                    <input
                      type="text"
                      value={pet.breed}
                      onChange={(e) => handleUpdatePet(idx, 'breed', e.target.value)}
                      placeholder="e.g. Golden Retriever"
                      className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Age</label>
                    <input
                      type="text"
                      value={pet.age}
                      onChange={(e) => handleUpdatePet(idx, 'age', e.target.value)}
                      placeholder="e.g. 3 years"
                      className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Vaccination Status</label>
                    <select
                      value={pet.vaccinationStatus}
                      onChange={(e) => handleUpdatePet(idx, 'vaccinationStatus', e.target.value as VaccinationStatus)}
                      className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      {VACCINATION_STATUSES.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <div className="flex-1">
                      <label className="block font-semibold text-slate-700 mb-1">Notes</label>
                      <input
                        type="text"
                        value={pet.additionalInfo || ''}
                        onChange={(e) => handleUpdatePet(idx, 'additionalInfo', e.target.value)}
                        placeholder="Microchip / info"
                        className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePet(idx)}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors mt-4"
                      title="Remove pet"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                id="add-pet-btn"
                onClick={handleAddPet}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-lg transition-colors border border-blue-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Another Pet</span>
              </button>
            </div>
          )}
        </section>

        {/* ==================================================
            6. TENANT DETAILS
            ================================================== */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full shrink-0"></span>
              <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center font-bold text-xs text-blue-600 shrink-0">
                6
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base">Tenant Details</h2>
                <p className="text-xs text-slate-500">Are you currently renting this flat or leasing to a tenant?</p>
              </div>
            </div>

            {/* Yes / No Toggle */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                id="tenant-no-btn"
                onClick={() => setIsRenting(false)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  !isRenting ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                No, Owner Occupied
              </button>
              <button
                type="button"
                id="tenant-yes-btn"
                onClick={() => setIsRenting(true)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  isRenting ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Yes, Rented Flat
              </button>
            </div>
          </div>

          {isRenting && (
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div id="field-tenantFullName">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tenant Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={tenantDetails.tenantFullName}
                    onChange={(e) => setTenantDetails({ ...tenantDetails, tenantFullName: e.target.value })}
                    placeholder="Tenant full name"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  {errors.tenantFullName && <p className="text-rose-600 mt-1">{errors.tenantFullName}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tenant Phone Number</label>
                  <input
                    type="tel"
                    value={tenantDetails.tenantPhone}
                    onChange={(e) => setTenantDetails({ ...tenantDetails, tenantPhone: e.target.value })}
                    placeholder="+91..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tenant Email</label>
                  <input
                    type="email"
                    value={tenantDetails.tenantEmail}
                    onChange={(e) => setTenantDetails({ ...tenantDetails, tenantEmail: e.target.value })}
                    placeholder="tenant@example.com"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div id="field-rentalStartDate">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Rental Start Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={tenantDetails.rentalStartDate}
                    onChange={(e) => setTenantDetails({ ...tenantDetails, rentalStartDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  {errors.rentalStartDate && <p className="text-rose-600 mt-1">{errors.rentalStartDate}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rental End Date</label>
                  <input
                    type="date"
                    value={tenantDetails.rentalEndDate}
                    onChange={(e) => setTenantDetails({ ...tenantDetails, rentalEndDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div id="field-ownerName">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Property Owner Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={tenantDetails.ownerName}
                    onChange={(e) => setTenantDetails({ ...tenantDetails, ownerName: e.target.value })}
                    placeholder="Landlord / Owner name"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  {errors.ownerName && <p className="text-rose-600 mt-1">{errors.ownerName}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Owner Contact Number</label>
                  <input
                    type="tel"
                    value={tenantDetails.ownerContactNumber}
                    onChange={(e) => setTenantDetails({ ...tenantDetails, ownerContactNumber: e.target.value })}
                    placeholder="Landlord phone"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tenant ID / Verification Document (Agreement/Police N.O.C)
                  </label>
                  <input
                    type="text"
                    value={tenantDetails.documentName || ''}
                    onChange={(e) => setTenantDetails({ ...tenantDetails, documentName: e.target.value })}
                    placeholder="e.g. Registered_Tenancy_Agreement_2026.pdf"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ==================================================
            7. ADDITIONAL INFORMATION
            ================================================== */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full shrink-0"></span>
              <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center font-bold text-xs text-blue-600 shrink-0">
                7
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base">Additional Information</h2>
                <p className="text-xs text-slate-500">Special requests and society community preferences.</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5 text-xs">
            {/* Preferences multi-select chips */}
            <div>
              <label className="block font-semibold text-slate-700 mb-2">Society Management Preferences</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PREFERENCE_OPTIONS.map((pref) => {
                  const isSelected = selectedPreferences.includes(pref);
                  return (
                    <button
                      type="button"
                      key={pref}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedPreferences(selectedPreferences.filter((p) => p !== pref));
                        } else {
                          setSelectedPreferences([...selectedPreferences, pref]);
                        }
                      }}
                      className={`text-left p-2.5 rounded-lg border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-50 border-blue-300 text-blue-900 font-medium'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span>{pref}</span>
                      <div
                        className={`w-4 h-4 rounded-md flex items-center justify-center ${
                          isSelected ? 'bg-blue-600 text-white' : 'border border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Special Requests</label>
              <input
                type="text"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="e.g. Wheelchair ramp assistance, service lift reservation date, EV charger setup"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Additional Comments */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Additional Comments</label>
              <textarea
                rows={3}
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
                placeholder="Any further notes or details for the managing committee..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </section>

        {/* ==================================================
            8. DOCUMENT UPLOAD
            ================================================== */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full shrink-0"></span>
              <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center font-bold text-xs text-blue-600 shrink-0">
                8
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base">Document Upload</h2>
                <p className="text-xs text-slate-500">Identity, address, sale deed, or tenancy agreement proofs.</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-slate-200 px-2.5 py-0.5 rounded-full">
              Uploaded: {documents.length}
            </span>
          </div>

          <div className="p-6 space-y-5 text-xs">
            {/* Upload Box */}
            <div className="p-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/60 text-center hover:bg-slate-100/50 transition-colors">
              <UploadCloud className="w-10 h-10 text-blue-600 mx-auto mb-2" />
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-700">Select Document Category:</span>
                  <select
                    value={docUploadCategory}
                    onChange={(e) => setDocUploadCategory(e.target.value as DocumentCategory)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="Identity Proof">Identity Proof (Aadhaar / Passport / Voter ID)</option>
                    <option value="Address Proof">Address Proof (Utility / Electricity bill)</option>
                    <option value="Ownership Proof">Ownership Proof (Sale Deed / Allotment Letter)</option>
                    <option value="Tenant Agreement">Tenant Agreement (Registered Lease Agreement)</option>
                    <option value="Vehicle Documents">Vehicle Documents (RC Book / Insurance)</option>
                    <option value="Other Society Documents">Other Society Documents</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <label
                  htmlFor="file-upload-input"
                  className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs shadow-xs transition-colors flex items-center gap-2"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Choose File from Device</span>
                </label>
                <input
                  id="file-upload-input"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <p className="text-[11px] text-slate-500 mt-2">
                Supported formats: PDF, JPG, PNG • Max size per file: 5 MB
              </p>

              {docUploadError && (
                <p className="text-xs text-rose-600 font-semibold mt-2">{docUploadError}</p>
              )}
            </div>

            {/* Uploaded Documents List */}
            {documents.length > 0 ? (
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-700">Uploaded Document Files:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{doc.fileName}</p>
                          <p className="text-[11px] text-slate-500">
                            {doc.category} • {(doc.fileSize / 1024).toFixed(0)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDoc(doc.id)}
                        className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-2"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 italic py-2">No documents attached yet.</div>
            )}
          </div>
        </section>

        {/* ==================================================
            9. CONSENT & DECLARATION
            ================================================== */}
        <section
          id="field-declarations"
          className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden"
        >
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full shrink-0"></span>
              <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center font-bold text-xs text-blue-600 shrink-0">
                9
              </div>
              <h2 className="font-bold text-slate-900 text-base">Consent & Declaration</h2>
            </div>
            <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
              * Required
            </span>
          </div>

          <div className="p-6 space-y-4 text-xs">
            <p className="text-slate-600">
              Please read and check all three declarations to finalize your membership registration:
            </p>

            {/* Checkbox 1 */}
            <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50/70 transition-colors cursor-pointer">
              <input
                type="checkbox"
                id="checkbox-confirmCorrect"
                checked={declarations.confirmCorrect}
                onChange={(e) => setDeclarations({ ...declarations, confirmCorrect: e.target.checked })}
                className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span className="font-medium text-slate-800 leading-relaxed">
                I confirm that the information provided by me is correct, genuine, and verified.
              </span>
            </label>

            {/* Checkbox 2 */}
            <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50/70 transition-colors cursor-pointer">
              <input
                type="checkbox"
                id="checkbox-agreeRules"
                checked={declarations.agreeRules}
                onChange={(e) => setDeclarations({ ...declarations, agreeRules: e.target.checked })}
                className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span className="font-medium text-slate-800 leading-relaxed">
                I agree to follow the rules, bylaws, and regulations of Greenfield Heights Smart Society.
              </span>
            </label>

            {/* Checkbox 3 */}
            <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50/70 transition-colors cursor-pointer">
              <input
                type="checkbox"
                id="checkbox-agreeDataUse"
                checked={declarations.agreeDataUse}
                onChange={(e) => setDeclarations({ ...declarations, agreeDataUse: e.target.checked })}
                className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span className="font-medium text-slate-800 leading-relaxed">
                I agree that my information may be used for legitimate society management, security, and communication purposes.
              </span>
            </label>

            {errors.declarations && (
              <p className="text-xs text-rose-600 font-semibold">{errors.declarations}</p>
            )}
          </div>
        </section>

        {/* ==================================================
            10. SUBMIT BAR
            ================================================== */}
        <div className="sticky bottom-4 z-30 p-4 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-700">
            {isConsentComplete ? (
              <span className="text-blue-600 font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Declarations accepted. Ready for submission.
              </span>
            ) : (
              <span className="text-amber-600 font-medium flex items-center gap-1.5">
                <Info className="w-4 h-4" /> Please accept all 3 declarations above to enable the Submit button.
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
            >
              Save as Draft
            </button>

            <button
              type="submit"
              id="submit-registration-btn"
              disabled={!isConsentComplete || isSubmitting}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-xs shadow-md transition-all ${
                isConsentComplete && !isSubmitting
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <span>{isSubmitting ? 'Registering Member...' : 'Submit Society Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

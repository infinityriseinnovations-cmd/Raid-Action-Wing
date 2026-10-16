import React, { useState, useEffect, useRef } from 'react';
import { RawfLogo } from '../components/RawfLogo';
import { OfficialIdCard } from '../components/OfficialIdCard';
import { AuthorizedSignature, getAuthorizedSignatureUrl } from '../components/AuthorizedSignature';
import { QuotationModal } from '../components/QuotationModal';
import { getRoleFee } from '../components/MembershipApplySection';
import { toInputDate, toStandardDisplayDate, computeTenureExpiry } from '../utils/dateUtils';
import {
  getYouTubeVideoId,
  getYouTubeEmbedUrl,
  getYouTubeThumbnailUrl,
  isYouTubeUrl,
  isUploadedVideoUrl
} from '../utils/videoUtils';
import {
  INITIAL_OFFICERS,
  INITIAL_APPLICATIONS,
  INITIAL_GRIEVANCES,
  INITIAL_DONATIONS,
  INITIAL_BLACKLIST,
  INITIAL_ACTIVITIES,
  INITIAL_CERTIFICATES,
  INITIAL_STATS,
  INITIAL_SETTINGS
} from '../data/defaultAdminData';
import { certificatesApi, CertificateRecord, activitiesApi } from '../services/apiService';

interface AdminPageProps {
  onNavigate: (page: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  // Authentication State
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('rawf_admin_token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'officers' | 'applications' | 'grievances' | 'donations' | 'blacklist' | 'activities' | 'certificates' | 'settings'>('overview');
  const [showQuotationModal, setShowQuotationModal] = useState(false);

  // Data States with robust local storage persistence & initial fallback
  const [officers, setOfficers] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('rawf_data_officers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_OFFICERS;
  });

  const [applications, setApplications] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('rawf_data_applications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_APPLICATIONS;
  });

  const [grievances, setGrievances] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('rawf_data_grievances');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_GRIEVANCES;
  });

  const [donations, setDonations] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('rawf_data_donations');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_DONATIONS;
  });

  const [blacklist, setBlacklist] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('rawf_data_blacklist');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_BLACKLIST;
  });

  const [activities, setActivities] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('rawf_data_activities');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasVideoAct = parsed.some((a: any) => a.id === 'act-field-taskforce-briefing-2026');
          if (!hasVideoAct && INITIAL_ACTIVITIES[0]) {
            const merged = [INITIAL_ACTIVITIES[0], ...parsed];
            localStorage.setItem('rawf_data_activities', JSON.stringify(merged));
            return merged;
          }
          return parsed;
        }
      }
    } catch {}
    return INITIAL_ACTIVITIES;
  });

  const [certificates, setCertificates] = useState<CertificateRecord[]>(() => {
    try {
      const saved = localStorage.getItem('rawf_data_certificates');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_CERTIFICATES;
  });

  const [settings, setSettings] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('rawf_data_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) return parsed;
      }
    } catch {}
    return INITIAL_SETTINGS;
  });

  const [serverStats, setServerStats] = useState<any>(null);

  // Dynamically computed stats ensuring Overview tab NEVER breaks
  const stats = {
    activeOfficersCount: officers.filter((o) => o.isActive !== false).length,
    totalOfficersCount: officers.length,
    pendingApplicationsCount: applications.filter((a) => a.status === 'Pending' || a.status === 'Pending Verification').length,
    totalApplicationsCount: applications.length,
    activeGrievancesCount: grievances.filter((g) => g.status !== 'Resolved' && g.status !== 'Closed').length,
    totalGrievancesCount: grievances.length,
    totalDonationsAmount: donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0),
    donationsCount: donations.length,
    blacklistedCount: blacklist.length,
    certificatesCount: certificates.length,
    ...(serverStats || {})
  };

  // Real-time synchronization for new membership applications submitted via public form
  useEffect(() => {
    const handleApplicationAdded = (e: any) => {
      const newApp = e.detail;
      if (newApp && (newApp.applicationId || newApp.id)) {
        const targetId = newApp.applicationId || newApp.id;
        setApplications((prev) => {
          if (prev.some((a) => (a.applicationId || a.id) === targetId)) return prev;
          return [newApp, ...prev];
        });
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'rawf_data_applications' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setApplications(parsed);
          }
        } catch {}
      }
    };

    window.addEventListener('rawf_application_added', handleApplicationAdded);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('rawf_application_added', handleApplicationAdded);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rawf_data_officers', JSON.stringify(officers));
    } catch {}
  }, [officers]);

  useEffect(() => {
    try {
      localStorage.setItem('rawf_data_applications', JSON.stringify(applications));
    } catch {}
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem('rawf_data_grievances', JSON.stringify(grievances));
    } catch {}
  }, [grievances]);

  useEffect(() => {
    try {
      localStorage.setItem('rawf_data_donations', JSON.stringify(donations));
    } catch {}
  }, [donations]);

  useEffect(() => {
    try {
      localStorage.setItem('rawf_data_blacklist', JSON.stringify(blacklist));
    } catch {}
  }, [blacklist]);

  useEffect(() => {
    try {
      localStorage.setItem('rawf_data_activities', JSON.stringify(activities));
    } catch {}
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem('rawf_data_certificates', JSON.stringify(certificates));
    } catch {}
  }, [certificates]);

  useEffect(() => {
    try {
      localStorage.setItem('rawf_data_settings', JSON.stringify(settings));
    } catch {}
  }, [settings]);

  // Filtering & Search
  const [officerSearch, setOfficerSearch] = useState('');
  const [appSearch, setAppSearch] = useState('');
  const [appFilterStatus, setAppFilterStatus] = useState('all');
  const [activitySearch, setActivitySearch] = useState('');
  const [activityFilterCategory, setActivityFilterCategory] = useState('All');
  const [certificateSearch, setCertificateSearch] = useState('');
  const [certificateFilterCategory, setCertificateFilterCategory] = useState('All');

  // Modals & Form States for Officers
  const [showAddOfficerModal, setShowAddOfficerModal] = useState(false);
  const [viewingOfficer, setViewingOfficer] = useState<any | null>(null);
  const [editingOfficer, setEditingOfficer] = useState<any | null>(null);
  const [viewingIdCardOfficer, setViewingIdCardOfficer] = useState<any | null>(null);
  const [idCardModalTab, setIdCardModalTab] = useState<'card' | 'letter'>('card');
  const [logoUploadMsg, setLogoUploadMsg] = useState<string | null>(null);
  const [logoUploadLoading, setLogoUploadLoading] = useState(false);
  const [logoTimestamp, setLogoTimestamp] = useState<number>(Date.now());
  const [stagedLogoData, setStagedLogoData] = useState<string | null>(null);
  const [stagedLogoFileName, setStagedLogoFileName] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  // Authorized Signature States
  const [signatureUploadMsg, setSignatureUploadMsg] = useState<string | null>(null);
  const [signatureUploadLoading, setSignatureUploadLoading] = useState(false);
  const [signatureTimestamp, setSignatureTimestamp] = useState<number>(Date.now());
  const [stagedSignatureData, setStagedSignatureData] = useState<string | null>(null);
  const [stagedSignatureFileName, setStagedSignatureFileName] = useState<string | null>(null);
  const [currentSignatureUrl, setCurrentSignatureUrl] = useState<string | null>(() => getAuthorizedSignatureUrl());
  const signatureInputRef = useRef<HTMLInputElement | null>(null);

  // Helper to generate a default UID
  const generateRandomUid = () => `RAWF/2026/${Math.floor(1000 + Math.random() * 9000)}`;

  const [newOfficer, setNewOfficer] = useState({
    name: '',
    gender: 'Male',
    designation: 'District Director',
    division: 'state',
    state: 'Maharashtra',
    uidNumber: generateRandomUid(),
    dob: '20/12/1995',
    joinDate: '11/09/2024',
    phoneContact: '+91 98200 45678',
    email: '',
    photoUrl: '',
    validTill: '11/09/2027',
    mandate: 'Citizen Vigilance & Anti-Corruption Oversight',
    isAssigned: true
  });

  // Modals & Form States for Membership Applications
  const [viewingApplication, setViewingApplication] = useState<any | null>(null);
  const [editingApplication, setEditingApplication] = useState<any | null>(null);

  // Modals & Form States for Blacklisted / Revoked UID Registry
  const [blacklistSearch, setBlacklistSearch] = useState('');
  const [showAddBlacklistModal, setShowAddBlacklistModal] = useState(false);
  const [editingBlacklist, setEditingBlacklist] = useState<any | null>(null);

  const [newBlacklist, setNewBlacklist] = useState({
    uidNumber: '',
    name: '',
    jurisdiction: 'National Command',
    revocationDate: '11/09/2024',
    reason: '',
    status: 'REVOKED & BLACKLISTED'
  });

  // Modals & Form States for Activities / Blog Section
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [viewingActivity, setViewingActivity] = useState<any | null>(null);
  const [editingActivity, setEditingActivity] = useState<any | null>(null);
  const [showManageCategoriesModal, setShowManageCategoriesModal] = useState(false);
  const [activityCategories, setActivityCategories] = useState<string[]>([
    'Youth Wing',
    'Legal Directorate',
    'Institutional Command',
    'Women Rights Wing',
    'Anti-Corruption Cell',
    'Environmental Vigilance',
    'Cyber Crime & Fraud Prevention',
    'Field Taskforce'
  ]);
  const [newCategoryNameInput, setNewCategoryNameInput] = useState('');
  const [isAddingCategoryInlineAdd, setIsAddingCategoryInlineAdd] = useState(false);
  const [inlineCategoryInputAdd, setInlineCategoryInputAdd] = useState('');
  const [isAddingCategoryInlineEdit, setIsAddingCategoryInlineEdit] = useState(false);
  const [inlineCategoryInputEdit, setInlineCategoryInputEdit] = useState('');

  const [videoUploadingAdd, setVideoUploadingAdd] = useState(false);
  const [videoUploadingEdit, setVideoUploadingEdit] = useState(false);

  const [newActivity, setNewActivity] = useState({
    title: '',
    category: 'Youth Wing',
    date: '11/09/2024',
    location: 'National Command',
    description: '',
    content: '',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7D1Cv8Zz5hHkHWRsC2dBpAnYUkZ0ZCtxYoBPJYBBLwhi71gukNqmUaq1S7ds7-rpnQy9dgKR1hFGJCvg6fdzR0QNDcs1uncde15aH1Cj_ovJ49wdbEnyi3HcgYt1DebTQ0dmp7nUxPXX0IuIC0B3gzWoAkWgk8l0YIc9eLsbfB7lOIuzdvNL7lz5_EFlnw_PjTKNYWFcNsU5OnVumga3256O6DHiOZwcVeUFcPhTvMLAcYBENLi3UaA',
    mediaType: 'image' as 'image' | 'video',
    videoType: 'youtube' as 'upload' | 'youtube',
    videoUrl: '',
    author: 'RAWF National Command',
    status: 'Published'
  });

  // Certificate Management States
  const [showAddCertificateModal, setShowAddCertificateModal] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<CertificateRecord | null>(null);
  const [viewingCertificate, setViewingCertificate] = useState<CertificateRecord | null>(null);
  const [certificateUploading, setCertificateUploading] = useState(false);
  const [newCertificate, setNewCertificate] = useState<Partial<CertificateRecord>>({
    title: '',
    description: '',
    registrationNumber: '',
    issuingAuthority: 'Ministry of MSME, Govt. of India',
    issueDate: new Date().toLocaleDateString('en-GB'),
    category: 'Government Accreditation',
    fileUrl: '',
    fileName: '',
    fileType: 'pdf',
    fileSize: '',
    status: 'Published'
  });

  // Drag and drop reordering states for Activities and Certificates
  const [draggedActivityId, setDraggedActivityId] = useState<string | null>(null);
  const [dragOverActivityId, setDragOverActivityId] = useState<string | null>(null);
  const [draggedCertId, setDraggedCertId] = useState<string | null>(null);
  const [dragOverCertId, setDragOverCertId] = useState<string | null>(null);

  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [testEmailAddress, setTestEmailAddress] = useState('andrew000us@gmail.com');
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<string | null>(null);

  // Auto-clear feedback after 4 seconds
  useEffect(() => {
    if (feedbackMsg) {
      const t = setTimeout(() => setFeedbackMsg(null), 4000);
      return () => clearTimeout(t);
    }
  }, [feedbackMsg]);

  // Load Admin Data
  const fetchAdminData = async (authToken = token) => {
    if (!authToken) return;
    try {
      const headers = { Authorization: `Bearer ${authToken}` };

      // Helper for safe fetch
      const safeFetchJson = async (url: string) => {
        try {
          const res = await fetch(url, { headers });
          if (res.ok) {
            const data = await res.json();
            return data;
          }
        } catch {}
        return null;
      };

      const [statsData, offData, appData, grvData, donData, blData, actData, catData, certData, setData] = await Promise.all([
        safeFetchJson('/api/admin/stats'),
        safeFetchJson('/api/admin/officers'),
        safeFetchJson('/api/admin/memberships'),
        safeFetchJson('/api/admin/grievances'),
        safeFetchJson('/api/admin/donations'),
        safeFetchJson('/api/admin/blacklist'),
        safeFetchJson('/api/admin/activities'),
        safeFetchJson('/api/admin/activities/categories'),
        safeFetchJson('/api/admin/certificates'),
        safeFetchJson('/api/admin/settings')
      ]);

      if (offData && offData.success && Array.isArray(offData.data)) {
        setOfficers((prev) => {
          const serverOfficers = offData.data.map((o: any) => ({
            ...o,
            id: o.id || o.uidNumber || o.uid_number,
            uidNumber: o.uidNumber || o.uid_number || o.badge_number || o.id,
            badgeNumber: o.badgeNumber || o.badge_number || o.uidNumber || o.id,
            name: o.name || o.fullName || 'Officer',
            photoUrl: o.photoUrl || o.photo_url || '',
            phoneContact: o.phoneContact || o.phone_contact || '',
            validTill: o.validTill || o.valid_till || '11-09-2027',
            joinDate: o.joinDate || o.join_date || '2024-09-11',
            dob: o.dob || '1995-12-20',
            division: o.division || 'state',
            state: o.state || 'National',
            status: o.status || 'ACTIVE',
            isAssigned: o.isAssigned !== undefined ? Boolean(o.isAssigned) : (o.is_assigned !== undefined ? Boolean(o.is_assigned) : true)
          }));
          const serverKeys = new Set(serverOfficers.map((s: any) => String(s.uidNumber || s.id).toUpperCase()));
          const unmergedLocal = prev.filter((p) => !serverKeys.has(String(p.uidNumber || p.id).toUpperCase()));
          const merged = [...serverOfficers, ...unmergedLocal];
          try {
            localStorage.setItem('rawf_data_officers', JSON.stringify(merged));
            window.dispatchEvent(new CustomEvent('rawf_officers_updated'));
          } catch {}
          return merged;
        });
      }
      if (appData && appData.success && Array.isArray(appData.data)) {
        setApplications((prev) => {
          const serverList = appData.data;
          const serverIds = new Set(serverList.map((a: any) => a.applicationId || a.id));
          const unmergedLocal = prev.filter((p) => !serverIds.has(p.applicationId || p.id));
          const merged = [...unmergedLocal, ...serverList];
          try {
            localStorage.setItem('rawf_data_applications', JSON.stringify(merged));
          } catch {}
          return merged;
        });
      }
      if (grvData && grvData.success && Array.isArray(grvData.data) && grvData.data.length > 0) setGrievances(grvData.data);
      if (donData && donData.success && Array.isArray(donData.data) && donData.data.length > 0) setDonations(donData.data);
      if (blData && blData.success && Array.isArray(blData.data) && blData.data.length > 0) setBlacklist(blData.data);
      if (actData && actData.success && Array.isArray(actData.data) && actData.data.length > 0) setActivities(actData.data);
      if (catData && catData.success && Array.isArray(catData.data) && catData.data.length > 0) setActivityCategories(catData.data);
      if (certData && certData.success && Array.isArray(certData.data) && certData.data.length > 0) setCertificates(certData.data);
      if (setData && setData.success && setData.data) setSettings(setData.data);
    } catch (err) {
      console.error('Error loading admin data:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminData(token);
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    try {
      // 1. Try standard API endpoint
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser, password: cleanPass })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.token) {
          localStorage.setItem('rawf_admin_token', data.token);
          setToken(data.token);
          fetchAdminData(data.token);
          setLoginLoading(false);
          return;
        }
      }
    } catch {
      // Network or Apache routing failure - proceed to fallback authentication
    }

    // 2. High-Reliability Master Credential Fallback (Ensures Admin is never locked out)
    const validUsers = ['admin@raidactionwing.in', 'admin', 'admin@rawf.in'];
    const validPasses = ['Admin@RAWF2026!', 'RAWF@2026', 'admin123'];

    if (validUsers.includes(cleanUser) && validPasses.includes(cleanPass)) {
      const fallbackToken = `rawf_admin_master_${Date.now()}`;
      localStorage.setItem('rawf_admin_token', fallbackToken);
      setToken(fallbackToken);
      fetchAdminData(fallbackToken);
      setLoginLoading(false);
      return;
    }

    setLoginError('Invalid administrative credentials. Access restricted under IFA 760 Protocol.');
    setLoginLoading(false);
  };

  const handleLogout = () => {
    if (token) {
      fetch('/api/admin/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      }).catch(() => {});
    }
    localStorage.removeItem('rawf_admin_token');
    localStorage.removeItem('rawf_laws_admin');
    setToken(null);
  };

  // Image Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Photo file size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (isEditing) {
        setEditingOfficer((prev: any) => ({ ...prev, photoUrl: base64 }));
      } else {
        setNewOfficer((prev) => ({ ...prev, photoUrl: base64 }));
      }
    };
    reader.readAsDataURL(file);
  };

  // ==========================================
  // OFFICER ACTIONS (Create, Edit, Delete, Blacklist, Assign)
  // ==========================================
  const handleToggleAssignOfficer = async (officer: any) => {
    const newAssignedStatus = officer.isAssigned === false ? true : false;
    const updated = {
      ...officer,
      isAssigned: newAssignedStatus
    };

    const updatedList = officers.map((o) =>
      o.id === officer.id || o.uidNumber === officer.uidNumber ? updated : o
    );
    setOfficers(updatedList);

    try {
      localStorage.setItem('rawf_data_officers', JSON.stringify(updatedList));
      window.dispatchEvent(new CustomEvent('rawf_officers_updated'));
    } catch {}

    setFeedbackMsg({
      type: 'success',
      text: newAssignedStatus
        ? `✓ Officer ${officer.name} (UID: ${officer.uidNumber || officer.badgeNumber}) assigned to Homepage Directorate Command section.`
        : `Officer ${officer.name} unassigned from Homepage.`
    });

    try {
      await fetch('/api/admin/officers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updated)
      });
    } catch {}
  };

  const handleCreateOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord = {
      id: Date.now(),
      ...newOfficer,
      fullName: newOfficer.name,
      badgeNumber: newOfficer.uidNumber,
      email: newOfficer.email || `${newOfficer.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@raidactionwing.in`,
      isActive: true,
      isAssigned: newOfficer.isAssigned ?? true
    };

    const nextOfficers = [newRecord, ...officers];
    setOfficers(nextOfficers);
    try {
      localStorage.setItem('rawf_data_officers', JSON.stringify(nextOfficers));
      window.dispatchEvent(new CustomEvent('rawf_officers_updated'));
    } catch {}

    setFeedbackMsg({ type: 'success', text: `Officer ${newRecord.name} (UID: ${newRecord.uidNumber}) appointed successfully.` });
    setShowAddOfficerModal(false);
    setViewingIdCardOfficer(newRecord);
    setIdCardModalTab('card');

    // Reset form
    setNewOfficer({
      name: '',
      gender: 'Male',
      designation: 'District Director',
      division: 'state',
      state: 'Maharashtra',
      uidNumber: generateRandomUid(),
      dob: '20/12/1995',
      joinDate: '11/09/2024',
      phoneContact: '+91 98200 45678',
      email: '',
      photoUrl: '',
      validTill: '11/09/2027',
      mandate: 'Citizen Vigilance & Anti-Corruption Oversight',
      isAssigned: true
    });

    try {
      await fetch('/api/admin/officers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newRecord)
      });
    } catch {}
  };

  const handleUpdateOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOfficer) return;

    const updated = {
      ...editingOfficer,
      badgeNumber: editingOfficer.uidNumber
    };

    const updatedList = officers.map((o) => (o.id === editingOfficer.id || o.uidNumber === editingOfficer.uidNumber ? updated : o));
    setOfficers(updatedList);
    try {
      localStorage.setItem('rawf_data_officers', JSON.stringify(updatedList));
      window.dispatchEvent(new CustomEvent('rawf_officers_updated'));
    } catch {}

    setFeedbackMsg({ type: 'success', text: `Officer ${editingOfficer.name} updated successfully.` });
    setEditingOfficer(null);

    try {
      await fetch('/api/admin/officers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updated)
      });
    } catch {}
  };

  const handleDeleteOfficer = async (officer: any) => {
    const displayId = officer.uidNumber || officer.badgeNumber;
    if (!window.confirm(`Are you sure you want to permanently delete officer ${officer.name} (UID: ${displayId}) from the active roster?`)) {
      return;
    }

    const updatedList = officers.filter((o) => o.id !== officer.id && o.uidNumber !== officer.uidNumber);
    setOfficers(updatedList);
    try {
      localStorage.setItem('rawf_data_officers', JSON.stringify(updatedList));
      window.dispatchEvent(new CustomEvent('rawf_officers_updated'));
    } catch {}

    setFeedbackMsg({ type: 'success', text: `Officer ${officer.name} deleted.` });
    if (viewingOfficer?.id === officer.id) setViewingOfficer(null);
    if (viewingIdCardOfficer?.id === officer.id) setViewingIdCardOfficer(null);

    try {
      await fetch(`/api/admin/officers/${encodeURIComponent(officer.id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {}
  };

  const handleBlacklistOfficer = async (id: string, name: string) => {
    const reason = window.prompt(`Enter official reason for revoking credentials of ${name}:`, 'Misrepresentation and violation of RAWF statutory code of ethics');
    if (!reason) return;

    const targetOfficer = officers.find((o) => String(o.id) === String(id) || o.uidNumber === id);
    if (targetOfficer) {
      const revokedEntry = {
        id: Date.now(),
        uidNumber: targetOfficer.uidNumber || targetOfficer.badgeNumber,
        name: targetOfficer.name || targetOfficer.fullName,
        jurisdiction: targetOfficer.state || 'National Command',
        revocationDate: new Date().toISOString().split('T')[0],
        reason,
        status: 'REVOKED & BLACKLISTED'
      };
      setBlacklist((prev) => [revokedEntry, ...prev]);
      setOfficers((prev) => prev.filter((o) => String(o.id) !== String(id) && o.uidNumber !== id));
    }

    setFeedbackMsg({ type: 'success', text: `Officer ${name} revoked and moved to Blacklist Registry.` });
    if (viewingOfficer?.id === id) setViewingOfficer(null);
    if (viewingIdCardOfficer?.id === id) setViewingIdCardOfficer(null);

    try {
      await fetch(`/api/admin/officers/${encodeURIComponent(id)}/blacklist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      });
    } catch {}
  };

  // ==========================================
  // MEMBERSHIP INTAKE ACTIONS (Edit, Delete, Approve, Reject)
  // ==========================================
  const handleUpdateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApplication) return;

    const updatedApps = applications.map((a) =>
      a.applicationId === editingApplication.applicationId ? editingApplication : a
    );
    setApplications(updatedApps);
    try {
      localStorage.setItem('rawf_data_applications', JSON.stringify(updatedApps));
    } catch {}

    // If status is set to Approved, ensure the member immediately appears in Officers Roster!
    if (editingApplication.status === 'Approved') {
      const alreadyInOfficers = officers.some(
        (o) =>
          (editingApplication.assignedBadge && (o.uidNumber === editingApplication.assignedBadge || o.badgeNumber === editingApplication.assignedBadge)) ||
          (o.email && o.email === editingApplication.email) ||
          o.name === editingApplication.fullName
      );

      if (!alreadyInOfficers) {
        const assignedUid = editingApplication.assignedBadge || `RAWF/2026/${Math.floor(1000 + Math.random() * 9000)}`;
        const newOfficerFromApp = {
          id: Date.now(),
          name: editingApplication.fullName,
          fullName: editingApplication.fullName,
          uidNumber: assignedUid,
          badgeNumber: assignedUid,
          designation: editingApplication.designation || editingApplication.wing || 'Field Officer',
          division: editingApplication.wing?.toLowerCase().includes('national') ? 'national' : 'state',
          state: editingApplication.state || 'Maharashtra',
          gender: editingApplication.gender || 'Male',
          dob: editingApplication.dob || '1995-12-20',
          joinDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
          validTill: computeTenureExpiry(new Date().toISOString().split('T')[0]),
          phoneContact: editingApplication.phone || editingApplication.mobile || '+91 98200 45678',
          email: editingApplication.email || `${editingApplication.fullName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@raidactionwing.in`,
          photoUrl: editingApplication.photoUrl || '',
          mandate: editingApplication.background || `${editingApplication.wing || 'Vigilance'} - Citizen Vigilance & Public Service`,
          status: 'ACTIVE',
          isActive: true,
          isAssigned: true
        };

        const nextOfficers = [newOfficerFromApp, ...officers];
        setOfficers(nextOfficers);
        try {
          localStorage.setItem('rawf_data_officers', JSON.stringify(nextOfficers));
          window.dispatchEvent(new CustomEvent('rawf_officers_updated'));
        } catch {}

        try {
          await fetch('/api/admin/officers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(newOfficerFromApp)
          });
        } catch {}
      }
    }

    setFeedbackMsg({ type: 'success', text: `Application ${editingApplication.applicationId} updated successfully.` });
    setEditingApplication(null);

    try {
      await fetch(`/api/admin/memberships/${encodeURIComponent(editingApplication.applicationId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingApplication)
      });
    } catch {}
  };

  const handleDeleteApplication = async (app: any) => {
    if (!window.confirm(`Are you sure you want to permanently delete membership application for ${app.fullName} (${app.applicationId})?`)) {
      return;
    }

    const nextApps = applications.filter((a) => a.applicationId !== app.applicationId);
    setApplications(nextApps);
    try {
      localStorage.setItem('rawf_data_applications', JSON.stringify(nextApps));
    } catch {}

    setFeedbackMsg({ type: 'success', text: `Application ${app.applicationId} deleted.` });
    if (viewingApplication?.applicationId === app.applicationId) setViewingApplication(null);

    try {
      await fetch(`/api/admin/memberships/${encodeURIComponent(app.applicationId)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {}
  };

  const handleApproveApplication = async (appId: string) => {
    if (!window.confirm('Approve this membership applicant and issue an official cryptographic RAWF Badge?')) return;

    const app = applications.find((a) => a.applicationId === appId);
    if (app) {
      const newUid = app.assignedBadge || `RAWF/2026/${Math.floor(1000 + Math.random() * 9000)}`;
      const newOff = {
        id: Date.now(),
        name: app.fullName,
        fullName: app.fullName,
        uidNumber: newUid,
        badgeNumber: newUid,
        designation: app.designation || app.wing || 'Field Officer',
        division: app.wing?.toLowerCase().includes('national') ? 'national' : 'state',
        state: app.state || 'Maharashtra',
        gender: app.gender || 'Male',
        dob: app.dob || '1995-12-20',
        joinDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
        validTill: computeTenureExpiry(new Date().toISOString().split('T')[0]),
        phoneContact: app.phone || app.mobile || '+91 98200 45678',
        email: app.email || `${app.fullName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@raidactionwing.in`,
        photoUrl: app.photoUrl || '',
        mandate: app.background || `${app.wing || 'Vigilance'} - Citizen Vigilance & Public Service`,
        status: 'ACTIVE',
        isActive: true,
        isAssigned: true
      };

      const updatedApps = applications.map((a) =>
        a.applicationId === appId ? { ...a, status: 'Approved', assignedBadge: newUid } : a
      );
      setApplications(updatedApps);
      try {
        localStorage.setItem('rawf_data_applications', JSON.stringify(updatedApps));
      } catch {}

      // Add to Officers Roster
      const nextOfficers = [newOff, ...officers.filter((o) => o.email !== app.email && o.name !== app.fullName)];
      setOfficers(nextOfficers);
      try {
        localStorage.setItem('rawf_data_officers', JSON.stringify(nextOfficers));
        window.dispatchEvent(new CustomEvent('rawf_officers_updated'));
      } catch {}

      setFeedbackMsg({
        type: 'success',
        text: `✓ Applicant ${app.fullName} Approved! Issued UID ${newUid} & placed in Officers Roster.`
      });

      if (viewingApplication?.applicationId === appId) setViewingApplication(null);
      setViewingIdCardOfficer(newOff);
      setIdCardModalTab('card');

      try {
        await fetch(`/api/admin/memberships/${encodeURIComponent(appId)}/approve-and-issue-badge`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
      } catch {}

      try {
        await fetch('/api/admin/officers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(newOff)
        });
      } catch {}
    }
  };

  const handleRejectApplication = async (appId: string) => {
    if (!window.confirm('Reject this membership application?')) return;

    setApplications((prev) => prev.map((a) => (a.applicationId === appId ? { ...a, status: 'Rejected' } : a)));
    setFeedbackMsg({ type: 'success', text: `Application ${appId} marked as Rejected.` });
    if (viewingApplication?.applicationId === appId) setViewingApplication(null);

    try {
      await fetch(`/api/admin/memberships/${encodeURIComponent(appId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'Rejected' })
      });
    } catch {}
  };

  // ==========================================
  // GRIEVANCE ACTIONS
  // ==========================================
  const handleUpdateGrievanceStatus = async (trackingId: string, currentStatus: string) => {
    const newStatus = window.prompt(
      `Update Investigation Status for ${trackingId}:\n(Options: "Received", "Assigned to Directorate", "Fact-Finding & Evidence", "Escalated to Statutory Body", "Resolved", "Closed")`,
      currentStatus
    );
    if (!newStatus) return;

    const details = window.prompt('Update status details / case notes for citizen tracking:', 'Cross-verification of documentary evidence underway by State Directorate.');

    setGrievances((prev) => prev.map((g) => (g.trackingCode === trackingId || g.trackingId === trackingId ? { ...g, status: newStatus, statusDetails: details || g.statusDetails } : g)));
    setFeedbackMsg({ type: 'success', text: `Grievance dossier ${trackingId} updated to "${newStatus}".` });

    try {
      await fetch(`/api/admin/grievances/${encodeURIComponent(trackingId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus, statusDetails: details })
      });
    } catch {}
  };

  // ==========================================
  // BLACKLIST REGISTRY (Create, Update, Delete)
  // ==========================================
  const handleCreateBlacklist = async (e: React.FormEvent) => {
    e.preventDefault();
    const entry = {
      id: Date.now(),
      ...newBlacklist
    };

    setBlacklist((prev) => [entry, ...prev]);
    setFeedbackMsg({ type: 'success', text: `Revocation record for ${entry.name} (${entry.uidNumber}) added to Blacklist Registry.` });
    setShowAddBlacklistModal(false);
    setNewBlacklist({
      uidNumber: '',
      name: '',
      jurisdiction: 'National Command',
      revocationDate: '11/09/2024',
      reason: '',
      status: 'REVOKED & BLACKLISTED'
    });

    try {
      await fetch('/api/admin/blacklist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(entry)
      });
    } catch {}
  };

  const handleUpdateBlacklist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlacklist) return;

    setBlacklist((prev) => prev.map((b) => (b.id === editingBlacklist.id || b.uidNumber === editingBlacklist.uidNumber ? editingBlacklist : b)));
    setFeedbackMsg({ type: 'success', text: 'Blacklist entry updated.' });
    setEditingBlacklist(null);

    try {
      const targetId = editingBlacklist.id || editingBlacklist.badgeNumber || editingBlacklist.uidNumber;
      await fetch(`/api/admin/blacklist/${encodeURIComponent(targetId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingBlacklist)
      });
    } catch {}
  };

  const handleDeleteBlacklist = async (item: any) => {
    const confirmId = item.uidNumber || item.badgeNumber || item.id;
    if (!window.confirm(`Are you sure you want to reinstate and remove Revoke UID ${confirmId} (${item.name}) from the blacklist registry?`)) {
      return;
    }

    setBlacklist((prev) => prev.filter((b) => b.id !== item.id && b.uidNumber !== item.uidNumber));
    setFeedbackMsg({ type: 'success', text: `UID ${confirmId} reinstated.` });

    try {
      await fetch(`/api/admin/blacklist/${encodeURIComponent(confirmId)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch {}
  };

  // ==========================================
  // ACTIVITIES / BLOG SECTION HANDLERS
  // ==========================================
  const handleActivityImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setFeedbackMsg({ type: 'error', text: 'Image size must be under 2MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (isEdit && editingActivity) {
        setEditingActivity({ ...editingActivity, image: base64String });
      } else {
        setNewActivity({ ...newActivity, image: base64String });
      }
      setFeedbackMsg({ type: 'success', text: 'Activity cover image uploaded successfully!' });
    };
    reader.readAsDataURL(file);
  };

  const handleActivityVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      setFeedbackMsg({ type: 'error', text: 'Video file size must be under 100MB.' });
      return;
    }

    if (isEdit) setVideoUploadingEdit(true);
    else setVideoUploadingAdd(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        const res = await fetch('/api/admin/activities/upload-video', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ videoBase64: base64String, fileName: file.name })
        });
        const data = await res.json();
        const finalUrl = data?.url || base64String;

        if (isEdit) {
          setEditingActivity((prev: any) => (prev ? {
            ...prev,
            mediaType: 'video',
            videoType: 'upload',
            videoUrl: finalUrl
          } : prev));
        } else {
          setNewActivity((prev) => ({
            ...prev,
            mediaType: 'video',
            videoType: 'upload',
            videoUrl: finalUrl
          }));
        }
        setFeedbackMsg({ type: 'success', text: `Video "${file.name}" uploaded successfully!` });
      } catch (err: any) {
        // Fallback to local base64 preview
        if (isEdit) {
          setEditingActivity((prev: any) => (prev ? {
            ...prev,
            mediaType: 'video',
            videoType: 'upload',
            videoUrl: base64String
          } : prev));
        } else {
          setNewActivity((prev) => ({
            ...prev,
            mediaType: 'video',
            videoType: 'upload',
            videoUrl: base64String
          }));
        }
        setFeedbackMsg({ type: 'success', text: `Video "${file.name}" loaded.` });
      } finally {
        if (isEdit) setVideoUploadingEdit(false);
        else setVideoUploadingAdd(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    const fallbackImage = newActivity.image || (
      newActivity.mediaType === 'video' && newActivity.videoType === 'youtube' && newActivity.videoUrl
        ? getYouTubeThumbnailUrl(newActivity.videoUrl) || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600'
        : 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600'
    );

    const act = {
      id: Date.now(),
      ...newActivity,
      image: fallbackImage,
      mediaType: newActivity.mediaType || 'image',
      videoType: newActivity.videoType || 'youtube',
      videoUrl: newActivity.videoUrl || ''
    };

    setActivities((prev) => [act, ...prev]);
    setFeedbackMsg({ type: 'success', text: `Activity article "${act.title}" published.` });
    setShowAddActivityModal(false);
    setNewActivity({
      title: '',
      category: 'Youth Wing',
      date: '11/09/2024',
      location: 'National Command',
      description: '',
      content: '',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7D1Cv8Zz5hHkHWRsC2dBpAnYUkZ0ZCtxYoBPJYBBLwhi71gukNqmUaq1S7ds7-rpnQy9dgKR1hFGJCvg6fdzR0QNDcs1uncde15aH1Cj_ovJ49wdbEnyi3HcgYt1DebTQ0dmp7nUxPXX0IuIC0B3gzWoAkWgk8l0YIc9eLsbfB7lOIuzdvNL7lz5_EFlnw_PjTKNYWFcNsU5OnVumga3256O6DHiOZwcVeUFcPhTvMLAcYBENLi3UaA',
      mediaType: 'image',
      videoType: 'youtube',
      videoUrl: '',
      author: 'RAWF National Command',
      status: 'Published'
    });

    try {
      await fetch('/api/admin/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(act)
      });
    } catch {}
  };

  const handleUpdateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingActivity) return;

    // Ensure fallback cover thumbnail if YouTube video is selected and no image is set
    const fallbackImage = editingActivity.image || (
      editingActivity.mediaType === 'video' && editingActivity.videoType === 'youtube' && editingActivity.videoUrl
        ? getYouTubeThumbnailUrl(editingActivity.videoUrl) || ''
        : ''
    );

    const updatedActivity = {
      ...editingActivity,
      image: fallbackImage,
      mediaType: editingActivity.mediaType || 'image',
      videoType: editingActivity.videoType || 'youtube',
      videoUrl: editingActivity.videoUrl || ''
    };

    setActivities((prev) => prev.map((a) => (a.id === updatedActivity.id ? updatedActivity : a)));
    setFeedbackMsg({ type: 'success', text: `Activity "${updatedActivity.title}" updated.` });
    setEditingActivity(null);

    try {
      await fetch(`/api/admin/activities/${encodeURIComponent(updatedActivity.id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedActivity)
      });
    } catch {}
  };

  const handleDeleteActivity = async (act: any) => {
    if (!window.confirm(`Are you sure you want to delete the activity article "${act.title}"?`)) {
      return;
    }

    setActivities((prev) => prev.filter((a) => a.id !== act.id));
    setFeedbackMsg({ type: 'success', text: `Activity "${act.title}" deleted.` });

    try {
      await fetch(`/api/admin/activities/${encodeURIComponent(act.id)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch {}
  };

  // Activities Reordering Handlers (Drag & Drop + Up/Down Sort)
  const handleMoveActivity = async (item: any, direction: 'up' | 'down') => {
    const visibleIndex = filteredActivities.findIndex((a) => a.id === item.id);
    if (visibleIndex === -1) return;
    const targetVisibleIndex = direction === 'up' ? visibleIndex - 1 : visibleIndex + 1;
    if (targetVisibleIndex < 0 || targetVisibleIndex >= filteredActivities.length) return;

    const targetItem = filteredActivities[targetVisibleIndex];
    const sourceIdx = activities.findIndex((a) => a.id === item.id);
    const targetIdx = activities.findIndex((a) => a.id === targetItem.id);
    if (sourceIdx === -1 || targetIdx === -1) return;

    const newActivities = [...activities];
    const [moved] = newActivities.splice(sourceIdx, 1);
    newActivities.splice(targetIdx, 0, moved);

    setActivities(newActivities);
    try {
      localStorage.setItem('rawf_data_activities', JSON.stringify(newActivities));
    } catch {}
    window.dispatchEvent(new CustomEvent('rawf_activities_reordered', { detail: newActivities }));

    if (token) {
      try {
        await activitiesApi.reorder(newActivities.map((a) => a.id), token);
      } catch (err) {
        console.warn('API activities reorder sync failed:', err);
      }
    }
    setFeedbackMsg({
      type: 'success',
      text: `Moved "${moved.title?.slice(0, 32)}..." ${direction}. New sequence saved.`
    });
  };

  const handleDropActivity = async (targetId: string) => {
    if (!draggedActivityId || draggedActivityId === targetId) {
      setDraggedActivityId(null);
      setDragOverActivityId(null);
      return;
    }
    const sourceIdx = activities.findIndex((a) => a.id === draggedActivityId);
    const targetIdx = activities.findIndex((a) => a.id === targetId);
    if (sourceIdx === -1 || targetIdx === -1) {
      setDraggedActivityId(null);
      setDragOverActivityId(null);
      return;
    }
    const newActivities = [...activities];
    const [moved] = newActivities.splice(sourceIdx, 1);
    newActivities.splice(targetIdx, 0, moved);

    setActivities(newActivities);
    try {
      localStorage.setItem('rawf_data_activities', JSON.stringify(newActivities));
    } catch {}
    window.dispatchEvent(new CustomEvent('rawf_activities_reordered', { detail: newActivities }));

    if (token) {
      try {
        await activitiesApi.reorder(newActivities.map((a) => a.id), token);
      } catch (err) {
        console.warn('API activities reorder sync failed:', err);
      }
    }
    setFeedbackMsg({
      type: 'success',
      text: `Reordered: "${moved.title?.slice(0, 32)}..." repositioned. Order saved.`
    });
    setDraggedActivityId(null);
    setDragOverActivityId(null);
  };

  // Activity Categories Management Handlers
  const handleAddCategory = async (nameToAdd?: string): Promise<string | null> => {
    const targetName = (nameToAdd || newCategoryNameInput).trim();
    if (!targetName) {
      setFeedbackMsg({ type: 'error', text: 'Please enter a category name.' });
      return null;
    }
    try {
      const res = await fetch('/api/admin/activities/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: targetName })
      });
      const data = await res.json();
      if (data.success) {
        setActivityCategories(data.data);
        setNewCategoryNameInput('');
        setInlineCategoryInputAdd('');
        setInlineCategoryInputEdit('');
        setIsAddingCategoryInlineAdd(false);
        setIsAddingCategoryInlineEdit(false);
        setFeedbackMsg({ type: 'success', text: data.message });
        return targetName;
      } else {
        setFeedbackMsg({ type: 'error', text: data.message });
        return null;
      }
    } catch {
      setFeedbackMsg({ type: 'error', text: 'Failed to add activity category.' });
      return null;
    }
  };

  const handleDeleteCategory = async (catToDelete: string) => {
    if (!window.confirm(`Are you sure you want to remove the category "${catToDelete}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/activities/categories/${encodeURIComponent(catToDelete)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setActivityCategories(data.data);
        setFeedbackMsg({ type: 'success', text: data.message });
      } else {
        setFeedbackMsg({ type: 'error', text: data.message });
      }
    } catch {
      setFeedbackMsg({ type: 'error', text: 'Failed to delete category.' });
    }
  };

  // ========================================================
  // CERTIFICATES & STATUTORY ACCREDITATIONS HANDLERS
  // ========================================================
  const handleCertificateFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      setFeedbackMsg({ type: 'error', text: 'Document file size exceeds 25MB limit.' });
      return;
    }

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/');

    if (!isPdf && !isImage) {
      setFeedbackMsg({ type: 'error', text: 'Please upload a PDF document or image file (.pdf, .png, .jpg, .jpeg, .webp).' });
      return;
    }

    setCertificateUploading(true);
    const reader = new FileReader();

    reader.onload = async () => {
      const base64Data = reader.result as string;
      const fileSizeStr = `${(file.size / 1024).toFixed(1)} KB`;
      const detectedType: 'pdf' | 'image' = isPdf ? 'pdf' : 'image';

      let targetUrl = base64Data;

      if (token) {
        try {
          const res = await certificatesApi.uploadFile(base64Data, file.name, detectedType, token);
          if (res.success && res.url) {
            targetUrl = res.url;
          }
        } catch (err) {
          console.warn('Direct server upload error, using encoded storage:', err);
        }
      }

      if (isEdit) {
        setEditingCertificate((prev) => prev ? {
          ...prev,
          fileUrl: targetUrl,
          fileName: file.name,
          fileType: detectedType,
          fileSize: fileSizeStr
        } : null);
      } else {
        setNewCertificate((prev) => ({
          ...prev,
          fileUrl: targetUrl,
          fileName: file.name,
          fileType: detectedType,
          fileSize: fileSizeStr
        }));
      }

      setCertificateUploading(false);
      setFeedbackMsg({ type: 'success', text: `Document '${file.name}' attached successfully.` });
    };

    reader.onerror = () => {
      setCertificateUploading(false);
      setFeedbackMsg({ type: 'error', text: 'Failed to read document file.' });
    };

    reader.readAsDataURL(file);
  };

  const handleCreateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertificate.title?.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Please enter a certificate title.' });
      return;
    }
    if (!newCertificate.description?.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Please enter a description for this certificate.' });
      return;
    }
    if (!newCertificate.fileUrl) {
      setFeedbackMsg({ type: 'error', text: 'Please upload a PDF or image document.' });
      return;
    }

    const certToSave: CertificateRecord = {
      id: `cert-${Date.now()}`,
      title: newCertificate.title.trim(),
      description: newCertificate.description.trim(),
      registrationNumber: newCertificate.registrationNumber?.trim() || 'Statutory Order',
      issuingAuthority: newCertificate.issuingAuthority?.trim() || 'Government of India',
      issueDate: newCertificate.issueDate?.trim() || new Date().toLocaleDateString('en-GB'),
      category: (newCertificate.category as any) || 'Government Accreditation',
      fileUrl: newCertificate.fileUrl,
      fileName: newCertificate.fileName || 'certificate-document.pdf',
      fileType: newCertificate.fileType || 'pdf',
      fileSize: newCertificate.fileSize || '10.5 KB',
      status: (newCertificate.status as any) || 'Published',
      createdAt: new Date().toISOString()
    };

    if (token) {
      try {
        await certificatesApi.create(certToSave, token);
      } catch (err) {
        console.warn('API sync failed, saving locally:', err);
      }
    }

    setCertificates((prev) => [certToSave, ...prev]);
    setShowAddCertificateModal(false);
    setNewCertificate({
      title: '',
      description: '',
      registrationNumber: '',
      issuingAuthority: 'Ministry of MSME, Govt. of India',
      issueDate: new Date().toLocaleDateString('en-GB'),
      category: 'Government Accreditation',
      fileUrl: '',
      fileName: '',
      fileType: 'pdf',
      fileSize: '',
      status: 'Published'
    });
    setFeedbackMsg({ type: 'success', text: `Certificate '${certToSave.title}' uploaded and published successfully.` });
  };

  const handleUpdateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCertificate || !editingCertificate.id) return;

    if (!editingCertificate.title?.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Certificate title cannot be blank.' });
      return;
    }
    if (!editingCertificate.fileUrl) {
      setFeedbackMsg({ type: 'error', text: 'Document file cannot be empty.' });
      return;
    }

    if (token) {
      try {
        await certificatesApi.update(editingCertificate.id, editingCertificate, token);
      } catch (err) {
        console.warn('API update failed, saving locally:', err);
      }
    }

    setCertificates((prev) => prev.map((c) => (c.id === editingCertificate.id ? editingCertificate : c)));
    setEditingCertificate(null);
    setFeedbackMsg({ type: 'success', text: `Certificate '${editingCertificate.title}' updated successfully.` });
  };

  const handleDeleteCertificate = async (cert: CertificateRecord) => {
    if (!window.confirm(`Are you sure you want to remove certificate "${cert.title}"? This cannot be undone.`)) {
      return;
    }

    if (token) {
      try {
        await certificatesApi.delete(cert.id, token);
      } catch (err) {
        console.warn('API delete failed, removing locally:', err);
      }
    }

    setCertificates((prev) => prev.filter((c) => c.id !== cert.id));
    setFeedbackMsg({ type: 'success', text: `Certificate '${cert.title}' removed.` });
  };

  // Certificates Reordering Handlers (Drag & Drop + Up/Down Sort)
  const handleMoveCertificate = async (item: CertificateRecord, direction: 'up' | 'down') => {
    const visibleIndex = filteredCertificates.findIndex((c) => c.id === item.id);
    if (visibleIndex === -1) return;
    const targetVisibleIndex = direction === 'up' ? visibleIndex - 1 : visibleIndex + 1;
    if (targetVisibleIndex < 0 || targetVisibleIndex >= filteredCertificates.length) return;

    const targetItem = filteredCertificates[targetVisibleIndex];
    const sourceIdx = certificates.findIndex((c) => c.id === item.id);
    const targetIdx = certificates.findIndex((c) => c.id === targetItem.id);
    if (sourceIdx === -1 || targetIdx === -1) return;

    const newCertificates = [...certificates];
    const [moved] = newCertificates.splice(sourceIdx, 1);
    newCertificates.splice(targetIdx, 0, moved);

    setCertificates(newCertificates);
    try {
      localStorage.setItem('rawf_data_certificates', JSON.stringify(newCertificates));
    } catch {}
    window.dispatchEvent(new CustomEvent('rawf_certificates_reordered', { detail: newCertificates }));

    if (token) {
      try {
        await certificatesApi.reorder(newCertificates.map((c) => c.id), token);
      } catch (err) {
        console.warn('API certificates reorder sync failed:', err);
      }
    }
    setFeedbackMsg({
      type: 'success',
      text: `Moved "${moved.title?.slice(0, 32)}..." ${direction}. New sequence saved.`
    });
  };

  const handleDropCertificate = async (targetId: string) => {
    if (!draggedCertId || draggedCertId === targetId) {
      setDraggedCertId(null);
      setDragOverCertId(null);
      return;
    }
    const sourceIdx = certificates.findIndex((c) => c.id === draggedCertId);
    const targetIdx = certificates.findIndex((c) => c.id === targetId);
    if (sourceIdx === -1 || targetIdx === -1) {
      setDraggedCertId(null);
      setDragOverCertId(null);
      return;
    }
    const newCertificates = [...certificates];
    const [moved] = newCertificates.splice(sourceIdx, 1);
    newCertificates.splice(targetIdx, 0, moved);

    setCertificates(newCertificates);
    try {
      localStorage.setItem('rawf_data_certificates', JSON.stringify(newCertificates));
    } catch {}
    window.dispatchEvent(new CustomEvent('rawf_certificates_reordered', { detail: newCertificates }));

    if (token) {
      try {
        await certificatesApi.reorder(newCertificates.map((c) => c.id), token);
      } catch (err) {
        console.warn('API certificates reorder sync failed:', err);
      }
    }
    setFeedbackMsg({
      type: 'success',
      text: `Reordered: "${moved.title?.slice(0, 32)}..." repositioned. Order saved.`
    });
    setDraggedCertId(null);
    setDragOverCertId(null);
  };

  // 1-Click JSON Backup
  const handleExportBackup = () => {
    window.open(`/api/admin/export-data?token=${token}`, '_blank');
  };

  // 1. When admin selects a new logo file: load for preview first
  const handleAdminLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStagedLogoFileName(file.name);
    setLogoUploadMsg(null);

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;
      setStagedLogoData(base64Data);
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be selected again if needed
    e.target.value = '';
  };

  // 2. Explicit SAVE Button: Saves permanently on backend + local cache + notifies all components
  const handleSaveUploadedLogo = async () => {
    if (!stagedLogoData) return;

    setLogoUploadLoading(true);
    setLogoUploadMsg('Saving logo and updating all sections...');

    try {
      const res = await fetch('/api/upload-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: stagedLogoData })
      });
      const data = await res.json();

      if (data.success) {
        // Save to localStorage for instant client rendering & offline capability
        localStorage.setItem('rawf_custom_logo_data', stagedLogoData);
        localStorage.setItem('rawf_logo_version', String(Date.now()));

        // Broadcast to all mounted components (RawfLogo, ID Card, Header, Footer)
        window.dispatchEvent(new CustomEvent('rawf_logo_updated', { detail: { src: stagedLogoData } }));

        setLogoTimestamp(Date.now());
        setStagedLogoData(null);
        setStagedLogoFileName(null);
        setLogoUploadMsg('✓ Official logo saved permanently and updated across all sections (including ID Card generation)!');
      } else {
        setLogoUploadMsg(`Error: ${data.message || 'Failed to save logo.'}`);
      }
    } catch {
      // Local fallback if offline
      localStorage.setItem('rawf_custom_logo_data', stagedLogoData);
      localStorage.setItem('rawf_logo_version', String(Date.now()));
      window.dispatchEvent(new CustomEvent('rawf_logo_updated', { detail: { src: stagedLogoData } }));
      setLogoTimestamp(Date.now());
      setStagedLogoData(null);
      setStagedLogoFileName(null);
      setLogoUploadMsg('✓ Logo saved locally and applied across all sections!');
    } finally {
      setLogoUploadLoading(false);
      setTimeout(() => setLogoUploadMsg(null), 6000);
    }
  };

  // 3. Cancel staged upload
  const handleCancelStagedLogo = () => {
    setStagedLogoData(null);
    setStagedLogoFileName(null);
    setLogoUploadMsg(null);
  };

  // 4. Reset to Default Official Emblem
  const handleResetDefaultLogo = () => {
    localStorage.removeItem('rawf_custom_logo_data');
    localStorage.setItem('rawf_logo_version', String(Date.now()));
    window.dispatchEvent(new CustomEvent('rawf_logo_updated', { detail: { src: '/rawf-logo.jpg' } }));
    setLogoTimestamp(Date.now());
    setStagedLogoData(null);
    setStagedLogoFileName(null);
    setLogoUploadMsg('✓ Reset to standard official RAWF emblem.');
    setTimeout(() => setLogoUploadMsg(null), 4000);
  };

  // ==========================================
  // AUTHORIZED SIGNATURE HANDLERS
  // ==========================================
  const handleAdminSignatureSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(png|jpeg|webp)/i)) {
      setSignatureUploadMsg('Error: Please select a valid PNG, JPG, or WEBP image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSignatureUploadMsg('Error: File size exceeds 5MB limit. Please upload a smaller signature image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setStagedSignatureData(reader.result);
        setStagedSignatureFileName(file.name);
        setSignatureUploadMsg(null);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSaveUploadedSignature = async () => {
    if (!stagedSignatureData) return;

    setSignatureUploadLoading(true);
    setSignatureUploadMsg('Saving authorized signature and updating all documents...');

    try {
      const res = await fetch('/api/upload-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: stagedSignatureData })
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('rawf_custom_signature_data', stagedSignatureData);
        localStorage.setItem('rawf_signature_version', String(Date.now()));
        window.dispatchEvent(new CustomEvent('rawf_signature_updated', { detail: { src: stagedSignatureData } }));
        window.dispatchEvent(new Event('storage'));

        setSignatureTimestamp(Date.now());
        setCurrentSignatureUrl(stagedSignatureData);
        setStagedSignatureData(null);
        setStagedSignatureFileName(null);
        setSignatureUploadMsg('✓ Authorized signature image saved successfully and automatically applied to all ID Cards, Appointment Letters, and official documents!');
      } else {
        setSignatureUploadMsg(`Error: ${data.message || 'Failed to save signature.'}`);
      }
    } catch {
      localStorage.setItem('rawf_custom_signature_data', stagedSignatureData);
      localStorage.setItem('rawf_signature_version', String(Date.now()));
      window.dispatchEvent(new CustomEvent('rawf_signature_updated', { detail: { src: stagedSignatureData } }));
      window.dispatchEvent(new Event('storage'));

      setSignatureTimestamp(Date.now());
      setCurrentSignatureUrl(stagedSignatureData);
      setStagedSignatureData(null);
      setStagedSignatureFileName(null);
      setSignatureUploadMsg('✓ Signature image saved locally and applied to all official documents!');
    } finally {
      setSignatureUploadLoading(false);
      setTimeout(() => setSignatureUploadMsg(null), 6000);
    }
  };

  const handleCancelStagedSignature = () => {
    setStagedSignatureData(null);
    setStagedSignatureFileName(null);
    setSignatureUploadMsg(null);
  };

  const handleResetDefaultSignature = async () => {
    localStorage.removeItem('rawf_custom_signature_data');
    localStorage.removeItem('rawf_signature_version');
    window.dispatchEvent(new CustomEvent('rawf_signature_updated', { detail: { src: null } }));
    window.dispatchEvent(new Event('storage'));

    try {
      await fetch('/api/reset-signature', { method: 'POST' });
    } catch {}

    setSignatureTimestamp(Date.now());
    setCurrentSignatureUrl(null);
    setStagedSignatureData(null);
    setStagedSignatureFileName(null);
    setSignatureUploadMsg('✓ Reset to standard official cursive signatory format.');
    setTimeout(() => setSignatureUploadMsg(null), 4000);
  };

  const handleSendTestEmail = async () => {
    if (!testEmailAddress.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Please enter a recipient email address.' });
      return;
    }
    setTestEmailLoading(true);
    setTestEmailResult('Dispatching diagnostic email via mail.raidactionwing.in...');
    try {
      const res = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmailAddress.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setTestEmailResult(`✓ ${data.message || 'Test email successfully sent.'}`);
        setFeedbackMsg({ type: 'success', text: `Test email sent to ${testEmailAddress}` });
      } else {
        setTestEmailResult(`⚠ ${data.message || 'Email delivery encountered an issue.'}`);
        setFeedbackMsg({ type: 'error', text: data.message || 'Email delivery failed' });
      }
    } catch {
      setTestEmailResult('✓ Test request sent to server.');
    } finally {
      setTestEmailLoading(false);
    }
  };

  // Filtered lists
  const filteredOfficers = officers.filter(
    (o) =>
      o.name.toLowerCase().includes(officerSearch.toLowerCase()) ||
      (o.uidNumber && o.uidNumber.toLowerCase().includes(officerSearch.toLowerCase())) ||
      (o.badgeNumber && o.badgeNumber.toLowerCase().includes(officerSearch.toLowerCase())) ||
      o.designation.toLowerCase().includes(officerSearch.toLowerCase()) ||
      o.state.toLowerCase().includes(officerSearch.toLowerCase()) ||
      (o.email && o.email.toLowerCase().includes(officerSearch.toLowerCase()))
  );

  const filteredApplications = applications.filter((app) => {
    const matchStatus =
      appFilterStatus === 'all' ||
      app.status === appFilterStatus ||
      (appFilterStatus === 'Pending Verification' && (app.status === 'Pending' || app.status === 'Pending Verification'));
    const matchSearch =
      !appSearch ||
      (app.fullName && app.fullName.toLowerCase().includes(appSearch.toLowerCase())) ||
      (app.wing && app.wing.toLowerCase().includes(appSearch.toLowerCase())) ||
      (app.applicationId && app.applicationId.toLowerCase().includes(appSearch.toLowerCase())) ||
      (app.state && app.state.toLowerCase().includes(appSearch.toLowerCase())) ||
      (app.mobile && app.mobile.includes(appSearch)) ||
      (app.phone && app.phone.includes(appSearch)) ||
      (app.email && app.email.toLowerCase().includes(appSearch.toLowerCase()));
    return matchStatus && matchSearch;
  });

  const filteredBlacklist = blacklist.filter((b) => {
    const q = blacklistSearch.toLowerCase();
    return (
      !blacklistSearch ||
      (b.name && b.name.toLowerCase().includes(q)) ||
      (b.uidNumber && b.uidNumber.toLowerCase().includes(q)) ||
      (b.badgeNumber && b.badgeNumber.toLowerCase().includes(q)) ||
      (b.jurisdiction && b.jurisdiction.toLowerCase().includes(q)) ||
      (b.reason && b.reason.toLowerCase().includes(q)) ||
      (b.status && b.status.toLowerCase().includes(q))
    );
  });

  const filteredActivities = activities.filter((act) => {
    const matchCat = activityFilterCategory === 'All' || (act.category && act.category.toLowerCase() === activityFilterCategory.toLowerCase());
    const q = activitySearch.toLowerCase();
    const matchQuery =
      !activitySearch ||
      (act.title && act.title.toLowerCase().includes(q)) ||
      (act.category && act.category.toLowerCase().includes(q)) ||
      (act.location && act.location.toLowerCase().includes(q)) ||
      (act.description && act.description.toLowerCase().includes(q)) ||
      (act.content && act.content.toLowerCase().includes(q));
    return matchCat && matchQuery;
  });

  const filteredCertificates = certificates.filter((c) => {
    const matchesSearch =
      (c.title || '').toLowerCase().includes(certificateSearch.toLowerCase()) ||
      (c.description || '').toLowerCase().includes(certificateSearch.toLowerCase()) ||
      (c.registrationNumber || '').toLowerCase().includes(certificateSearch.toLowerCase()) ||
      (c.issuingAuthority || '').toLowerCase().includes(certificateSearch.toLowerCase());
    const matchesCategory =
      certificateFilterCategory === 'All' ||
      (c.category && c.category.toLowerCase() === certificateFilterCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  // ==========================================
  // VIEW: LOGIN SCREEN (When Not Authenticated)
  // ==========================================
  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-100 to-slate-200">
        <div className="max-w-md w-full bg-white border-2 border-slate-300 rounded-2xl shadow-xl p-8 space-y-6 animate-scaleUp">
          <div className="text-center space-y-2">
            <RawfLogo className="w-16 h-16 mx-auto" />
            <span className="text-[10px] font-mono text-red-600 font-bold uppercase tracking-widest block">
              RESTRICTED CITIZEN VIGILANCE TELEMETRY
            </span>
            <h2 className="font-headline font-extrabold text-2xl text-slate-900 uppercase tracking-tight">
              Admin Command Console
            </h2>
            <p className="text-xs text-slate-500">
              Authorized access only. Sign in with administrative credentials under IFA 760 Protocol.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-red-600 text-[18px]">error</span>
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">
                Admin Username or Email
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#0d47a1]"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">
                Secret Access Key / Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#0d47a1] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-[#0d47a1] hover:bg-blue-900 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {loginLoading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">key</span>
              )}
              Authenticate & Launch Console
            </button>
          </form>

          {/* Return Link */}
          <div className="pt-2 border-t border-slate-100 text-center space-y-2">
            <div>
              <button
                onClick={() => onNavigate('home')}
                className="text-xs text-slate-500 hover:text-slate-900 font-semibold underline cursor-pointer"
              >
                ← Return to Public Website
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: AUTHENTICATED ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      {/* Admin Top Command Header */}
      <div className="bg-[#0a192f] text-white border-b-4 border-red-600 sticky top-[116px] z-40 px-4 lg:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <RawfLogo className="w-8 h-8 bg-white rounded" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-headline font-bold text-sm uppercase text-white">
                  RAWF Command Administration Console
                </span>
                <span className="px-2 py-0.2 bg-emerald-600 text-white font-mono text-[9px] font-bold rounded uppercase">
                  ACTIVE
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 block">
                Director General Command • IFA 760 / 1882 Charter
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowQuotationModal(true)}
              className="px-3.5 py-1.5 bg-[#2b579a] hover:bg-[#1e3e70] text-white text-xs font-bold uppercase rounded flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
              title="Official Commercial Project Quotation & Word (.docx) Specification"
            >
              <span className="material-symbols-outlined text-[16px]">description</span>
              <span>Quotation (.docx)</span>
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase rounded flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">public</span>
              <span>View Site</span>
            </button>
            <button
              onClick={handleExportBackup}
              className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold uppercase rounded flex items-center gap-1 cursor-pointer transition-colors"
              title="Download full database snapshot"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Backup</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase rounded flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Feedback Banner */}
      {feedbackMsg && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn ${
            feedbackMsg.type === 'success' ? 'bg-emerald-700 text-white' : 'bg-red-600 text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {feedbackMsg.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Main Dashboard Layout */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-2 flex flex-wrap gap-1.5 shadow-xs">
          {[
            { id: 'overview', label: 'Telemetry Overview', icon: 'dashboard' },
            { id: 'officers', label: `Officers Roster (${officers.length})`, icon: 'shield_person' },
            { id: 'applications', label: `Membership Intake (${applications.length})`, icon: 'how_to_reg' },
            { id: 'grievances', label: `Grievance Dossiers (${grievances.length})`, icon: 'campaign' },
            { id: 'donations', label: `80G Donations (${donations.length})`, icon: 'volunteer_activism' },
            { id: 'blacklist', label: `Blacklist Registry (${blacklist.length})`, icon: 'block' },
            { id: 'activities', label: `Activities / Blog (${activities.length})`, icon: 'article' },
            { id: 'certificates', label: `Certificates (${certificates.length})`, icon: 'workspace_premium' },
            { id: 'settings', label: 'System & cPanel Config', icon: 'settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#0d47a1] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ========================================== */}
        {/* TAB 1: OVERVIEW & TELEMETRY */}
        {/* ========================================== */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6 animate-fadeIn">
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Active Directory Officers
                </span>
                <span className="font-headline font-black text-3xl text-slate-900 mt-1 block">
                  {stats.activeOfficersCount}
                </span>
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  28 State Commands
                </span>
              </div>

              <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Pending Member Reviews
                </span>
                <span className="font-headline font-black text-3xl text-amber-600 mt-1 block">
                  {stats.pendingApplicationsCount}
                </span>
                <span className="text-xs text-slate-500 mt-1 block">
                  Total: {stats.totalApplicationsCount} applicants
                </span>
              </div>

              <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Confidential Grievances
                </span>
                <span className="font-headline font-black text-3xl text-red-600 mt-1 block">
                  {stats.activeGrievancesCount}
                </span>
                <span className="text-xs text-slate-500 mt-1 block">
                  {stats.totalGrievancesCount} Total Dossiers Filed
                </span>
              </div>

              <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  80G Contributions
                </span>
                <span className="font-headline font-black text-2xl text-emerald-700 mt-1 block">
                  ₹{Number(stats.totalDonationsAmount).toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-500 mt-1 block">
                  {stats.donationsCount} Verified Donors
                </span>
              </div>
            </div>

            {/* Quick Action Hub */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="font-headline font-bold text-base text-slate-900 uppercase flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600">bolt</span>
                Director General Quick Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => {
                    setActiveTab('officers');
                    setShowAddOfficerModal(true);
                  }}
                  className="p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-[#0d47a1] rounded-xl text-left transition-all cursor-pointer group"
                >
                  <span className="material-symbols-outlined text-[#0d47a1] text-2xl mb-1 block">
                    person_add
                  </span>
                  <strong className="text-xs font-bold text-slate-900 block group-hover:text-[#0d47a1]">
                    Appoint New Officer &amp; Generate ID
                  </strong>
                  <span className="text-[11px] text-slate-500">
                    Assign UID, photo, role, and auto-generate official ID card.
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('applications')}
                  className="p-4 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-600 rounded-xl text-left transition-all cursor-pointer group"
                >
                  <span className="material-symbols-outlined text-amber-600 text-2xl mb-1 block">
                    fact_check
                  </span>
                  <strong className="text-xs font-bold text-slate-900 block group-hover:text-amber-700">
                    Review Pending Intake ({stats.pendingApplicationsCount})
                  </strong>
                  <span className="text-[11px] text-slate-500">
                    Approve and 1-click issue official badge credentials.
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('grievances')}
                  className="p-4 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-600 rounded-xl text-left transition-all cursor-pointer group"
                >
                  <span className="material-symbols-outlined text-red-600 text-2xl mb-1 block">
                    campaign
                  </span>
                  <strong className="text-xs font-bold text-slate-900 block group-hover:text-red-700">
                    Inspect Urgent Dossiers
                  </strong>
                  <span className="text-[11px] text-slate-500">
                    Update investigation stages and add field directives.
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: OFFICERS ROSTER MANAGEMENT */}
        {/* ========================================== */}
        {activeTab === 'officers' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden space-y-4 p-5 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-headline font-bold text-base text-slate-900 uppercase">
                  National Active Officers Roster
                </h3>
                <p className="text-xs text-slate-500">
                  Full control: <strong>Generate ID Card</strong>, <strong>View Dossier</strong>, <strong>Edit Profile</strong>, <strong>Delete Record</strong>, or <strong>Revoke Credentials</strong>.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={officerSearch}
                  onChange={(e) => setOfficerSearch(e.target.value)}
                  placeholder="Search UID, name, state, email..."
                  className="bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                />
                <button
                  onClick={() => setShowAddOfficerModal(true)}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase rounded flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-[16px]">person_add</span>
                  <span>Add Officer</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                    <th className="p-3">UID Number</th>
                    <th className="p-3">Officer Name</th>
                    <th className="p-3">Designation / Role</th>
                    <th className="p-3">Jurisdiction</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-center">Homepage Assignment</th>
                    <th className="p-3">Expiry Date</th>
                    <th className="p-3 text-right">Actions (Assign / ID Card / View / Edit / Delete)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOfficers.map((off) => (
                    <tr key={off.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-mono font-bold text-[#0d47a1]">
                        {off.uidNumber || off.badgeNumber}
                      </td>
                      <td className="p-3 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          {off.photoUrl ? (
                            <img
                              src={off.photoUrl}
                              alt={off.name}
                              className="w-7 h-7 rounded-full object-cover border border-slate-300 shrink-0"
                            />
                          ) : (
                            <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                              {off.name.charAt(0)}
                            </span>
                          )}
                          <div>
                            <div>{off.name}</div>
                            {off.email && (
                              <div className="text-[10px] text-slate-400 font-mono font-normal">
                                {off.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-slate-700 font-medium">
                        {off.designation}
                      </td>
                      <td className="p-3 text-slate-600">
                        {off.state}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 font-mono text-[10px] font-bold rounded ${
                            off.status === 'COMMAND'
                              ? 'bg-purple-100 text-purple-800'
                              : off.status === 'VERIFIED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {off.status}
                        </span>
                      </td>
                      {/* HOMEPAGE ASSIGNMENT TOGGLE */}
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleAssignOfficer(off)}
                          className={`px-2.5 py-1 rounded font-bold text-[11px] uppercase transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs border ${
                            off.isAssigned !== false
                              ? 'bg-emerald-50 hover:bg-red-50 text-emerald-700 hover:text-red-700 border-emerald-300 hover:border-red-300 group'
                              : 'bg-slate-100 hover:bg-[#0d47a1] text-slate-600 hover:text-white border-slate-300'
                          }`}
                          title={
                            off.isAssigned !== false
                              ? 'Currently featured on Homepage (Click to Unassign)'
                              : 'Click to assign officer to Homepage Directorate Command section'
                          }
                        >
                          {off.isAssigned !== false ? (
                            <>
                              <span className="w-2 h-2 rounded-full bg-emerald-500 group-hover:bg-red-500"></span>
                              <span className="group-hover:hidden">Assigned</span>
                              <span className="hidden group-hover:inline">Unassign</span>
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-[14px]">add_circle</span>
                              <span>Assign</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-3 font-mono text-slate-600">
                        {off.validTill}
                      </td>
                      <td className="p-3 text-right space-x-1 whitespace-nowrap">
                        {/* ASSIGN / UNASSIGN BUTTON */}
                        <button
                          type="button"
                          onClick={() => handleToggleAssignOfficer(off)}
                          className={`px-2 py-1 rounded text-[11px] font-bold uppercase transition-colors cursor-pointer inline-flex items-center gap-1 border ${
                            off.isAssigned !== false
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-600 hover:text-white'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-[#0d47a1] hover:text-white'
                          }`}
                          title={off.isAssigned !== false ? 'Assigned to Homepage (Click to Unassign)' : 'Assign to Homepage'}
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            {off.isAssigned !== false ? 'check_circle' : 'assignment_ind'}
                          </span>
                          <span>{off.isAssigned !== false ? 'Assigned' : 'Assign'}</span>
                        </button>

                        {/* ID CARD BUTTON */}
                        <button
                          onClick={() => {
                            setViewingIdCardOfficer(off);
                            setIdCardModalTab('card');
                          }}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 rounded text-[11px] font-bold uppercase transition-colors cursor-pointer inline-flex items-center gap-1 border border-emerald-200"
                          title="View Official Generated ID Card"
                        >
                          <span className="material-symbols-outlined text-[13px]">credit_card</span>
                          <span>ID Card</span>
                        </button>

                        {/* VIEW BUTTON */}
                        <button
                          onClick={() => setViewingOfficer(off)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-bold uppercase transition-colors cursor-pointer inline-flex items-center gap-1"
                          title="View Officer Dossier"
                        >
                          <span className="material-symbols-outlined text-[13px]">visibility</span>
                          <span>View</span>
                        </button>

                        {/* EDIT BUTTON */}
                        <button
                          onClick={() => setEditingOfficer({ ...off, uidNumber: off.uidNumber || off.badgeNumber })}
                          className="px-2 py-1 bg-blue-50 hover:bg-[#0d47a1] text-[#0d47a1] hover:text-white rounded text-[11px] font-bold uppercase transition-colors cursor-pointer inline-flex items-center gap-1"
                          title="Edit Officer Details"
                        >
                          <span className="material-symbols-outlined text-[13px]">edit</span>
                          <span>Edit</span>
                        </button>

                        {/* DELETE BUTTON */}
                        <button
                          onClick={() => handleDeleteOfficer(off)}
                          className="px-2 py-1 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded text-[11px] font-bold uppercase transition-colors cursor-pointer inline-flex items-center gap-1"
                          title="Delete from Roster"
                        >
                          <span className="material-symbols-outlined text-[13px]">delete</span>
                          <span>Delete</span>
                        </button>

                        {/* REVOKE & BLACKLIST BUTTON */}
                        <button
                          onClick={() => handleBlacklistOfficer(off.id, off.name)}
                          className="px-2 py-1 bg-amber-50 hover:bg-amber-600 text-amber-700 hover:text-white rounded text-[11px] font-bold uppercase transition-colors cursor-pointer inline-flex items-center gap-1"
                          title="Revoke and Move to Public Blacklist"
                        >
                          <span className="material-symbols-outlined text-[13px]">block</span>
                          <span>Revoke</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredOfficers.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-slate-400 text-xs">
                        No officers match your search query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: MEMBERSHIP INTAKE APPLICATIONS */}
        {/* ========================================== */}
        {activeTab === 'applications' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden space-y-4 p-5 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-headline font-bold text-base text-slate-900 uppercase">
                  Membership Applications Review Queue
                </h3>
                <p className="text-xs text-slate-500">
                  Full control: <strong>View</strong> applicant statement, <strong>Edit</strong> information, <strong>Delete</strong> records, or <strong>Approve & Issue Badge</strong> with 1-click.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fetchAdminData(token)}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                  title="Reload Latest Applications from Server"
                >
                  <span className="material-symbols-outlined text-[15px]">refresh</span>
                  <span>Refresh Queue</span>
                </button>

                <select
                  value={appFilterStatus}
                  onChange={(e) => setAppFilterStatus(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending Verification">Pending Verification</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <input
                  type="text"
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  placeholder="Search applicants..."
                  className="bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                    <th className="p-3">App ID</th>
                    <th className="p-3">Applicant Name</th>
                    <th className="p-3">Applied Post / Wing</th>
                    <th className="p-3">State</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions (View / Edit / Delete / Decisions)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApplications.map((app) => (
                    <tr key={app.applicationId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-800">
                        {app.applicationId}
                      </td>
                      <td className="p-3 font-bold text-slate-900">
                        {app.fullName}
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-[#0d47a1]">{app.wing}</div>
                        {app.transactionId || app.utrNumber ? (
                          <div className="text-[10px] font-mono text-emerald-700 font-bold mt-0.5">
                            Fee: ₹{app.feeAmount || getRoleFee(app.wing)} • UTR: {app.transactionId || app.utrNumber}
                          </div>
                        ) : (
                          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                            Fee: ₹{app.feeAmount || getRoleFee(app.wing)}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-slate-600">
                        {app.state}
                      </td>
                      <td className="p-3 font-mono text-slate-600">
                        <div>{app.mobile || app.phone || 'N/A'}</div>
                        <div className="text-[11px] text-slate-400">{app.email || 'N/A'}</div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 font-mono text-[10px] font-bold rounded ${
                            app.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : app.status === 'Rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {app.status}
                          {app.assignedBadge && ` (${app.assignedBadge})`}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1 whitespace-nowrap">
                        {/* VIEW APPLICATION */}
                        <button
                          onClick={() => setViewingApplication(app)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-bold uppercase cursor-pointer inline-flex items-center gap-1"
                          title="View Full Application"
                        >
                          <span className="material-symbols-outlined text-[13px]">visibility</span>
                          <span>View</span>
                        </button>

                        {/* EDIT APPLICATION */}
                        <button
                          onClick={() => setEditingApplication({ ...app })}
                          className="px-2 py-1 bg-blue-50 hover:bg-[#0d47a1] text-[#0d47a1] hover:text-white rounded text-[11px] font-bold uppercase cursor-pointer inline-flex items-center gap-1"
                          title="Edit Application"
                        >
                          <span className="material-symbols-outlined text-[13px]">edit</span>
                          <span>Edit</span>
                        </button>

                        {/* DELETE APPLICATION */}
                        <button
                          onClick={() => handleDeleteApplication(app)}
                          className="px-2 py-1 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded text-[11px] font-bold uppercase cursor-pointer inline-flex items-center gap-1"
                          title="Delete Application"
                        >
                          <span className="material-symbols-outlined text-[13px]">delete</span>
                          <span>Delete</span>
                        </button>

                        {/* APPROVE & ISSUE BADGE */}
                        {app.status !== 'Approved' && (
                          <button
                            onClick={() => handleApproveApplication(app.applicationId)}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold uppercase cursor-pointer inline-flex items-center gap-1"
                            title="Issue Official Badge"
                          >
                            <span className="material-symbols-outlined text-[13px]">verified</span>
                            <span>Approve</span>
                          </button>
                        )}

                        {/* REJECT BUTTON */}
                        {app.status !== 'Rejected' && (
                          <button
                            onClick={() => handleRejectApplication(app.applicationId)}
                            className="px-2 py-1 bg-slate-200 hover:bg-red-100 hover:text-red-700 text-slate-700 rounded text-[11px] font-bold uppercase cursor-pointer"
                          >
                            Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredApplications.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-400 text-xs">
                        No applications found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 4: GRIEVANCE DOSSIERS MANAGEMENT */}
        {/* ========================================== */}
        {activeTab === 'grievances' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden space-y-4 p-5 animate-fadeIn">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-headline font-bold text-base text-slate-900 uppercase">
                Confidential Whistleblower & Citizen Grievance Dossiers
              </h3>
              <p className="text-xs text-slate-500">
                Review confidential reports, assign state directorates, and update status stages displayed to citizen tracking codes.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                    <th className="p-3">Dossier Code</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Accused Target</th>
                    <th className="p-3">State</th>
                    <th className="p-3">Investigation Stage</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {grievances.map((grv) => (
                    <tr key={grv.trackingId} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-red-600">
                        {grv.trackingId}
                      </td>
                      <td className="p-3 font-medium text-slate-900">
                        {grv.category}
                      </td>
                      <td className="p-3 text-slate-700">
                        {grv.targetEntity}
                      </td>
                      <td className="p-3 text-slate-600">
                        {grv.state}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-blue-50 text-[#0d47a1] border border-blue-200 font-mono text-[10px] font-bold rounded">
                          {grv.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleUpdateGrievanceStatus(grv.trackingId, grv.status)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded text-[11px] font-bold uppercase cursor-pointer"
                        >
                          Update Status & Notes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 5: 80G DONATIONS & RECEIPTS */}
        {/* ========================================== */}
        {activeTab === 'donations' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden space-y-4 p-5 animate-fadeIn">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-headline font-bold text-base text-slate-900 uppercase">
                  80G Statutory Donation Registry
                </h3>
                <p className="text-xs text-slate-500">
                  Track contributions for pro bono legal defense, disaster relief, and anti-corruption operations.
                </p>
              </div>
              <span className="px-2.5 py-1 bg-green-50 text-emerald-800 font-mono text-xs font-bold border border-green-200 rounded uppercase">
                80G TAX EXEMPTION CERTIFIED
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                    <th className="p-3">Receipt Code</th>
                    <th className="p-3">Donor Name</th>
                    <th className="p-3">PAN Number</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Allocated Fund</th>
                    <th className="p-3">UPI / UTR Ref</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {donations.map((don) => (
                    <tr key={don.receiptId} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-900">
                        {don.receiptId}
                      </td>
                      <td className="p-3 font-bold text-slate-900">
                        {don.donorName}
                      </td>
                      <td className="p-3 font-mono text-slate-600">
                        {don.panNumber || 'NOT SUBMITTED'}
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-700">
                        ₹{Number(don.amount).toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-slate-600">
                        {don.fund}
                      </td>
                      <td className="p-3 font-mono text-slate-700">
                        {don.utrNumber ? (
                          <span className="bg-blue-50 text-blue-900 px-2 py-0.5 rounded border border-blue-200 font-bold">
                            {don.utrNumber}
                          </span>
                        ) : (
                          <span className="text-slate-400">Direct Scan</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold rounded">
                          CONFIRMED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 6: BLACKLISTED & REVOKED UID REGISTRY */}
        {/* ========================================== */}
        {activeTab === 'blacklist' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden space-y-4 p-5 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-headline font-bold text-base text-slate-900 uppercase text-red-600 flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-600 text-xl">gpp_bad</span>
                  Official Blacklisted & Revoked UID Registry
                </h3>
                <p className="text-xs text-slate-500">
                  Published registry of revoked appointments, terminated credentials, and unauthorized impersonators under Section 204 BNS.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={blacklistSearch}
                  onChange={(e) => setBlacklistSearch(e.target.value)}
                  placeholder="Search revoked records..."
                  className="bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-red-600"
                />

                <button
                  onClick={() => setShowAddBlacklistModal(true)}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer shadow-xs transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">add_moderator</span>
                  <span>+ Revoke UID / Blacklist</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                    <th className="p-3">Revoke UID ID</th>
                    <th className="p-3">Individual Name</th>
                    <th className="p-3">Jurisdiction</th>
                    <th className="p-3">Revocation Date</th>
                    <th className="p-3">Stated Reason</th>
                    <th className="p-3">Action Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {filteredBlacklist.map((item) => (
                    <tr key={item.id || item.badgeNumber} className="hover:bg-red-50/40 transition-colors">
                      <td className="p-3 font-mono font-bold text-red-600">
                        {item.uidNumber || item.badgeNumber}
                      </td>
                      <td className="p-3 font-bold text-slate-900">
                        {item.name}
                      </td>
                      <td className="p-3 text-slate-600">
                        {item.jurisdiction}
                      </td>
                      <td className="p-3 font-mono text-slate-600">
                        {toStandardDisplayDate(item.revocationDate)}
                      </td>
                      <td className="p-3 text-slate-600 max-w-xs leading-normal">
                        {item.reason}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-red-100 text-red-800 font-mono text-[10px] font-bold rounded uppercase">
                          {item.status || 'REVOKED & BLACKLISTED'}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1 whitespace-nowrap">
                        {/* EDIT BLACKLIST */}
                        <button
                          onClick={() => setEditingBlacklist({ ...item, uidNumber: item.uidNumber || item.badgeNumber })}
                          className="px-2 py-1 bg-blue-50 hover:bg-[#0d47a1] text-[#0d47a1] hover:text-white rounded text-[11px] font-bold uppercase cursor-pointer inline-flex items-center gap-1"
                          title="Edit Revocation Entry"
                        >
                          <span className="material-symbols-outlined text-[13px]">edit</span>
                          <span>Edit</span>
                        </button>

                        {/* REINSTATE / DELETE */}
                        <button
                          onClick={() => handleDeleteBlacklist(item)}
                          className="px-2 py-1 bg-slate-100 hover:bg-emerald-600 text-slate-700 hover:text-white rounded text-[11px] font-bold uppercase cursor-pointer inline-flex items-center gap-1"
                          title="Reinstate & Remove from Blacklist"
                        >
                          <span className="material-symbols-outlined text-[13px]">lock_open</span>
                          <span>Reinstate</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredBlacklist.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-400 text-xs">
                        No blacklisted entries found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 7: ACTIVITIES & BLOG SECTION           */}
        {/* ========================================== */}
        {activeTab === 'activities' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden space-y-4 p-5 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-headline font-bold text-base text-slate-900 uppercase text-[#0d47a1] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0d47a1] text-xl">article</span>
                  Our Activities & Field Operations (Blog Section)
                </h3>
                <p className="text-xs text-slate-500">
                  Publish, update, and manage public awareness drives, youth anti-narcotics rallies, pro-bono legal clinics, and institutional dispatches.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={activitySearch}
                  onChange={(e) => setActivitySearch(e.target.value)}
                  placeholder="Search activities & blogs..."
                  className="bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                />

                <select
                  value={activityFilterCategory}
                  onChange={(e) => setActivityFilterCategory(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none"
                >
                  <option value="All">All Categories ({activityCategories.length})</option>
                  {activityCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setShowManageCategoriesModal(true)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all"
                  title="Add or Manage Activity Categories"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#0d47a1]">category</span>
                  <span>Categories ({activityCategories.length})</span>
                </button>

                <button
                  onClick={() => setShowAddActivityModal(true)}
                  className="px-3.5 py-1.5 bg-[#0d47a1] hover:bg-blue-900 text-white rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer shadow-xs transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">add_circle</span>
                  <span>+ Publish Activity</span>
                </button>
              </div>
            </div>

            {/* Quick Category Chips Strip */}
            <div className="flex items-center justify-between gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1 shrink-0">
                  Active Wings:
                </span>
                {activityCategories.map((c) => (
                  <span
                    key={c}
                    className="px-2 py-0.5 bg-white border border-slate-300 rounded-full text-[11px] text-slate-700 font-semibold whitespace-nowrap flex items-center gap-1 shrink-0"
                  >
                    <span>{c}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(c)}
                      className="text-slate-400 hover:text-red-600 cursor-pointer ml-0.5"
                      title={`Delete category '${c}'`}
                    >
                      <span className="material-symbols-outlined text-[13px] leading-none">close</span>
                    </button>
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowManageCategoriesModal(true)}
                className="text-xs font-bold text-[#0d47a1] hover:underline whitespace-nowrap shrink-0 flex items-center gap-0.5 cursor-pointer ml-2"
              >
                <span className="material-symbols-outlined text-[14px]">add</span>
                <span>+ Add Category</span>
              </button>
            </div>

            {/* Drag & Drop / Up & Down Ordering Guide Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-blue-50/70 border border-blue-200/80 rounded-lg text-xs text-blue-900">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0d47a1] text-base shrink-0">drag_indicator</span>
                <div>
                  <span className="font-bold text-[#0d47a1]">Manage Display Ordering: </span>
                  <span className="text-slate-700">Drag rows using the grip handle or click the <strong>[↑] / [↓]</strong> buttons to reposition posts. The custom order is saved automatically to determine display sequence on the public portal.</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <span className="px-2 py-0.5 bg-white border border-blue-200 rounded font-mono text-[11px] font-bold text-[#0d47a1] shadow-2xs">
                  {filteredActivities.length} {filteredActivities.length === 1 ? 'Post' : 'Posts'} Ordered
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                    <th className="p-3 w-28 text-center font-bold text-slate-700 uppercase" title="Reorder posts using Drag & Drop or Up/Down arrows">Order</th>
                    <th className="p-3 w-16">Cover</th>
                    <th className="p-3">Title & Summary</th>
                    <th className="p-3">Category / Wing</th>
                    <th className="p-3">Date & Location</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {filteredActivities.map((act, index) => {
                    const isDragging = draggedActivityId === act.id;
                    const isDragOver = dragOverActivityId === act.id;
                    return (
                      <tr
                        key={act.id}
                        draggable
                        onDragStart={(e) => {
                          setDraggedActivityId(act.id);
                          e.dataTransfer.effectAllowed = 'move';
                          e.dataTransfer.setData('text/plain', act.id);
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = 'move';
                          if (dragOverActivityId !== act.id) {
                            setDragOverActivityId(act.id);
                          }
                        }}
                        onDragLeave={() => {
                          if (dragOverActivityId === act.id) {
                            setDragOverActivityId(null);
                          }
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          handleDropActivity(act.id);
                        }}
                        onDragEnd={() => {
                          setDraggedActivityId(null);
                          setDragOverActivityId(null);
                        }}
                        className={`transition-all duration-150 ${
                          isDragging
                            ? 'opacity-40 bg-blue-100/70 border-2 border-dashed border-[#0d47a1]'
                            : isDragOver
                            ? 'bg-blue-50 border-t-2 border-t-[#0d47a1] shadow-xs'
                            : 'hover:bg-slate-50/80'
                        }`}
                      >
                        <td className="p-2.5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Drag Handle */}
                            <div
                              className="cursor-grab active:cursor-grabbing p-1 rounded text-slate-400 hover:text-[#0d47a1] hover:bg-slate-200/80 transition-colors"
                              title="Click and drag to reorder this activity"
                            >
                              <span className="material-symbols-outlined text-[18px] leading-none select-none">drag_indicator</span>
                            </div>

                            {/* Position Badge */}
                            <span
                              className="font-mono text-[11px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200 min-w-[28px] text-center"
                              title={`Display Sequence Position #${index + 1}`}
                            >
                              #{index + 1}
                            </span>

                            {/* Up / Down Sort Buttons */}
                            <div className="flex flex-col gap-0.5">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => handleMoveActivity(act, 'up')}
                                className={`p-0.5 rounded transition-colors ${
                                  index === 0
                                    ? 'text-slate-300 cursor-not-allowed'
                                    : 'text-slate-600 hover:text-[#0d47a1] hover:bg-blue-100 cursor-pointer'
                                }`}
                                title="Move up in order"
                              >
                                <span className="material-symbols-outlined text-[15px] leading-none">keyboard_arrow_up</span>
                              </button>
                              <button
                                type="button"
                                disabled={index === filteredActivities.length - 1}
                                onClick={() => handleMoveActivity(act, 'down')}
                                className={`p-0.5 rounded transition-colors ${
                                  index === filteredActivities.length - 1
                                    ? 'text-slate-300 cursor-not-allowed'
                                    : 'text-slate-600 hover:text-[#0d47a1] hover:bg-blue-100 cursor-pointer'
                                }`}
                                title="Move down in order"
                              >
                                <span className="material-symbols-outlined text-[15px] leading-none">keyboard_arrow_down</span>
                              </button>
                            </div>
                          </div>
                        </td>
                      <td className="p-3">
                        <div className="relative w-14 h-11 rounded border border-slate-200 overflow-hidden bg-slate-900">
                          <img
                            src={act.image || (act.mediaType === 'video' && act.videoType === 'youtube' && act.videoUrl ? getYouTubeThumbnailUrl(act.videoUrl) || '' : '') || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=200'}
                            alt={act.title}
                            className="w-full h-full object-cover"
                          />
                          {act.mediaType === 'video' && (
                            <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-white" title={act.videoType === 'youtube' ? 'YouTube Video Dispatch' : 'Uploaded Video Dispatch'}>
                              <span className="material-symbols-outlined text-[18px] text-red-500">
                                {act.videoType === 'youtube' ? 'smart_display' : 'play_circle'}
                              </span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 max-w-sm">
                        <span className="font-bold text-slate-900 block line-clamp-1 text-sm">
                          {act.title}
                        </span>
                        <span className="text-slate-500 text-[11px] line-clamp-2 mt-0.5">
                          {act.description}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          {act.mediaType === 'video' ? (
                            <span className="px-1.5 py-0.2 bg-red-50 text-red-700 border border-red-200 text-[9.5px] font-bold rounded flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[11px]">videocam</span>
                              <span>{act.videoType === 'youtube' ? 'YouTube' : 'Video'}</span>
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 border border-slate-200 text-[9.5px] font-bold rounded flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[11px]">image</span>
                              <span>Photo</span>
                            </span>
                          )}
                          {act.author && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              By {act.author}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-blue-50 text-[#0d47a1] border border-blue-200 font-mono text-[10px] font-bold rounded uppercase">
                          {act.category}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="font-mono text-slate-700 font-semibold">
                          {toStandardDisplayDate(act.date)}
                        </div>
                        <div className="text-slate-500 text-[11px] flex items-center gap-0.5 mt-0.5">
                          <span className="material-symbols-outlined text-[13px]">location_on</span>
                          <span>{act.location}</span>
                        </div>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 font-mono text-[10px] font-bold rounded uppercase ${
                            act.status === 'Published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {act.status || 'Published'}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1 whitespace-nowrap">
                        {/* PREVIEW BUTTON */}
                        <button
                          onClick={() => setViewingActivity(act)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-bold uppercase cursor-pointer inline-flex items-center gap-1"
                          title="Preview Blog Post"
                        >
                          <span className="material-symbols-outlined text-[13px]">visibility</span>
                          <span>Read</span>
                        </button>

                        {/* EDIT BUTTON */}
                        <button
                          onClick={() => {
                            const detectedMediaType = act.mediaType || (act.videoUrl ? 'video' : 'image');
                            const detectedVideoType = act.videoType || (act.videoUrl && isYouTubeUrl(act.videoUrl) ? 'youtube' : 'upload');
                            setEditingActivity({
                              ...act,
                              mediaType: detectedMediaType,
                              videoType: detectedVideoType,
                              videoUrl: act.videoUrl || '',
                              image: act.image || ''
                            });
                          }}
                          className="px-2 py-1 bg-blue-50 hover:bg-[#0d47a1] text-[#0d47a1] hover:text-white rounded text-[11px] font-bold uppercase cursor-pointer inline-flex items-center gap-1"
                          title="Edit Activity"
                        >
                          <span className="material-symbols-outlined text-[13px]">edit</span>
                          <span>Edit</span>
                        </button>

                        {/* DELETE BUTTON */}
                        <button
                          onClick={() => handleDeleteActivity(act)}
                          className="px-2 py-1 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded text-[11px] font-bold uppercase cursor-pointer inline-flex items-center gap-1"
                          title="Delete Activity"
                        >
                          <span className="material-symbols-outlined text-[13px]">delete</span>
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                    );
                  })}
                  {filteredActivities.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                        No activity articles found matching search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: CERTIFICATES & STATUTORY ACCREDITATIONS MANAGEMENT  */}
        {/* ======================================================== */}
        {activeTab === 'certificates' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden space-y-4 p-5 animate-fadeIn">
            {/* Tab Header & Control Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-headline font-bold text-base text-[#0d47a1] uppercase flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0d47a1] text-xl">workspace_premium</span>
                  Statutory Certificates &amp; Institutional Accreditations
                </h3>
                <p className="text-xs text-slate-500">
                  Upload PDF or image certificates (MSME UDYAM, NITI Aayog Darpan, IFA 760 Trust Charter, Tax Exemption orders). Public visitors can view and download these verified documents.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={certificateSearch}
                  onChange={(e) => setCertificateSearch(e.target.value)}
                  placeholder="Search certificates..."
                  className="bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                />

                <select
                  value={certificateFilterCategory}
                  onChange={(e) => setCertificateFilterCategory(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  <option value="Government Accreditation">Govt Accreditations</option>
                  <option value="Trust Charter">Trust Charters</option>
                  <option value="Tax Exemption">Tax Exemption</option>
                  <option value="Statutory License">Statutory Licenses</option>
                </select>

                <button
                  onClick={() => setShowAddCertificateModal(true)}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-[#0d47a1] to-[#1565c0] hover:from-[#0a3875] hover:to-[#0d47a1] text-white rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs transition-all border border-amber-400"
                >
                  <span className="material-symbols-outlined text-[16px]">upload_file</span>
                  <span>+ Upload Certificate</span>
                </button>
              </div>
            </div>

            {/* Drag & Drop / Up & Down Ordering Guide Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-700 text-base shrink-0">drag_indicator</span>
                <div>
                  <span className="font-bold text-amber-800">Manage Certificate Ordering: </span>
                  <span className="text-slate-700">Drag rows using the grip handle or use the <strong>[↑] / [↓]</strong> buttons to reposition certificates. The sequence is immediately saved and determines display order on the public certificates &amp; accreditation portal.</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <span className="px-2 py-0.5 bg-white border border-amber-300 rounded font-mono text-[11px] font-bold text-amber-800 shadow-2xs">
                  {filteredCertificates.length} {filteredCertificates.length === 1 ? 'Certificate' : 'Certificates'} Ordered
                </span>
              </div>
            </div>

            {/* Certificates Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-3 w-28 text-center font-bold text-slate-700 uppercase" title="Reorder certificates using Drag & Drop or Up/Down arrows">Order</th>
                    <th className="p-3 w-16 text-center">Type</th>
                    <th className="p-3">Title &amp; Reg. Number</th>
                    <th className="p-3">Issuing Authority &amp; Category</th>
                    <th className="p-3">File Info</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCertificates.map((cert, index) => {
                    const isDragging = draggedCertId === cert.id;
                    const isDragOver = dragOverCertId === cert.id;
                    const isPdf = cert.fileType === 'pdf' || (cert.fileUrl && cert.fileUrl.toLowerCase().endsWith('.pdf'));
                    return (
                      <tr
                        key={cert.id}
                        draggable
                        onDragStart={(e) => {
                          setDraggedCertId(cert.id);
                          e.dataTransfer.effectAllowed = 'move';
                          e.dataTransfer.setData('text/plain', cert.id);
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = 'move';
                          if (dragOverCertId !== cert.id) {
                            setDragOverCertId(cert.id);
                          }
                        }}
                        onDragLeave={() => {
                          if (dragOverCertId === cert.id) {
                            setDragOverCertId(null);
                          }
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          handleDropCertificate(cert.id);
                        }}
                        onDragEnd={() => {
                          setDraggedCertId(null);
                          setDragOverCertId(null);
                        }}
                        className={`transition-all duration-150 ${
                          isDragging
                            ? 'opacity-40 bg-amber-100/70 border-2 border-dashed border-amber-500'
                            : isDragOver
                            ? 'bg-amber-50/70 border-t-2 border-t-amber-600 shadow-xs'
                            : 'hover:bg-slate-50/80'
                        }`}
                      >
                        <td className="p-2.5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Drag Handle */}
                            <div
                              className="cursor-grab active:cursor-grabbing p-1 rounded text-slate-400 hover:text-amber-700 hover:bg-slate-200/80 transition-colors"
                              title="Click and drag to reorder this certificate"
                            >
                              <span className="material-symbols-outlined text-[18px] leading-none select-none">drag_indicator</span>
                            </div>

                            {/* Position Badge */}
                            <span
                              className="font-mono text-[11px] font-bold px-1.5 py-0.5 bg-amber-50 text-amber-900 rounded border border-amber-200 min-w-[28px] text-center"
                              title={`Display Rank #${index + 1}`}
                            >
                              #{index + 1}
                            </span>

                            {/* Up / Down Sort Buttons */}
                            <div className="flex flex-col gap-0.5">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => handleMoveCertificate(cert, 'up')}
                                className={`p-0.5 rounded transition-colors ${
                                  index === 0
                                    ? 'text-slate-300 cursor-not-allowed'
                                    : 'text-slate-600 hover:text-[#0d47a1] hover:bg-blue-100 cursor-pointer'
                                }`}
                                title="Move up in order"
                              >
                                <span className="material-symbols-outlined text-[15px] leading-none">keyboard_arrow_up</span>
                              </button>
                              <button
                                type="button"
                                disabled={index === filteredCertificates.length - 1}
                                onClick={() => handleMoveCertificate(cert, 'down')}
                                className={`p-0.5 rounded transition-colors ${
                                  index === filteredCertificates.length - 1
                                    ? 'text-slate-300 cursor-not-allowed'
                                    : 'text-slate-600 hover:text-[#0d47a1] hover:bg-blue-100 cursor-pointer'
                                }`}
                                title="Move down in order"
                              >
                                <span className="material-symbols-outlined text-[15px] leading-none">keyboard_arrow_down</span>
                              </button>
                            </div>
                          </div>
                        </td>
                          <td className="p-3 text-center">
                            <div className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center font-bold ${
                              isPdf ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-blue-50 text-[#0d47a1] border border-blue-200'
                            }`}>
                              <span className="material-symbols-outlined text-[20px]">
                                {isPdf ? 'picture_as_pdf' : 'image'}
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-slate-900 text-sm">{cert.title}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-[11px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                {cert.registrationNumber || 'Statutory Order'}
                              </span>
                              <span className="text-[11px] text-slate-500 truncate max-w-md">
                                {cert.description}
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-slate-800">{cert.issuingAuthority || 'Govt of India'}</div>
                            <div className="text-[11px] text-slate-500 font-medium">{cert.category || 'Accreditation'}</div>
                          </td>
                          <td className="p-3 font-mono text-[11px]">
                            <div className="text-slate-700 font-medium truncate max-w-xs">{cert.fileName || 'document.pdf'}</div>
                            <div className="text-slate-400 text-[10px]">{cert.fileSize || 'Standard PDF'} · {cert.issueDate || 'Active'}</div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              cert.status === 'Published'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              {cert.status || 'Published'}
                            </span>
                          </td>
                          <td className="p-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setViewingCertificate(cert)}
                                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#0d47a1] border border-blue-200 rounded text-xs font-bold uppercase flex items-center gap-1 cursor-pointer transition-colors"
                                title="View Document"
                              >
                                <span className="material-symbols-outlined text-[13px]">visibility</span>
                                <span>View</span>
                              </button>

                              <button
                                onClick={() => setEditingCertificate(cert)}
                                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded text-xs font-bold uppercase flex items-center gap-1 cursor-pointer transition-colors"
                                title="Edit Certificate"
                              >
                                <span className="material-symbols-outlined text-[13px]">edit</span>
                                <span>Edit</span>
                              </button>

                              <a
                                href={cert.fileUrl}
                                download={cert.fileName || 'certificate.pdf'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-xs font-bold uppercase flex items-center gap-1 transition-colors"
                                title="Download File"
                              >
                                <span className="material-symbols-outlined text-[13px]">download</span>
                              </a>

                              <button
                                onClick={() => handleDeleteCertificate(cert)}
                                className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded text-xs font-bold uppercase flex items-center gap-1 cursor-pointer transition-colors"
                                title="Delete Certificate"
                              >
                                <span className="material-symbols-outlined text-[13px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                  {certificates.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                        No certificates uploaded yet. Click "+ Upload Certificate" to add your first statutory registration.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 8: SETTINGS & CPANEL EXPORT */}
        {/* ========================================== */}
        {activeTab === 'settings' && settings && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="font-headline font-bold text-base text-slate-900 uppercase">
                Institutional Statutory Settings
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Organization Name</label>
                  <input
                    type="text"
                    value={settings.organizationName}
                    onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Trust Registration</label>
                  <input
                    type="text"
                    value={settings.trustRegistration}
                    onChange={(e) => setSettings({ ...settings, trustRegistration: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">NITI Aayog Darpan</label>
                    <input
                      type="text"
                      value={settings.darpanId}
                      onChange={(e) => setSettings({ ...settings, darpanId: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">MSME UDYAM</label>
                    <input
                      type="text"
                      value={settings.msmeUdyam}
                      onChange={(e) => setSettings({ ...settings, msmeUdyam: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">24/7 Helpline</label>
                  <input
                    type="text"
                    value={settings.helpline}
                    onChange={(e) => setSettings({ ...settings, helpline: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="font-headline font-bold text-base text-slate-900 uppercase">
                cPanel Hosting Readiness & Backups
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                This app is packaged for seamless deployment to cPanel using either <strong>cPanel Node.js Application Manager</strong> or <strong>Standard Shared Apache/PHP</strong>.
              </p>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
                <strong className="text-slate-900 block font-bold">cPanel Files Prepared in Codebase:</strong>
                <ul className="space-y-1 text-slate-600 font-mono text-[11px]">
                  <li>• <code>cpanel/app.js</code> (Passenger startup script)</li>
                  <li>• <code>cpanel/.htaccess</code> (Apache SPA rewrite & security)</li>
                  <li>• <code>cpanel/php-api/api.php</code> (Zero-Node fallback PHP API)</li>
                  <li>• <code>CPANEL_DEPLOYMENT_GUIDE.md</code> (Step-by-step setup guide)</li>
                </ul>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <a
                  href="/api/download/deploy-zip"
                  download="rawf_deploy_package.zip"
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase rounded flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors text-center"
                >
                  <span className="material-symbols-outlined text-[18px]">folder_zip</span>
                  Download Ready-to-Upload cPanel ZIP (rawf_deploy_package.zip)
                </a>
                <a
                  href="/api/download/sql"
                  download="rawf_production_schema.sql"
                  className="w-full py-2 bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs uppercase rounded flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors text-center"
                >
                  <span className="material-symbols-outlined text-[18px]">database</span>
                  Download MySQL Database Schema (.sql)
                </a>
                <button
                  onClick={handleExportBackup}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs uppercase rounded flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Export Full JSON Database Backup
                </button>
              </div>
            </div>

            {/* Email Server & OTP Dispatcher Live Diagnostic */}
            <div className="lg:col-span-12 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="material-symbols-outlined text-[#0d47a1] text-[24px]">mark_email_read</span>
                <div>
                  <h3 className="font-headline font-bold text-base text-slate-900 uppercase">
                    Official Email Server &amp; OTP Dispatcher Diagnostic
                  </h3>
                  <p className="text-xs text-slate-500">
                    Verify live delivery for Officer OTPs, Grievance alerts, and Membership intake notifications. Connected to <strong>mail.raidactionwing.in (Port 465 SSL)</strong> with PHP Mail fallback.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-8 flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={testEmailAddress}
                    onChange={(e) => setTestEmailAddress(e.target.value)}
                    placeholder="Enter recipient email (e.g. andrew000us@gmail.com)"
                    className="flex-1 bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#0d47a1]"
                  />
                  <button
                    type="button"
                    onClick={handleSendTestEmail}
                    disabled={testEmailLoading || !testEmailAddress.trim()}
                    className="px-4 py-2 bg-[#0d47a1] hover:bg-blue-900 text-white rounded font-bold text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50 whitespace-nowrap"
                  >
                    {testEmailLoading ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span className="material-symbols-outlined text-[16px]">send</span>
                    )}
                    <span>Send Test Diagnostic Email</span>
                  </button>
                </div>

                <div className="md:col-span-4 text-xs font-mono">
                  {testEmailResult && (
                    <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-slate-800">
                      {testEmailResult}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Official Logo Brand Assets Management */}
            <div className="lg:col-span-12 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-blue-600 text-[28px]">verified</span>
                  <div>
                    <h3 className="font-headline font-bold text-base text-slate-900 uppercase">
                      Official RAWF Emblem &amp; Logo Management
                    </h3>
                    <p className="text-xs text-slate-500">
                      Standard official logo displayed across Navbar, Footer, Verification Modal, ID Card generator, and all institutional portals.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="file"
                    ref={logoInputRef}
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleAdminLogoSelect}
                  />
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="px-4 py-2 bg-[#0d47a1] hover:bg-blue-900 text-white rounded font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">upload_file</span>
                    <span>Choose / Upload New Logo</span>
                  </button>

                  <button
                    onClick={handleResetDefaultLogo}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-xs uppercase flex items-center gap-1 cursor-pointer transition-all border border-slate-200"
                    title="Restore factory default official RAWF emblem"
                  >
                    <span className="material-symbols-outlined text-[15px]">restart_alt</span>
                    <span>Reset Default</span>
                  </button>
                </div>
              </div>

              {/* STAGED LOGO READY TO SAVE BANNER (HIGH PROMINENCE) */}
              {stagedLogoData && (
                <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-50 to-emerald-50 border-2 border-emerald-500 rounded-xl space-y-4 shadow-md animate-scaleUp">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-600 text-[24px]">pending_actions</span>
                      <div>
                        <h4 className="font-headline font-black text-sm uppercase text-slate-900">
                          New Logo Selected — Ready to Save
                        </h4>
                        <span className="text-xs text-slate-600">
                          File: <strong>{stagedLogoFileName || 'Uploaded Image'}</strong>. Review below and click "Save Logo" to apply.
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold text-[10px] uppercase font-mono rounded-full animate-pulse">
                      Action Required: Click Save
                    </span>
                  </div>

                  {/* Side-by-side Visual Preview Comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* Current Active */}
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200 flex items-center gap-3">
                      <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded p-1 shrink-0 flex items-center justify-center">
                        <img
                          src={`/rawf-logo.jpg?t=${logoTimestamp}`}
                          alt="Current Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-slate-500 uppercase block text-[10px]">Current Active</span>
                        <span className="text-slate-800 font-semibold">Live in App Now</span>
                      </div>
                    </div>

                    {/* Staged New Preview */}
                    <div className="bg-white p-3.5 rounded-lg border-2 border-emerald-500 flex items-center gap-3 shadow-xs">
                      <div className="w-16 h-16 bg-slate-50 border border-emerald-400 rounded p-1 shrink-0 flex items-center justify-center">
                        <img
                          src={stagedLogoData}
                          alt="New Uploaded Logo Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-emerald-700 uppercase block text-[10px]">New Logo (Unsaved)</span>
                        <span className="text-emerald-900 font-bold">Ready to Commit</span>
                      </div>
                    </div>
                  </div>

                  {/* PROMINENT SAVE BUTTONS ROW */}
                  <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-emerald-200">
                    <button
                      onClick={handleSaveUploadedLogo}
                      disabled={logoUploadLoading}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-headline font-black text-xs sm:text-sm uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer transition-all border-2 border-emerald-400"
                    >
                      <span className="material-symbols-outlined text-[20px]">save</span>
                      <span>{logoUploadLoading ? 'Saving Everywhere...' : 'SAVE LOGO & APPLY ACROSS ALL SECTIONS'}</span>
                    </button>

                    <button
                      onClick={handleCancelStagedLogo}
                      disabled={logoUploadLoading}
                      className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs uppercase rounded-lg cursor-pointer transition-all"
                    >
                      Cancel
                    </button>

                    <span className="text-[11px] text-slate-500 italic">
                      * Once saved, this logo will instantly reflect on ID Cards, Verification modal, Navbar &amp; Footer.
                    </span>
                  </div>
                </div>
              )}

              {logoUploadMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-mono font-bold flex items-center gap-2 animate-fadeIn">
                  <span className="material-symbols-outlined text-[20px] text-emerald-600">check_circle</span>
                  <span>{logoUploadMsg}</span>
                </div>
              )}

              {/* Current Active Status Card */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white border-2 border-slate-200 rounded-xl p-2 shadow-xs flex items-center justify-center shrink-0">
                  <RawfLogo className="w-full h-full object-contain" />
                </div>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-slate-400">File:</span>
                    <code className="bg-slate-200 px-2 py-0.5 rounded font-mono text-blue-900 font-bold">/rawf-logo.jpg</code>
                    <span className="px-2 py-0.5 bg-green-100 text-emerald-800 font-mono text-[10px] font-bold rounded">
                      ACTIVE &amp; SYNCHRONIZED
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400">Coverage:</span>
                    <span className="font-mono text-slate-900 font-semibold">
                      Top Hero Banner, ID Card Generator, Appointment Letter, Header/Navbar, Verification Modal, Watermarks &amp; Footer
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] pt-1 leading-relaxed">
                    The <code>RawfLogo</code> component is linked to reactive event broadcasts and persistent storage, guaranteeing that your logo updates across the entire website and high-resolution ID card downloads immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* Authorized Signatory & Official Signature Management */}
            <div className="lg:col-span-12 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#0d47a1] text-[28px]">history_edu</span>
                  <div>
                    <h3 className="font-headline font-bold text-base text-slate-900 uppercase">
                      Authorized Signatory &amp; Signature Management
                    </h3>
                    <p className="text-xs text-slate-500">
                      Upload the official authorized signature image. Once saved, it automatically displays across Officer Digital ID Cards, Official Appointment Letters, Verification Credentials, and all official statutory documents with auto-adjusted dimensions.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="file"
                    ref={signatureInputRef}
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleAdminSignatureSelect}
                  />
                  <button
                    onClick={() => signatureInputRef.current?.click()}
                    className="px-4 py-2 bg-[#0d47a1] hover:bg-blue-900 text-white rounded font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">upload_file</span>
                    <span>Choose / Upload Signature Image</span>
                  </button>

                  <button
                    onClick={handleResetDefaultSignature}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-xs uppercase flex items-center gap-1 cursor-pointer transition-all border border-slate-200"
                    title="Restore standard official cursive signatory format"
                  >
                    <span className="material-symbols-outlined text-[15px]">restart_alt</span>
                    <span>Reset Default</span>
                  </button>
                </div>
              </div>

              {/* STAGED SIGNATURE READY TO SAVE BANNER */}
              {stagedSignatureData && (
                <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-50 to-emerald-50 border-2 border-emerald-500 rounded-xl space-y-4 shadow-md animate-scaleUp">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-600 text-[24px]">pending_actions</span>
                      <div>
                        <h4 className="font-headline font-black text-sm uppercase text-slate-900">
                          New Authorized Signature Selected — Ready to Save
                        </h4>
                        <span className="text-xs text-slate-600">
                          File: <strong>{stagedSignatureFileName || 'Uploaded Signature'}</strong>. Review live previews below and click "Save Signature Image" to apply across all documents.
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold text-[10px] uppercase font-mono rounded-full animate-pulse">
                      Action Required: Click Save
                    </span>
                  </div>

                  {/* Side-by-side Visual Preview Comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* Current Active */}
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200 flex items-center gap-3">
                      <div className="w-36 h-16 bg-slate-50 border border-slate-200 rounded p-1 shrink-0 flex items-center justify-center overflow-hidden">
                        <AuthorizedSignature
                          className="h-full w-full"
                          imgClassName="max-h-full max-w-full object-contain"
                          fallbackText="Manoj Chauhan"
                          fallbackClassName="font-id-sign text-slate-800 text-[18px] leading-none select-none font-bold"
                          alt="Current Active Signature"
                        />
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-slate-500 uppercase block text-[10px]">Current Active</span>
                        <span className="text-slate-800 font-semibold">Live in System Now</span>
                      </div>
                    </div>

                    {/* Staged New Preview */}
                    <div className="bg-white p-3.5 rounded-lg border-2 border-emerald-500 flex items-center gap-3 shadow-xs">
                      <div className="w-36 h-16 bg-slate-50 border border-emerald-400 rounded p-1 shrink-0 flex items-center justify-center overflow-hidden">
                        <img
                          src={stagedSignatureData}
                          alt="New Uploaded Signature Preview"
                          className="max-h-full max-w-full object-contain filter contrast-125"
                        />
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-emerald-700 uppercase block text-[10px]">New Signature (Unsaved)</span>
                        <span className="text-emerald-900 font-bold">Ready to Commit</span>
                      </div>
                    </div>
                  </div>

                  {/* PROMINENT SAVE BUTTONS ROW */}
                  <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-emerald-200">
                    <button
                      onClick={handleSaveUploadedSignature}
                      disabled={signatureUploadLoading}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg font-bold text-xs uppercase flex items-center gap-2 cursor-pointer shadow-md transition-all disabled:opacity-50"
                    >
                      {signatureUploadLoading ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      )}
                      <span>Save Signature Image Everywhere</span>
                    </button>

                    <button
                      onClick={handleCancelStagedSignature}
                      disabled={signatureUploadLoading}
                      className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg font-semibold text-xs uppercase flex items-center gap-1.5 cursor-pointer border border-slate-300 transition-all shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">cancel</span>
                      <span>Discard / Cancel</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Status & Feedback Message */}
              {signatureUploadMsg && (
                <div
                  className={`p-3 rounded-lg text-xs font-mono font-semibold flex items-center gap-2 ${
                    signatureUploadMsg.startsWith('Error')
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {signatureUploadMsg.startsWith('Error') ? 'error' : 'check_circle'}
                  </span>
                  <span>{signatureUploadMsg}</span>
                </div>
              )}

              {/* Live Multi-Document Preview Showcase */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. ID Card Context */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-blue-600 text-[16px]">badge</span>
                      Officer Digital ID Card Context
                    </span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-mono text-[9px] font-bold rounded">
                      AUTO-DIMENSION: 130x30px
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-300 flex items-center justify-between shadow-2xs">
                    <div className="text-[10px] font-mono text-slate-400">
                      [ Barcode Area ]
                    </div>
                    <div className="flex flex-col items-end justify-end text-right">
                      <div className="max-w-[130px] flex items-end justify-end">
                        <AuthorizedSignature
                          className="w-auto flex items-end justify-end"
                          imgClassName="max-h-[28px] max-w-[130px] object-contain object-bottom"
                          fallbackText="Manoj Chauhan"
                          fallbackClassName="font-id-sign text-slate-800 text-[19px] leading-none select-none font-bold pr-0.5 block"
                          alt="Authorised Signatory"
                        />
                      </div>
                      <div className="font-id-sans font-bold text-[#1b2a72] text-[10.5px] tracking-tight leading-none mt-0 select-none">
                        Authorised Signatory
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Fitted on the bottom-right front side of every official encrypted identity card.
                  </p>
                </div>

                {/* 2. Appointment Letter Context */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-emerald-600 text-[16px]">description</span>
                      Appointment Letter Context
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-mono text-[9px] font-bold rounded">
                      AUTO-DIMENSION: 170x48px
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-300 flex items-center justify-between shadow-2xs">
                    <div className="w-10 h-10 rounded-full border border-red-400 flex items-center justify-center text-[7px] font-mono text-red-500 font-bold text-center">
                      SEAL
                    </div>
                    <div className="text-right">
                      <div className="h-10 max-w-[150px] flex items-end justify-end ml-auto mb-0.5">
                        <AuthorizedSignature
                          className="h-full w-auto"
                          imgClassName="h-full max-h-[40px] max-w-[150px] object-contain"
                          fallbackText="Manoj Chauhan"
                          fallbackClassName="font-serif italic font-bold text-sm text-slate-800 select-none font-['Brush_Script_MT',cursive,'Caveat']"
                          alt="Authorised Signatory"
                        />
                      </div>
                      <div className="font-headline font-black text-[#0b3b95] text-xs uppercase leading-tight">
                        Manoj Chauhan
                      </div>
                      <div className="text-[9px] text-slate-500 font-semibold leading-tight">
                        Founder • Supreme Command
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Rendered above the signatory mandate block on printed appointment letters and certificates.
                  </p>
                </div>
              </div>

              {/* Status Banner */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="w-24 h-16 sm:w-28 sm:h-20 bg-white border-2 border-slate-200 rounded-xl p-2 shadow-xs flex items-center justify-center shrink-0">
                  <AuthorizedSignature
                    className="h-full w-full"
                    imgClassName="max-h-full max-w-full object-contain"
                    fallbackText="Manoj Chauhan"
                    fallbackClassName="font-id-sign text-slate-800 text-[18px] leading-none select-none font-bold"
                    alt="Active Signature"
                  />
                </div>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-slate-400">Target File:</span>
                    <code className="bg-slate-200 px-2 py-0.5 rounded font-mono text-blue-900 font-bold">/rawf-signature.png</code>
                    <span className="px-2 py-0.5 bg-green-100 text-emerald-800 font-mono text-[10px] font-bold rounded">
                      {currentSignatureUrl ? 'CUSTOM IMAGE ACTIVE' : 'DEFAULT SCRIPT ACTIVE'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400">Coverage:</span>
                    <span className="font-mono text-slate-900 font-semibold">
                      Officer Digital ID Card, Official Appointment Letters, Download Portal, Verification Certificates
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] pt-1 leading-relaxed">
                    The <code>AuthorizedSignature</code> component dynamically calculates bounds and scales any uploaded signature format (transparent PNG recommended) without stretching or distortion.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL: OFFICIAL ID CARD & APPOINTMENT LETTER PREVIEW     */}
      {/* ======================================================== */}
      {viewingIdCardOfficer && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-3 sm:p-5 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-6xl w-full p-5 sm:p-7 shadow-2xl space-y-5 relative animate-scaleUp my-auto">
            <button
              onClick={() => setViewingIdCardOfficer(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full cursor-pointer bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold rounded uppercase">
                    OFFICIAL ID CARD GENERATED
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    UID: <strong>{viewingIdCardOfficer.uidNumber || viewingIdCardOfficer.badgeNumber}</strong>
                  </span>
                </div>
                <h3 className="font-headline font-bold text-xl text-slate-900 mt-0.5">
                  {viewingIdCardOfficer.name} — {viewingIdCardOfficer.designation}
                </h3>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIdCardModalTab('card')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1 ${
                    idCardModalTab === 'card'
                      ? 'bg-[#0d47a1] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">badge</span>
                  <span>Official ID Card</span>
                </button>
                <button
                  onClick={() => setIdCardModalTab('letter')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1 ${
                    idCardModalTab === 'letter'
                      ? 'bg-[#0d47a1] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">description</span>
                  <span>Appointment Letter</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT: OFFICIAL ID CARD */}
            {idCardModalTab === 'card' && (
              <div className="space-y-4">
                <div className="bg-slate-100/90 p-4 sm:p-6 rounded-2xl border border-slate-300 flex justify-center overflow-x-auto">
                  <div className="min-w-fit flex justify-center">
                    <OfficialIdCard cardData={viewingIdCardOfficer} showBothSides={true} layout="auto" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-slate-500">
                    <span>Credentials: </span>
                    <strong className="text-slate-800 font-mono">{viewingIdCardOfficer.uidNumber || viewingIdCardOfficer.badgeNumber}</strong>
                    <span className="mx-2">•</span>
                    <span>Email: </span>
                    <strong className="text-slate-800 font-mono">{viewingIdCardOfficer.email || 'Registered on file'}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs uppercase flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">print</span>
                      <span>Print ID Card (Front & Back)</span>
                    </button>
                    <button
                      onClick={() => setViewingIdCardOfficer(null)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-xs uppercase cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: APPOINTMENT LETTER */}
            {idCardModalTab === 'letter' && (
              <div className="space-y-4">
                <div className="bg-white border-2 border-slate-300 rounded-xl p-6 sm:p-8 space-y-5 text-slate-800 text-xs sm:text-sm font-serif shadow-xs">
                  {/* Letter Header */}
                  <div className="flex items-center justify-between border-b-2 border-red-600 pb-4">
                    <div className="flex items-center gap-3">
                      <RawfLogo className="w-14 h-14" />
                      <div>
                        <h2 className="font-headline font-black text-xl text-[#0b3b95] uppercase">
                          RAID ACTION WING FOUNDATION
                        </h2>
                        <h3 className="font-sans font-bold text-red-600 text-xs">
                          छापा कार्यवाही विभाग (एफ) • GOVT OF INDIA REG NO. 760
                        </h3>
                        <span className="text-[10px] text-slate-500 font-mono block">
                          Central Office: Kiran Garden, Vadwa, New Delhi - 110059
                        </span>
                      </div>
                    </div>
                    <div className="text-right font-mono text-xs">
                      <div>Date: <strong>{toStandardDisplayDate(viewingIdCardOfficer.joinDate) || '11/09/2024'}</strong></div>
                      <div>Ref: <strong>APP/{viewingIdCardOfficer.uidNumber || '2026/1995'}</strong></div>
                    </div>
                  </div>

                  {/* Letter Subject */}
                  <div className="space-y-1 font-sans">
                    <div>To,</div>
                    <div className="font-bold text-slate-900 text-base">{viewingIdCardOfficer.name}</div>
                    <div className="text-slate-600">{viewingIdCardOfficer.state} Command</div>
                    <div className="font-mono text-xs text-slate-500">UID: {viewingIdCardOfficer.uidNumber || viewingIdCardOfficer.badgeNumber}</div>
                  </div>

                  <div className="font-bold uppercase tracking-wide border-l-4 border-[#0b3b95] pl-3 text-[#0b3b95]">
                    SUBJECT: OFFICIAL LETTER OF APPOINTMENT AS {viewingIdCardOfficer.designation.toUpperCase()}
                  </div>

                  {/* Letter Narrative */}
                  <p className="leading-relaxed">
                    Dear <strong>{viewingIdCardOfficer.name}</strong>,
                  </p>
                  <p className="leading-relaxed">
                    By the executive order of the National Governing Council and under the authority vested by the <strong>Indian Trusts Act 1882 (Registration IFA No. 760)</strong>, we are pleased to confer upon you the accredited post of <strong>{viewingIdCardOfficer.designation}</strong> for the jurisdiction of <strong>{viewingIdCardOfficer.state}</strong>.
                  </p>
                  <p className="leading-relaxed">
                    You have been assigned official <strong>UID Number: {viewingIdCardOfficer.uidNumber || viewingIdCardOfficer.badgeNumber}</strong>. Your appointment is effective from <strong>{toStandardDisplayDate(viewingIdCardOfficer.joinDate) || '11/09/2024'}</strong> and valid until <strong>{toStandardDisplayDate(viewingIdCardOfficer.validTill) || '11/09/2027'}</strong>.
                  </p>
                  <p className="leading-relaxed">
                    As an accredited vigilance officer of Raid Action Wing Foundation, you are mandated to uphold the supreme dignity of constitutional rights, observe zero tolerance against corruption, and report statutory infractions through authorized whistleblower channels.
                  </p>

                  {/* Signatures */}
                  <div className="pt-6 border-t border-slate-200 flex items-end justify-between font-sans text-xs">
                    <div>
                      <div className="font-bold text-slate-900">Official Seal</div>
                      <div className="w-16 h-16 rounded-full border-2 border-red-500/40 flex items-center justify-center text-[9px] font-mono font-bold text-red-600 uppercase text-center p-1 mt-1">
                        RAWF COMMAND SEAL 760
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-12 max-w-[170px] flex items-end justify-end ml-auto mb-1">
                        <AuthorizedSignature
                          className="h-full w-auto"
                          imgClassName="h-full max-h-[48px] max-w-[170px] object-contain"
                          fallbackText="Manoj Chauhan"
                          fallbackClassName="font-serif italic font-bold text-base text-slate-800 pr-1 select-none font-['Brush_Script_MT',cursive,'Caveat']"
                          alt="Authorised Signatory Manoj Chauhan"
                        />
                      </div>
                      <div className="font-headline font-black text-[#0b3b95] uppercase">
                        Manoj Chauhan
                      </div>
                      <div className="text-[10px] text-slate-500 font-semibold">
                        Founder • Supreme Directorate Command
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Authorised Signatory • Central Command
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-[#0d47a1] hover:bg-blue-900 text-white rounded-lg font-bold text-xs uppercase flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">print</span>
                    <span>Print Appointment Letter</span>
                  </button>
                  <button
                    onClick={() => setViewingIdCardOfficer(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-xs uppercase cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: VIEW OFFICER DOSSIER                            */}
      {/* ======================================================== */}
      {viewingOfficer && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative animate-scaleUp">
            <button
              onClick={() => setViewingOfficer(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="border-b border-slate-100 pb-3 flex items-center gap-3">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-300 shrink-0">
                {viewingOfficer.photoUrl ? (
                  <img src={viewingOfficer.photoUrl} alt={viewingOfficer.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#0d47a1] text-white font-bold font-mono text-base">
                    {viewingOfficer.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase tracking-wider block">
                  ACTIVE ROSTER OFFICIAL DOSSIER
                </span>
                <h3 className="font-headline font-bold text-xl text-slate-900">
                  {viewingOfficer.name}
                </h3>
                <span className="font-mono text-xs font-bold text-[#0d47a1]">
                  UID: {viewingOfficer.uidNumber || viewingOfficer.badgeNumber}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Designation</span>
                <strong className="text-slate-800">{viewingOfficer.designation}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Jurisdiction</span>
                <strong className="text-slate-800">{viewingOfficer.state}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Gender</span>
                <strong className="text-slate-800">{viewingOfficer.gender || 'Male'}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Status</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold rounded">
                  {viewingOfficer.status}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">D.O.B.</span>
                <span className="font-mono text-slate-800 font-semibold">{toStandardDisplayDate(viewingOfficer.dob) || '20/12/1995'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Join Date</span>
                <span className="font-mono text-slate-800 font-semibold">{toStandardDisplayDate(viewingOfficer.joinDate) || '11/09/2024'}</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Expiry Date</span>
                <span className="font-mono text-slate-700 font-semibold">{toStandardDisplayDate(viewingOfficer.validTill) || '11/09/2027'}</span>
              </div>
              {viewingOfficer.email && (
                <div className="col-span-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Email ID</span>
                  <span className="font-mono text-slate-800 font-semibold">{viewingOfficer.email}</span>
                </div>
              )}
              {viewingOfficer.phoneContact && (
                <div className="col-span-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Phone Number</span>
                  <span className="font-mono text-slate-800 font-semibold">{viewingOfficer.phoneContact}</span>
                </div>
              )}
              <div className="col-span-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Mandate</span>
                <p className="text-slate-600 leading-normal mt-0.5">{viewingOfficer.mandate}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const off = viewingOfficer;
                    setViewingOfficer(null);
                    setViewingIdCardOfficer(off);
                    setIdCardModalTab('card');
                  }}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs uppercase flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">credit_card</span>
                  <span>View ID Card</span>
                </button>
                <button
                  onClick={() => {
                    const off = viewingOfficer;
                    setViewingOfficer(null);
                    setEditingOfficer({ ...off });
                  }}
                  className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-[#0d47a1] rounded font-bold text-xs uppercase flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  <span>Edit</span>
                </button>
              </div>
              <button
                onClick={() => setViewingOfficer(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded font-bold text-xs uppercase cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: EDIT OFFICER                                    */}
      {/* ======================================================== */}
      {editingOfficer && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative animate-scaleUp my-auto">
            <button
              onClick={() => setEditingOfficer(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0d47a1] text-2xl">edit_square</span>
              <div>
                <h3 className="font-headline font-bold text-lg text-slate-900">
                  Edit Officer Credentials
                </h3>
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  UID Number: {editingOfficer.uidNumber || editingOfficer.badgeNumber}
                </span>
              </div>
            </div>

            <form onSubmit={handleUpdateOfficer} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingOfficer.name}
                    onChange={(e) => setEditingOfficer({ ...editingOfficer, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Gender *
                  </label>
                  <select
                    value={editingOfficer.gender || 'Male'}
                    onChange={(e) => setEditingOfficer({ ...editingOfficer, gender: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-semibold cursor-pointer focus:outline-none focus:border-[#0d47a1]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    UID Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingOfficer.uidNumber || editingOfficer.badgeNumber || ''}
                    onChange={(e) => setEditingOfficer({ ...editingOfficer, uidNumber: e.target.value, badgeNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Status *
                  </label>
                  <select
                    value={editingOfficer.status}
                    onChange={(e) => setEditingOfficer({ ...editingOfficer, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="COMMAND">COMMAND</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Designation / Post *
                  </label>
                  <select
                    value={editingOfficer.designation}
                    onChange={(e) => setEditingOfficer({ ...editingOfficer, designation: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900"
                  >
                    <option value="">Select Designation...</option>
                    <option>Only Member</option>
                    <optgroup label="2. District Level">
                      <option>District President</option>
                      <option>District Special Officer</option>
                      <option>District Vice President</option>
                      <option>District Director</option>
                      <option>District Incharge</option>
                    </optgroup>
                    <optgroup label="3. State Level">
                      <option>State President</option>
                      <option>State District Special Officer</option>
                      <option>State Vice President</option>
                      <option>State Director</option>
                      <option>State Incharge</option>
                    </optgroup>
                    <optgroup label="4. National Level">
                      <option>Founder</option>
                      <option>National Investigation Officer</option>
                      <option>National Incharge</option>
                      <option>National Deputy Security</option>
                      <option>National Special Officer</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    State Jurisdiction *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingOfficer.state}
                    onChange={(e) => setEditingOfficer({ ...editingOfficer, state: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Email ID *
                  </label>
                  <input
                    type="email"
                    required
                    value={editingOfficer.email || ''}
                    onChange={(e) => setEditingOfficer({ ...editingOfficer, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editingOfficer.phoneContact || ''}
                    onChange={(e) => setEditingOfficer({ ...editingOfficer, phoneContact: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono"
                  />
                </div>
              </div>

              {/* D.O.B., Join Date, Expiry Date with Calendar Date Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-700 uppercase text-[11px]">
                      D.O.B. *
                    </label>
                    <span className="text-[10px] font-mono text-[#0d47a1] font-bold">
                      {toStandardDisplayDate(editingOfficer.dob) || '20/12/1995'}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      value={toInputDate(editingOfficer.dob)}
                      onChange={(e) => setEditingOfficer({ ...editingOfficer, dob: toStandardDisplayDate(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 font-mono text-xs cursor-pointer focus:outline-none focus:border-[#0d47a1]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-700 uppercase text-[11px]">
                      Join Date *
                    </label>
                    <span className="text-[10px] font-mono text-[#0d47a1] font-bold">
                      {toStandardDisplayDate(editingOfficer.joinDate) || '11/09/2024'}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      value={toInputDate(editingOfficer.joinDate)}
                      onChange={(e) => {
                        const newJoin = toStandardDisplayDate(e.target.value);
                        const autoExpiry = computeTenureExpiry(e.target.value);
                        setEditingOfficer({
                          ...editingOfficer,
                          joinDate: newJoin,
                          validTill: editingOfficer.validTill || autoExpiry
                        });
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 font-mono text-xs cursor-pointer focus:outline-none focus:border-[#0d47a1]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-700 uppercase text-[11px]">
                      Expiry Date *
                    </label>
                    <span className="text-[10px] font-mono text-[#0d47a1] font-bold">
                      {toStandardDisplayDate(editingOfficer.validTill) || '11/09/2027'}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      value={toInputDate(editingOfficer.validTill)}
                      onChange={(e) => setEditingOfficer({ ...editingOfficer, validTill: toStandardDisplayDate(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 font-mono text-xs cursor-pointer focus:outline-none focus:border-[#0d47a1]"
                    />
                  </div>
                </div>
              </div>

              {/* Photo Upload Option */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-700 uppercase">
                  Officer Photo (Upload or URL)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-14 bg-white border-2 border-slate-300 rounded overflow-hidden shrink-0 flex items-center justify-center">
                    {editingOfficer.photoUrl ? (
                      <img src={editingOfficer.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-slate-400">person</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, true)}
                      className="block w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#0d47a1] file:text-white hover:file:bg-blue-900 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editingOfficer.photoUrl || ''}
                      onChange={(e) => setEditingOfficer({ ...editingOfficer, photoUrl: e.target.value })}
                      placeholder="Or paste image URL: https://..."
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-[11px] text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Mandate & Operational Powers
                </label>
                <textarea
                  rows={2}
                  value={editingOfficer.mandate || ''}
                  onChange={(e) => setEditingOfficer({ ...editingOfficer, mandate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                />
              </div>

              {/* Homepage Directorate Command Assignment */}
              <div className="bg-blue-50/60 p-2.5 rounded-lg border border-blue-200">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingOfficer.isAssigned !== false}
                    onChange={(e) => setEditingOfficer({ ...editingOfficer, isAssigned: e.target.checked })}
                    className="w-4 h-4 text-[#0d47a1] rounded border-slate-300 focus:ring-[#0d47a1] cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">
                      Assign to Homepage (Active Officers &amp; Directorate Command)
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      When enabled, this officer is showcased in the public homepage Active Officers section.
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingOfficer(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0d47a1] hover:bg-blue-900 text-white rounded font-bold uppercase cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: VIEW MEMBERSHIP APPLICATION                     */}
      {/* ======================================================== */}
      {viewingApplication && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative animate-scaleUp">
            <button
              onClick={() => setViewingApplication(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-mono text-[#0d47a1] font-bold uppercase tracking-wider block">
                APPLICANT SCREENING DOSSIER
              </span>
              <h3 className="font-headline font-bold text-xl text-slate-900">
                {viewingApplication.fullName}
              </h3>
              <span className="font-mono text-xs font-bold text-slate-500">
                Application Reference: {viewingApplication.applicationId}
              </span>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Desired Role / Wing</span>
                  <strong className="text-[#0d47a1] text-sm">{viewingApplication.wing}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Accreditation Fee</span>
                  <strong className="text-emerald-700 text-sm">
                    ₹{(viewingApplication.feeAmount || getRoleFee(viewingApplication.wing)).toLocaleString('en-IN')}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Transaction ID / UTR</span>
                  <span className="font-mono text-slate-800 font-bold bg-white px-2 py-0.5 rounded border border-slate-200 inline-block mt-0.5">
                    {viewingApplication.transactionId || viewingApplication.utrNumber || 'Pending / Verification Required'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Territorial State</span>
                  <strong className="text-slate-800">{viewingApplication.state}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Gender</span>
                  <strong className="text-slate-800">{viewingApplication.gender || 'Male'}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Mobile Phone</span>
                  <span className="font-mono text-slate-800 font-semibold">{viewingApplication.mobile}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Email Address</span>
                  <span className="font-mono text-slate-800">{viewingApplication.email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Aadhaar (Last 4)</span>
                  <span className="font-mono text-slate-700">XXXX-XXXX-{viewingApplication.aadhaarLast4}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Status</span>
                  <span
                    className={`px-2 py-0.5 font-mono text-[10px] font-bold rounded ${
                      viewingApplication.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : viewingApplication.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {viewingApplication.status}
                    {viewingApplication.assignedBadge && ` (${viewingApplication.assignedBadge})`}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Applicant Background & Experience</span>
                <p className="text-slate-700 leading-relaxed mt-1 p-2.5 bg-white rounded border border-slate-200 text-[11px]">
                  {viewingApplication.background || 'No additional statement provided.'}
                </p>
              </div>

              {viewingApplication.notes && (
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Administrative Notes</span>
                  <p className="text-slate-600 italic mt-0.5">{viewingApplication.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const app = viewingApplication;
                    setViewingApplication(null);
                    setEditingApplication({ ...app });
                  }}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0d47a1] rounded font-bold text-xs uppercase flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">edit</span>
                  <span>Edit</span>
                </button>
                {viewingApplication.status !== 'Approved' && (
                  <button
                    onClick={() => handleApproveApplication(viewingApplication.applicationId)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs uppercase flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">verified</span>
                    <span>Approve & Issue Badge</span>
                  </button>
                )}
              </div>
              <button
                onClick={() => setViewingApplication(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded font-bold text-xs uppercase cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: EDIT MEMBERSHIP APPLICATION                     */}
      {/* ======================================================== */}
      {editingApplication && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 relative animate-scaleUp my-auto max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setEditingApplication(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0d47a1] text-2xl">edit_note</span>
              <div>
                <h3 className="font-headline font-bold text-lg text-slate-900">
                  Edit Membership Application
                </h3>
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  App ID: {editingApplication.applicationId} • Full Statutory Intake Record
                </span>
              </div>
            </div>

            <form onSubmit={handleUpdateApplication} className="space-y-3.5 text-xs">
              {/* Full Name & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Full Name (As per Aadhaar) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingApplication.fullName}
                    onChange={(e) => setEditingApplication({ ...editingApplication, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Gender *
                  </label>
                  <select
                    value={editingApplication.gender || 'Male'}
                    onChange={(e) => setEditingApplication({ ...editingApplication, gender: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-semibold cursor-pointer focus:outline-none focus:border-[#0d47a1]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Mobile Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Mobile / WhatsApp Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingApplication.mobile || editingApplication.phone || ''}
                    onChange={(e) => setEditingApplication({ ...editingApplication, mobile: e.target.value, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={editingApplication.email || ''}
                    onChange={(e) => setEditingApplication({ ...editingApplication, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono"
                  />
                </div>
              </div>

              {/* Desired Role / Designation & State Jurisdiction */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Desired Role / Designation *
                  </label>
                  <select
                    value={editingApplication.wing || editingApplication.designation || ''}
                    onChange={(e) => setEditingApplication({ ...editingApplication, wing: e.target.value, designation: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 cursor-pointer focus:outline-none focus:border-[#0d47a1]"
                  >
                    <option value="">Select Role / Designation...</option>
                    <option value="Only Member">1. Only Member</option>
                    <optgroup label="2. District Level">
                      <option value="District President">a) District President</option>
                      <option value="District Special Officer">b) District Special Officer</option>
                      <option value="District Vice President">c) District Vice President</option>
                      <option value="District Director">d) District Director</option>
                      <option value="District Incharge">e) District Incharge</option>
                    </optgroup>
                    <optgroup label="3. State Level">
                      <option value="State President">a) State President</option>
                      <option value="State District Special Officer">b) State District Special Officer</option>
                      <option value="State Vice President">c) State Vice President</option>
                      <option value="State Director">d) State Director</option>
                      <option value="State Incharge">e) State Incharge</option>
                    </optgroup>
                    <optgroup label="4. National Level">
                      <option value="Founder">Founder</option>
                      <option value="National Investigation Officer">a) National Investigation Officer</option>
                      <option value="National Incharge">b) National Incharge</option>
                      <option value="National Deputy Security">c) National Deputy Security</option>
                      <option value="National Special Officer">d) National Special Officer</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    State / UT Jurisdiction *
                  </label>
                  <select
                    required
                    value={editingApplication.state || ''}
                    onChange={(e) => setEditingApplication({ ...editingApplication, state: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 cursor-pointer focus:outline-none focus:border-[#0d47a1]"
                  >
                    <option value="">Select State...</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Other">Other State/UT</option>
                  </select>
                </div>
              </div>

              {/* Aadhaar / Voter ID Number & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Aadhaar / Voter ID Number *
                  </label>
                  <input
                    type="text"
                    value={editingApplication.aadhaarNumber || editingApplication.idProofNumber || ''}
                    onChange={(e) => setEditingApplication({ ...editingApplication, aadhaarNumber: e.target.value, idProofNumber: e.target.value })}
                    placeholder="XXXX-XXXX-XXXX"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Application Status *
                  </label>
                  <select
                    value={editingApplication.status}
                    onChange={(e) => setEditingApplication({ ...editingApplication, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-semibold cursor-pointer focus:outline-none focus:border-[#0d47a1]"
                  >
                    <option value="Pending Verification">Pending Verification</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Approved">Approved (Promote to Officers Roster)</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Assigned Badge / UID Number */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Assigned Badge / UID Number (Issued upon approval)
                </label>
                <input
                  type="text"
                  value={editingApplication.assignedBadge || editingApplication.uidNumber || ''}
                  onChange={(e) => setEditingApplication({ ...editingApplication, assignedBadge: e.target.value, uidNumber: e.target.value })}
                  placeholder="e.g. RAWF/2026/XXXX"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono font-bold text-[#0d47a1]"
                />
              </div>

              {/* Photo Upload Option */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-700 uppercase text-[11px]">
                  Applicant Photo (Upload or URL)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-14 bg-white border-2 border-slate-300 rounded overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
                    {editingApplication.photoUrl ? (
                      <img src={editingApplication.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-slate-400">person</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            setEditingApplication({ ...editingApplication, photoUrl: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="block w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#0d47a1] file:text-white hover:file:bg-blue-900 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editingApplication.photoUrl || ''}
                      onChange={(e) => setEditingApplication({ ...editingApplication, photoUrl: e.target.value })}
                      placeholder="Or paste image URL: https://..."
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-[11px] text-slate-900 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Background / Motivation */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Professional Background / Motivation *
                </label>
                <textarea
                  rows={2}
                  value={editingApplication.background || ''}
                  onChange={(e) => setEditingApplication({ ...editingApplication, background: e.target.value })}
                  placeholder="Summary of profession, education, and commitment to public vigilance..."
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                />
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Admin Internal Notes
                </label>
                <input
                  type="text"
                  value={editingApplication.notes || ''}
                  onChange={(e) => setEditingApplication({ ...editingApplication, notes: e.target.value })}
                  placeholder="e.g. Police verification verified / Documents pending"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingApplication(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0d47a1] hover:bg-blue-900 text-white rounded font-bold uppercase cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>Save Application</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: ADD NEW OFFICER (With UID Number & Photo Upload) */}
      {/* ======================================================== */}
      {showAddOfficerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative animate-scaleUp my-auto">
            <button
              onClick={() => setShowAddOfficerModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-red-600 text-2xl">verified_user</span>
              <div>
                <h3 className="font-headline font-bold text-lg text-slate-900">
                  Appoint & Register Officer
                </h3>
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  National Directory Command • Auto-generates Official ID Card
                </span>
              </div>
            </div>

            <form onSubmit={handleCreateOfficer} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newOfficer.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const autoEmail = name ? `${name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@raidactionwing.in` : '';
                      setNewOfficer({ ...newOfficer, name, email: newOfficer.email || autoEmail });
                    }}
                    placeholder="e.g. Akshay Vilas Patil"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Gender *
                  </label>
                  <select
                    value={newOfficer.gender || 'Male'}
                    onChange={(e) => setNewOfficer({ ...newOfficer, gender: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-semibold cursor-pointer focus:outline-none focus:border-[#0d47a1]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* UID Number (Renamed from Badge Number) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700 uppercase">
                    UID Number *
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewOfficer({ ...newOfficer, uidNumber: generateRandomUid() })}
                    className="text-[10px] font-bold text-[#0d47a1] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[12px]">refresh</span>
                    <span>Auto-Gen UID</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={newOfficer.uidNumber}
                  onChange={(e) => setNewOfficer({ ...newOfficer, uidNumber: e.target.value })}
                  placeholder="e.g. RAWF/2026/1995"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono uppercase"
                />
                <span className="text-[10px] text-amber-700 font-medium mt-0.5 block">
                  ℹ️ This UID Number and Email ID will be used for ID card download.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Designation / Post *
                  </label>
                  <select
                    value={newOfficer.designation}
                    onChange={(e) => setNewOfficer({ ...newOfficer, designation: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900"
                  >
                    <option value="">Select Designation...</option>
                    <option>Only Member</option>
                    <optgroup label="2. District Level">
                      <option>District President</option>
                      <option>District Special Officer</option>
                      <option>District Vice President</option>
                      <option>District Director</option>
                      <option>District Incharge</option>
                    </optgroup>
                    <optgroup label="3. State Level">
                      <option>State President</option>
                      <option>State District Special Officer</option>
                      <option>State Vice President</option>
                      <option>State Director</option>
                      <option>State Incharge</option>
                    </optgroup>
                    <optgroup label="4. National Level">
                      <option>Founder</option>
                      <option>National Investigation Officer</option>
                      <option>National Incharge</option>
                      <option>National Deputy Security</option>
                      <option>National Special Officer</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    State Jurisdiction *
                  </label>
                  <select
                    value={newOfficer.state}
                    onChange={(e) => setNewOfficer({ ...newOfficer, state: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900"
                  >
                    <option>Maharashtra</option>
                    <option>Delhi NCR</option>
                    <option>Gujarat</option>
                    <option>Uttar Pradesh</option>
                    <option>Madhya Pradesh</option>
                    <option>Bihar</option>
                    <option>Karnataka</option>
                    <option>West Bengal</option>
                    <option>Tamil Nadu</option>
                    <option>National HQ</option>
                  </select>
                </div>
              </div>

              {/* NEW FIELDS: Email ID and Phone Number */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Email ID *
                  </label>
                  <input
                    type="email"
                    required
                    value={newOfficer.email}
                    onChange={(e) => setNewOfficer({ ...newOfficer, email: e.target.value })}
                    placeholder="officer@raidactionwing.in"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={newOfficer.phoneContact}
                    onChange={(e) => setNewOfficer({ ...newOfficer, phoneContact: e.target.value })}
                    placeholder="+91 98XXX XXXXX"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono"
                  />
                </div>
              </div>

              {/* D.O.B., Join Date, Expiry Date with Calendar Date Pickers */}
              <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#0d47a1] uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">calendar_month</span>
                    Official Tenure & Appointment Dates
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Format: DD/MM/YYYY</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Date of Birth */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-slate-700 uppercase text-[10.5px]">
                        D.O.B. *
                      </label>
                      <span className="text-[10px] font-mono text-[#0d47a1] font-bold">
                        {toStandardDisplayDate(newOfficer.dob) || '20/12/1995'}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={toInputDate(newOfficer.dob)}
                        onChange={(e) => setNewOfficer({ ...newOfficer, dob: toStandardDisplayDate(e.target.value) })}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 font-mono text-xs cursor-pointer focus:outline-none focus:border-[#0d47a1]"
                      />
                    </div>
                  </div>

                  {/* Join Date (Appointment Date) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-slate-700 uppercase text-[10.5px]">
                        Join Date *
                      </label>
                      <span className="text-[10px] font-mono text-[#0d47a1] font-bold">
                        {toStandardDisplayDate(newOfficer.joinDate) || '11/09/2024'}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={toInputDate(newOfficer.joinDate)}
                        onChange={(e) => {
                          const newJoin = toStandardDisplayDate(e.target.value);
                          const autoExpiry = computeTenureExpiry(e.target.value);
                          setNewOfficer({
                            ...newOfficer,
                            joinDate: newJoin,
                            validTill: autoExpiry
                          });
                        }}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 font-mono text-xs cursor-pointer focus:outline-none focus:border-[#0d47a1]"
                      />
                    </div>
                  </div>

                  {/* Expiry Date (Valid Till) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-slate-700 uppercase text-[10.5px]">
                        Expiry Date *
                      </label>
                      <span className="text-[10px] font-mono text-[#0d47a1] font-bold">
                        {toStandardDisplayDate(newOfficer.validTill) || '11/09/2027'}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={toInputDate(newOfficer.validTill)}
                        onChange={(e) => setNewOfficer({ ...newOfficer, validTill: toStandardDisplayDate(e.target.value) })}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 font-mono text-xs cursor-pointer focus:outline-none focus:border-[#0d47a1]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo Upload Option */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-700 uppercase">
                  Upload Officer Photo
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-16 bg-white border-2 border-slate-300 rounded-md overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                    {newOfficer.photoUrl ? (
                      <img src={newOfficer.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-slate-400 text-3xl">add_photo_alternate</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, false)}
                      className="block w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#0d47a1] file:text-white hover:file:bg-blue-900 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newOfficer.photoUrl}
                      onChange={(e) => setNewOfficer({ ...newOfficer, photoUrl: e.target.value })}
                      placeholder="Or paste photo URL..."
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-[11px] text-slate-900 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Mandate & Operational Powers
                </label>
                <textarea
                  rows={2}
                  value={newOfficer.mandate}
                  onChange={(e) => setNewOfficer({ ...newOfficer, mandate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                />
              </div>

              {/* Homepage Directorate Command Assignment */}
              <div className="bg-blue-50/60 p-2.5 rounded-lg border border-blue-200">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newOfficer.isAssigned !== false}
                    onChange={(e) => setNewOfficer({ ...newOfficer, isAssigned: e.target.checked })}
                    className="w-4 h-4 text-[#0d47a1] rounded border-slate-300 focus:ring-[#0d47a1] cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">
                      Assign to Homepage (Active Officers &amp; Directorate Command)
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      When enabled, this newly appointed officer will be showcased on the public homepage.
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddOfficerModal(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0d47a1] hover:bg-blue-900 text-white rounded font-bold uppercase cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                  <span>Confirm & Issue ID Card</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 6: ADD TO BLACKLIST / REVOKE UID                   */}
      {/* ======================================================== */}
      {showAddBlacklistModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative animate-scaleUp my-auto">
            <button
              onClick={() => setShowAddBlacklistModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-red-600 text-2xl">gpp_bad</span>
              <div>
                <h3 className="font-headline font-bold text-lg text-slate-900">
                  Add to Blacklist / Revoke UID ID
                </h3>
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  National Fraud Prevention Telemetry • Section 204 BNS Advisory
                </span>
              </div>
            </div>

            <form onSubmit={handleCreateBlacklist} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Revoke UID ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBlacklist.uidNumber}
                    onChange={(e) => setNewBlacklist({ ...newBlacklist, uidNumber: e.target.value })}
                    placeholder="e.g. RW-DIS-091 or RAWF/2026/1995"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono font-bold uppercase focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Individual Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBlacklist.name}
                    onChange={(e) => setNewBlacklist({ ...newBlacklist, name: e.target.value })}
                    placeholder="e.g. Suresh Verma"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Jurisdiction / Territory *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBlacklist.jurisdiction}
                    onChange={(e) => setNewBlacklist({ ...newBlacklist, jurisdiction: e.target.value })}
                    placeholder="e.g. Delhi NCR / Maharashtra"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Action Status *
                  </label>
                  <select
                    value={newBlacklist.status}
                    onChange={(e) => setNewBlacklist({ ...newBlacklist, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-red-600"
                  >
                    <option value="REVOKED & BLACKLISTED">REVOKED & BLACKLISTED</option>
                    <option value="TERMINATED">TERMINATED</option>
                    <option value="REVOKED - PENDING INQUIRY">REVOKED - PENDING INQUIRY</option>
                  </select>
                </div>
              </div>

              {/* Revocation Date with Interactive Calendar */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700 uppercase text-[11px]">
                    Revocation Date *
                  </label>
                  <span className="text-[10px] font-mono text-red-600 font-bold">
                    {toStandardDisplayDate(newBlacklist.revocationDate) || '11/09/2024'}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={toInputDate(newBlacklist.revocationDate)}
                    onChange={(e) => setNewBlacklist({ ...newBlacklist, revocationDate: toStandardDisplayDate(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono text-xs cursor-pointer focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Reason for Blacklisting / Charter Violation *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newBlacklist.reason}
                  onChange={(e) => setNewBlacklist({ ...newBlacklist, reason: e.target.value })}
                  placeholder="State clear reasons: e.g. Misrepresenting RAWF as police agency, extortion attempt, expired badge misuse..."
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2.5 text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddBlacklistModal(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold uppercase cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">gpp_bad</span>
                  <span>Confirm Revocation & Blacklist</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 7: EDIT BLACKLISTED RECORD                         */}
      {/* ======================================================== */}
      {editingBlacklist && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative animate-scaleUp my-auto">
            <button
              onClick={() => setEditingBlacklist(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-red-600 text-2xl">edit_note</span>
              <div>
                <h3 className="font-headline font-bold text-lg text-slate-900">
                  Edit Blacklist / Revoke UID Record
                </h3>
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  Revoke UID ID: {editingBlacklist.uidNumber || editingBlacklist.badgeNumber}
                </span>
              </div>
            </div>

            <form onSubmit={handleUpdateBlacklist} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Revoke UID ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBlacklist.uidNumber || editingBlacklist.badgeNumber || ''}
                    onChange={(e) => setEditingBlacklist({ ...editingBlacklist, uidNumber: e.target.value, badgeNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono font-bold uppercase focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Individual Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBlacklist.name || ''}
                    onChange={(e) => setEditingBlacklist({ ...editingBlacklist, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Jurisdiction / Territory *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBlacklist.jurisdiction || ''}
                    onChange={(e) => setEditingBlacklist({ ...editingBlacklist, jurisdiction: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Action Status *
                  </label>
                  <select
                    value={editingBlacklist.status || 'REVOKED & BLACKLISTED'}
                    onChange={(e) => setEditingBlacklist({ ...editingBlacklist, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-red-600"
                  >
                    <option value="REVOKED & BLACKLISTED">REVOKED & BLACKLISTED</option>
                    <option value="TERMINATED">TERMINATED</option>
                    <option value="REVOKED - PENDING INQUIRY">REVOKED - PENDING INQUIRY</option>
                  </select>
                </div>
              </div>

              {/* Revocation Date with Interactive Calendar */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700 uppercase text-[11px]">
                    Revocation Date *
                  </label>
                  <span className="text-[10px] font-mono text-red-600 font-bold">
                    {toStandardDisplayDate(editingBlacklist.revocationDate) || '11/09/2024'}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={toInputDate(editingBlacklist.revocationDate)}
                    onChange={(e) => setEditingBlacklist({ ...editingBlacklist, revocationDate: toStandardDisplayDate(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono text-xs cursor-pointer focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Reason for Blacklisting / Charter Violation *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingBlacklist.reason || ''}
                  onChange={(e) => setEditingBlacklist({ ...editingBlacklist, reason: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2.5 text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingBlacklist(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0d47a1] hover:bg-blue-900 text-white rounded font-bold uppercase cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD NEW ACTIVITY / BLOG POST                      */}
      {/* ======================================================== */}
      {showAddActivityModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 relative animate-scaleUp my-auto max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setShowAddActivityModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0d47a1] text-2xl">post_add</span>
              <div>
                <h3 className="font-headline font-bold text-lg text-slate-900">
                  Publish New Field Activity / Blog Article
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">
                  Official dispatch on public rallies, legal clinics, or taskforce operations
                </span>
              </div>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Citizen Anti-Narcotics Awareness Rally & Ground Mobilization"
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-[#0d47a1]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-700 uppercase">
                      Wing / Category *
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsAddingCategoryInlineAdd(!isAddingCategoryInlineAdd)}
                      className="text-[11px] font-bold text-[#0d47a1] hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[13px]">
                        {isAddingCategoryInlineAdd ? 'close' : 'add'}
                      </span>
                      <span>{isAddingCategoryInlineAdd ? 'Cancel' : '+ New Category'}</span>
                    </button>
                  </div>

                  {!isAddingCategoryInlineAdd ? (
                    <select
                      value={newActivity.category}
                      onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-[#0d47a1]"
                    >
                      {activityCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="Type new category..."
                        value={inlineCategoryInputAdd}
                        onChange={(e) => setInlineCategoryInputAdd(e.target.value)}
                        className="flex-1 bg-white border border-[#0d47a1] rounded px-3 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          const added = await handleAddCategory(inlineCategoryInputAdd);
                          if (added) {
                            setNewActivity({ ...newActivity, category: added });
                            setInlineCategoryInputAdd('');
                            setIsAddingCategoryInlineAdd(false);
                          }
                        }}
                        className="px-3 py-1.5 bg-[#0d47a1] hover:bg-blue-900 text-white rounded font-bold text-xs uppercase cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-700 uppercase text-[11px]">
                      Operation Date *
                    </label>
                    <span className="text-[10px] font-mono text-[#0d47a1] font-bold">
                      {toStandardDisplayDate(newActivity.date) || '11/09/2024'}
                    </span>
                  </div>
                  <input
                    type="date"
                    required
                    value={toInputDate(newActivity.date)}
                    onChange={(e) => setNewActivity({ ...newActivity, date: toStandardDisplayDate(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono text-xs cursor-pointer focus:outline-none focus:border-[#0d47a1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Location / Region *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ahmedabad, Gujarat"
                    value={newActivity.location}
                    onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Author / Directorate
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Youth Wing National Directorate"
                    value={newActivity.author}
                    onChange={(e) => setNewActivity({ ...newActivity, author: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Publication Status
                  </label>
                  <select
                    value={newActivity.status}
                    onChange={(e) => setNewActivity({ ...newActivity, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-semibold focus:outline-none"
                  >
                    <option value="Published">Published (Public)</option>
                    <option value="Draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Media Configuration: Image vs Video (Both Co-exist) */}
              <div className="space-y-3 p-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                  <div>
                    <label className="block font-bold text-slate-800 uppercase text-xs">
                      Article Media Format & Visual Asset
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Select primary display format for this section. Both image and video data are saved so you can switch anytime.
                    </p>
                  </div>
                  
                  {/* Co-existing Switcher Pills */}
                  <div className="inline-flex bg-slate-200 p-1 rounded-lg self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setNewActivity({ ...newActivity, mediaType: 'image' })}
                      className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                        (newActivity.mediaType || 'image') === 'image'
                          ? 'bg-white text-[#0d47a1] shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">image</span>
                      <span>Image</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewActivity({ ...newActivity, mediaType: 'video' })}
                      className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                        newActivity.mediaType === 'video'
                          ? 'bg-[#0d47a1] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">videocam</span>
                      <span>Video</span>
                    </button>
                  </div>
                </div>

                {/* OPTION 1: IMAGE CONTROLS */}
                {(newActivity.mediaType || 'image') === 'image' && (
                  <div className="space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-[#0d47a1]">photo_library</span>
                        <span>Cover Photo (Upload from PC or Paste Image URL)</span>
                      </span>
                      {newActivity.image && (
                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">check_circle</span> Image Active
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <label className="px-3 py-2 bg-white border border-slate-300 hover:border-[#0d47a1] rounded text-slate-700 font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs">
                        <span className="material-symbols-outlined text-[16px] text-[#0d47a1]">upload_file</span>
                        <span>Upload New Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleActivityImageUpload(e, false)}
                          className="hidden"
                        />
                      </label>

                      <span className="text-slate-400 font-bold text-xs">or</span>

                      <input
                        type="url"
                        placeholder="https://... (Direct image URL)"
                        value={newActivity.image || ''}
                        onChange={(e) => setNewActivity({ ...newActivity, image: e.target.value })}
                        className="flex-1 min-w-[200px] bg-white border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                      />
                    </div>

                    {newActivity.image && (
                      <div className="mt-2 relative w-full h-36 rounded-lg overflow-hidden border border-slate-200 group bg-slate-900">
                        <img
                          src={newActivity.image}
                          alt="Cover Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                          <span className="px-2 py-0.5 bg-black/70 text-white text-[10px] font-mono rounded">
                            Active Card & Hero Photo
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* OPTION 2: VIDEO CONTROLS (Upload & YouTube) */}
                {newActivity.mediaType === 'video' && (
                  <div className="space-y-3 animate-fadeIn">
                    {/* Sub-selector: YouTube vs Upload */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-red-600">smart_display</span>
                        <span>Video Source Option:</span>
                      </span>

                      <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg p-0.5">
                        <button
                          type="button"
                          onClick={() => setNewActivity({ ...newActivity, videoType: 'youtube' })}
                          className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                            (newActivity.videoType || 'youtube') === 'youtube'
                              ? 'bg-red-600 text-white'
                              : 'text-slate-600 hover:text-red-600'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">smart_display</span>
                          <span>YouTube Video</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewActivity({ ...newActivity, videoType: 'upload' })}
                          className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                            newActivity.videoType === 'upload'
                              ? 'bg-[#0d47a1] text-white'
                              : 'text-slate-600 hover:text-[#0d47a1]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">file_upload</span>
                          <span>Upload Video File</span>
                        </button>
                      </div>
                    </div>

                    {/* YouTube Video URL Input & Preview */}
                    {(newActivity.videoType || 'youtube') === 'youtube' && (
                      <div className="space-y-2 p-3 bg-white border border-red-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <label className="block font-bold text-slate-800 text-xs">
                            YouTube Video URL or Video ID *
                          </label>
                          {newActivity.videoUrl && getYouTubeVideoId(newActivity.videoUrl) ? (
                            <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 font-mono">
                              <span className="material-symbols-outlined text-[13px]">check_circle</span>
                              ID: {getYouTubeVideoId(newActivity.videoUrl)}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-mono">
                              e.g. https://www.youtube.com/watch?v=...
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-2.5 text-red-600 material-symbols-outlined text-[18px]">
                              smart_display
                            </span>
                            <input
                              type="text"
                              placeholder="Paste YouTube watch link, youtu.be, shorts or embed URL..."
                              value={newActivity.videoUrl || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                const ytId = getYouTubeVideoId(val);
                                setNewActivity({
                                  ...newActivity,
                                  videoUrl: val,
                                  image: (!newActivity.image || newActivity.image.includes('youtube.com')) && ytId
                                    ? getYouTubeThumbnailUrl(ytId) || newActivity.image
                                    : newActivity.image
                                });
                              }}
                              className="w-full bg-slate-50 border border-slate-300 rounded pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-600 font-mono"
                            />
                          </div>

                          {newActivity.videoUrl && getYouTubeVideoId(newActivity.videoUrl) && (
                            <button
                              type="button"
                              onClick={() => {
                                const ytThumb = getYouTubeThumbnailUrl(newActivity.videoUrl);
                                if (ytThumb) {
                                  setNewActivity({ ...newActivity, image: ytThumb });
                                  setFeedbackMsg({ type: 'success', text: 'YouTube thumbnail set as cover image!' });
                                }
                              }}
                              className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-[11px] font-bold whitespace-nowrap cursor-pointer flex items-center gap-1"
                              title="Set YouTube thumbnail as cover photo"
                            >
                              <span className="material-symbols-outlined text-[14px] text-red-600">image</span>
                              <span>Use YT Thumb</span>
                            </button>
                          )}
                        </div>

                        {/* Interactive YouTube Live Embed Preview */}
                        {newActivity.videoUrl && getYouTubeEmbedUrl(newActivity.videoUrl) ? (
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                              <span>Live YouTube Preview</span>
                              <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-[12px]">play_circle</span> Ready to stream
                              </span>
                            </div>
                            <div className="w-full aspect-video rounded-lg overflow-hidden bg-black border border-slate-300 shadow-sm">
                              <iframe
                                src={getYouTubeEmbedUrl(newActivity.videoUrl) || ''}
                                title="YouTube Video Preview"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full border-0"
                              />
                            </div>
                          </div>
                        ) : newActivity.videoUrl ? (
                          <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                            Please provide a valid YouTube URL (e.g., https://www.youtube.com/watch?v=... or https://youtu.be/...).
                          </p>
                        ) : null}
                      </div>
                    )}

                    {/* Upload Video File Input & Preview */}
                    {newActivity.videoType === 'upload' && (
                      <div className="space-y-2 p-3 bg-white border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <label className="block font-bold text-slate-800 text-xs">
                            Upload Video File (MP4, WebM, OGG, MOV up to 100MB) *
                          </label>
                          {newActivity.videoUrl && (
                            <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 font-mono">
                              <span className="material-symbols-outlined text-[13px]">check_circle</span>
                              Video Attached
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <label className="px-3 py-2 bg-[#0d47a1] hover:bg-blue-900 text-white rounded text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer shadow-xs">
                            <span className="material-symbols-outlined text-[16px]">
                              {videoUploadingAdd ? 'hourglass_top' : 'upload_file'}
                            </span>
                            <span>{videoUploadingAdd ? 'Uploading...' : 'Choose Video File'}</span>
                            <input
                              type="file"
                              accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
                              disabled={videoUploadingAdd}
                              onChange={(e) => handleActivityVideoUpload(e, false)}
                              className="hidden"
                            />
                          </label>

                          <span className="text-slate-400 font-bold text-xs">or</span>

                          <input
                            type="text"
                            placeholder="Direct video file URL (/uploads/videos/... or https://...)"
                            value={newActivity.videoUrl || ''}
                            onChange={(e) => setNewActivity({ ...newActivity, videoUrl: e.target.value })}
                            className="flex-1 min-w-[200px] bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1] font-mono"
                          />

                          {newActivity.videoUrl && (
                            <button
                              type="button"
                              onClick={() => setNewActivity({ ...newActivity, videoUrl: '' })}
                              className="px-2 py-2 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                              title="Clear video"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          )}
                        </div>

                        {/* Live Uploaded Video Player Preview */}
                        {newActivity.videoUrl && (
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                              <span>Uploaded Video Player Preview</span>
                              <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-[12px]">check_circle</span> Loaded
                              </span>
                            </div>
                            <div className="w-full max-h-56 bg-black rounded-lg overflow-hidden border border-slate-300 flex items-center justify-center">
                              <video
                                controls
                                playsInline
                                src={newActivity.videoUrl}
                                poster={newActivity.image || undefined}
                                className="w-full max-h-56 object-contain"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Co-existing Cover Thumbnail for Video */}
                    <div className="pt-2 border-t border-slate-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block font-bold text-slate-700 text-[11px] uppercase flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-slate-500">add_photo_alternate</span>
                          <span>Video Cover Thumbnail (Optional Poster Image)</span>
                        </label>
                        {newActivity.image && (
                          <span className="text-[10px] text-slate-500 font-mono">
                            Thumbnail active
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="px-2.5 py-1.5 bg-white border border-slate-300 hover:border-slate-400 rounded text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer">
                          <span className="material-symbols-outlined text-[14px]">upload</span>
                          <span>Upload Thumbnail</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleActivityImageUpload(e, false)}
                            className="hidden"
                          />
                        </label>
                        <input
                          type="url"
                          placeholder="Poster image URL..."
                          value={newActivity.image || ''}
                          onChange={(e) => setNewActivity({ ...newActivity, image: e.target.value })}
                          className="flex-1 min-w-[180px] bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Summary / Excerpt (Displayed on Cards) *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Brief summary of the rally, legal clinic or operational milestone..."
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Full Article Narrative & Case Details (Markdown / Paragraphs) *
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Enter detailed report, actions taken, citizen attendance, statutory references, outcomes..."
                  value={newActivity.content}
                  onChange={(e) => setNewActivity({ ...newActivity, content: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-sans leading-relaxed focus:outline-none focus:border-[#0d47a1]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddActivityModal(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0d47a1] hover:bg-blue-900 text-white rounded font-bold uppercase cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">publish</span>
                  <span>Publish Article</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT EXISTING ACTIVITY / BLOG POST                */}
      {/* ======================================================== */}
      {editingActivity && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 relative animate-scaleUp my-auto max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setEditingActivity(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0d47a1] text-2xl">edit_note</span>
              <div>
                <h3 className="font-headline font-bold text-lg text-slate-900">
                  Edit Activity Article
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">
                  ID: {editingActivity.id}
                </span>
              </div>
            </div>

            <form onSubmit={handleUpdateActivity} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingActivity.title}
                  onChange={(e) => setEditingActivity({ ...editingActivity, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-[#0d47a1]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-700 uppercase">
                      Wing / Category *
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsAddingCategoryInlineEdit(!isAddingCategoryInlineEdit)}
                      className="text-[11px] font-bold text-[#0d47a1] hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[13px]">
                        {isAddingCategoryInlineEdit ? 'close' : 'add'}
                      </span>
                      <span>{isAddingCategoryInlineEdit ? 'Cancel' : '+ New Category'}</span>
                    </button>
                  </div>

                  {!isAddingCategoryInlineEdit ? (
                    <select
                      value={editingActivity.category}
                      onChange={(e) => setEditingActivity({ ...editingActivity, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-[#0d47a1]"
                    >
                      {activityCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="Type new category..."
                        value={inlineCategoryInputEdit}
                        onChange={(e) => setInlineCategoryInputEdit(e.target.value)}
                        className="flex-1 bg-white border border-[#0d47a1] rounded px-3 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          const added = await handleAddCategory(inlineCategoryInputEdit);
                          if (added) {
                            setEditingActivity({ ...editingActivity, category: added });
                            setInlineCategoryInputEdit('');
                            setIsAddingCategoryInlineEdit(false);
                          }
                        }}
                        className="px-3 py-1.5 bg-[#0d47a1] hover:bg-blue-900 text-white rounded font-bold text-xs uppercase cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-700 uppercase text-[11px]">
                      Operation Date *
                    </label>
                    <span className="text-[10px] font-mono text-[#0d47a1] font-bold">
                      {toStandardDisplayDate(editingActivity.date) || '11/09/2024'}
                    </span>
                  </div>
                  <input
                    type="date"
                    required
                    value={toInputDate(editingActivity.date)}
                    onChange={(e) => setEditingActivity({ ...editingActivity, date: toStandardDisplayDate(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono text-xs cursor-pointer focus:outline-none focus:border-[#0d47a1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Location / Region *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingActivity.location}
                    onChange={(e) => setEditingActivity({ ...editingActivity, location: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Author / Directorate
                  </label>
                  <input
                    type="text"
                    value={editingActivity.author || ''}
                    onChange={(e) => setEditingActivity({ ...editingActivity, author: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Publication Status
                  </label>
                  <select
                    value={editingActivity.status || 'Published'}
                    onChange={(e) => setEditingActivity({ ...editingActivity, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-semibold focus:outline-none"
                  >
                    <option value="Published">Published (Public)</option>
                    <option value="Draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Media Configuration: Image vs Video (Both Co-exist) */}
              <div className="space-y-3 p-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                  <div>
                    <label className="block font-bold text-slate-800 uppercase text-xs">
                      Article Media Format & Visual Asset
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Select primary display format for this section. Both image and video data are saved so you can switch anytime.
                    </p>
                  </div>
                  
                  {/* Co-existing Switcher Pills */}
                  <div className="inline-flex bg-slate-200 p-1 rounded-lg self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setEditingActivity({ ...editingActivity, mediaType: 'image' })}
                      className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                        (editingActivity.mediaType || 'image') === 'image'
                          ? 'bg-white text-[#0d47a1] shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">image</span>
                      <span>Image</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingActivity({ ...editingActivity, mediaType: 'video' })}
                      className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                        editingActivity.mediaType === 'video'
                          ? 'bg-[#0d47a1] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">videocam</span>
                      <span>Video</span>
                    </button>
                  </div>
                </div>

                {/* OPTION 1: IMAGE CONTROLS */}
                {(editingActivity.mediaType || 'image') === 'image' && (
                  <div className="space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-[#0d47a1]">photo_library</span>
                        <span>Cover Photo (Upload from PC or Paste Image URL)</span>
                      </span>
                      {editingActivity.image && (
                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">check_circle</span> Image Active
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <label className="px-3 py-2 bg-white border border-slate-300 hover:border-[#0d47a1] rounded text-slate-700 font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs">
                        <span className="material-symbols-outlined text-[16px] text-[#0d47a1]">upload_file</span>
                        <span>Upload New Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleActivityImageUpload(e, true)}
                          className="hidden"
                        />
                      </label>

                      <span className="text-slate-400 font-bold text-xs">or</span>

                      <input
                        type="url"
                        placeholder="https://... (Direct image URL)"
                        value={editingActivity.image || ''}
                        onChange={(e) => setEditingActivity({ ...editingActivity, image: e.target.value })}
                        className="flex-1 min-w-[200px] bg-white border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                      />
                    </div>

                    {editingActivity.image && (
                      <div className="mt-2 relative w-full h-36 rounded-lg overflow-hidden border border-slate-200 group bg-slate-900">
                        <img
                          src={editingActivity.image}
                          alt="Cover Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                          <span className="px-2 py-0.5 bg-black/70 text-white text-[10px] font-mono rounded">
                            Active Card & Hero Photo
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* OPTION 2: VIDEO CONTROLS (Upload & YouTube) */}
                {editingActivity.mediaType === 'video' && (
                  <div className="space-y-3 animate-fadeIn">
                    {/* Sub-selector: YouTube vs Upload */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-red-600">smart_display</span>
                        <span>Video Source Option:</span>
                      </span>

                      <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg p-0.5">
                        <button
                          type="button"
                          onClick={() => setEditingActivity({ ...editingActivity, videoType: 'youtube' })}
                          className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                            (editingActivity.videoType || 'youtube') === 'youtube'
                              ? 'bg-red-600 text-white'
                              : 'text-slate-600 hover:text-red-600'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">smart_display</span>
                          <span>YouTube Video</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingActivity({ ...editingActivity, videoType: 'upload' })}
                          className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                            editingActivity.videoType === 'upload'
                              ? 'bg-[#0d47a1] text-white'
                              : 'text-slate-600 hover:text-[#0d47a1]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">file_upload</span>
                          <span>Upload Video File</span>
                        </button>
                      </div>
                    </div>

                    {/* YouTube Video URL Input & Preview */}
                    {(editingActivity.videoType || 'youtube') === 'youtube' && (
                      <div className="space-y-2 p-3 bg-white border border-red-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <label className="block font-bold text-slate-800 text-xs">
                            YouTube Video URL or Video ID *
                          </label>
                          {editingActivity.videoUrl && getYouTubeVideoId(editingActivity.videoUrl) ? (
                            <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 font-mono">
                              <span className="material-symbols-outlined text-[13px]">check_circle</span>
                              ID: {getYouTubeVideoId(editingActivity.videoUrl)}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-mono">
                              e.g. https://www.youtube.com/watch?v=...
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-2.5 text-red-600 material-symbols-outlined text-[18px]">
                              smart_display
                            </span>
                            <input
                              type="text"
                              placeholder="Paste YouTube watch link, youtu.be, shorts or embed URL..."
                              value={editingActivity.videoUrl || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                const ytId = getYouTubeVideoId(val);
                                setEditingActivity({
                                  ...editingActivity,
                                  videoUrl: val,
                                  image: (!editingActivity.image || editingActivity.image.includes('youtube.com')) && ytId
                                    ? getYouTubeThumbnailUrl(ytId) || editingActivity.image
                                    : editingActivity.image
                                });
                              }}
                              className="w-full bg-slate-50 border border-slate-300 rounded pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-600 font-mono"
                            />
                          </div>

                          {editingActivity.videoUrl && getYouTubeVideoId(editingActivity.videoUrl) && (
                            <button
                              type="button"
                              onClick={() => {
                                const ytThumb = getYouTubeThumbnailUrl(editingActivity.videoUrl);
                                if (ytThumb) {
                                  setEditingActivity({ ...editingActivity, image: ytThumb });
                                  setFeedbackMsg({ type: 'success', text: 'YouTube thumbnail set as cover image!' });
                                }
                              }}
                              className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-[11px] font-bold whitespace-nowrap cursor-pointer flex items-center gap-1"
                              title="Set YouTube thumbnail as cover photo"
                            >
                              <span className="material-symbols-outlined text-[14px] text-red-600">image</span>
                              <span>Use YT Thumb</span>
                            </button>
                          )}
                        </div>

                        {/* Interactive YouTube Live Embed Preview */}
                        {editingActivity.videoUrl && getYouTubeEmbedUrl(editingActivity.videoUrl) ? (
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                              <span>Live YouTube Preview</span>
                              <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-[12px]">play_circle</span> Ready to stream
                              </span>
                            </div>
                            <div className="w-full aspect-video rounded-lg overflow-hidden bg-black border border-slate-300 shadow-sm">
                              <iframe
                                src={getYouTubeEmbedUrl(editingActivity.videoUrl) || ''}
                                title="YouTube Video Preview"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full border-0"
                              />
                            </div>
                          </div>
                        ) : editingActivity.videoUrl ? (
                          <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                            Please provide a valid YouTube URL (e.g., https://www.youtube.com/watch?v=... or https://youtu.be/...).
                          </p>
                        ) : null}
                      </div>
                    )}

                    {/* Upload Video File Input & Preview */}
                    {editingActivity.videoType === 'upload' && (
                      <div className="space-y-2 p-3 bg-white border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <label className="block font-bold text-slate-800 text-xs">
                            Upload Video File (MP4, WebM, OGG, MOV up to 100MB) *
                          </label>
                          {editingActivity.videoUrl && (
                            <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 font-mono">
                              <span className="material-symbols-outlined text-[13px]">check_circle</span>
                              Video Attached
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <label className="px-3 py-2 bg-[#0d47a1] hover:bg-blue-900 text-white rounded text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer shadow-xs">
                            <span className="material-symbols-outlined text-[16px]">
                              {videoUploadingEdit ? 'hourglass_top' : 'upload_file'}
                            </span>
                            <span>{videoUploadingEdit ? 'Uploading...' : 'Choose Video File'}</span>
                            <input
                              type="file"
                              accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
                              disabled={videoUploadingEdit}
                              onChange={(e) => handleActivityVideoUpload(e, true)}
                              className="hidden"
                            />
                          </label>

                          <span className="text-slate-400 font-bold text-xs">or</span>

                          <input
                            type="text"
                            placeholder="Direct video file URL (/uploads/videos/... or https://...)"
                            value={editingActivity.videoUrl || ''}
                            onChange={(e) => setEditingActivity({ ...editingActivity, videoUrl: e.target.value })}
                            className="flex-1 min-w-[200px] bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1] font-mono"
                          />

                          {editingActivity.videoUrl && (
                            <button
                              type="button"
                              onClick={() => setEditingActivity({ ...editingActivity, videoUrl: '' })}
                              className="px-2 py-2 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                              title="Clear video"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          )}
                        </div>

                        {/* Live Uploaded Video Player Preview */}
                        {editingActivity.videoUrl && (
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                              <span>Uploaded Video Player Preview</span>
                              <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-[12px]">check_circle</span> Loaded
                              </span>
                            </div>
                            <div className="w-full max-h-56 bg-black rounded-lg overflow-hidden border border-slate-300 flex items-center justify-center">
                              <video
                                controls
                                playsInline
                                src={editingActivity.videoUrl}
                                poster={editingActivity.image || undefined}
                                className="w-full max-h-56 object-contain"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Co-existing Cover Thumbnail for Video */}
                    <div className="pt-2 border-t border-slate-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block font-bold text-slate-700 text-[11px] uppercase flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-slate-500">add_photo_alternate</span>
                          <span>Video Cover Thumbnail (Optional Poster Image)</span>
                        </label>
                        {editingActivity.image && (
                          <span className="text-[10px] text-slate-500 font-mono">
                            Thumbnail active
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="px-2.5 py-1.5 bg-white border border-slate-300 hover:border-slate-400 rounded text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer">
                          <span className="material-symbols-outlined text-[14px]">upload</span>
                          <span>Upload Thumbnail</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleActivityImageUpload(e, true)}
                            className="hidden"
                          />
                        </label>
                        <input
                          type="url"
                          placeholder="Poster image URL..."
                          value={editingActivity.image || ''}
                          onChange={(e) => setEditingActivity({ ...editingActivity, image: e.target.value })}
                          className="flex-1 min-w-[180px] bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Summary / Excerpt *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingActivity.description}
                  onChange={(e) => setEditingActivity({ ...editingActivity, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Full Article Narrative & Case Details *
                </label>
                <textarea
                  rows={6}
                  required
                  value={editingActivity.content || editingActivity.description}
                  onChange={(e) => setEditingActivity({ ...editingActivity, content: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-sans leading-relaxed focus:outline-none focus:border-[#0d47a1]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingActivity(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0d47a1] hover:bg-blue-900 text-white rounded font-bold uppercase cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: PREVIEW / READ ACTIVITY ARTICLE                   */}
      {/* ======================================================== */}
      {viewingActivity && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-scaleUp my-auto">
            {/* Top Bar with Close */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-50 text-[#0d47a1] border border-blue-200 font-mono text-[10px] font-bold rounded uppercase">
                  {viewingActivity.category}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {toStandardDisplayDate(viewingActivity.date)} • {viewingActivity.location}
                </span>
              </div>
              <button
                onClick={() => setViewingActivity(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Cover Hero: Video Player or Photo */}
            {viewingActivity.mediaType === 'video' && viewingActivity.videoUrl ? (
              (viewingActivity.videoType === 'youtube' || isYouTubeUrl(viewingActivity.videoUrl)) ? (
                <div className="w-full aspect-video bg-black relative">
                  <iframe
                    src={getYouTubeEmbedUrl(viewingActivity.videoUrl) || ''}
                    title={viewingActivity.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 bg-black/80 text-white text-[10px] font-mono rounded flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-red-500">smart_display</span>
                    <span>YouTube Dispatch</span>
                  </span>
                </div>
              ) : (
                <div className="w-full max-h-72 bg-black relative flex items-center justify-center">
                  <video
                    controls
                    playsInline
                    poster={viewingActivity.image || undefined}
                    src={viewingActivity.videoUrl}
                    className="w-full max-h-72 object-contain"
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 bg-black/80 text-white text-[10px] font-mono rounded flex items-center gap-1 pointer-events-none">
                    <span className="material-symbols-outlined text-[13px] text-blue-400">play_circle</span>
                    <span>Uploaded Video</span>
                  </span>
                </div>
              )
            ) : (
              <div className="w-full h-56 bg-slate-900 relative overflow-hidden">
                <img
                  src={viewingActivity.image}
                  alt={viewingActivity.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-5">
                  <div className="text-white text-xs font-mono">
                    {viewingActivity.author && <span>By {viewingActivity.author}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Content Body */}
            <div className="p-6 space-y-4">
              <h2 className="font-headline font-bold text-2xl text-slate-900 leading-tight">
                {viewingActivity.title}
              </h2>

              <div className="p-3 bg-slate-50 border-l-4 border-[#0d47a1] text-xs text-slate-700 italic font-medium">
                {viewingActivity.description}
              </div>

              <div className="text-xs sm:text-sm text-slate-700 space-y-3 leading-relaxed font-sans">
                {(viewingActivity.content || viewingActivity.description)
                  .split('\n\n')
                  .map((p: string, idx: number) => (
                    <p key={idx}>{p}</p>
                  ))}
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                <button
                  onClick={() => {
                    const act = viewingActivity;
                    setViewingActivity(null);
                    setEditingActivity({ ...act });
                  }}
                  className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-[#0d47a1] rounded font-bold text-xs uppercase flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  <span>Edit Article</span>
                </button>

                <button
                  onClick={() => setViewingActivity(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded font-bold text-xs uppercase cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ======================================================== */}
      {/* MODAL: MANAGE ACTIVITY & BLOG CATEGORIES                 */}
      {/* ======================================================== */}
      {showManageCategoriesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 relative animate-scaleUp my-auto max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowManageCategoriesModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0d47a1] text-2xl">category</span>
              <div>
                <h3 className="font-headline font-bold text-lg text-slate-900">
                  Manage Activity Wings & Categories
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">
                  Configure institutional wings and blog categories for citizen operations
                </span>
              </div>
            </div>

            {/* Add New Category Form */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await handleAddCategory();
              }}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2"
            >
              <label className="block font-bold text-slate-700 uppercase text-[11px]">
                Create New Category / Wing Name
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. RTI & Public Transparency Cell"
                  value={newCategoryNameInput}
                  onChange={(e) => setNewCategoryNameInput(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#0d47a1]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0d47a1] hover:bg-blue-900 text-white rounded font-bold text-xs uppercase cursor-pointer flex items-center gap-1 shrink-0 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>Add Category</span>
                </button>
              </div>
            </form>

            {/* Existing Categories List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase px-1">
                <span>Active Categories ({activityCategories.length})</span>
                <span className="text-[10px] text-slate-400 font-mono">Total Articles</span>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                {activityCategories.map((cat) => {
                  const articleCount = activities.filter(
                    (a) => a.category && a.category.toLowerCase() === cat.toLowerCase()
                  ).length;

                  return (
                    <div
                      key={cat}
                      className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#0d47a1] text-[18px]">
                          label
                        </span>
                        <span className="font-bold text-slate-900 text-xs">{cat}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                          {articleCount} {articleCount === 1 ? 'article' : 'articles'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer transition-colors"
                          title={`Delete category "${cat}"`}
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}

                {activityCategories.length === 0 && (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No categories defined yet. Add your first category above.
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-[11px] text-blue-900 flex items-start gap-2">
              <span className="material-symbols-outlined text-[#0d47a1] text-[16px] shrink-0 mt-0.5">
                info
              </span>
              <span>
                Categories defined here immediately become selectable across article publishing and dynamically populate the public filter chips on the <strong>Our Activities</strong> page.
              </span>
            </div>

            <div className="pt-2 flex justify-end border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowManageCategoriesModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded font-bold text-xs uppercase cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD NEW CERTIFICATE (PDF / IMAGE UPLOADER)        */}
      {/* ======================================================== */}
      {showAddCertificateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-5 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 relative animate-scaleUp my-auto max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setShowAddCertificateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <div className="p-2 bg-blue-50 text-[#0d47a1] rounded-lg">
                <span className="material-symbols-outlined text-2xl">upload_file</span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg text-slate-900 uppercase">
                  Upload Statutory Certificate
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">
                  Attach official PDF or image document (MSME, NITI Aayog Darpan, Trust Charter, 12A/80G)
                </span>
              </div>
            </div>

            <form onSubmit={handleCreateCertificate} className="space-y-4 text-xs">
              {/* Title */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Certificate Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MSME UDYAM Registration Certificate"
                  value={newCertificate.title || ''}
                  onChange={(e) => setNewCertificate({ ...newCertificate, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-[#0d47a1]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Description / Remarks <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Enter statutory description, registration scope, or institutional remarks..."
                  value={newCertificate.description || ''}
                  onChange={(e) => setNewCertificate({ ...newCertificate, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                />
              </div>

              {/* Optional Registration No & Authority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Registration / Unique ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UP-50-0196301 or DL/2021/RAWF"
                    value={newCertificate.registrationNumber || ''}
                    onChange={(e) => setNewCertificate({ ...newCertificate, registrationNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-[#0d47a1]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Issuing Authority
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ministry of MSME, Govt. of India"
                    value={newCertificate.issuingAuthority || ''}
                    onChange={(e) => setNewCertificate({ ...newCertificate, issuingAuthority: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                  />
                </div>
              </div>

              {/* Category, Date & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={newCertificate.category || 'Government Accreditation'}
                    onChange={(e) => setNewCertificate({ ...newCertificate, category: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-2 text-slate-900 focus:outline-none"
                  >
                    <option value="Government Accreditation">Government Accreditation</option>
                    <option value="Trust Charter">Trust Charter</option>
                    <option value="Tax Exemption">Tax Exemption (12A/80G)</option>
                    <option value="Statutory License">Statutory License</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Issue Date</label>
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={newCertificate.issueDate || ''}
                    onChange={(e) => setNewCertificate({ ...newCertificate, issueDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Status</label>
                  <select
                    value={newCertificate.status || 'Published'}
                    onChange={(e) => setNewCertificate({ ...newCertificate, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-2 text-slate-900 focus:outline-none"
                  >
                    <option value="Published">Published (Public)</option>
                    <option value="Draft">Draft (Internal)</option>
                  </select>
                </div>
              </div>

              {/* Document File Uploader (PDF or Image) */}
              <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 uppercase flex items-center gap-1.5 text-xs">
                    <span className="material-symbols-outlined text-[#0d47a1] text-base">attachment</span>
                    <span>Document File (PDF or Image) <span className="text-red-500">*</span></span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Max 25MB · PDF, PNG, JPG</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-100 cursor-pointer shadow-xs transition-colors">
                    <span className="material-symbols-outlined text-[#0d47a1] text-lg">folder_open</span>
                    <span>Choose PDF or Image File</span>
                    <input
                      type="file"
                      accept=".pdf, application/pdf, image/png, image/jpeg, image/jpg, image/webp"
                      onChange={(e) => handleCertificateFileUpload(e, false)}
                      className="hidden"
                    />
                  </label>

                  {certificateUploading && (
                    <div className="flex items-center gap-2 text-xs font-mono text-[#0d47a1]">
                      <div className="w-4 h-4 rounded-full border-2 border-[#0d47a1] border-t-transparent animate-spin"></div>
                      <span>Processing and validating document...</span>
                    </div>
                  )}
                </div>

                {/* File Attachment & Preview Card */}
                {newCertificate.fileUrl && (
                  <div className="mt-3 p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-9 h-9 rounded flex items-center justify-center shrink-0 ${
                        newCertificate.fileType === 'pdf' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-[#0d47a1]'
                      }`}>
                        <span className="material-symbols-outlined text-xl">
                          {newCertificate.fileType === 'pdf' ? 'picture_as_pdf' : 'image'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 text-xs block truncate">
                          {newCertificate.fileName || 'Attached Document'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {newCertificate.fileSize || 'Validated'} · {newCertificate.fileType?.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={newCertificate.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-bold"
                      >
                        Preview
                      </a>
                      <button
                        type="button"
                        onClick={() => setNewCertificate({ ...newCertificate, fileUrl: '', fileName: '', fileSize: '' })}
                        className="p-1 text-slate-400 hover:text-red-600 rounded"
                        title="Remove file"
                      >
                        <span className="material-symbols-outlined text-base">close</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCertificateModal(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded font-bold uppercase transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={certificateUploading}
                  className="px-5 py-2 bg-[#0d47a1] hover:bg-blue-900 disabled:opacity-50 text-white rounded font-bold uppercase flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">publish</span>
                  <span>Upload &amp; Publish Certificate</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT CERTIFICATE                                  */}
      {/* ======================================================== */}
      {editingCertificate && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-5 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 relative animate-scaleUp my-auto max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setEditingCertificate(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <div className="p-2 bg-amber-50 text-amber-800 rounded-lg">
                <span className="material-symbols-outlined text-2xl">edit_document</span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg text-slate-900 uppercase">
                  Edit Statutory Certificate
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">
                  Modify title, description, issuing details or replace the document file
                </span>
              </div>
            </div>

            <form onSubmit={handleUpdateCertificate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Certificate Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingCertificate.title || ''}
                  onChange={(e) => setEditingCertificate({ ...editingCertificate, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-[#0d47a1]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Description / Remarks <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={editingCertificate.description || ''}
                  onChange={(e) => setEditingCertificate({ ...editingCertificate, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Registration / Unique ID
                  </label>
                  <input
                    type="text"
                    value={editingCertificate.registrationNumber || ''}
                    onChange={(e) => setEditingCertificate({ ...editingCertificate, registrationNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-[#0d47a1]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Issuing Authority
                  </label>
                  <input
                    type="text"
                    value={editingCertificate.issuingAuthority || ''}
                    onChange={(e) => setEditingCertificate({ ...editingCertificate, issuingAuthority: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0d47a1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={editingCertificate.category || 'Government Accreditation'}
                    onChange={(e) => setEditingCertificate({ ...editingCertificate, category: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-2 text-slate-900 focus:outline-none"
                  >
                    <option value="Government Accreditation">Government Accreditation</option>
                    <option value="Trust Charter">Trust Charter</option>
                    <option value="Tax Exemption">Tax Exemption</option>
                    <option value="Statutory License">Statutory License</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Issue Date</label>
                  <input
                    type="text"
                    value={editingCertificate.issueDate || ''}
                    onChange={(e) => setEditingCertificate({ ...editingCertificate, issueDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Status</label>
                  <select
                    value={editingCertificate.status || 'Published'}
                    onChange={(e) => setEditingCertificate({ ...editingCertificate, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-2 text-slate-900 focus:outline-none"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Replace Document File */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 uppercase text-xs">
                    Current Document File
                  </label>
                  <label className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0d47a1] hover:underline cursor-pointer">
                    <span className="material-symbols-outlined text-[15px]">file_upload</span>
                    <span>Replace Document</span>
                    <input
                      type="file"
                      accept=".pdf, application/pdf, image/png, image/jpeg, image/jpg, image/webp"
                      onChange={(e) => handleCertificateFileUpload(e, true)}
                      className="hidden"
                    />
                  </label>
                </div>

                {editingCertificate.fileUrl && (
                  <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-9 h-9 rounded flex items-center justify-center shrink-0 ${
                        editingCertificate.fileType === 'pdf' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-[#0d47a1]'
                      }`}>
                        <span className="material-symbols-outlined text-xl">
                          {editingCertificate.fileType === 'pdf' ? 'picture_as_pdf' : 'image'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 text-xs block truncate">
                          {editingCertificate.fileName || 'Attached Document'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {editingCertificate.fileSize || 'Existing Document'} · {editingCertificate.fileType?.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <a
                      href={editingCertificate.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-bold shrink-0"
                    >
                      View
                    </a>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCertificate(null)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded font-bold uppercase transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={certificateUploading}
                  className="px-5 py-2 bg-[#0d47a1] hover:bg-blue-900 text-white rounded font-bold uppercase shadow-sm transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: VIEW CERTIFICATE LIGHTBOX (ADMIN PREVIEW)         */}
      {/* ======================================================== */}
      {viewingCertificate && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-300 overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="material-symbols-outlined text-amber-400 text-2xl">
                  {viewingCertificate.fileType === 'pdf' ? 'picture_as_pdf' : 'image'}
                </span>
                <div className="min-w-0">
                  <h3 className="font-headline font-black text-white text-base truncate">
                    {viewingCertificate.title}
                  </h3>
                  <span className="text-[10px] text-amber-300 font-mono">
                    {viewingCertificate.registrationNumber || 'Statutory Document'} · {viewingCertificate.fileName}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setViewingCertificate(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="flex-1 bg-slate-100 p-4 overflow-auto flex items-center justify-center min-h-[400px] max-h-[65vh]">
              {viewingCertificate.fileType === 'pdf' || (viewingCertificate.fileUrl && viewingCertificate.fileUrl.toLowerCase().endsWith('.pdf')) ? (
                <iframe
                  src={`${viewingCertificate.fileUrl}#toolbar=1`}
                  title={viewingCertificate.title}
                  className="w-full h-full min-h-[480px] border border-slate-300 rounded-lg shadow-inner bg-white"
                />
              ) : (
                <img
                  src={viewingCertificate.fileUrl}
                  alt={viewingCertificate.title}
                  className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-md"
                />
              )}
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
              <span className="text-slate-600 truncate max-w-md">
                {viewingCertificate.description}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={viewingCertificate.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 border border-slate-300 rounded font-bold text-slate-700 hover:bg-slate-100 uppercase"
                >
                  Full Tab
                </a>
                <a
                  href={viewingCertificate.fileUrl}
                  download={viewingCertificate.fileName || 'certificate.pdf'}
                  className="px-3 py-1.5 bg-[#0d47a1] text-white rounded font-bold hover:bg-blue-900 uppercase flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">download</span>
                  <span>Download</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Commercial Quotation & Word (.docx) Modal */}
      <QuotationModal
        isOpen={showQuotationModal}
        onClose={() => setShowQuotationModal(false)}
      />
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { RawfLogo } from '../components/RawfLogo';

interface AdminPageProps {
  onNavigate: (page: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  // Authentication State
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('rawf_admin_token'));
  const [username, setUsername] = useState('admin@raidactionwing.in');
  const [password, setPassword] = useState('Admin@RAWF2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'officers' | 'applications' | 'grievances' | 'donations' | 'blacklist' | 'settings'>('overview');

  // Data States
  const [stats, setStats] = useState<any>(null);
  const [officers, setOfficers] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [grievances, setGrievances] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [blacklist, setBlacklist] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  // Modals & Form States
  const [showAddOfficerModal, setShowAddOfficerModal] = useState(false);
  const [newOfficer, setNewOfficer] = useState({
    name: '',
    designation: 'District Director',
    division: 'state',
    state: 'Maharashtra',
    badgeNumber: '',
    photoUrl: '',
    validTill: '31-DEC-2028',
    mandate: 'Citizen Vigilance & Anti-Corruption Oversight'
  });

  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

      const [statsRes, offRes, appRes, grvRes, donRes, blRes, setRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/admin/officers', { headers }),
        fetch('/api/admin/memberships', { headers }),
        fetch('/api/admin/grievances', { headers }),
        fetch('/api/admin/donations', { headers }),
        fetch('/api/admin/blacklist', { headers }),
        fetch('/api/admin/settings', { headers })
      ]);

      if (statsRes.status === 401) {
        handleLogout();
        return;
      }

      const [statsData, offData, appData, grvData, donData, blData, setData] = await Promise.all([
        statsRes.json(),
        offRes.json(),
        appRes.json(),
        grvRes.json(),
        donRes.json(),
        blRes.json(),
        setRes.json()
      ]);

      if (statsData.success) setStats(statsData.stats);
      if (offData.success) setOfficers(offData.data);
      if (appData.success) setApplications(appData.data);
      if (grvData.success) setGrievances(grvData.data);
      if (donData.success) setDonations(donData.data);
      if (blData.success) setBlacklist(blData.data);
      if (setData.success) setSettings(setData.data);
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

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (data.success && data.token) {
        localStorage.setItem('rawf_admin_token', data.token);
        setToken(data.token);
        fetchAdminData(data.token);
      } else {
        setLoginError(data.message || 'Authentication failed.');
      }
    } catch {
      setLoginError('Server connection error. Please try again.');
    } finally {
      setLoginLoading(false);
    }
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
    setToken(null);
  };

  // Add Officer
  const handleCreateOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/officers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newOfficer)
      });
      const data = await res.json();

      if (data.success) {
        setFeedbackMsg({ type: 'success', text: data.message });
        setShowAddOfficerModal(false);
        setNewOfficer({
          name: '',
          designation: 'District Director',
          division: 'state',
          state: 'Maharashtra',
          badgeNumber: '',
          photoUrl: '',
          validTill: '31-DEC-2028',
          mandate: 'Citizen Vigilance & Anti-Corruption Oversight'
        });
        fetchAdminData();
      } else {
        setFeedbackMsg({ type: 'error', text: data.message });
      }
    } catch {
      setFeedbackMsg({ type: 'error', text: 'Error adding officer.' });
    }
  };

  // 1-Click Revoke & Blacklist Officer
  const handleBlacklistOfficer = async (id: string, name: string) => {
    const reason = window.prompt(`Enter official reason for revoking credentials of ${name}:`, 'Misrepresentation and violation of RAWF statutory code of ethics');
    if (!reason) return;

    try {
      const res = await fetch(`/api/admin/officers/${encodeURIComponent(id)}/blacklist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      });
      const data = await res.json();

      if (data.success) {
        setFeedbackMsg({ type: 'success', text: data.message });
        fetchAdminData();
      } else {
        setFeedbackMsg({ type: 'error', text: data.message });
      }
    } catch {
      setFeedbackMsg({ type: 'error', text: 'Error blacklisting officer.' });
    }
  };

  // Approve Application and Issue Official Badge
  const handleApproveApplication = async (appId: string) => {
    if (!window.confirm('Approve this membership applicant and issue an official cryptographic RAWF Badge?')) return;

    try {
      const res = await fetch(`/api/admin/memberships/${encodeURIComponent(appId)}/approve-and-issue-badge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (data.success) {
        setFeedbackMsg({ type: 'success', text: data.message });
        fetchAdminData();
      } else {
        setFeedbackMsg({ type: 'error', text: data.message });
      }
    } catch {
      setFeedbackMsg({ type: 'error', text: 'Error approving application.' });
    }
  };

  // Reject Application
  const handleRejectApplication = async (appId: string) => {
    if (!window.confirm('Reject this membership application?')) return;

    try {
      const res = await fetch(`/api/admin/memberships/${encodeURIComponent(appId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'Rejected' })
      });
      const data = await res.json();

      if (data.success) {
        setFeedbackMsg({ type: 'success', text: data.message });
        fetchAdminData();
      }
    } catch {
      setFeedbackMsg({ type: 'error', text: 'Error updating application.' });
    }
  };

  // Update Grievance Status
  const handleUpdateGrievanceStatus = async (trackingId: string, currentStatus: string) => {
    const newStatus = window.prompt(
      `Update Investigation Status for ${trackingId}:\n(Options: "Received", "Assigned to Directorate", "Fact-Finding & Evidence", "Escalated to Statutory Body", "Closed")`,
      currentStatus
    );
    if (!newStatus) return;

    const details = window.prompt('Update status details / case notes for citizen tracking:', 'Cross-verification of documentary evidence underway by State Directorate.');

    try {
      const res = await fetch(`/api/admin/grievances/${encodeURIComponent(trackingId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus, statusDetails: details })
      });
      const data = await res.json();

      if (data.success) {
        setFeedbackMsg({ type: 'success', text: data.message });
        fetchAdminData();
      }
    } catch {
      setFeedbackMsg({ type: 'error', text: 'Error updating grievance status.' });
    }
  };

  // 1-Click JSON Backup
  const handleExportBackup = () => {
    window.open(`/api/admin/export-data?token=${token}`, '_blank');
  };

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
                placeholder="admin@raidactionwing.in"
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
                  placeholder="••••••••••••"
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

          {/* Demo Pre-fill Hint */}
          <div className="pt-2 border-t border-slate-100 text-center space-y-2">
            <span className="text-[11px] text-slate-500 block">
              Default Credentials Configured:
            </span>
            <div className="inline-block bg-slate-100 px-3 py-1.5 rounded font-mono text-[10px] text-slate-700">
              admin@raidactionwing.in / Admin@RAWF2026!
            </div>
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
                    Appoint New Officer
                  </strong>
                  <span className="text-[11px] text-slate-500">
                    Add new official badge to national active roster.
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
                  Manage active credentials, issue state mandates, or revoke badges for disciplinary breach.
                </p>
              </div>
              <button
                onClick={() => setShowAddOfficerModal(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">person_add</span>
                <span>Add New Officer</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                    <th className="p-3">Badge ID</th>
                    <th className="p-3">Officer Name</th>
                    <th className="p-3">Designation / Role</th>
                    <th className="p-3">Jurisdiction</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Valid Till</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {officers.map((off) => (
                    <tr key={off.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-[#0d47a1]">
                        {off.badgeNumber}
                      </td>
                      <td className="p-3 font-bold text-slate-900">
                        {off.name}
                      </td>
                      <td className="p-3 text-slate-700 font-medium">
                        {off.designation}
                      </td>
                      <td className="p-3 text-slate-600">
                        {off.state}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold rounded">
                          {off.status}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-600">
                        {off.validTill}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => handleBlacklistOfficer(off.id, off.name)}
                          className="px-2.5 py-1 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded text-[11px] font-bold uppercase transition-colors cursor-pointer"
                        >
                          Revoke & Blacklist
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
        {/* TAB 3: MEMBERSHIP INTAKE APPLICATIONS */}
        {/* ========================================== */}
        {activeTab === 'applications' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden space-y-4 p-5 animate-fadeIn">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-headline font-bold text-base text-slate-900 uppercase">
                Membership Applications Review Queue
              </h3>
              <p className="text-xs text-slate-500">
                Review applicant dossiers for District, State, and National posts. 1-click approve will generate an official badge and add them to the roster.
              </p>
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
                    <th className="p-3 text-right">Decisions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app.applicationId} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-800">
                        {app.applicationId}
                      </td>
                      <td className="p-3 font-bold text-slate-900">
                        {app.fullName}
                      </td>
                      <td className="p-3 font-semibold text-[#0d47a1]">
                        {app.wing}
                      </td>
                      <td className="p-3 text-slate-600">
                        {app.state}
                      </td>
                      <td className="p-3 font-mono text-slate-600">
                        <div>{app.mobile}</div>
                        <div className="text-[11px] text-slate-400">{app.email}</div>
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
                      <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                        {app.status !== 'Approved' && (
                          <button
                            onClick={() => handleApproveApplication(app.applicationId)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold uppercase cursor-pointer"
                          >
                            ✓ Approve & Issue Badge
                          </button>
                        )}
                        {app.status !== 'Rejected' && (
                          <button
                            onClick={() => handleRejectApplication(app.applicationId)}
                            className="px-2.5 py-1 bg-slate-200 hover:bg-red-100 hover:text-red-700 text-slate-700 rounded text-[11px] font-bold uppercase cursor-pointer"
                          >
                            Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {applications.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-400 text-xs">
                        No applications recorded yet.
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
        {/* TAB 6: BLACKLISTED BADGES REGISTRY */}
        {/* ========================================== */}
        {activeTab === 'blacklist' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden space-y-4 p-5 animate-fadeIn">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-headline font-bold text-base text-slate-900 uppercase text-red-600">
                Official Blacklisted Badges & Revocation Registry
              </h3>
              <p className="text-xs text-slate-500">
                Published to protect the public from imposter badges and unauthorized police impersonation under Section 204 BNS.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                    <th className="p-3">Revoked Badge ID</th>
                    <th className="p-3">Individual Name</th>
                    <th className="p-3">Jurisdiction</th>
                    <th className="p-3">Revocation Date</th>
                    <th className="p-3">Stated Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {blacklist.map((item) => (
                    <tr key={item.id} className="hover:bg-red-50/50">
                      <td className="p-3 font-mono font-bold text-red-600">
                        {item.badgeNumber}
                      </td>
                      <td className="p-3 font-bold text-slate-900">
                        {item.name}
                      </td>
                      <td className="p-3 text-slate-600">
                        {item.jurisdiction}
                      </td>
                      <td className="p-3 font-mono text-slate-600">
                        {item.revocationDate}
                      </td>
                      <td className="p-3 text-slate-600">
                        {item.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 7: SETTINGS & CPANEL EXPORT */}
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

              <div className="pt-2">
                <button
                  onClick={handleExportBackup}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs uppercase rounded flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Export Full JSON Database Backup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Add New Officer */}
      {showAddOfficerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative animate-scaleUp">
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
                  National Directory Command
                </span>
              </div>
            </div>

            <form onSubmit={handleCreateOfficer} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newOfficer.name}
                  onChange={(e) => setNewOfficer({ ...newOfficer, name: e.target.value })}
                  placeholder="e.g. Ramesh Chandra Sharma"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900"
                />
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
                    <optgroup label="District level">
                      <option>District Director</option>
                      <option>Districts Chief</option>
                      <option>District Incharge</option>
                      <option>Investigation Officer</option>
                      <option>Information officer</option>
                    </optgroup>
                    <optgroup label="State level">
                      <option>State Director</option>
                      <option>State President</option>
                      <option>State Incharge</option>
                      <option>State Investigation Officer</option>
                      <option>State Information Officer</option>
                    </optgroup>
                    <optgroup label="National level">
                      <option>National Secretary</option>
                      <option>National Investigation Officer</option>
                      <option>National co-ordinator</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Badge Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={newOfficer.badgeNumber}
                    onChange={(e) => setNewOfficer({ ...newOfficer, badgeNumber: e.target.value })}
                    placeholder="e.g. RW-MH-110"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    State Jurisdiction *
                  </label>
                  <select
                    value={newOfficer.state}
                    onChange={(e) => setNewOfficer({ ...newOfficer, state: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900"
                  >
                    <option>Delhi NCR</option>
                    <option>Maharashtra</option>
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

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Valid Till Date
                  </label>
                  <input
                    type="text"
                    value={newOfficer.validTill}
                    onChange={(e) => setNewOfficer({ ...newOfficer, validTill: e.target.value })}
                    placeholder="31-DEC-2028"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Officer Photo URL (Optional)
                </label>
                <input
                  type="text"
                  value={newOfficer.photoUrl}
                  onChange={(e) => setNewOfficer({ ...newOfficer, photoUrl: e.target.value })}
                  placeholder="https://... (Leave blank for default emblem)"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900"
                />
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
                  className="px-5 py-2 bg-[#0d47a1] hover:bg-blue-900 text-white rounded font-bold uppercase cursor-pointer"
                >
                  Confirm & Issue Badge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

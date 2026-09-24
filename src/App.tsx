/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroCommandCenter } from './components/HeroCommandCenter';
import { PortalHub } from './components/PortalHub';
import { PriorityChannels } from './components/PriorityChannels';
import { InstitutionalMandate } from './components/InstitutionalMandate';
import { ServicesSection } from './components/ServicesSection';
import { InitiativesSection } from './components/InitiativesSection';
import { EventsSection } from './components/EventsSection';
import { OfficersDirectory } from './components/OfficersDirectory';
import { CitizenRightsRepository } from './components/CitizenRightsRepository';
import { MembershipApplySection } from './components/MembershipApplySection';
import { IdCardDownloadPortal } from './components/IdCardDownloadPortal';
import { ReportGrievanceSection } from './components/ReportGrievanceSection';
import { DonateSection } from './components/DonateSection';
import { StatutoryDisclaimer } from './components/StatutoryDisclaimer';
import { Footer } from './components/Footer';
import { OfficerVerificationModal } from './components/OfficerVerificationModal';

// Dedicated Subpages
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { YourRightsPage } from './pages/YourRightsPage';
import { BlacklistedOfficersPage } from './pages/BlacklistedOfficersPage';
import { IndianLawsPage } from './pages/IndianLawsPage';
import { GrievanceCellPage } from './pages/GrievanceCellPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { ContactPage } from './pages/ContactPage';
import { ApplyOnlinePage } from './pages/ApplyOnlinePage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [currentSubParam, setCurrentSubParam] = useState<string | undefined>(undefined);
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [verifyPrefillCode, setVerifyPrefillCode] = useState<string | undefined>(undefined);
  const [prefillWing, setPrefillWing] = useState<string | undefined>(undefined);

  // Sync hash changes for anchor navigation or deep links
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'about-page') setCurrentPage('about');
      else if (hash === 'services-page') setCurrentPage('services');
      else if (hash === 'projects-page') setCurrentPage('projects');
      else if (hash === 'departments-page') setCurrentPage('departments');
      else if (hash === 'rights-page') setCurrentPage('rights');
      else if (hash === 'blacklisted-officers') setCurrentPage('blacklisted-officers');
      else if (hash === 'indian-laws-page') setCurrentPage('indian-laws');
      else if (hash === 'grievance-cell-page') setCurrentPage('grievance-cell');
      else if (hash === 'activities-page') setCurrentPage('activities');
      else if (hash === 'apply-online-page') setCurrentPage('apply-online');
      else if (hash === 'contact-page') setCurrentPage('contact');
    };

    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavigate = (page: string, subParam?: string) => {
    setCurrentPage(page);
    setCurrentSubParam(subParam);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenVerifyModal = (code?: string) => {
    setVerifyPrefillCode(code);
    setVerifyModalOpen(true);
  };

  const handleCloseVerifyModal = () => {
    setVerifyModalOpen(false);
    setVerifyPrefillCode(undefined);
  };

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const handleSelectServiceForReport = (title: string) => {
    setPrefillWing(title);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans antialiased selection:bg-red-100 selection:text-red-800">
      {/* Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenVerifyModal={handleOpenVerifyModal}
        lang={lang}
        onToggleLang={handleToggleLang}
      />

      {/* Main View Router */}
      <main className="w-full pt-[116px]">
        {currentPage === 'home' && (
          <>
            {/* Hero Command Center */}
            <HeroCommandCenter
              onOpenVerifyModal={handleOpenVerifyModal}
              lang={lang}
            />

            {/* Interactive Civic Action & Gateways Hub */}
            <PortalHub />

            {/* Priority Citizen Defense Channels */}
            <PriorityChannels />

            {/* Institutional Mandate & Origins (About Us) */}
            <InstitutionalMandate />

            {/* Core Services Wings */}
            <ServicesSection onSelectServiceForReport={handleSelectServiceForReport} />

            {/* National Initiatives & Deployments */}
            <InitiativesSection />

            {/* Ground Action & Events Schedule */}
            <EventsSection />

            {/* Active Officers Directory & Anti-Fraud Roster */}
            <OfficersDirectory onVerifyOfficer={handleOpenVerifyModal} />

            {/* Indian Statutory Law & Rights Repository */}
            <CitizenRightsRepository />

            {/* Membership Application & Volunteers */}
            <MembershipApplySection />

            {/* ID Card Download Portal */}
            <IdCardDownloadPortal />

            {/* Confidential Incident / Grievance Filing Terminal */}
            <ReportGrievanceSection prefillWingTitle={prefillWing} />

            {/* Support & Donate to RAWF */}
            <DonateSection />

            {/* Statutory Non-Governmental Notice */}
            <StatutoryDisclaimer />
          </>
        )}

        {currentPage === 'about' && (
          <AboutPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'services' && (
          <ServicesPage
            onNavigate={handleNavigate}
            onSelectServiceForReport={handleSelectServiceForReport}
            initialService={currentSubParam}
          />
        )}

        {currentPage === 'projects' && (
          <ProjectsPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'departments' && (
          <DepartmentsPage
            onNavigate={handleNavigate}
            onSelectDepartmentForInquiry={handleSelectServiceForReport}
          />
        )}

        {currentPage === 'rights' && (
          <YourRightsPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'officers' && (
          <div className="py-8">
            <OfficersDirectory onVerifyOfficer={handleOpenVerifyModal} />
          </div>
        )}

        {currentPage === 'blacklisted-officers' && (
          <BlacklistedOfficersPage
            onNavigate={handleNavigate}
            onOpenVerifyModal={handleOpenVerifyModal}
          />
        )}

        {currentPage === 'indian-laws' && (
          <IndianLawsPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'activities' && (
          <ActivitiesPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'grievance-cell' && (
          <GrievanceCellPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'apply-online' && (
          <ApplyOnlinePage onNavigate={handleNavigate} />
        )}

        {currentPage === 'id-download' && (
          <div className="py-8">
            <IdCardDownloadPortal />
          </div>
        )}

        {currentPage === 'donate' && (
          <div className="py-8">
            <DonateSection />
          </div>
        )}

        {currentPage === 'contact' && (
          <ContactPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'events' && (
          <div className="py-8">
            <EventsSection />
          </div>
        )}
      </main>

      {/* Institutional Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Global Officer Verification Modal */}
      <OfficerVerificationModal
        isOpen={verifyModalOpen}
        onClose={handleCloseVerifyModal}
        prefillCode={verifyPrefillCode}
      />
    </div>
  );
}

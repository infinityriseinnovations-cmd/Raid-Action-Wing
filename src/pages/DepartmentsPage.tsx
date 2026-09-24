import React, { useState } from 'react';
import { ALL_DEPARTMENTS, DepartmentItem } from '../data/siteData';

interface DepartmentsPageProps {
  onNavigate: (page: string) => void;
  onSelectDepartmentForInquiry?: (deptName: string) => void;
}

export const DepartmentsPage: React.FC<DepartmentsPageProps> = ({ onNavigate, onSelectDepartmentForInquiry }) => {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<DepartmentItem | null>(null);

  const filtered = ALL_DEPARTMENTS.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.mandate.toLowerCase().includes(search.toLowerCase()) ||
      d.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <div className="bg-[#0a192f] text-white py-12 px-4 lg:px-8 border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <button onClick={() => onNavigate('home')} className="hover:text-white cursor-pointer">
              Home
            </button>
            <span>/</span>
            <span className="text-red-400 font-bold">Our Departments</span>
          </div>
          <h1 className="font-headline font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight">
            22 Specialized Task Divisions & Wings
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl">
            Coordinated departmental command structure providing multidisciplinary investigations, legal advocacy, cyber forensics, and grassroots human protection.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        {/* Search */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-bold uppercase text-slate-700">
            Active Directorate Roster: {filtered.length} Divisions
          </span>
          <div className="w-full sm:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search wing by name or code..."
              className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1]"
            />
          </div>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((dept) => (
            <div
              key={dept.id}
              className="bg-white border border-slate-200 hover:border-[#0d47a1] rounded-xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    {dept.code}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {dept.headOffice}
                  </span>
                </div>

                <h3 className="font-headline font-bold text-slate-900 text-base group-hover:text-[#0d47a1] transition-colors">
                  {dept.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {dept.mandate}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between">
                <button
                  onClick={() => setSelectedDept(dept)}
                  className="text-xs font-bold text-[#0d47a1] hover:underline uppercase cursor-pointer"
                >
                  View Protocol
                </button>
                <button
                  onClick={() => {
                    if (onSelectDepartmentForInquiry) onSelectDepartmentForInquiry(dept.name);
                    onNavigate('home');
                    window.location.hash = '#report-tip-anchor';
                  }}
                  className="px-2.5 py-1 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded text-[11px] font-bold uppercase transition-colors cursor-pointer"
                >
                  Report To Wing
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Protocol Modal */}
      {selectedDept && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4 relative animate-scaleUp">
            <button
              onClick={() => setSelectedDept(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="border-b border-slate-100 pb-3">
              <span className="font-mono text-[10px] text-[#0d47a1] font-bold uppercase block">
                {selectedDept.code} • {selectedDept.headOffice}
              </span>
              <h3 className="font-headline font-bold text-lg text-slate-900 mt-0.5">
                {selectedDept.name}
              </h3>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {selectedDept.mandate}
            </p>

            <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs space-y-1 text-slate-600">
              <strong className="text-slate-900 block font-bold text-[11px] uppercase">
                Director General Directive
              </strong>
              <p>
                Officers assigned to {selectedDept.name} are empowered to carry out citizen vigilance and fact-finding oversight in accordance with the Indian Trusts Act 1882 Charter.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedDept(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded text-xs font-bold uppercase cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

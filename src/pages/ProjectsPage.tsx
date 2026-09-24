import React, { useState } from 'react';
import { ALL_PROJECTS } from '../data/siteData';

interface ProjectsPageProps {
  onNavigate: (page: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const categories = ['all', 'Legal Defense', 'Social Welfare', 'Gender Rights', 'Environment', 'Agrarian Defense', 'Human Rights', 'Anti-Narcotics'];

  const filtered = ALL_PROJECTS.filter((p) => {
    const matchCat = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

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
            <span className="text-red-400 font-bold">Our Projects</span>
          </div>
          <h1 className="font-headline font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight">
            National Social & Legal Initiatives
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl">
            Over 20 ground missions safeguarding constitutional rights, nutrition integrity, ecological preservation, and anti-narcotics enforcement across India.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        {/* Filter Controls */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0d47a1] text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Projects' : cat}
              </button>
            ))}
          </div>

          <div className="w-full md:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search initiatives..."
              className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#0d47a1]"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              className="bg-white border-2 border-slate-200 hover:border-[#0d47a1] rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-blue-50 text-[#0d47a1] border border-blue-200 font-mono text-[10px] uppercase font-bold rounded">
                    {proj.tag}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono uppercase font-semibold">
                    {proj.category}
                  </span>
                </div>

                <h3 className="font-headline font-bold text-base text-slate-900 group-hover:text-[#0d47a1] transition-colors leading-tight">
                  {proj.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {proj.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  {proj.impact}
                </span>
                <button
                  onClick={() => onNavigate('apply-online')}
                  className="text-red-600 font-bold uppercase hover:underline text-[11px] cursor-pointer"
                >
                  Volunteer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

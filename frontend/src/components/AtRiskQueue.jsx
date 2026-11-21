import React from 'react';
import { useApp } from '../context/AppContext';

export default function AtRiskQueue() {
  const {
    filteredStudents,
    selectedStudentId,
    setSelectedStudentId,
    activeRiskTab,
    setActiveRiskTab,
    queueSearch,
    setQueueSearch
  } = useApp();

  const getRiskBadgeColor = (score, tier) => {
    if (tier === 'High' || score >= 80) return 'bg-status-high text-error';
    if (tier === 'Medium' || score >= 50) return 'bg-status-med text-amber-600';
    return 'bg-status-low text-emerald-600';
  };

  const getRiskBarBg = (score, tier) => {
    if (tier === 'High' || score >= 80) return 'bg-status-high';
    if (tier === 'Medium' || score >= 50) return 'bg-status-med';
    return 'bg-status-low';
  };

  return (
    <aside className="bg-surface-container flex flex-col h-full w-80 border-r border-outline-variant py-dossier-inset gap-unit flex-shrink-0 z-40 relative shadow-[4px_0_12px_rgba(0,0,0,0.02)]">
      <div className="px-6 mb-4">
        <h2 className="font-h3 text-h3 font-bold text-on-surface">At-Risk Queue</h2>
        <p className="font-data-label text-data-label text-on-surface-variant uppercase tracking-wider mt-1">
          Clinical Priority
        </p>

        {/* Quick Search on mobile / small screens */}
        <div className="mt-3 block lg:hidden">
          <input
            type="text"
            value={queueSearch}
            onChange={(e) => setQueueSearch(e.target.value)}
            placeholder="Search students..."
            className="w-full px-3 py-1.5 bg-surface-bright border border-outline-variant rounded text-xs focus:ring-1 focus:ring-primary outline-none"
          />
        </div>

        {/* Sidebar Priority Filter Tabs */}
        <div className="mt-4 flex gap-1 border-b border-outline-variant pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveRiskTab('All')}
            className={`rounded font-bold flex-1 py-1.5 px-2 flex flex-col items-center justify-center gap-0.5 transition-all text-xs ${
              activeRiskTab === 'All'
                ? 'bg-surface-bright text-primary shadow-sm border border-outline-variant'
                : 'text-on-surface-variant hover:bg-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">list</span>
            <span className="text-[9px] uppercase font-data-label">All</span>
          </button>

          <button
            onClick={() => setActiveRiskTab('High')}
            className={`rounded font-bold flex-1 py-1.5 px-2 flex flex-col items-center justify-center gap-0.5 transition-all text-xs ${
              activeRiskTab === 'High'
                ? 'bg-surface-bright text-primary shadow-sm border border-outline-variant'
                : 'text-on-surface-variant hover:bg-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-error">priority_high</span>
            <span className="text-[9px] uppercase font-data-label">High</span>
          </button>

          <button
            onClick={() => setActiveRiskTab('Medium')}
            className={`rounded font-bold flex-1 py-1.5 px-2 flex flex-col items-center justify-center gap-0.5 transition-all text-xs ${
              activeRiskTab === 'Medium'
                ? 'bg-surface-bright text-primary shadow-sm border border-outline-variant'
                : 'text-on-surface-variant hover:bg-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-amber-500">warning</span>
            <span className="text-[9px] uppercase font-data-label">Med</span>
          </button>

          <button
            onClick={() => setActiveRiskTab('Low')}
            className={`rounded font-bold flex-1 py-1.5 px-2 flex flex-col items-center justify-center gap-0.5 transition-all text-xs ${
              activeRiskTab === 'Low'
                ? 'bg-surface-bright text-primary shadow-sm border border-outline-variant'
                : 'text-on-surface-variant hover:bg-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-emerald-500">info</span>
            <span className="text-[9px] uppercase font-data-label">Low</span>
          </button>

          <button
            onClick={() => setActiveRiskTab('Watch')}
            className={`rounded font-bold flex-1 py-1.5 px-2 flex flex-col items-center justify-center gap-0.5 transition-all text-xs ${
              activeRiskTab === 'Watch'
                ? 'bg-surface-bright text-primary shadow-sm border border-outline-variant'
                : 'text-on-surface-variant hover:bg-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            <span className="text-[9px] uppercase font-data-label">Watch</span>
          </button>
        </div>
      </div>

      {/* Student Cards List */}
      <div className="flex-1 overflow-y-auto student-list px-4 space-y-2 pb-20">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-8 px-4 text-on-surface-variant">
            <span className="material-symbols-outlined text-[36px] text-outline mb-2">person_search</span>
            <p className="font-body-sm text-xs font-medium">No students match current filters.</p>
          </div>
        ) : (
          filteredStudents.map((student) => {
            const isSelected = student.id === selectedStudentId;
            const barBg = getRiskBarBg(student.riskScore, student.riskTier);

            return (
              <button
                key={student.id}
                onClick={() => setSelectedStudentId(student.id)}
                className={`w-full text-left rounded-lg p-3 relative group transition-all duration-150 ${
                  isSelected
                    ? 'bg-surface-bright border border-outline-variant shadow-sm'
                    : 'hover:bg-surface-bright border border-transparent hover:border-outline-variant'
                }`}
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 ${barBg} rounded-l-lg ${
                    isSelected ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'
                  }`}
                ></div>
                <div className="flex justify-between items-start pl-2">
                  <div>
                    <p className={`text-sm ${isSelected ? 'font-bold text-on-surface' : 'font-medium text-on-surface-variant'}`}>
                      {student.name}
                    </p>
                    <p className="font-data-label text-[10px] text-secondary mt-0.5">
                      ID: {student.id}
                    </p>
                  </div>
                  <span className={`font-metric-display text-[14px] font-bold ${student.riskScore >= 80 ? 'text-error' : student.riskScore >= 50 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {student.riskScore}%
                  </span>
                </div>
                {student.tags && student.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2 pl-2">
                    {student.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-error-container text-on-error-container font-data-label text-[9px] px-1.5 py-0.5 uppercase rounded-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}

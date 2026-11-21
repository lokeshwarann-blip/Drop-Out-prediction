import React from 'react';
import { useApp } from '../context/AppContext';
import { NavLink, useLocation } from 'react-router-dom';

export default function HeaderNav() {
  const {
    viewMode,
    setViewMode,
    queueSearch,
    setQueueSearch,
    logsSearch,
    setLogsSearch,
    students,
    setSelectedStudentId
  } = useApp();

  const location = useLocation();
  const isDashboard = location.pathname === '/';
  const isLogs = location.pathname === '/logs';

  return (
    <header className="bg-surface border-b border-outline-variant docked full-width top-0 z-50 flex justify-between items-center w-full px-container-padding h-20 fixed">
      <div className="flex items-center gap-8">
        <h1 className="font-h2 text-h2 font-bold text-on-surface tracking-tighter">
          Intervention Intelligence
        </h1>
        <nav className="hidden md:flex gap-6 items-center">
          <NavLink
            to="/"
            className={({ isActive }) => `font-body-md transition-colors pb-1 ${
              isActive
                ? 'text-primary border-b-2 border-primary font-bold'
                : 'text-secondary font-medium hover:text-primary'
            }`}
          >
            Student Roster
          </NavLink>
          <NavLink
            to="/logs"
            className={({ isActive }) => `font-body-md transition-colors pb-1 ${
              isActive
                ? 'text-primary border-b-2 border-primary font-bold'
                : 'text-secondary font-medium hover:text-primary'
            }`}
          >
            Communication Log
          </NavLink>
          <NavLink
            to="/analytics"
            className={({ isActive }) => `font-body-md transition-colors pb-1 ${
              isActive
                ? 'text-primary border-b-2 border-primary font-bold'
                : 'text-secondary font-medium hover:text-primary'
            }`}
          >
            Analytics
          </NavLink>
          <NavLink
            to="/fairness"
            className={({ isActive }) => `font-body-md transition-colors pb-1 ${
              isActive
                ? 'text-primary border-b-2 border-primary font-bold'
                : 'text-secondary font-medium hover:text-primary'
            }`}
          >
            Fairness Audit
          </NavLink>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Dynamic Search Bar */}
        <div className="relative hidden lg:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">
            search
          </span>
          <input
            type="text"
            value={isDashboard ? queueSearch : logsSearch}
            onChange={(e) => {
              if (isDashboard) {
                setQueueSearch(e.target.value);
              } else {
                setLogsSearch(e.target.value);
              }
            }}
            placeholder={isDashboard ? "Search student ID or name..." : "Search recipient or message..."}
            className="pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-sm w-64 outline-none"
          />
          
          {/* Search Dropdown (Dashboard only) */}
          {isDashboard && queueSearch.trim() !== '' && (
            <div className="absolute top-full left-0 mt-1 w-full bg-surface-bright border border-outline-variant rounded shadow-lg max-h-60 overflow-y-auto z-50">
              {students
                .filter(s => {
                  const q = queueSearch.toLowerCase();
                  return s.id.toLowerCase().includes(q) || s.name.toLowerCase().split(' ').some(w => w.startsWith(q));
                })
                .slice(0, 10)
                .map(student => (
                  <button
                    key={student.id}
                    onClick={() => {
                      setSelectedStudentId(student.id);
                      setQueueSearch('');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-surface-container border-b border-outline-variant last:border-0 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-on-surface text-sm">{student.name}</p>
                      <p className="text-[10px] text-secondary font-data-label">{student.id}</p>
                    </div>
                    <span className={`font-bold text-xs ${student.riskScore >= 80 ? 'text-error' : student.riskScore >= 50 ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {student.riskScore}%
                    </span>
                  </button>
                ))
              }
              {students.filter(s => {
                  const q = queueSearch.toLowerCase();
                  return s.id.toLowerCase().includes(q) || s.name.toLowerCase().split(' ').some(w => w.startsWith(q));
              }).length === 0 && (
                <div className="px-4 py-3 text-xs text-secondary text-center">No students found.</div>
              )}
            </div>
          )}
        </div>

        {/* Profile / Account Icon */}
        <div className="relative group">
          <button
            className="text-on-surface hover:text-primary transition-colors focus:outline-none flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[28px]">account_circle</span>
          </button>
          
          {/* Profile Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-surface-bright border border-outline-variant rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <div className="px-4 py-3 border-b border-outline-variant">
              <p className="text-sm font-bold text-on-surface">Signed In</p>
              <p className="text-xs text-secondary capitalize">{viewMode} Role</p>
            </div>
            <button
              onClick={() => {
                setViewMode(viewMode === 'counselor' ? 'teacher' : 'counselor');
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-surface-container text-on-surface flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
              Switch to {viewMode === 'counselor' ? 'Teacher' : 'Counselor'}
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.reload();
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-surface-container text-error flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

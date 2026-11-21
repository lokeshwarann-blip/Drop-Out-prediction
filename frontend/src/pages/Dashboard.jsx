import React from 'react';

export default function Dashboard() {
  return (
    <div className="w-full">
      <div className="absolute inset-0 w-full h-full opacity-20 pointer-events-none z-0">

</div>

<nav className="bg-surface border-b border-outline-variant docked full-width top-0 z-50 flex justify-between items-center w-full px-container-padding h-20 fixed">
<div className="flex items-center gap-8">
<h1 className="font-h2 text-h2 font-bold text-on-surface tracking-tighter">Intervention Intelligence</h1>
<div className="hidden md:flex gap-6 items-center">

<a className="text-primary border-b-2 border-primary font-bold pb-2 font-metric-display text-body-lg" href="#">Student Roster</a>

<a className="text-secondary font-medium pb-2 hover:text-primary transition-colors font-metric-display text-body-lg" href="#">Communication Log</a>
</div>
</div>
<div className="flex items-center gap-4">
<div className="relative hidden lg:block">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary">search</span>
<input className="pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-sm w-64" placeholder="Search students ID or name..." type="text"/>
</div>
<button className="text-on-surface hover:text-primary transition-colors">
<span className="material-symbols-outlined text-[28px]">account_circle</span>
</button>
</div>
</nav>
<div className="flex h-screen pt-20">

<aside className="bg-surface-container flex flex-col h-full w-80 border-r border-outline-variant py-dossier-inset gap-unit flex-shrink-0 z-40 relative shadow-[4px_0_12px_rgba(0,0,0,0.02)]">
<div className="px-6 mb-6">
<h2 className="font-h3 text-h3 font-bold text-on-surface">At-Risk Queue</h2>
<p className="font-data-label text-data-label text-on-surface-variant uppercase tracking-wider mt-1">Clinical Priority</p>
<div className="mt-4 flex gap-2 border-b border-outline-variant pb-4">

<button className="bg-surface-bright text-primary rounded shadow-sm font-bold flex-1 py-2 flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform">
<span className="material-symbols-outlined text-[20px] text-error">priority_high</span>
<span className="text-[10px] uppercase font-data-label">High</span>
</button>
<button className="text-on-surface-variant hover:bg-surface-variant rounded flex-1 py-2 flex flex-col items-center justify-center gap-1 transition-colors">
<span className="material-symbols-outlined text-[20px] text-amber-500">warning</span>
<span className="text-[10px] uppercase font-data-label">Medium</span>
</button>
<button className="text-on-surface-variant hover:bg-surface-variant rounded flex-1 py-2 flex flex-col items-center justify-center gap-1 transition-colors">
<span className="material-symbols-outlined text-[20px] text-emerald-500">info</span>
<span className="text-[10px] uppercase font-data-label">Low</span>
</button>
<button className="text-on-surface-variant hover:bg-surface-variant rounded flex-1 py-2 flex flex-col items-center justify-center gap-1 transition-colors">
<span className="material-symbols-outlined text-[20px]">visibility</span>
<span className="text-[10px] uppercase font-data-label">Watch</span>
</button>
</div>
</div>

<div className="flex-1 overflow-y-auto student-list px-4 space-y-1 pb-20">

<button className="w-full text-left bg-surface-bright rounded-lg p-3 border border-outline-variant shadow-sm relative group">
<div className="absolute left-0 top-0 bottom-0 w-1 bg-status-high rounded-l-lg"></div>
<div className="flex justify-between items-start pl-2">
<div>
<p className="font-bold text-on-surface text-sm">Marcus Johnson</p>
<p className="font-data-label text-[10px] text-secondary mt-0.5">ID: 9482103</p>
</div>
<span className="font-metric-display text-[14px] font-bold text-error">94%</span>
</div>
<div className="flex gap-2 mt-2 pl-2">
<span className="bg-error-container text-on-error-container font-data-label text-[9px] px-1.5 py-0.5 uppercase">Attendance</span>
<span className="bg-error-container text-on-error-container font-data-label text-[9px] px-1.5 py-0.5 uppercase">Academics</span>
</div>
</button>

<button className="w-full text-left hover:bg-surface-bright rounded-lg p-3 border border-transparent hover:border-outline-variant transition-colors relative group">
<div className="absolute left-0 top-0 bottom-0 w-1 bg-status-high rounded-l-lg opacity-50 group-hover:opacity-100"></div>
<div className="flex justify-between items-start pl-2">
<div>
<p className="font-medium text-on-surface-variant text-sm">Sarah Jenkins</p>
<p className="font-data-label text-[10px] text-secondary mt-0.5">ID: 8847291</p>
</div>
<span className="font-metric-display text-[14px] font-bold text-error opacity-70 group-hover:opacity-100">88%</span>
</div>
</button>
<button className="w-full text-left hover:bg-surface-bright rounded-lg p-3 border border-transparent hover:border-outline-variant transition-colors relative group">
<div className="absolute left-0 top-0 bottom-0 w-1 bg-status-high rounded-l-lg opacity-50 group-hover:opacity-100"></div>
<div className="flex justify-between items-start pl-2">
<div>
<p className="font-medium text-on-surface-variant text-sm">David Chen</p>
<p className="font-data-label text-[10px] text-secondary mt-0.5">ID: 4728192</p>
</div>
<span className="font-metric-display text-[14px] font-bold text-error opacity-70 group-hover:opacity-100">85%</span>
</div>
</button>
<button className="w-full text-left hover:bg-surface-bright rounded-lg p-3 border border-transparent hover:border-outline-variant transition-colors relative group">
<div className="absolute left-0 top-0 bottom-0 w-1 bg-status-med rounded-l-lg opacity-50 group-hover:opacity-100"></div>
<div className="flex justify-between items-start pl-2">
<div>
<p className="font-medium text-on-surface-variant text-sm">Alicia Reyes</p>
<p className="font-data-label text-[10px] text-secondary mt-0.5">ID: 3392817</p>
</div>
<span className="font-metric-display text-[14px] font-bold text-status-med opacity-70 group-hover:opacity-100">62%</span>
</div>
</button>
<button className="w-full text-left hover:bg-surface-bright rounded-lg p-3 border border-transparent hover:border-outline-variant transition-colors relative group">
<div className="absolute left-0 top-0 bottom-0 w-1 bg-status-low rounded-l-lg opacity-50 group-hover:opacity-100"></div>
<div className="flex justify-between items-start pl-2">
<div>
<p className="font-medium text-on-surface-variant text-sm">Michael Chang</p>
<p className="font-data-label text-[10px] text-secondary mt-0.5">ID: 1192847</p>
</div>
<span className="font-metric-display text-[14px] font-bold text-status-low opacity-70 group-hover:opacity-100">14%</span>
</div>
</button>

<div className="h-48"></div>
</div>
</aside>

<main className="flex-1 overflow-y-auto p-container-padding relative z-10">

<div className="flex justify-end mb-6">
<div className="inline-flex rounded-md shadow-sm" role="group">
<button className="px-4 py-2 text-sm font-medium text-primary bg-surface-bright border border-outline-variant rounded-l-lg hover:bg-surface-variant focus:z-10 focus:ring-2 focus:ring-primary" type="button">
                    Counselor View
                  </button>
<button className="px-4 py-2 text-sm font-medium text-secondary bg-surface-bright border border-l-0 border-outline-variant rounded-r-lg hover:bg-surface-variant focus:z-10 focus:ring-2 focus:ring-primary" type="button">
                    Teacher View
                  </button>
</div>
</div>
<div className="max-w-6xl mx-auto space-y-section-gap pb-20">

<div className="dossier-card rounded shadow-sm">
<div className="dossier-card-risk-bar bg-status-high"></div>
<div className="p-8 pl-12 flex justify-between items-start border-b border-outline-variant">
<div>
<div className="flex items-center gap-3 mb-2">
<h2 className="font-h1 text-h1 font-bold text-on-surface">Marcus Johnson</h2>
<span className="bg-error-container text-on-error-container font-data-label text-[12px] px-2 py-1 uppercase rounded-none border border-error">High Risk</span>
</div>
<p className="font-body-lg text-secondary">Grade 10 • Homeroom 302 • Age 16</p>
<div className="flex gap-6 mt-6">
<div>
<p className="font-data-label text-data-label text-secondary uppercase mb-1">Student ID</p>
<p className="font-metric-display text-[18px] text-on-surface">9482103</p>
</div>
<div>
<p className="font-data-label text-data-label text-secondary uppercase mb-1">Guardian</p>
<p className="font-body-md text-on-surface">Sarah Johnson (Mother)</p>
<p className="font-body-sm text-secondary">555-019-4821</p>
</div>
</div>
</div>
<div className="text-right">
<p className="font-data-label text-data-label text-secondary uppercase mb-2">Cumulative Risk Score</p>
<p className="font-metric-display text-[64px] text-error font-bold leading-none">94%</p>
<button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition-colors inline-flex items-center gap-2">
<span className="material-symbols-outlined text-[20px]">healing</span>
                                Log Intervention
                            </button>
</div>
</div>

<div className="grid grid-cols-4 divide-x divide-outline-variant bg-surface-bright">
<div className="p-6">
<p className="font-data-label text-data-label text-secondary uppercase mb-2">Attendance</p>
<p className="font-metric-display text-[32px] text-error font-bold">72%</p>
<p className="font-body-sm text-secondary mt-1">YTD Average</p>
</div>
<div className="p-6">
<p className="font-data-label text-data-label text-secondary uppercase mb-2">Current CGPA</p>
<p className="font-metric-display text-[32px] text-amber-500 font-bold">2.1</p>
<p className="font-body-sm text-secondary mt-1">Target: 2.5</p>
</div>
<div className="p-6">
<p className="font-data-label text-data-label text-secondary uppercase mb-2">Incidents</p>
<p className="font-metric-display text-[32px] text-on-surface font-bold">4</p>
<p className="font-body-sm text-secondary mt-1">Last 30 Days</p>
</div>
<div className="p-6">
<p className="font-data-label text-data-label text-secondary uppercase mb-2">Engagement</p>
<p className="font-metric-display text-[32px] text-status-low font-bold">Low</p>
<p className="font-body-sm text-secondary mt-1">Canvas Activity</p>
</div>
</div>
</div>

<div className="grid grid-cols-12 gap-gutter">

<div className="col-span-12 lg:col-span-8 space-y-8">

<div className="dossier-card rounded p-8">
<div className="flex items-center gap-2 mb-6 border-b border-outline-variant pb-4">
<span className="material-symbols-outlined text-primary">psychology</span>
<h3 className="font-h3 text-h3 text-on-surface">SHAP AI Risk Factors</h3>
</div>
<div className="space-y-6">
<div>
<div className="flex justify-between items-end mb-2">
<p className="font-medium text-on-surface">Consecutive Absences (Unexcused)</p>
<p className="font-metric-display text-[16px] text-error">-40% impact</p>
</div>
<div className="w-full bg-surface-container-high h-2 rounded overflow-hidden">
<div className="bg-error h-full" ></div>
</div>
<p className="font-body-sm text-secondary mt-1">Model indicates 5+ unexcused absences in a 3-week period correlates highly with eventual dropout.</p>
</div>
<div>
<div className="flex justify-between items-end mb-2">
<p className="font-medium text-on-surface">Declining Math Scores</p>
<p className="font-metric-display text-[16px] text-amber-500">-25% impact</p>
</div>
<div className="w-full bg-surface-container-high h-2 rounded overflow-hidden">
<div className="bg-amber-500 h-full" ></div>
</div>
<p className="font-body-sm text-secondary mt-1">Algebra II grade dropped from C+ to D- over last two grading periods.</p>
</div>
<div>
<div className="flex justify-between items-end mb-2">
<p className="font-medium text-on-surface">Extracurricular Disengagement</p>
<p className="font-metric-display text-[16px] text-amber-500">-15% impact</p>
</div>
<div className="w-full bg-surface-container-high h-2 rounded overflow-hidden">
<div className="bg-amber-500 h-full" ></div>
</div>
</div>
</div>
</div>

<div className="dossier-card rounded p-8">
<div className="flex items-center gap-2 mb-6 border-b border-outline-variant pb-4">
<span className="material-symbols-outlined text-primary">history</span>
<h3 className="font-h3 text-h3 text-on-surface">Intervention History</h3>
</div>
<div className="relative pl-6 border-l-2 border-outline-variant space-y-8">
<div className="relative">
<div className="absolute -left-[31px] bg-surface-bright rounded-full p-1 border-2 border-outline-variant">
<span className="material-symbols-outlined text-[16px] text-secondary">event</span>
</div>
<p className="font-data-label text-data-label text-secondary uppercase">Oct 12, 2023</p>
<p className="font-medium text-on-surface mt-1">Parent-Teacher Conference</p>
<p className="font-body-sm text-on-surface-variant mt-1">Discussed attendance issues. Mother mentioned changed work schedule affecting morning routine. Agreed to try school breakfast program.</p>
</div>
<div className="relative">
<div className="absolute -left-[31px] bg-surface-bright rounded-full p-1 border-2 border-outline-variant">
<span className="material-symbols-outlined text-[16px] text-secondary">forum</span>
</div>
<p className="font-data-label text-data-label text-secondary uppercase">Sep 28, 2023</p>
<p className="font-medium text-on-surface mt-1">Counselor Check-in</p>
<p className="font-body-sm text-on-surface-variant mt-1">Brief hallway meeting. Marcus seemed withdrawn. Scheduled formal meeting for next week (Did not attend).</p>
</div>
</div>
</div>
</div>

<div className="col-span-12 lg:col-span-4 space-y-8">

<div className="dossier-card rounded p-6 bg-surface-bright">
<h3 className="font-h3 text-[18px] text-on-surface mb-4">Recommended Interventions</h3>
<div className="border border-outline-variant rounded p-4 bg-surface-bright">
<div className="flex justify-between items-start mb-3">
<p className="font-data-label text-data-label text-primary uppercase font-bold">Near-Peer Mentoring</p>
<span className="font-metric-display text-[14px] text-status-low font-bold">89% Match</span>
</div>
<div className="flex items-center gap-3 mb-4">
<div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold">
                                        JT
                                    </div>
<div>
<p className="font-medium text-sm text-on-surface">Jamal Thompson</p>
<p className="font-body-sm text-[12px] text-secondary">Grade 12 • Honor Roll</p>
</div>
</div>
<p className="font-body-sm text-[13px] text-on-surface-variant mb-4">Algorithm suggests strong compatibility based on shared interests (Robotics Club past participation) and similar academic turnaround profile.</p>
<button className="w-full bg-primary text-white font-medium py-2 rounded text-sm hover:bg-opacity-90 transition-opacity">
                                    Initiate Introduction
                                </button>
</div>
</div>

<div className="dossier-card rounded p-6">
<h3 className="font-h3 text-[18px] text-on-surface mb-4">Current Schedule</h3>
<ul className="space-y-3 font-body-sm">
<li className="flex justify-between border-b border-outline-variant pb-2">
<span className="text-secondary">P1 • English Lit</span>
<span className="font-medium text-error">F (52%)</span>
</li>
<li className="flex justify-between border-b border-outline-variant pb-2">
<span className="text-secondary">P2 • Algebra II</span>
<span className="font-medium text-amber-500">D- (61%)</span>
</li>
<li className="flex justify-between border-b border-outline-variant pb-2">
<span className="text-secondary">P3 • Biology</span>
<span className="font-medium text-on-surface">C (74%)</span>
</li>
<li className="flex justify-between">
<span className="text-secondary">P4 • Art History</span>
<span className="font-medium text-status-low">B (85%)</span>
</li>
</ul>
</div>
</div>
</div>
</div>
</main>
</div>
    </div>
  );
}

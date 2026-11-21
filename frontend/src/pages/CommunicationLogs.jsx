import React from 'react';

export default function CommunicationLogs() {
  return (
    <div className="w-full">
      <header className="bg-surface flex justify-between items-center w-full px-container-padding h-20 border-b border-outline-variant relative z-10">
<div className="flex items-center gap-gutter">
<h1 className="font-h2 text-h2 font-bold text-on-surface tracking-tighter">Intervention Intelligence</h1>
<nav className="hidden md:flex gap-unit items-end ml-section-gap h-full">
<a className="text-secondary font-medium pb-2 hover:text-primary transition-colors flex items-center h-full pt-6" href="#">
<span className="font-body-md text-body-md">Student Roster</span>
</a>
<a className="text-primary border-b-2 border-primary font-bold pb-2 flex items-center h-full pt-6 opacity-80 transition-all duration-150" href="#">
<span className="font-body-md text-body-md">Communication Log</span>
</a>
</nav>
</div>
<div className="flex items-center gap-unit">
<button className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-DEFAULT hover:bg-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
<span className="material-symbols-outlined" data-icon="account_circle">account_circle</span>
</button>
</div>
</header>

<main className="flex-1 w-full max-w-[1600px] mx-auto px-container-padding py-section-gap grid grid-cols-12 gap-gutter">

<aside className="col-span-12 md:col-span-3 space-y-gutter">
<div className="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT p-dossier-inset">
<h3 className="font-h3 text-h3 text-on-surface mb-unit">Log Filters</h3>
<p className="font-body-sm text-body-sm text-secondary mb-section-gap">Refine communication records.</p>
<div className="space-y-dossier-inset">

<div>
<label className="font-body-md text-body-md text-on-surface-variant mb-2 block font-medium">Delivery Status</label>
<div className="space-y-2">
<label className="flex items-center gap-2 cursor-pointer group">
<input checked="" className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4" type="checkbox"/>
<span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary">Delivered</span>
</label>
<label className="flex items-center gap-2 cursor-pointer group">
<input className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4" type="checkbox"/>
<span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary">Failed</span>
</label>
<label className="flex items-center gap-2 cursor-pointer group">
<input checked="" className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4" type="checkbox"/>
<span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary">Pending</span>
</label>
</div>
</div>

<div>
<label className="font-body-md text-body-md text-on-surface-variant mb-2 block font-medium">Channel</label>
<select className="w-full bg-transparent border border-outline-variant rounded-DEFAULT p-2 font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none">
<option>All Channels</option>
<option>SMS</option>
<option>Email</option>
<option>IVR</option>
</select>
</div>
<div className="pt-unit">
<button className="w-full bg-secondary-container hover:bg-surface-variant text-on-secondary-container font-body-md text-body-md py-2 rounded-DEFAULT transition-colors font-medium">Reset Filters</button>
</div>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT p-dossier-inset flex flex-col items-start relative overflow-hidden group hover:bg-surface-variant transition-colors cursor-default">
<div className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary-container"></div>
<span className="font-data-label text-data-label text-secondary uppercase tracking-widest mb-2">Total Logs (24h)</span>
<span className="font-metric-display text-metric-display text-on-surface">1,248</span>
<div className="mt-4 flex items-center gap-1 text-sm text-on-surface-variant">
<span className="material-symbols-outlined text-error text-[18px]">trending_up</span>
<span className="font-body-sm text-body-sm"><span className="text-error font-medium">12%</span> failure rate</span>
</div>
</div>
</aside>

<section className="col-span-12 md:col-span-9 bg-surface-container-lowest border border-outline-variant rounded-DEFAULT flex flex-col">
<div className="p-dossier-inset border-b border-outline-variant flex justify-between items-center bg-surface-bright">
<div>
<h2 className="font-h3 text-h3 text-on-surface">Communication Log</h2>
<p className="font-body-sm text-body-sm text-secondary">Real-time dispatch history</p>
</div>
<div className="flex gap-2">
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
<input className="pl-10 pr-4 py-2 border border-outline-variant rounded-DEFAULT font-body-sm text-body-sm bg-transparent focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none w-64" placeholder="Search recipient..." type="text"/>
</div>
<button className="bg-[#0F172A] hover:bg-primary text-white font-body-sm text-body-sm px-4 py-2 rounded-DEFAULT transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">download</span> Export
                    </button>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="border-b border-outline-variant bg-surface-bright">
<th className="p-4 font-data-label text-data-label text-secondary uppercase tracking-wider font-medium w-12 text-center">Pri</th>
<th className="p-4 font-data-label text-data-label text-secondary uppercase tracking-wider font-medium">Type</th>
<th className="p-4 font-data-label text-data-label text-secondary uppercase tracking-wider font-medium">Recipient</th>
<th className="p-4 font-data-label text-data-label text-secondary uppercase tracking-wider font-medium w-1/3">Snippet</th>
<th className="p-4 font-data-label text-data-label text-secondary uppercase tracking-wider font-medium">Date/Time</th>
<th className="p-4 font-data-label text-data-label text-secondary uppercase tracking-wider font-medium">Status</th>
<th className="p-4 font-data-label text-data-label text-secondary uppercase tracking-wider font-medium text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant font-body-sm text-body-sm">

<tr className="hover:bg-surface-variant transition-colors group">
<td className="p-4 text-center">
<div className="w-2 h-2 rounded-full bg-error mx-auto" title="High Priority"></div>
</td>
<td className="p-4 text-on-surface font-medium flex items-center gap-2">
<span className="material-symbols-outlined text-[16px] text-secondary">sms</span> SMS
                            </td>
<td className="p-4 text-on-surface">A. Johnson (ID: 9482)</td>
<td className="p-4 text-secondary truncate max-w-xs" title="URGENT: Please complete mandatory intake forms before 5PM today.">URGENT: Please complete mandatory in...</td>
<td className="p-4 font-data-label text-data-label text-on-surface-variant whitespace-nowrap">2023-10-27 14:02:11</td>
<td className="p-4">
<span className="px-2 py-1 bg-surface-container-high text-on-surface text-[11px] font-bold uppercase tracking-wider">Delivered</span>
</td>
<td className="p-4 text-right space-x-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
<button className="text-[#2563EB] hover:text-on-tertiary-fixed-variant font-medium text-[13px]">View</button>
</td>
</tr>

<tr className="hover:bg-surface-variant transition-colors group">
<td className="p-4 text-center">
<div className="w-2 h-2 rounded-full bg-error mx-auto" title="High Priority"></div>
</td>
<td className="p-4 text-on-surface font-medium flex items-center gap-2">
<span className="material-symbols-outlined text-[16px] text-secondary">mail</span> Email
                            </td>
<td className="p-4 text-on-surface">S. Williams (ID: 1104)</td>
<td className="p-4 text-secondary truncate max-w-xs" title="Missing assignment alert: Intro to Psychology.">Missing assignment alert: Intro to Ps...</td>
<td className="p-4 font-data-label text-data-label text-on-surface-variant whitespace-nowrap">2023-10-27 13:45:00</td>
<td className="p-4">
<span className="px-2 py-1 bg-[#FEE2E2] text-[#991B1B] text-[11px] font-bold uppercase tracking-wider">Failed</span>
</td>
<td className="p-4 text-right space-x-3 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
<button className="text-on-surface hover:text-primary font-medium text-[13px]">Retry</button>
<button className="text-[#2563EB] hover:text-on-tertiary-fixed-variant font-medium text-[13px]">View</button>
</td>
</tr>

<tr className="hover:bg-surface-variant transition-colors group">
<td className="p-4 text-center">
<div className="w-2 h-2 rounded-full bg-surface-tint mx-auto" title="Low Priority"></div>
</td>
<td className="p-4 text-on-surface font-medium flex items-center gap-2">
<span className="material-symbols-outlined text-[16px] text-secondary">phone_in_talk</span> IVR
                            </td>
<td className="p-4 text-on-surface">M. Davis (ID: 3392)</td>
<td className="p-4 text-secondary truncate max-w-xs" title="Automated check-in reminder for upcoming appointment.">Automated check-in reminder for upco...</td>
<td className="p-4 font-data-label text-data-label text-on-surface-variant whitespace-nowrap">2023-10-27 11:15:42</td>
<td className="p-4">
<span className="px-2 py-1 bg-surface-container-high text-on-surface text-[11px] font-bold uppercase tracking-wider">Delivered</span>
</td>
<td className="p-4 text-right space-x-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
<button className="text-[#2563EB] hover:text-on-tertiary-fixed-variant font-medium text-[13px]">View</button>
</td>
</tr>

<tr className="hover:bg-surface-variant transition-colors group">
<td className="p-4 text-center">
<div className="w-2 h-2 rounded-full bg-surface-tint mx-auto" title="Medium Priority"></div>
</td>
<td className="p-4 text-on-surface font-medium flex items-center gap-2">
<span className="material-symbols-outlined text-[16px] text-secondary">sms</span> SMS
                            </td>
<td className="p-4 text-on-surface">J. Smith (ID: 8821)</td>
<td className="p-4 text-secondary truncate max-w-xs" title="Your advising appointment is scheduled for tomorrow at 10AM.">Your advising appointment is schedule...</td>
<td className="p-4 font-data-label text-data-label text-on-surface-variant whitespace-nowrap">2023-10-27 09:30:15</td>
<td className="p-4">
<span className="px-2 py-1 bg-surface-container-high text-on-surface text-[11px] font-bold uppercase tracking-wider">Delivered</span>
</td>
<td className="p-4 text-right space-x-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
<button className="text-[#2563EB] hover:text-on-tertiary-fixed-variant font-medium text-[13px]">View</button>
</td>
</tr>
</tbody>
</table>
</div>
<div className="p-4 border-t border-outline-variant flex items-center justify-between text-secondary bg-surface-bright mt-auto rounded-b-DEFAULT">
<span className="font-body-sm text-body-sm">Showing 1-4 of 1,248 logs</span>
<div className="flex gap-2">
<button className="px-3 py-1 border border-outline-variant rounded-DEFAULT hover:bg-surface transition-colors disabled:opacity-50" disabled="">Prev</button>
<button className="px-3 py-1 border border-outline-variant rounded-DEFAULT hover:bg-surface transition-colors">Next</button>
</div>
</div>
</section>
</main>
    </div>
  );
}

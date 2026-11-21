import React from 'react';
import { useApp } from '../context/AppContext';

export default function CommunicationLogsView() {
  const {
    filteredCommunicationLogs,
    logStatusFilters,
    toggleLogStatusFilter,
    logChannelFilter,
    setLogChannelFilter,
    resetLogFilters,
    logsSearch,
    setLogsSearch,
    retryCommunicationLog,
    exportLogsCSV,
    setSelectedLogDetail
  } = useApp();

  const totalLogsCount = filteredCommunicationLogs.length;
  const failedCount = filteredCommunicationLogs.filter((l) => l.status === 'Failed').length;
  const failureRate = totalLogsCount > 0 ? ((failedCount / totalLogsCount) * 100).toFixed(0) : 0;

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'SMS':
        return 'sms';
      case 'Email':
        return 'mail';
      case 'IVR':
        return 'call';
      default:
        return 'chat';
    }
  };

  return (
    <main className="flex-1 w-full max-w-[1600px] mx-auto px-container-padding py-section-gap grid grid-cols-12 gap-gutter pt-24">
      {/* Filters Sidebar (3 columns) */}
      <aside className="col-span-12 md:col-span-3 space-y-gutter">
        <div className="bg-surface-container-lowest border border-outline-variant rounded p-dossier-inset shadow-sm">
          <h3 className="font-h3 text-h3 text-on-surface mb-unit">Log Filters</h3>
          <p className="font-body-sm text-body-sm text-secondary mb-6">Refine communication records.</p>
          
          <div className="space-y-6">
            {/* Status Filter */}
            <div>
              <label className="font-body-md text-body-md text-on-surface-variant mb-2 block font-medium">
                Delivery Status
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={logStatusFilters.Delivered}
                    onChange={() => toggleLogStatusFilter('Delivered')}
                    className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4"
                  />
                  <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary">
                    Delivered
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={logStatusFilters.Failed}
                    onChange={() => toggleLogStatusFilter('Failed')}
                    className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4"
                  />
                  <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary">
                    Failed
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={logStatusFilters.Pending}
                    onChange={() => toggleLogStatusFilter('Pending')}
                    className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4"
                  />
                  <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary">
                    Pending
                  </span>
                </label>
              </div>
            </div>

            {/* Type / Channel Filter */}
            <div>
              <label className="font-body-md text-body-md text-on-surface-variant mb-2 block font-medium">
                Channel
              </label>
              <select
                value={logChannelFilter}
                onChange={(e) => setLogChannelFilter(e.target.value)}
                className="w-full bg-transparent border border-outline-variant rounded p-2 font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none"
              >
                <option value="All Channels">All Channels</option>
                <option value="SMS">SMS</option>
                <option value="Email">Email</option>
                <option value="IVR">IVR</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                onClick={resetLogFilters}
                className="w-full bg-secondary-container hover:bg-surface-variant text-on-secondary-container font-body-md text-body-md py-2 rounded transition-colors font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded p-dossier-inset flex flex-col items-start relative overflow-hidden group hover:bg-surface-variant transition-colors cursor-default shadow-sm">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary-container"></div>
          <span className="font-data-label text-data-label text-secondary uppercase tracking-widest mb-2">
            Total Logs ({totalLogsCount})
          </span>
          <span className="font-metric-display text-[40px] text-on-surface leading-none font-bold">
            {totalLogsCount}
          </span>
          <div className="mt-4 flex items-center gap-1.5 text-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-error text-[18px]">trending_up</span>
            <span className="font-body-sm text-body-sm">
              <span className="text-error font-medium">{failureRate}%</span> failure rate
            </span>
          </div>
        </div>
      </aside>

      {/* Main Data Canvas (9 columns) */}
      <section className="col-span-12 md:col-span-9 bg-surface-container-lowest border border-outline-variant rounded flex flex-col shadow-sm overflow-hidden">
        <div className="p-dossier-inset border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center bg-surface-bright gap-4">
          <div>
            <h2 className="font-h3 text-h3 text-on-surface">Communication Log</h2>
            <p className="font-body-sm text-body-sm text-secondary">Real-time dispatch history</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                search
              </span>
              <input
                type="text"
                value={logsSearch}
                onChange={(e) => setLogsSearch(e.target.value)}
                placeholder="Search recipient..."
                className="pl-10 pr-4 py-2 border border-outline-variant rounded font-body-sm text-body-sm bg-transparent focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none w-full sm:w-64"
              />
            </div>
            <button
              onClick={exportLogsCSV}
              className="bg-[#0F172A] hover:bg-primary text-white font-body-sm text-body-sm px-4 py-2 rounded transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[18px]">download</span> Export
            </button>
          </div>
        </div>

        {/* Log Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-bright">
                <th className="p-4 font-data-label text-data-label text-secondary uppercase tracking-wider font-medium w-12 text-center">
                  Pri
                </th>
                <th className="p-4 font-data-label text-data-label text-secondary uppercase tracking-wider font-medium">
                  Type
                </th>
                <th className="p-4 font-data-label text-data-label text-secondary uppercase tracking-wider font-medium">
                  Recipient
                </th>
                <th className="p-4 font-data-label text-data-label text-secondary uppercase tracking-wider font-medium w-1/3">
                  Snippet
                </th>
                <th className="p-4 font-data-label text-data-label text-secondary uppercase tracking-wider font-medium">
                  Date/Time
                </th>
                <th className="p-4 font-data-label text-data-label text-secondary uppercase tracking-wider font-medium">
                  Status
                </th>
                <th className="p-4 font-data-label text-data-label text-secondary uppercase tracking-wider font-medium text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant font-body-sm text-body-sm">
              {filteredCommunicationLogs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-secondary">
                    No communication logs found for current search and filters.
                  </td>
                </tr>
              ) : (
                filteredCommunicationLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-variant transition-colors group">
                    <td className="p-4 text-center">
                      <div
                        className={`w-2 h-2 rounded-full mx-auto ${
                          log.priority === 'high' ? 'bg-error' : 'bg-secondary'
                        }`}
                        title={log.priority === 'high' ? 'High Priority' : 'Normal Priority'}
                      ></div>
                    </td>
                    <td className="p-4 text-on-surface font-medium flex items-center gap-2 whitespace-nowrap">
                      <span className="material-symbols-outlined text-[16px] text-secondary">
                        {getChannelIcon(log.channel)}
                      </span>{' '}
                      {log.channel}
                    </td>
                    <td className="p-4 text-on-surface font-medium">{log.recipient}</td>
                    <td className="p-4 text-secondary truncate max-w-xs" title={log.snippet}>
                      {log.snippet}
                    </td>
                    <td className="p-4 font-data-label text-data-label text-on-surface-variant whitespace-nowrap">
                      {log.dateTime}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 text-[11px] font-bold uppercase tracking-wider ${
                          log.status === 'Delivered'
                            ? 'bg-surface-container-high text-on-surface'
                            : log.status === 'Failed'
                            ? 'bg-error-container text-on-error-container'
                            : 'bg-yellow-900/50 text-yellow-500'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      {log.status === 'Failed' && (
                        <button
                          onClick={() => retryCommunicationLog(log.id)}
                          className="text-on-surface hover:text-primary font-medium text-[13px] underline"
                        >
                          Retry
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedLogDetail(log)}
                        className="text-[#2563EB] hover:text-on-tertiary-fixed-variant font-medium text-[13px]"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

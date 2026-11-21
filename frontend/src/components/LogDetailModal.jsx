import React from 'react';
import { useApp } from '../context/AppContext';

export default function LogDetailModal() {
  const { selectedLogDetail, setSelectedLogDetail, retryCommunicationLog } = useApp();

  if (!selectedLogDetail) return null;

  const { id, priority, channel, recipient, recipientName, studentId, fullMessage, dateTime, status } = selectedLogDetail;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-bright border border-outline-variant rounded-lg max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center border-b border-outline-variant pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">visibility</span>
            <h3 className="font-h3 text-h3 text-on-surface">Communication Log Detail</h3>
          </div>
          <button
            onClick={() => setSelectedLogDetail(null)}
            className="text-secondary hover:text-primary transition-colors text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4 font-body-sm text-on-surface">
          <div className="flex justify-between items-center bg-surface-container-low p-3 rounded">
            <div>
              <p className="font-data-label text-[10px] text-secondary uppercase">Log Identifier</p>
              <p className="font-metric-display text-sm font-bold">{id}</p>
            </div>
            <span
              className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded ${
                status === 'Delivered'
                  ? 'bg-surface-container-high text-on-surface'
                  : status === 'Failed'
                  ? 'bg-[#FEE2E2] text-[#991B1B]'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-data-label text-[10px] text-secondary uppercase">Recipient</p>
              <p className="font-medium text-sm">{recipient}</p>
            </div>
            <div>
              <p className="font-data-label text-[10px] text-secondary uppercase">Channel</p>
              <p className="font-medium text-sm">{channel}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-data-label text-[10px] text-secondary uppercase">Priority</p>
              <p className="font-medium text-sm uppercase">{priority}</p>
            </div>
            <div>
              <p className="font-data-label text-[10px] text-secondary uppercase">Dispatched At</p>
              <p className="font-data-label text-xs text-on-surface-variant">{dateTime}</p>
            </div>
          </div>

          <div>
            <p className="font-data-label text-[10px] text-secondary uppercase mb-1">Full Message Content</p>
            <div className="bg-surface-bright border border-outline-variant p-3 rounded font-body-sm text-sm text-on-surface-variant leading-relaxed">
              {fullMessage || selectedLogDetail.snippet}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-outline-variant">
            {status === 'Failed' && (
              <button
                onClick={() => {
                  retryCommunicationLog(id);
                  setSelectedLogDetail(null);
                }}
                className="px-4 py-2 bg-error text-white rounded font-body-md text-sm font-medium hover:bg-opacity-90 transition-opacity"
              >
                Retry Dispatch
              </button>
            )}
            <button
              onClick={() => setSelectedLogDetail(null)}
              className="px-4 py-2 bg-secondary-container hover:bg-surface-variant text-on-secondary-container rounded font-body-md text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

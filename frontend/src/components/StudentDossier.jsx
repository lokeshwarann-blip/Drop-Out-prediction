import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import WhatIfSimulator from './WhatIfSimulator';

export default function StudentDossier() {
  const {
    selectedStudent,
    viewMode,
    setIsInterventionModalOpen,
    initiatePeerMentoring
  } = useApp();

  if (!selectedStudent) {
    return (
      <div className="flex-1 p-container-padding flex items-center justify-center min-h-[600px]">
        <div className="text-center p-8 bg-surface-bright border border-outline-variant rounded max-w-md">
          <span className="material-symbols-outlined text-[48px] text-outline mb-2">person_search</span>
          <h3 className="font-h3 text-h3 text-on-surface">No Student Selected</h3>
          <p className="font-body-sm text-secondary mt-1">
            Please select a student from the At-Risk Queue on the left to inspect their dossier.
          </p>
        </div>
      </div>
    );
  }

  const {
    id,
    name,
    riskScore,
    riskTier,
    grade,
    homeroom,
    age,
    guardian,
    readouts,
    shapFactors,
    schedule,
    peerMatch,
    interventionHistory
  } = selectedStudent;

  const [deltas, setDeltas] = useState(null);
  const [isLoadingDeltas, setIsLoadingDeltas] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoadingDeltas(true);
    fetch(`http://localhost:8001/students/${id}/deltas`)
      .then(res => res.json())
      .then(data => {
        setDeltas(data);
        setIsLoadingDeltas(false);
      })
      .catch(err => {
        console.error("Failed to fetch deltas", err);
        setIsLoadingDeltas(false);
      });
  }, [id]);

  const isHighRisk = riskScore >= 80 || riskTier === 'High';
  const isMedRisk = riskScore >= 50 && riskScore < 80;

  const riskBarBg = isHighRisk ? 'bg-status-high' : isMedRisk ? 'bg-status-med' : 'bg-status-low';
  const riskTextColor = isHighRisk ? 'text-error' : isMedRisk ? 'text-amber-500' : 'text-emerald-500';

  return (
    <div className="max-w-6xl mx-auto space-y-section-gap pb-20">
      {/* Main Dossier Header Card */}
      <div className="dossier-card rounded shadow-sm">
        <div className={`dossier-card-risk-bar ${riskBarBg}`}></div>

        <div className="p-8 pl-12 flex flex-col md:flex-row justify-between items-start border-b border-outline-variant gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="font-h1 text-h1 font-bold text-on-surface">{name}</h2>
              <span
                className={`font-data-label text-[12px] px-2.5 py-1 uppercase border font-bold ${
                  isHighRisk
                    ? 'bg-error-container text-on-error-container border-error'
                    : isMedRisk
                    ? 'bg-amber-100 text-amber-800 border-amber-400'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-400'
                }`}
              >
                {riskTier} Risk
              </span>
            </div>
            <p className="font-body-lg text-secondary">
              {grade} • {homeroom} • Age {age}
            </p>

            <div className="flex flex-wrap gap-8 mt-6">
              <div>
                <p className="font-data-label text-data-label text-secondary uppercase mb-1">Student ID</p>
                <p className="font-metric-display text-[18px] text-on-surface font-semibold">{id}</p>
              </div>
              <div>
                <p className="font-data-label text-data-label text-secondary uppercase mb-1">Guardian</p>
                <p className="font-body-md text-on-surface font-medium">{guardian?.name || 'N/A'}</p>
                <p className="font-body-sm text-secondary">{guardian?.phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="text-left md:text-right w-full md:w-auto">
            <p className="font-data-label text-data-label text-secondary uppercase mb-2">
              Cumulative Risk Score
            </p>
            <p className={`font-metric-display text-[64px] font-bold leading-none ${riskTextColor}`}>
              {riskScore}%
            </p>
            <button
              onClick={() => setIsInterventionModalOpen(true)}
              className="mt-4 w-full md:w-auto bg-[#000000] hover:bg-opacity-90 text-white font-medium py-2.5 px-6 rounded transition-all inline-flex items-center justify-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">healing</span>
              Log Intervention
            </button>
          </div>
        </div>

        {/* Readouts Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-outline-variant bg-surface-bright">
          <div className="p-6">
            <p className="font-data-label text-data-label text-secondary uppercase mb-2">Attendance</p>
            <p className="font-metric-display text-[32px] text-error font-bold">{readouts?.attendance}</p>
            <p className="font-body-sm text-secondary mt-1">YTD Average</p>
          </div>
          <div className="p-6">
            <p className="font-data-label text-data-label text-secondary uppercase mb-2">Current CGPA</p>
            <p className="font-metric-display text-[32px] text-amber-500 font-bold">{readouts?.cgpa}</p>
            <p className="font-body-sm text-secondary mt-1">Target: {readouts?.targetCgpa}</p>
          </div>
          <div className="p-6">
            <p className="font-data-label text-data-label text-secondary uppercase mb-2">Incidents</p>
            <p className="font-metric-display text-[32px] text-on-surface font-bold">{readouts?.incidents}</p>
            <p className="font-body-sm text-secondary mt-1">Last 30 Days</p>
          </div>
          <div className="p-6">
            <p className="font-data-label text-data-label text-secondary uppercase mb-2">Engagement</p>
            <p className="font-metric-display text-[32px] text-emerald-600 font-bold">{readouts?.engagement}</p>
            <p className="font-body-sm text-secondary mt-1">LMS Activity</p>
          </div>
        </div>
        
        {/* Trend Analysis Bar */}
        {deltas && deltas.delta_30d && (
          <div className="bg-surface-container-low border-t border-outline-variant p-4 flex justify-around">
            <div className="text-center">
               <p className="font-data-label text-[10px] text-secondary uppercase tracking-wider mb-1">30d Attendance Trend</p>
               <p className={`font-bold text-lg ${deltas.delta_30d.attendance_pct_delta < 0 ? 'text-error' : 'text-emerald-600'}`}>
                 {deltas.delta_30d.attendance_pct_delta > 0 ? '+' : ''}{deltas.delta_30d.attendance_pct_delta}%
               </p>
            </div>
            <div className="text-center border-l border-outline-variant pl-8">
               <p className="font-data-label text-[10px] text-secondary uppercase tracking-wider mb-1">30d Score Trend</p>
               <p className={`font-bold text-lg ${deltas.delta_30d.avg_score_delta < 0 ? 'text-error' : 'text-emerald-600'}`}>
                 {deltas.delta_30d.avg_score_delta > 0 ? '+' : ''}{deltas.delta_30d.avg_score_delta} pts
               </p>
            </div>
            <div className="text-center border-l border-outline-variant pl-8">
               <p className="font-data-label text-[10px] text-secondary uppercase tracking-wider mb-1">Prior Fee Status</p>
               <p className={`font-bold text-lg ${deltas.delta_30d.fee_status_then !== readouts?.tags?.[1] ? 'text-amber-500' : 'text-on-surface'}`}>
                 {deltas.delta_30d.fee_status_then}
               </p>
            </div>
          </div>
        )}
      </div>

      {/* 12-Column Grid Area */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* Main Column (8 cols) */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* AI Explainability (SHAP Risk Factors) */}
          <div className="dossier-card rounded p-8">
            <div className="flex items-center gap-2 mb-6 border-b border-outline-variant pb-4">
              <span className="material-symbols-outlined text-primary">psychology</span>
              <h3 className="font-h3 text-h3 text-on-surface">SHAP AI Risk Factors</h3>
            </div>

            {viewMode === 'counselor' ? (
              <div className="space-y-6">
                {shapFactors && shapFactors.length > 0 ? (
                  shapFactors.map((shap, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-end mb-2">
                        <p className="font-medium text-on-surface">{shap.factor}</p>
                        <p
                          className={`font-metric-display text-[16px] font-bold ${
                            shap.impact.includes('-') ? 'text-error' : 'text-emerald-600'
                          }`}
                        >
                          {shap.impact}
                        </p>
                      </div>
                      <div className="w-full bg-surface-container-high h-2 rounded overflow-hidden">
                        <div
                          className={`h-full ${
                            shap.color === 'error'
                              ? 'bg-error'
                              : shap.color === 'amber-500'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: shap.width || '50%' }}
                        ></div>
                      </div>
                      <p className="font-body-sm text-secondary mt-1.5">{shap.desc}</p>
                    </div>
                  ))
                ) : (
                  <p className="font-body-sm text-secondary italic">No adverse SHAP risk factors identified.</p>
                )}
              </div>
            ) : (
              <div className="p-4 bg-surface-container-low border border-outline-variant rounded text-on-surface-variant">
                <p className="font-body-md font-semibold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">visibility_off</span>
                  Teacher View Active
                </p>
                <p className="font-body-sm text-secondary mt-1">
                  Detailed SHAP ML parameters and sensitive personal notes are restricted per RBAC policy. 
                  Student is currently flagged for <span className="font-bold text-error">{riskTier} Risk</span> monitoring.
                </p>
              </div>
            )}
          </div>

          {/* Intervention History Timeline */}
          <div className="dossier-card rounded p-8">
            <div className="flex justify-between items-center mb-6 border-b border-outline-variant pb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">history</span>
                <h3 className="font-h3 text-h3 text-on-surface">Intervention History</h3>
              </div>
              <button
                onClick={() => setIsInterventionModalOpen(true)}
                className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
              >
                + Add Record
              </button>
            </div>

            {interventionHistory && interventionHistory.length > 0 ? (
              <div className="relative pl-6 border-l-2 border-outline-variant space-y-8">
                {interventionHistory.map((item) => (
                  <div key={item.id} className="relative">
                    <div className="absolute -left-[31px] bg-surface-bright rounded-full p-1 border-2 border-outline-variant">
                      <span className="material-symbols-outlined text-[16px] text-secondary">
                        {item.icon || 'event'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="font-data-label text-data-label text-secondary uppercase">{item.date}</p>
                      <span className="font-data-label text-[10px] px-2 py-0.5 bg-surface-container text-on-surface-variant rounded">
                        {item.channel}
                      </span>
                    </div>
                    <p className="font-medium text-on-surface mt-1 text-base">{item.title}</p>
                    <p className="font-body-sm text-on-surface-variant mt-1 bg-surface-bright p-3 border border-outline-variant rounded">
                      {item.notes}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-body-sm text-secondary italic">No past interventions recorded for this student.</p>
            )}
          </div>
        </div>

        {/* Side Column (4 cols) */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          {/* Near-Peer Mentoring Suggestion */}
          <div className="dossier-card rounded p-6 bg-surface-bright">
            <h3 className="font-h3 text-[18px] text-on-surface mb-4">Recommended Interventions</h3>
            {peerMatch ? (
              <div className="border border-outline-variant rounded p-4 bg-surface-bright shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <p className="font-data-label text-data-label text-primary uppercase font-bold">
                    Near-Peer Mentoring
                  </p>
                  <span className="font-metric-display text-[14px] text-emerald-600 font-bold">
                    {peerMatch.matchPercent}
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold">
                    {peerMatch.initials}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-on-surface">{peerMatch.name}</p>
                    <p className="font-body-sm text-[12px] text-secondary">
                      {peerMatch.grade} • {peerMatch.badge}
                    </p>
                  </div>
                </div>
                <p className="font-body-sm text-[13px] text-on-surface-variant mb-4 bg-surface-container-low p-2.5 rounded border border-outline-variant">
                  "{peerMatch.reason}"
                </p>
                <button
                  onClick={() => initiatePeerMentoring(id)}
                  className="w-full bg-primary hover:bg-opacity-90 text-white font-medium py-2 rounded text-sm transition-opacity flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">group_add</span>
                  Initiate Introduction
                </button>
              </div>
            ) : (
              <div className="p-4 border border-outline-variant rounded bg-surface-bright text-center">
                <p className="font-body-sm text-secondary">No active peer match needed for current risk profile.</p>
              </div>
            )}
          </div>

          {/* Current Schedule */}
          <div className="dossier-card rounded p-6">
            <h3 className="font-h3 text-[18px] text-on-surface mb-4">Current Schedule</h3>
            <ul className="space-y-3 font-body-sm">
              {schedule && schedule.length > 0 ? (
                schedule.map((item, idx) => (
                  <li key={idx} className="flex justify-between border-b border-outline-variant pb-2">
                    <span className="text-secondary">{item.period} • {item.course}</span>
                    <span
                      className={`font-medium ${
                        item.status === 'error'
                          ? 'text-error font-bold'
                          : item.status === 'warning'
                          ? 'text-amber-500'
                          : item.status === 'success'
                          ? 'text-emerald-600'
                          : 'text-on-surface'
                      }`}
                    >
                      {item.grade}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-secondary text-xs">No active courses registered.</li>
              )}
            </ul>
          </div>
          
          {/* What-If Simulator */}
          <WhatIfSimulator student={selectedStudent} />
        </div>
      </div>
    </div>
  );
}

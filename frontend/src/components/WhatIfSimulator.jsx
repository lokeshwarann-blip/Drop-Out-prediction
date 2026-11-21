import React, { useState, useEffect } from 'react';

export default function WhatIfSimulator({ student, onSimulate }) {
  const [attendance, setAttendance] = useState(parseFloat(student.readouts.attendance.replace('%', '')));
  const [score, setScore] = useState(parseFloat(student.readouts.cgpa) * 20); // convert 5.0 cgpa approx to 100 max
  const [feeStatus, setFeeStatus] = useState(student.tags[1]);
  const [loading, setLoading] = useState(false);
  const [simulatedResult, setSimulatedResult] = useState(null);
  const [simError, setSimError] = useState(null);

  const handleSimulate = async () => {
    setLoading(true);
    setSimError(null);
    try {
      const response = await fetch(`http://localhost:8001/students/${student.id}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attendance_pct: attendance,
          avg_score: score,
          fee_status: feeStatus
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Simulation failed");
      }
      setSimulatedResult(data);
    } catch (err) {
      console.error(err);
      setSimError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (tier) => {
    return tier === 'High' ? 'text-error' : tier === 'Medium' ? 'text-amber-500' : 'text-emerald-500';
  };

  return (
    <div className="dossier-card rounded p-6 mt-8 border border-outline-variant">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-h3 text-[18px] text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">tune</span>
          What-If Simulator
        </h3>
        {simulatedResult && (
          <div className="text-right">
             <p className="font-data-label text-[10px] text-secondary uppercase mb-1">Simulated Risk</p>
             <p className={`font-metric-display text-[32px] font-bold leading-none ${getRiskColor(simulatedResult.simulated_risk_tier)}`}>
               {simulatedResult.simulated_risk_score}%
             </p>
          </div>
        )}
      </div>
      
      {simError && (
        <div className="bg-error-container text-on-error-container p-2 rounded mb-4 text-xs">
          Error: {simError.toString()}
        </div>
      )}
      
      <p className="font-body-sm text-secondary mb-6">Adjust parameters below to see how changes might affect {student.name}'s risk score.</p>
      
      <div className="space-y-4">
        <div>
          <label className="flex justify-between font-body-sm text-on-surface mb-1">
            <span>Attendance (%)</span>
            <span className="font-bold">{attendance.toFixed(1)}%</span>
          </label>
          <input 
            type="range" 
            min="0" max="100" step="1"
            value={attendance}
            onChange={(e) => setAttendance(parseFloat(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
        
        <div>
          <label className="flex justify-between font-body-sm text-on-surface mb-1">
            <span>Average Score (0-100)</span>
            <span className="font-bold">{score.toFixed(1)}</span>
          </label>
          <input 
            type="range" 
            min="0" max="100" step="1"
            value={score}
            onChange={(e) => setScore(parseFloat(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div>
          <label className="block font-body-sm text-on-surface mb-1">Fee Status</label>
          <select 
            value={feeStatus}
            onChange={(e) => setFeeStatus(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant text-on-surface rounded p-2 text-sm"
          >
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
        
        <button 
          onClick={handleSimulate}
          disabled={loading}
          className="w-full mt-4 bg-primary text-white py-2 rounded text-sm font-medium hover:bg-opacity-90 transition-opacity flex justify-center items-center gap-2"
        >
          {loading ? 'Simulating...' : 'Run Simulation'}
          <span className="material-symbols-outlined text-[18px]">play_circle</span>
        </button>
      </div>
    </div>
  );
}

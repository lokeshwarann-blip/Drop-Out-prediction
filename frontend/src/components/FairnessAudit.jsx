import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function FairnessAudit() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8001/api/fairness')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-on-surface">Loading Fairness Metrics...</div>;
  }

  if (!data) {
    return <div className="p-8 text-center text-error">Failed to load fairness metrics.</div>;
  }

  const chartData = data.metrics.map(m => ({
    name: m.bracket,
    "Flag Rate (%)": m.flagRate,
    "False Positive Rate (%)": m.falsePositiveRate
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-4xl text-primary">gavel</span>
          Fairness & Bias Audit
        </h1>
        <p className="text-secondary mt-2">
          Monitoring predictive parity across protected demographics. Current slice: <span className="font-bold uppercase">{data.demographic}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-bright border border-outline-variant p-6 rounded shadow-sm flex flex-col justify-between">
          <h3 className="font-h3 text-secondary text-sm uppercase mb-2">Disparate Impact Ratio</h3>
          <p className={`text-4xl font-bold ${data.disparate_impact_ratio < 0.8 ? 'text-error' : 'text-emerald-500'}`}>
            {data.disparate_impact_ratio.toFixed(2)}
          </p>
          <p className="text-xs text-secondary mt-2">
            (High vs Low Flag Rate). Threshold &gt; 0.8 is considered equitable.
          </p>
        </div>
      </div>

      <div className="bg-surface-bright border border-outline-variant p-6 rounded shadow-sm mt-8">
        <h3 className="font-h3 text-on-surface mb-6">Risk Distributions by Income Bracket</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} />
              <Legend />
              <Bar dataKey="Flag Rate (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="False Positive Rate (%)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-surface-bright border border-outline-variant p-6 rounded shadow-sm mt-8">
        <h3 className="font-h3 text-on-surface mb-4">"Why Not Flagged" Explorer</h3>
        <p className="text-sm text-secondary mb-6">
          Investigate specific individuals belonging to high-risk demographics who the model accurately identified as Low Risk due to counter-balancing protective factors.
        </p>

        {data.why_not_flagged_examples.map(ex => (
          <div key={ex.id} className="bg-surface-container-low border border-outline p-4 rounded mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-on-surface">{ex.name} ({ex.id})</h4>
              <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded font-bold border border-emerald-400">
                Risk Score: {ex.risk_score}%
              </span>
            </div>
            <p className="text-sm text-on-surface-variant mb-4">{ex.reasoning}</p>
            
            <div className="space-y-3">
              <h5 className="text-xs uppercase text-secondary font-bold">Top Protective Factors:</h5>
              {ex.factors.map((f, i) => (
                <div key={i} className="flex items-start gap-3 bg-surface-bright p-3 rounded border border-outline-variant">
                  <span className="font-bold text-emerald-500 font-metric-display">{f.impact}</span>
                  <div>
                    <p className="font-bold text-sm text-on-surface">{f.factor}</p>
                    <p className="text-xs text-secondary">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

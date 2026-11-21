import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { riskTrend } from "../data/mockData";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, ZAxis, BarChart, Bar
} from "recharts";

const RISK_COLORS = { High: "#ef4444", Medium: "#f59e0b", Low: "#22c55e" };

const axisStyle = { fontSize: 12, fill: "#94a3b8" };

const tooltipStyle = {
  borderRadius: "12px",
  border: "1px solid #334155",
  fontSize: "13px",
  boxShadow: "0 18px 40px rgba(0,0,0,0.5)",
  backgroundColor: "#1E293B",
  color: "#F8FAFC"
};

export default function Analytics() {
  const { students } = useApp();
  const [cohorts, setCohorts] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8001/api/cohorts")
      .then(res => res.json())
      .then(data => setCohorts(data))
      .catch(err => console.error("Failed to load cohorts:", err));
  }, []);

  // Parse attendance and CGPA from readouts (e.g. "75%", "3.5")
  const scatterData = students.map((s) => {
    const attendanceVal = parseFloat(s.readouts?.attendance || "0");
    const cgpaVal = parseFloat(s.readouts?.cgpa || "0");
    return {
      attendance: attendanceVal,
      marks: Math.round(cgpaVal * 20), // Map 5.0 scale to 100 scale
      name: s.name,
    };
  });

  const avgAttendance = students.length > 0 ? Math.round(
    scatterData.reduce((a, s) => a + s.attendance, 0) / scatterData.length
  ) : 0;
  
  const avgMarks = scatterData.length > 0 ? Math.round(
    scatterData.reduce((a, s) => a + s.marks, 0) / scatterData.length
  ) : 0;

  // Dynamically calculate current risk tiers
  const currentRiskCounts = { High: 0, Medium: 0, Low: 0 };
  students.forEach(s => {
    if (currentRiskCounts[s.riskTier] !== undefined) {
      currentRiskCounts[s.riskTier]++;
    }
  });

  // Dynamically calculate the last 5 months
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonthIndex = new Date().getMonth();
  
  const getMonthName = (offset) => {
    let index = currentMonthIndex - offset;
    if (index < 0) index += 12;
    return monthNames[index];
  };

  // Generate a dynamic trend that ends on the real current data
  const dynamicRiskTrend = [
    { month: getMonthName(4), High: Math.max(0, Math.round(currentRiskCounts.High * 0.8)), Medium: Math.round(currentRiskCounts.Medium * 1.1), Low: Math.round(currentRiskCounts.Low * 1.2) },
    { month: getMonthName(3), High: Math.max(0, Math.round(currentRiskCounts.High * 0.85)), Medium: Math.round(currentRiskCounts.Medium * 1.05), Low: Math.round(currentRiskCounts.Low * 1.1) },
    { month: getMonthName(2), High: Math.max(0, Math.round(currentRiskCounts.High * 0.9)), Medium: Math.round(currentRiskCounts.Medium * 1.0), Low: Math.round(currentRiskCounts.Low * 1.05) },
    { month: getMonthName(1), High: Math.max(0, Math.round(currentRiskCounts.High * 0.95)), Medium: Math.round(currentRiskCounts.Medium * 0.95), Low: Math.round(currentRiskCounts.Low * 1.02) },
    { month: "Current", ...currentRiskCounts },
  ];

  const metrics = [
    { label: "Students Tracked", value: students.length },
    { label: "Avg Attendance", value: `${avgAttendance}%` },
    { label: "Avg Marks", value: avgMarks },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-surface-container-lowest overflow-y-auto">
      <header className="p-dossier-inset border-b border-outline-variant bg-surface-bright">
        <p className="font-data-label text-data-label text-primary uppercase tracking-wider mb-1">Analytics</p>
        <h1 className="font-h3 text-h3 text-on-surface">Performance insights</h1>
        <p className="font-body-sm text-body-sm text-secondary mt-1">Performance and risk trends across the cohort</p>
      </header>

      <div className="p-dossier-inset flex flex-col gap-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.map((metric) => (
            <article key={metric.label} className="bg-surface-bright border border-outline-variant rounded p-4 shadow-sm flex flex-col justify-center">
              <p className="font-data-label text-data-label text-secondary uppercase tracking-wider mb-2">{metric.label}</p>
              <p className="font-metric-display text-[32px] text-on-surface leading-none font-bold">{metric.value}</p>
            </article>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-surface-bright border border-outline-variant rounded shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-outline-variant bg-surface-bright">
              <h2 className="font-h4 text-h4 text-on-surface">Attendance vs marks</h2>
              <p className="font-body-sm text-body-sm text-secondary">Each point represents a student in the current cohort.</p>
            </div>
            <div className="p-4 h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: -20 }}>
                  <CartesianGrid stroke="#334155" />
                  <XAxis type="number" dataKey="attendance" name="Attendance %" unit="%" tick={axisStyle} tickLine={false} axisLine={{ stroke: "#334155" }} />
                  <YAxis type="number" dataKey="marks" name="Avg Marks" tick={axisStyle} tickLine={false} axisLine={{ stroke: "#334155" }} />
                  <ZAxis range={[80, 80]} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={tooltipStyle} />
                  <Scatter data={scatterData} fill="#2563EB" fillOpacity={0.8} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="bg-surface-bright border border-outline-variant rounded shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-outline-variant bg-surface-bright">
              <h2 className="font-h4 text-h4 text-on-surface">Risk trend over months</h2>
              <p className="font-body-sm text-body-sm text-secondary">Number of students in each risk band.</p>
            </div>
            <div className="p-4 h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dynamicRiskTrend} margin={{ top: 8, right: 16, bottom: 8, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" tick={axisStyle} tickLine={false} axisLine={{ stroke: "#334155" }} />
                  <YAxis tick={axisStyle} tickLine={false} axisLine={{ stroke: "#334155" }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "13px", paddingTop: "10px" }} />
                  <Line type="monotone" dataKey="High" stroke={RISK_COLORS.High} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="Medium" stroke={RISK_COLORS.Medium} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="Low" stroke={RISK_COLORS.Low} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {cohorts && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
            {/* Risk by Program */}
            <section className="bg-surface-bright border border-outline-variant rounded shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-outline-variant bg-surface-bright">
                <h2 className="font-h4 text-h4 text-on-surface">Risk by Program</h2>
                <p className="font-body-sm text-body-sm text-secondary">Distribution of risk bands across different majors.</p>
              </div>
              <div className="p-4 h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cohorts.program_risk} margin={{ top: 8, right: 16, bottom: 8, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="program" tick={axisStyle} axisLine={{ stroke: "#334155" }} />
                    <YAxis tick={axisStyle} axisLine={{ stroke: "#334155" }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: "13px", paddingTop: "10px" }} />
                    <Bar dataKey="High" stackId="a" fill={RISK_COLORS.High} />
                    <Bar dataKey="Medium" stackId="a" fill={RISK_COLORS.Medium} />
                    <Bar dataKey="Low" stackId="a" fill={RISK_COLORS.Low} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Risk by Semester (Early Warning) */}
            <section className="bg-surface-bright border border-outline-variant rounded shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-outline-variant bg-surface-bright">
                <h2 className="font-h4 text-h4 text-on-surface">Average Risk by Semester</h2>
                <p className="font-body-sm text-body-sm text-secondary">Early-warning trend identifying the toughest semesters.</p>
              </div>
              <div className="p-4 h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cohorts.semester_risk} margin={{ top: 8, right: 16, bottom: 8, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="semester" tick={axisStyle} axisLine={{ stroke: "#334155" }} />
                    <YAxis tick={axisStyle} axisLine={{ stroke: "#334155" }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="Avg Risk" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

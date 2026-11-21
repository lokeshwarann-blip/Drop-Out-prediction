import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function LogInterventionModal() {
  const {
    isInterventionModalOpen,
    setIsInterventionModalOpen,
    selectedStudent,
    students,
    logNewIntervention
  } = useApp();

  const [studentId, setStudentId] = useState(selectedStudent?.id || '9482103');
  const [title, setTitle] = useState('Parent-Teacher Conference');
  const [channel, setChannel] = useState('SMS');
  const [priority, setPriority] = useState('high');
  const [notes, setNotes] = useState('');

  if (!isInterventionModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!notes.trim()) return;

    logNewIntervention({
      studentId: studentId || selectedStudent?.id,
      title,
      channel,
      priority,
      notes
    });

    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-bright border border-outline-variant rounded-lg max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center border-b border-outline-variant pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">healing</span>
            <h3 className="font-h3 text-h3 text-on-surface">Log Clinical Intervention</h3>
          </div>
          <button
            onClick={() => setIsInterventionModalOpen(false)}
            className="text-secondary hover:text-primary transition-colors text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-data-label text-data-label text-secondary uppercase mb-1">
              Select Student
            </label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded p-2.5 font-body-sm text-on-surface focus:ring-1 focus:ring-primary outline-none"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (ID: {s.id}) - {s.riskTier} Risk ({s.riskScore}%)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-data-label text-data-label text-secondary uppercase mb-1">
                Intervention Action
              </label>
              <select
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded p-2.5 font-body-sm text-on-surface focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="Parent-Teacher Conference">Parent-Teacher Conference</option>
                <option value="Counselor Check-in">Counselor Check-in</option>
                <option value="Academic Warning Notice">Academic Warning Notice</option>
                <option value="Attendance Contract Review">Attendance Contract Review</option>
                <option value="Math Lab Peer Referral">Math Lab Peer Referral</option>
                <option value="Financial Aid Counseling">Financial Aid Counseling</option>
              </select>
            </div>

            <div>
              <label className="block font-data-label text-data-label text-secondary uppercase mb-1">
                Dispatch Channel
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded p-2.5 font-body-sm text-on-surface focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="SMS">SMS Notification</option>
                <option value="Email">Official Email</option>
                <option value="IVR">Automated IVR Call</option>
                <option value="Meeting">In-Person Meeting</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-data-label text-data-label text-secondary uppercase mb-1">
              Priority Level
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  name="priority"
                  value="high"
                  checked={priority === 'high'}
                  onChange={() => setPriority('high')}
                  className="text-error focus:ring-error"
                />
                <span className="font-medium text-error flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-error inline-block"></span> High Priority
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  name="priority"
                  value="normal"
                  checked={priority === 'normal'}
                  onChange={() => setPriority('normal')}
                  className="text-secondary focus:ring-secondary"
                />
                <span className="font-medium text-secondary flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-secondary inline-block"></span> Standard
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-data-label text-data-label text-secondary uppercase mb-1">
              Clinical Case Notes / Message Content
            </label>
            <textarea
              required
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter specific details regarding the intervention, guardian agreement, or next steps..."
              className="w-full bg-surface-container-low border border-outline-variant rounded p-3 font-body-sm text-on-surface focus:ring-1 focus:ring-primary outline-none"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsInterventionModalOpen(false)}
              className="px-4 py-2 border border-outline-variant rounded font-body-md text-secondary hover:bg-surface-bright transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded font-body-md font-medium hover:bg-opacity-90 transition-opacity shadow-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              Dispatch & Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

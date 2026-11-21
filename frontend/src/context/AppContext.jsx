import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { INITIAL_STUDENTS, INITIAL_COMMUNICATION_LOGS } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [communicationLogs, setCommunicationLogs] = useState(INITIAL_COMMUNICATION_LOGS);
  const [isLoadingML, setIsLoadingML] = useState(true);
  
  // Navigation & View Mode State
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' | 'logs'
  const [viewMode, setViewMode] = useState('counselor'); // 'counselor' | 'teacher'
  const [selectedStudentId, setSelectedStudentId] = useState('9482103');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Fetch live ML predictions from FastAPI backend
    fetch('http://localhost:8001/api/predictions')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setStudents(data);
          setSelectedStudentId(data[0].id); // Auto-select the first ML generated student
          
          // Generate dynamic communication logs based on real students
          const dynamicLogs = [];
          const channels = ['SMS', 'Email', 'IVR'];
          const statuses = ['Delivered', 'Delivered', 'Delivered', 'Failed', 'Pending'];
          const snippets = [
            'URGENT: Mandatory attendance intervention scheduled...',
            'Missing assignment alert: Intro to Psychology...',
            'Automated IVR Call: Unexcused Friday absence...',
            'Reminder: Math Lab peer tutoring session today...',
            'Parent-Teacher Conference invitation dispatched...',
            'Honor Roll commendation & AP Scholarship notification...',
            'Weekly academic progress report delivered.',
            'Warning: Dropping below 75% attendance threshold.'
          ];
          
          for (let i = 0; i < 15; i++) {
            const randomStudent = data[Math.floor(Math.random() * data.length)];
            const date = new Date(Date.now() - Math.floor(Math.random() * 10) * 86400000); // last 10 days
            
            dynamicLogs.push({
              id: `LOG-${1000 + i}`,
              priority: Math.random() > 0.7 ? 'high' : 'normal',
              channel: channels[Math.floor(Math.random() * channels.length)],
              recipient: `${randomStudent.name.charAt(0)}. ${randomStudent.name.split(' ').pop()} (ID: ${randomStudent.id})`,
              recipientName: randomStudent.name,
              studentId: randomStudent.id,
              snippet: snippets[Math.floor(Math.random() * snippets.length)],
              fullMessage: "Auto-generated dynamic communication log.",
              dateTime: date.toISOString().replace('T', ' ').substring(0, 19),
              status: statuses[Math.floor(Math.random() * statuses.length)]
            });
          }
          
          // Sort by newest first
          dynamicLogs.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
          setCommunicationLogs(dynamicLogs);
        }
        setIsLoadingML(false);
      })
      .catch(err => {
        console.error("Failed to fetch ML data. Falling back to mock data.", err);
        setIsLoadingML(false);
      });
  }, []);
  
  // Filtering & Search States
  const [activeRiskTab, setActiveRiskTab] = useState('All'); // 'All' | 'High' | 'Medium' | 'Low' | 'Watch'
  const [queueSearch, setQueueSearch] = useState('');
  
  const [logsSearch, setLogsSearch] = useState('');
  const [logStatusFilters, setLogStatusFilters] = useState({
    Delivered: true,
    Failed: true,
    Pending: true
  });
  const [logChannelFilter, setLogChannelFilter] = useState('All Channels');

  // Modals & Toast State
  const [isInterventionModalOpen, setIsInterventionModalOpen] = useState(false);
  const [selectedLogDetail, setSelectedLogDetail] = useState(null);
  const [toast, setToast] = useState(null); // { message, type }

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Currently selected student profile
  const selectedStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || students[0];
  }, [students, selectedStudentId]);

  // Filtered Students Queue
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // Risk tab filter
      if (activeRiskTab === 'High' && student.riskTier !== 'High') return false;
      if (activeRiskTab === 'Medium' && student.riskTier !== 'Medium') return false;
      if (activeRiskTab === 'Low' && student.riskTier !== 'Low') return false;
      if (activeRiskTab === 'Watch' && student.riskScore < 50) return false;

      // Search query
      if (queueSearch.trim() !== '') {
        const q = queueSearch.toLowerCase();
        // Match if the ID includes the query, or if ANY part of the name STARTS with the query
        const matchId = student.id.toLowerCase().includes(q);
        const matchName = student.name.toLowerCase().split(' ').some(word => word.startsWith(q));
        
        return matchName || matchId;
      }
      return true;
    });
  }, [students, activeRiskTab, queueSearch]);

  // Filtered Communication Logs
  const filteredCommunicationLogs = useMemo(() => {
    return communicationLogs.filter((log) => {
      // Status filter
      if (!logStatusFilters[log.status]) return false;

      // Channel filter
      if (logChannelFilter !== 'All Channels' && log.channel !== logChannelFilter) {
        return false;
      }

      // Search
      if (logsSearch.trim() !== '') {
        const q = logsSearch.toLowerCase();
        return (
          log.recipient.toLowerCase().includes(q) ||
          log.snippet.toLowerCase().includes(q) ||
          log.studentId.toLowerCase().includes(q) ||
          (log.recipientName && log.recipientName.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [communicationLogs, logStatusFilters, logChannelFilter, logsSearch]);

  // Action 1: Log Intervention
  const logNewIntervention = async ({ studentId, title, channel, notes, priority = 'high' }) => {
    const now = new Date();
    const formattedDateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    // Format to local time YYYY-MM-DD HH:MM:SS
    const pad = (n) => n.toString().padStart(2, '0');
    const formattedTimeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    
    const targetStudent = students.find((s) => s.id === studentId);
    if (!targetStudent) return;

    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:8001/students/${studentId}/interventions`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: title || 'Counselor Intervention',
          notes: notes || 'Logged intervention details.',
          pre_intervention_risk: targetStudent.riskScore / 100.0
        })
      });
    } catch (err) {
      console.error("Failed to log intervention to backend:", err);
    }

    const newInterventionId = `INT-${Date.now().toString().slice(-4)}`;
    const newLogId = `LOG-${Date.now().toString().slice(-4)}`;

    const newIntervention = {
      id: newInterventionId,
      date: formattedDateStr,
      title: title || 'Counselor Intervention',
      icon: channel === 'SMS' ? 'sms' : channel === 'Email' ? 'mail' : channel === 'IVR' ? 'call' : 'event',
      notes: notes || 'Logged intervention details.',
      channel: channel || 'SMS'
    };

    // 1. Update student intervention history
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            interventionHistory: [newIntervention, ...s.interventionHistory]
          };
        }
        return s;
      })
    );

    // 2. Add entry to Communication Logs in real time
    const newLog = {
      id: newLogId,
      priority: priority.toLowerCase(),
      channel: channel || 'SMS',
      recipient: `${targetStudent.name.charAt(0)}. ${targetStudent.name.split(' ').pop()} (ID: ${targetStudent.id})`,
      recipientName: targetStudent.name,
      studentId: targetStudent.id,
      snippet: `${title}: ${notes.slice(0, 45)}...`,
      fullMessage: notes, // Store only the notes that the user explicitly typed
      dateTime: formattedTimeStr,
      status: 'Delivered'
    };

    setCommunicationLogs((prev) => [newLog, ...prev]);

    showToast(`Intervention "${title}" logged for ${targetStudent.name} & dispatched to Communication Log.`);
    setIsInterventionModalOpen(false);
  };

  // Action 2: Initiate Peer Mentoring
  const initiatePeerMentoring = (studentId) => {
    const targetStudent = students.find((s) => s.id === studentId);
    if (!targetStudent || !targetStudent.peerMatch) return;

    logNewIntervention({
      studentId,
      title: 'Near-Peer Mentoring Match Approved',
      channel: 'SMS',
      notes: `Initiated introduction with mentor ${targetStudent.peerMatch.name} (${targetStudent.peerMatch.grade}). Match compatibility: ${targetStudent.peerMatch.matchPercent}.`,
      priority: 'high'
    });
  };

  // Action 3: Retry Failed Communication Log
  const retryCommunicationLog = (logId) => {
    setCommunicationLogs((prev) =>
      prev.map((log) => {
        if (log.id === logId) {
          return { ...log, status: 'Pending' };
        }
        return log;
      })
    );

    showToast(`Re-dispatching log ${logId}...`);

    setTimeout(() => {
      setCommunicationLogs((prev) =>
        prev.map((log) => {
          if (log.id === logId) {
            return { ...log, status: 'Delivered' };
          }
          return log;
        })
      );
      showToast(`Log ${logId} successfully delivered!`, 'success');
    }, 1200);
  };

  // Action 4: Export Logs to CSV
  const exportLogsCSV = () => {
    if (filteredCommunicationLogs.length === 0) {
      showToast('No logs to export.', 'error');
      return;
    }

    const headers = ['ID', 'Priority', 'Channel', 'Recipient', 'Student ID', 'Snippet', 'DateTime', 'Status'];
    const rows = filteredCommunicationLogs.map((l) => [
      l.id,
      l.priority,
      l.channel,
      `"${l.recipient.replace(/"/g, '""')}"`,
      l.studentId,
      `"${l.snippet.replace(/"/g, '""')}"`,
      l.dateTime,
      l.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `communication_logs_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported communication logs to CSV.');
  };

  const toggleLogStatusFilter = (status) => {
    setLogStatusFilters((prev) => ({ ...prev, [status]: !prev[status] }));
  };

  const resetLogFilters = () => {
    setLogStatusFilters({ Delivered: true, Failed: true, Pending: true });
    setLogChannelFilter('All Channels');
    setLogsSearch('');
    showToast('Communication log filters reset.');
  };

  const value = {
    students,
    communicationLogs,
    activeView,
    setActiveView,
    viewMode,
    setViewMode,
    selectedStudentId,
    setSelectedStudentId,
    selectedStudent,
    filteredStudents,
    filteredCommunicationLogs,
    activeRiskTab,
    setActiveRiskTab,
    queueSearch,
    setQueueSearch,
    logsSearch,
    setLogsSearch,
    logStatusFilters,
    toggleLogStatusFilter,
    logChannelFilter,
    setLogChannelFilter,
    resetLogFilters,
    isInterventionModalOpen,
    setIsInterventionModalOpen,
    selectedLogDetail,
    setSelectedLogDetail,
    toast,
    showToast,
    logNewIntervention,
    initiatePeerMentoring,
    retryCommunicationLog,
    exportLogsCSV,
    isLoggedIn,
    setIsLoggedIn,
    isLoadingML
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

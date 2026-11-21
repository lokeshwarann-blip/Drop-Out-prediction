export const INITIAL_STUDENTS = [
  {
    id: "9482103",
    name: "Marcus Johnson",
    riskScore: 94,
    riskTier: "High",
    grade: "Grade 10",
    homeroom: "Homeroom 302",
    age: 16,
    guardian: {
      name: "Sarah Johnson (Mother)",
      phone: "555-019-4821"
    },
    tags: ["Attendance", "Academics"],
    readouts: {
      attendance: "72%",
      cgpa: "2.1",
      targetCgpa: "2.5",
      incidents: 4,
      engagement: "Low"
    },
    shapFactors: [
      {
        factor: "Consecutive Absences (Unexcused)",
        impact: "-40% impact",
        width: "80%",
        color: "error",
        desc: "Model indicates 5+ unexcused absences in a 3-week period correlates highly with eventual dropout."
      },
      {
        factor: "Declining Math Scores",
        impact: "-25% impact",
        width: "50%",
        color: "amber-500",
        desc: "Algebra II grade dropped from C+ to D- over last two grading periods."
      },
      {
        factor: "Extracurricular Disengagement",
        impact: "-15% impact",
        width: "30%",
        color: "amber-500",
        desc: "Stopped participating in Robotics Club after week 4 of semester."
      }
    ],
    schedule: [
      { period: "P1", course: "English Lit", grade: "F (52%)", status: "error" },
      { period: "P2", course: "Algebra II", grade: "D- (61%)", status: "warning" },
      { period: "P3", course: "Biology", grade: "C (74%)", status: "normal" },
      { period: "P4", course: "Art History", grade: "B (85%)", status: "success" }
    ],
    peerMatch: {
      name: "Jamal Thompson",
      initials: "JT",
      grade: "Grade 12",
      badge: "Honor Roll",
      matchPercent: "89% Match",
      reason: "Algorithm suggests strong compatibility based on shared interests (Robotics Club past participation) and similar academic turnaround profile."
    },
    interventionHistory: [
      {
        id: "INT-901",
        date: "Oct 12, 2023",
        title: "Parent-Teacher Conference",
        icon: "event",
        notes: "Discussed attendance issues. Mother mentioned changed work schedule affecting morning routine. Agreed to try school breakfast program.",
        channel: "Meeting"
      },
      {
        id: "INT-902",
        date: "Sep 28, 2023",
        title: "Counselor Check-in",
        icon: "forum",
        notes: "Brief hallway meeting. Marcus seemed withdrawn. Scheduled formal meeting for next week (Did not attend).",
        channel: "Check-in"
      }
    ]
  },
  {
    id: "8847291",
    name: "Sarah Jenkins",
    riskScore: 88,
    riskTier: "High",
    grade: "Grade 11",
    homeroom: "Homeroom 208",
    age: 17,
    guardian: {
      name: "Robert Jenkins (Father)",
      phone: "555-014-9920"
    },
    tags: ["Academics", "LMS Disengagement"],
    readouts: {
      attendance: "81%",
      cgpa: "1.9",
      targetCgpa: "2.4",
      incidents: 2,
      engagement: "Low"
    },
    shapFactors: [
      {
        factor: "Zero LMS Assignment Submissions",
        impact: "-35% impact",
        width: "70%",
        color: "error",
        desc: "3 major term paper milestones unsubmitted across Physics and Psychology."
      },
      {
        factor: "Repeated Exam Failure",
        impact: "-30% impact",
        width: "60%",
        color: "error",
        desc: "Failed mid-term examinations in Chemistry and Pre-Calculus."
      }
    ],
    schedule: [
      { period: "P1", course: "Chemistry", grade: "F (48%)", status: "error" },
      { period: "P2", course: "Pre-Calculus", grade: "D (60%)", status: "warning" },
      { period: "P3", course: "US History", grade: "C- (70%)", status: "normal" },
      { period: "P4", course: "Psychology", grade: "D+ (67%)", status: "warning" }
    ],
    peerMatch: {
      name: "Sneha Reddy",
      initials: "SR",
      grade: "Grade 12",
      badge: "Peer Tutor",
      matchPercent: "92% Match",
      reason: "High academic alignment in Chemistry and proven experience mentoring students through mid-term recoveries."
    },
    interventionHistory: [
      {
        id: "INT-801",
        date: "Oct 15, 2023",
        title: "Academic Warning Notice",
        icon: "warning",
        notes: "Official notice dispatched regarding potential credit loss in Chemistry due to unsubmitted labs.",
        channel: "Email"
      }
    ]
  },
  {
    id: "4728192",
    name: "David Chen",
    riskScore: 85,
    riskTier: "High",
    grade: "Grade 10",
    homeroom: "Homeroom 302",
    age: 15,
    guardian: {
      name: "Mei Chen (Mother)",
      phone: "555-018-3319"
    },
    tags: ["Attendance", "Behavior"],
    readouts: {
      attendance: "69%",
      cgpa: "2.3",
      targetCgpa: "2.8",
      incidents: 5,
      engagement: "Low"
    },
    shapFactors: [
      {
        factor: "Monday/Friday Chronic Absence Pattern",
        impact: "-42% impact",
        width: "84%",
        color: "error",
        desc: "9 out of 10 recent absences occurred on Fridays or Mondays."
      },
      {
        factor: "Disciplinary Incidents",
        impact: "-20% impact",
        width: "40%",
        color: "amber-500",
        desc: "Multiple tardiness infractions logged by Period 1 instructor."
      }
    ],
    schedule: [
      { period: "P1", course: "World History", grade: "F (50%)", status: "error" },
      { period: "P2", course: "Geometry", grade: "C+ (77%)", status: "normal" },
      { period: "P3", course: "Physical Ed", grade: "A (92%)", status: "success" },
      { period: "P4", course: "Spanish II", grade: "C (73%)", status: "normal" }
    ],
    peerMatch: {
      name: "Lucas Vance",
      initials: "LV",
      grade: "Grade 11",
      badge: "Student Ambassador",
      matchPercent: "85% Match",
      reason: "Lucas successfully navigated homeroom attendance monitoring last semester and leads peer study groups."
    },
    interventionHistory: [
      {
        id: "INT-701",
        date: "Oct 04, 2023",
        title: "Attendance Intervention Plan",
        icon: "assignment",
        notes: "Created daily attendance tracking contract requiring Period 1 signature.",
        channel: "In-Person"
      }
    ]
  },
  {
    id: "3392817",
    name: "Alicia Reyes",
    riskScore: 62,
    riskTier: "Medium",
    grade: "Grade 9",
    homeroom: "Homeroom 104",
    age: 14,
    guardian: {
      name: "Carlos Reyes (Father)",
      phone: "555-017-7728"
    },
    tags: ["Math Slope", "Tardiness"],
    readouts: {
      attendance: "84%",
      cgpa: "2.7",
      targetCgpa: "3.0",
      incidents: 2,
      engagement: "Moderate"
    },
    shapFactors: [
      {
        factor: "Algebra Quiz Variance",
        impact: "-22% impact",
        width: "44%",
        color: "amber-500",
        desc: "Significant drop in quiz performance over last 3 weeks."
      }
    ],
    schedule: [
      { period: "P1", course: "English 9", grade: "B- (81%)", status: "normal" },
      { period: "P2", course: "Algebra I", grade: "C- (71%)", status: "warning" },
      { period: "P3", course: "Earth Science", grade: "B (84%)", status: "success" },
      { period: "P4", course: "Art I", grade: "A (95%)", status: "success" }
    ],
    peerMatch: {
      name: "Elena Gomez",
      initials: "EG",
      grade: "Grade 10",
      badge: "Math Club President",
      matchPercent: "91% Match",
      reason: "High peer affinity in Algebra problem solving and same native language background."
    },
    interventionHistory: [
      {
        id: "INT-601",
        date: "Sep 20, 2023",
        title: "Math Lab Referral",
        icon: "school",
        notes: "Assigned to Tuesday/Thursday peer tutoring in Math lab.",
        channel: "Referral"
      }
    ]
  },
  {
    id: "1192847",
    name: "Michael Chang",
    riskScore: 14,
    riskTier: "Low",
    grade: "Grade 12",
    homeroom: "Homeroom 401",
    age: 18,
    guardian: {
      name: "Grace Chang (Mother)",
      phone: "555-012-4411"
    },
    tags: ["Honor Student", "Regular"],
    readouts: {
      attendance: "96%",
      cgpa: "3.8",
      targetCgpa: "3.8",
      incidents: 0,
      engagement: "High"
    },
    shapFactors: [
      {
        factor: "Consistent Attendance",
        impact: "+35% positive",
        width: "70%",
        color: "emerald-500",
        desc: "Maintains 96%+ year-to-date attendance."
      }
    ],
    schedule: [
      { period: "P1", course: "AP Physics", grade: "A (94%)", status: "success" },
      { period: "P2", course: "AP Calculus BC", grade: "A (96%)", status: "success" },
      { period: "P3", course: "AP Lit", grade: "A- (91%)", status: "success" },
      { period: "P4", course: "Government", grade: "A (98%)", status: "success" }
    ],
    peerMatch: null,
    interventionHistory: []
  }
];

export const INITIAL_COMMUNICATION_LOGS = [
  {
    id: "LOG-1001",
    priority: "high",
    channel: "SMS",
    recipient: "A. Johnson (ID: 9482103)",
    recipientName: "Marcus Johnson",
    studentId: "9482103",
    snippet: "URGENT: Mandatory attendance intervention scheduled for 9AM.",
    fullMessage: "URGENT: Mandatory attendance intervention scheduled for 9AM. Please confirm attendance with counseling department immediately.",
    dateTime: "2023-10-27 14:02:11",
    status: "Delivered"
  },
  {
    id: "LOG-1002",
    priority: "high",
    channel: "Email",
    recipient: "S. Williams (ID: 8847291)",
    recipientName: "Sarah Jenkins",
    studentId: "8847291",
    snippet: "Missing assignment alert: Intro to Psychology unit exam.",
    fullMessage: "Missing assignment alert: Intro to Psychology unit exam pending submission. Grade penalty applies after 5PM.",
    dateTime: "2023-10-27 13:45:00",
    status: "Failed"
  },
  {
    id: "LOG-1003",
    priority: "normal",
    channel: "IVR",
    recipient: "M. Chen (ID: 4728192)",
    recipientName: "David Chen",
    studentId: "4728192",
    snippet: "Automated IVR Call: Unexcused Friday absence recorded.",
    fullMessage: "Automated IVR Call dispatched to guardian regarding unexcused Friday absence. Call duration: 45 seconds.",
    dateTime: "2023-10-27 11:20:44",
    status: "Delivered"
  },
  {
    id: "LOG-1004",
    priority: "normal",
    channel: "SMS",
    recipient: "C. Reyes (ID: 3392817)",
    recipientName: "Alicia Reyes",
    studentId: "3392817",
    snippet: "Reminder: Math Lab peer tutoring session today at 3:30PM.",
    fullMessage: "Reminder: Math Lab peer tutoring session today at 3:30PM in Room 104 with Elena Gomez.",
    dateTime: "2023-10-26 16:00:00",
    status: "Delivered"
  },
  {
    id: "LOG-1005",
    priority: "high",
    channel: "SMS",
    recipient: "S. Johnson (ID: 9482103)",
    recipientName: "Marcus Johnson",
    studentId: "9482103",
    snippet: "Parent-Teacher Conference invitation dispatched.",
    fullMessage: "Parent-Teacher Conference invitation dispatched for morning breakfast support program alignment.",
    dateTime: "2023-10-12 09:30:15",
    status: "Delivered"
  },
  {
    id: "LOG-1006",
    priority: "normal",
    channel: "Email",
    recipient: "G. Chang (ID: 1192847)",
    recipientName: "Michael Chang",
    studentId: "1192847",
    snippet: "Honor Roll commendation & AP Scholarship notification.",
    fullMessage: "Honor Roll commendation & AP Scholarship notification delivered to student and guardian.",
    dateTime: "2023-10-10 10:15:00",
    status: "Delivered"
  }
];

export const riskTrend = [
  { month: "Jan", High: 1, Medium: 2, Low: 4 },
  { month: "Feb", High: 2, Medium: 2, Low: 3 },
  { month: "Mar", High: 2, Medium: 1, Low: 4 },
  { month: "Apr", High: 3, Medium: 1, Low: 3 },
  { month: "May", High: 2, Medium: 2, Low: 2 },
];

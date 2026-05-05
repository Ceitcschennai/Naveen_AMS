import React, { useState } from 'react';
import '../styles/ReportOverview.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const dummyAttendance = [
  { empId: 'EMP001', name: 'John Doe', empType: 'Permanent', date: '2025-04-01', inTime: '09:00', outTime: '17:00' },
  { empId: 'EMP001', name: 'John Doe', empType: 'Permanent', date: '2025-04-03', inTime: '09:05', outTime: '17:10' },
  { empId: 'EMP001', name: 'John Doe', empType: 'Permanent', date: '2025-04-11', inTime: '09:12', outTime: '17:15' },
  { empId: 'EMP002', name: 'Jane Smith', empType: 'Contract', date: '2025-04-05', inTime: '09:15', outTime: '17:30' },
  { empId: 'EMP002', name: 'Jane Smith', empType: 'Contract', date: '2025-04-18', inTime: '09:20', outTime: '17:25' },
  { empId: 'EMP002', name: 'Jane Smith', empType: 'Contract', date: '2025-04-23', inTime: '09:30', outTime: '17:45' },
  { empId: 'EMP003', name: 'Alice Green', empType: 'Internship', date: '2025-04-10', inTime: '09:00', outTime: '13:00' },
];

const getWeekNumberInMonth = (date) => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  return Math.ceil((date.getDate() + firstDay.getDay()) / 7);
};

const weeks = ['1st', '2nd', '3rd', '4th', '5th'];

const AttendanceReport = () => {
  const [month, setMonth] = useState('2025-04');
  const [week, setWeek] = useState('');

  const filteredData = dummyAttendance.filter(entry => {
    if (!month) return false;
    if (!entry.date.startsWith(month)) return false;
    if (!week) return true;
    const dateObj = new Date(entry.date);
    const weekNumber = getWeekNumberInMonth(dateObj);
    return week === `${weekNumber}`;
  });

  const handleDownload = () => {
    const csvRows = [
      ['Employee ID', 'Name', 'Employee Type', 'Date', 'In Time', 'Out Time'],
      ...filteredData.map(e => [e.empId, e.name, e.empType, e.date, e.inTime, e.outTime])
    ];
    const csvContent = csvRows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const weekLabel = week ? `-week${week}` : '';
    a.download = `attendance-report-${month}${weekLabel}.csv`;
    a.click();
  };

  return (
    <div className="AttendanceReport-container">
      <Sidebar />
      <div className="attendanceReport-content">
        <Header />
        <div className="overview-report-wrapper">
          <h1 className="overview-report-title">Attendance Report</h1>

          <div className="overview-filter-section">
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
            <select value={week} onChange={(e) => setWeek(e.target.value)}>
              <option value="">Whole Month</option>
              {weeks.map((label, i) => (
                <option key={i} value={i + 1}>{label} Week</option>
              ))}
            </select>
            <button onClick={handleDownload}>Download</button>
          </div>

          <div className="overview-table-wrapper">
            <table className="overview-report-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Employee Type</th>
                  <th>Date</th>
                  <th>In Time</th>
                  <th>Out Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length ? (
                  filteredData.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.empId}</td>
                      <td>{entry.name}</td>
                      <td>{entry.empType}</td>
                      <td>{entry.date}</td>
                      <td>{entry.inTime}</td>
                      <td>{entry.outTime}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No attendance data for selected period.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReport;

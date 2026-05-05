import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import '../styles/IndividualReport.css';
import sathya from "../assets/images/sathyaphoto.jpg";
import john from "../assets/images/john.jpg"; // Add more employee photos
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

// Employee Profiles
const employeeProfiles = {
  EMP001: {
    id: 'EMP001',
    name: 'SATHYABAMA D',
    role: 'React Developer',
    photo: sathya,
  },
  EMP002: {
    id: 'EMP002',
    name: 'John Smith',
    role: 'Backend Developer',
    photo: john,
  },
};

// Attendance Data
const dummyData = [
  { date: '2024-04-01', status: 'Present', in: '09:02am', out: '07:20pm', late: '', early: '', hours: '09:20', id: 'EMP001' },
  { date: '2024-04-02', status: 'Present', in: '09:30am', out: '06:20pm', late: '00:30', early: '', hours: '09:10', id: 'EMP001' },
  { date: '2024-04-03', status: 'Leave', in: '', out: '', late: '', early: '', hours: '', id: 'EMP001' },
  { date: '2024-04-04', status: 'Present', in: '08:50am', out: '05:20pm', late: '', early: '00:40', hours: '08:20', id: 'EMP001' },
  { date: '2024-04-05', status: 'Absent', in: '', out: '', late: '', early: '', hours: '', id: 'EMP001' },
  { date: '2024-04-06', status: 'Present', in: '08:49am', out: '06:50pm', late: '', early: '', hours: '09:00', id: 'EMP002' },
  { date: '2024-04-07', status: 'Off Day', in: '', out: '', late: '', early: '', hours: '', id: 'EMP002' },
  { date: '2024-04-08', status: 'Present', in: '08:32am', out: '02:25pm', late: '00:42', early: '', hours: '09:20', id: 'EMP002' },
  { date: '2024-04-09', status: 'Present', in: '05:42am', out: '01:10pm', late: '', early: '00:50', hours: '09:20', id: 'EMP002' },
  { date: '2024-04-10', status: 'Present', in: '05:42am', out: '02:25pm', late: '', early: '', hours: '09:20', id: 'EMP002' },
];

const getWeek = (date) => {
  const day = new Date(date).getDate();
  return Math.ceil(day / 7);
};

const AttendanceReport = () => {
  const [month, setMonth] = useState('2024-04');
  const [employeeID, setEmployeeID] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('all');

  const filtered = dummyData.filter(d =>
    d.date.startsWith(month) &&
    (employeeID.trim() === '' || d.id.toLowerCase() === employeeID.toLowerCase()) &&
    (selectedWeek === 'all' || getWeek(d.date) === parseInt(selectedWeek))
  );

  const profile = employeeProfiles[employeeID.toUpperCase()];

  const summary = {
    workingDay: filtered.length,
    present: filtered.filter(e => e.status === 'Present').length,
    absent: filtered.filter(e => e.status === 'Absent').length,
    leave: filtered.filter(e => e.status === 'Leave').length,
    offDay: filtered.filter(e => e.status === 'Off Day').length,
    govtHoliday: 2,
    lateEntry: filtered.filter(e => e.late).length,
    earlyExit: filtered.filter(e => e.early).length,
  };

  const downloadCSV = () => {
    const csv = [
      ['Date', 'Status', 'Entry', 'Exit', 'Late', 'Early Exit', 'Working Hours'],
      ...filtered.map(e => [
        e.date, e.status, e.in || '--', e.out || '--', e.late || '--', e.early || '--', e.hours || '--'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'Attendance_Report.csv');
  };

  return (
    <div className="Individual-container">
      <Sidebar />
      <div className="Individual-content">
        <Header />

        <div className="individual-report-wrapper">
          {profile && (
            <div className="individual-profile-section">
              <img src={profile.photo} alt="Profile" className="individual-profile-img" />
              <div className="individual-profile-info">
                <h3>{profile.name}</h3>
                <p>{profile.role}</p>
                <p>ID: {profile.id}</p>
              </div>
            </div>
          )}

          <div className="individual-top-controls">
            <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
            <input
              type="text"
              placeholder="Enter Employee ID"
              value={employeeID}
              onChange={(e) => setEmployeeID(e.target.value)}
            />
            <select value={selectedWeek} onChange={(e) => setSelectedWeek(e.target.value)}>
              <option value="all">All Weeks</option>
              <option value="1">1st Week</option>
              <option value="2">2nd Week</option>
              <option value="3">3rd Week</option>
              <option value="4">4th Week</option>
              <option value="5">5th Week</option>
            </select>
            <button className="individual-download-btn" onClick={downloadCSV}>⭳</button>
          </div>

          <div className="individual-summary-grid">
            <div><span>Working Day</span><strong>{summary.workingDay}</strong></div>
            <div><span>Weekend/Day Off</span><strong>{summary.offDay}</strong></div>
            <div><span>Leave</span><strong>{summary.leave}</strong></div>
            <div><span>Late Entry</span><strong>{summary.lateEntry}</strong></div>
            <div><span>Present</span><strong>{summary.present}</strong></div>
            <div><span>Govt. Holiday</span><strong>{summary.govtHoliday}</strong></div>
            <div><span>Absent</span><strong>{summary.absent}</strong></div>
            <div><span>Early Exit</span><strong>{summary.earlyExit}</strong></div>
          </div>

          <div className="individual-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Entry</th>
                  <th>Exit</th>
                  <th>Late</th>
                  <th>Early Exit</th>
                  <th>Working Hours</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length ? (
                  filtered.map((entry, idx) => (
                    <tr key={idx}>
                      <td>{entry.date}</td>
                      <td className={`status ${entry.status.toLowerCase().replace(' ', '-')}`}>{entry.status}</td>
                      <td className={entry.late ? 'red-text' : ''}>{entry.in || '--'}</td>
                      <td className={entry.early ? 'red-text' : ''}>{entry.out || '--'}</td>
                      <td className="red-text">{entry.late || '--'}</td>
                      <td className="red-text">{entry.early || '--'}</td>
                      <td>{entry.hours || '--'}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="7">No Records Found</td></tr>
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

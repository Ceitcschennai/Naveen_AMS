import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../styles/Attendance.css';
import { usePopup } from '../PopupNotification';

// List of employees
const employees = [
  { empId: 'EMP001', name: 'Suseendhiran', type: 'Permanent' },
  { empId: 'EMP002', name: 'Sathyabama', type: 'Contract' },
  { empId: 'EMP003', name: 'Sanjay', type: 'Intern' },
  { empId: 'EMP004', name: 'Monika', type: 'Permanent' },
  { empId: 'EMP005', name: 'Vinay', type: 'Contract' },
  { empId: 'EMP006', name: 'Arun Kumar', type: 'Permanent' },
  { empId: 'EMP007', name: 'Priya Das', type: 'Intern' },
  { empId: 'EMP008', name: 'Kiran Rao', type: 'Contract' }
];

// Get today's date string (YYYY-MM-DD)
const getTodayDate = () => new Date().toISOString().split('T')[0];

// Dummy attendance records for today
const today = getTodayDate();
const initialAttendance = [
  { empId: 'EMP001', name: 'Suseendhiran', employeeType: 'Permanent', date: today, inTime: '08:55', outTime: '17:05' },
  { empId: 'EMP002', name: 'Sathyabama', employeeType: 'Contract', date: today, inTime: '09:10', outTime: '' },
  { empId: 'EMP003', name: 'Sanjay', employeeType: 'Intern', date: today, inTime: '10:00', outTime: '15:30' },
  { empId: 'EMP004', name: 'Monika', employeeType: 'Permanent', date: today, inTime: '09:05', outTime: '' },
  { empId: 'EMP005', name: 'Vinay', employeeType: 'Contract', date: today, inTime: '09:15', outTime: '17:10' },
  { empId: 'EMP006', name: 'vishal', employeeType: 'Permanent', date: today, inTime: '08:45', outTime: '' },
  { empId: 'EMP007', name: 'wincy', employeeType: 'Intern', date: today, inTime: '09:30', outTime: '16:00' },
  { empId: 'EMP008', name: 'Ruban', employeeType: 'Contract', date: today, inTime: '09:20', outTime: '' }
];

const RealTimeAttendance = () => {
  const { showPopup } = usePopup();
  const [attendance, setAttendance] = useState(initialAttendance);
  const [lastScannedEmp, setLastScannedEmp] = useState('Monika (EMP004)');
  const [lastScannedTime, setLastScannedTime] = useState('09:05');

  // eslint-disable-next-line
  const handleScan = (result) => {
    if (result?.text) {
      const empId = result.text.trim();
      const now = new Date();
      const dateStr = getTodayDate();
      const timeStr = now.toTimeString().split(' ')[0].slice(0, 5); // "HH:MM"

      const employee = employees.find((e) => e.empId === empId);
      if (!employee) {
        showPopup('Invalid QR Code');
        return;
      }

      const existing = attendance.find(
        (entry) => entry.empId === empId && entry.date === dateStr
      );

      let updatedAttendance;

      if (existing) {
        updatedAttendance = attendance.map((entry) =>
          entry.empId === empId && entry.date === dateStr
            ? { ...entry, outTime: timeStr }
            : entry
        );
      } else {
        updatedAttendance = [
          ...attendance,
          {
            empId,
            name: employee.name,
            employeeType: employee.type,
            date: dateStr,
            inTime: timeStr,
            outTime: ''
          }
        ];
      }

      setAttendance(updatedAttendance);
      setLastScannedEmp(`${employee.name} (${empId})`);
      setLastScannedTime(timeStr);
    }
  };

  const todayAttendance = attendance.filter((entry) => entry.date === today);

  return (
    <div className="attendance-container">
      <Sidebar />
      <div className="attendance-content">
        <Header />
        <div className="attendance-section-container">
          <h2 className="attendance-report-title">Today's Attendance - {today}</h2>

          <div className="qr-scanner-wrapper">
            <p><strong>Last Scanned:</strong> {lastScannedEmp || '--'} at {lastScannedTime || '--'}</p>
          </div>

          <div className="attendance-table-wrapper">
            <table className="attendance-report-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Employee Type</th>
                  <th>In Time</th>
                  <th>Out Time</th>
                </tr>
              </thead>
              <tbody>
                {todayAttendance.length > 0 ? (
                  todayAttendance.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.empId}</td>
                      <td>{entry.name}</td>
                      <td>{entry.employeeType}</td>
                      <td>{entry.inTime}</td>
                      <td>{entry.outTime || '--'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No attendance records for today.</td>
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

export default RealTimeAttendance;

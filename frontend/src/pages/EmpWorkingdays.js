import React, { useState } from 'react';
import EmpHeader from '../components/EmpHeader';
import EmpSidebar from '../components/EmpSidebar';
import '../styles/EmpWorkingdays.css';

const employeeTypes = [
  {
    type: 'Permanent Employee',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    holidays: ['Saturday', 'Sunday']
  },
  {
    type: 'Contract Employee',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    holidays: ['Saturday', 'Sunday']
  },
  {
    type: 'Internship Employee',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    holidays: ['Sunday']
  }
];

function WorkingDays() {
  const [selectedType, setSelectedType] = useState(null);

  return (
    <div className="emp-workingdays-container">
      <EmpSidebar />
      <div className="emp-workingdays-content">
        <EmpHeader />
        <div className="emp-overall-container">
          <h1 className="emp-title">Employee Working Days</h1>

          <div className="emp-buttons">
            {employeeTypes.map((emp, idx) => (
              <button
                key={idx}
                className={`emp-button ${selectedType === emp.type ? 'emp-button-active' : ''}`}
                onClick={() => setSelectedType(emp.type)}
              >
                {emp.type}
              </button>
            ))}
          </div>

          {selectedType && (
            <div className="emp-card emp-fade-in">
              <h2>{selectedType}</h2>
              <p><strong>Working Days:</strong></p>
              <ul>
                {employeeTypes.find(emp => emp.type === selectedType).workingDays.map((day, i) => (
                  <li key={i}>{day}</li>
                ))}
              </ul>
              <p><strong>Holidays:</strong></p>
              <ul>
                {employeeTypes.find(emp => emp.type === selectedType).holidays.map((day, i) => (
                  <li key={i}>{day}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkingDays;

import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../styles/Workingdays.css';

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
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    holidays: ['Saturday','Sunday']
  }
];

function WorkingDays() {
  const [selectedType, setSelectedType] = useState(null);

  return (
    <div className="Workingdays-container">
      <Sidebar />
      <div className="Workingdays-content">
        <Header />
        <div className="overall-container">
          <h1 className="title">Employee Working Days</h1>

          <div className="buttons">
            {employeeTypes.map((emp, idx) => (
              <button
                key={idx}
                className={`work-button ${selectedType === emp.type ? 'active' : ''}`}
                onClick={() => setSelectedType(emp.type)}
              >
                {emp.type}
              </button>
            ))}
          </div>

          {selectedType && (
            <div className="card fade-in">
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

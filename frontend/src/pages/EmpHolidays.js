import React, { useEffect, useState } from "react";
import Header from "../components/EmpHeader";
import Sidebar from "../components/EmpSidebar";
import "../styles/EmpHolidays.css";
import axios from "axios";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const getDaysInMonth = (monthIndex, year) => {
  return new Date(year, monthIndex + 1, 0).getDate();
};

const getFirstDayOfMonth = (monthIndex, year) => {
  return new Date(year, monthIndex, 1).getDay();
};

const EmpHolidays = () => {

  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [holidays, setHolidays] = useState({});

  // ================= FETCH HOLIDAYS =================
  useEffect(() => {

    const fetchHolidays = async () => {

      try {

        const res = await axios.get(
          `http://localhost:5000/api/holidays?year=${year}`
        );

        console.log("Employee Holiday Data:", res.data);

        setHolidays(res.data || {});

      } catch (err) {

        console.error("Failed to fetch employee holidays", err);
        setHolidays({});

      }

    };

    fetchHolidays();

  }, [year]);

  // ================= MONTH NAVIGATION =================
  const handlePrev = () => {

    setCurrentMonthIndex((prev) => {

      const newIndex = prev === 0 ? 11 : prev - 1;

      if (newIndex === 11) setYear((y) => y - 1);

      return newIndex;

    });

  };

  const handleNext = () => {

    setCurrentMonthIndex((prev) => {

      const newIndex = prev === 11 ? 0 : prev + 1;

      if (newIndex === 0) setYear((y) => y + 1);

      return newIndex;

    });

  };

  const month = months[currentMonthIndex];

  const holidaysForMonth = holidays[String(year)]?.[month] || {};

  const daysInMonth = getDaysInMonth(currentMonthIndex, year);

  const startDay = getFirstDayOfMonth(currentMonthIndex, year);

  return (

    <div className="emp-holidays-container">

      <Sidebar />

      <div className="emp-holidays-content">

        <Header />

        <div className="emp-holidays-calendar-wrapper emp-holidays-fade-in">

          <div className="emp-holidays-calendar-header">

            <button onClick={handlePrev}>
              &laquo; Prev
            </button>

            <div className="emp-holidays-month-label">
              <h2>{month} {year}</h2>
            </div>

            <button onClick={handleNext}>
              Next &raquo;
            </button>

          </div>

          <div className="emp-holidays-calendar-grid">

            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((day) => (
              <div key={day} className="emp-holidays-day-header">
                {day}
              </div>
            ))}

            {Array.from({ length: 42 }).map((_, index) => {

              const dayNumber = index - startDay + 1;

              const isWithinMonth = dayNumber > 0 && dayNumber <= daysInMonth;

              const holiday = isWithinMonth ? holidaysForMonth[dayNumber] : null;

              let className = "emp-holidays-day";

              if (!isWithinMonth) className += " emp-holidays-empty";

              else if (holiday) {

                className += holiday.type === "G"
                  ? " emp-holidays-gov"
                  : " emp-holidays-restricted";

              }

              return (

                <div key={index} className={className}>

                  {isWithinMonth && (
                    <>
                      <div className="emp-holidays-day-number">
                        {dayNumber}
                      </div>

                      {holiday && (
                        <div className="emp-holidays-holiday-text">
                          {holiday.name} ({holiday.type})
                        </div>
                      )}
                    </>
                  )}

                </div>

              );

            })}

          </div>

        </div>

      </div>

    </div>

  );

};

export default EmpHolidays;
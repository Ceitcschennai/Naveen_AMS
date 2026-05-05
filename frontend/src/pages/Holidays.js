import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import "../styles/Holidays.css";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const getDaysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
const getFirstDayOfMonth = (m, y) => new Date(y, m, 1).getDay();

const HolidayCalendar = () => {

  const [mIndex, setMIndex] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [holidays, setHolidays] = useState({});

  // ================= FETCH HOLIDAYS =================
  useEffect(() => {

    const fetchHolidays = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await axios.get(
          `http://localhost:5000/api/holidays?year=${year}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log("Holiday API Response:", res.data);

        setHolidays(res.data);

      } catch (error) {

        console.error("Failed to fetch holidays", error);

      }

    };

    fetchHolidays();

  }, [year]);

  // ================= MONTH NAVIGATION =================
  const prev = () => {
    setMIndex((prev) => {
      const ni = prev === 0 ? 11 : prev - 1;
      if (ni === 11) setYear((y) => y - 1);
      return ni;
    });
  };

  const next = () => {
    setMIndex((prev) => {
      const ni = prev === 11 ? 0 : prev + 1;
      if (ni === 0) setYear((y) => y + 1);
      return ni;
    });
  };

  const daysInMonth = getDaysInMonth(mIndex, year);
  const startDay = getFirstDayOfMonth(mIndex, year);
  const totalCells = 42;

  const monthName = months[mIndex];

  const monthly = holidays[String(year)]?.[monthName] || {};

  // ================= CALENDAR CELLS =================
  const calendarCells = Array.from({ length: totalCells }).map((_, i) => {

    const dayNum = i - startDay + 1;

    const isValid = dayNum > 0 && dayNum <= daysInMonth;

    const holiday = isValid ? monthly[String(dayNum)] : null;

    let className = "calendar-day";

    if (!isValid) className += " empty";
    else if (holiday?.type === "G") className += " gov";
    else if (holiday?.type === "R") className += " restricted";

    return (

      <div key={i} className={className}>

        {isValid && (

          <>
            <div className="day-number">{dayNum}</div>

            {holiday && (
              <div className="holiday-text">
                {holiday.name} ({holiday.type})
              </div>
            )}

          </>

        )}

      </div>

    );

  });

  return (

    <div className="Holidays-container">

      <Sidebar />

      <div className="Holidays-content">

        <Header />

        <div className="calendar-wrapper fade-in">

          <div className="calendar-header">

            <button onClick={prev}>
              &laquo; Prev
            </button>

            <h2>
              {monthName} {year}
            </h2>

            <button onClick={next}>
              Next &raquo;
            </button>

          </div>

          <div className="calendar-grid">

            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((day) => (
              <div key={day} className="calendar-day-header">
                {day}
              </div>
            ))}

            {calendarCells}

          </div>

        </div>

      </div>

    </div>

  );

};

export default HolidayCalendar;
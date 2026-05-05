// controllers/holidayController.js

exports.getHolidays = (req, res) => {

  try {

    const { year } = req.query;

    const selectedYear = parseInt(year) || new Date().getFullYear();

    const holidays = generateHolidayData(selectedYear);

    res.status(200).json({
      [selectedYear]: holidays
    });

  } catch (error) {

    console.error("Holiday API error:", error);

    res.status(500).json({
      message: "Failed to fetch holidays"
    });

  }

};


// ================= GENERATE HOLIDAY DATA =================
function generateHolidayData(year) {

  const fixedHolidays = [
    { name: "New Year", month: 0, day: 1, type: "G" },
    { name: "Pongal", month: 0, day: 14, type: "G" },
    { name: "Republic Day", month: 0, day: 26, type: "G" },
    { name: "Tamil New Year", month: 3, day: 14, type: "G" },
    { name: "Labour Day", month: 4, day: 1, type: "G" },
    { name: "Independence Day", month: 7, day: 15, type: "G" },
    { name: "Gandhi Jayanti", month: 9, day: 2, type: "R" },
    { name: "Vinayagar Chaturthi", month: 8, day: 17, type: "G" },
    { name: "Saraswati Puja", month: 9, day: 23, type: "R" },
    { name: "Christmas", month: 11, day: 25, type: "G" }
  ];

  const dynamicHolidays = [
    {
      name: "Good Friday",
      date: getGoodFriday(year),
      type: "R"
    },
    {
      name: "Diwali",
      date: getDiwali(year),
      type: "G"
    }
  ];

  const holidaysByMonth = {};

  // ===== FIXED HOLIDAYS =====
  fixedHolidays.forEach(holiday => {

    const { name, month, day, type } = holiday;

    const date = new Date(year, month, day);

    const monthName = date.toLocaleString("default", { month: "long" });

    if (!holidaysByMonth[monthName]) {
      holidaysByMonth[monthName] = {};
    }

    holidaysByMonth[monthName][day] = {
      name,
      type
    };

  });


  // ===== DYNAMIC HOLIDAYS =====
  dynamicHolidays.forEach(({ name, date, type }) => {

    const monthName = date.toLocaleString("default", { month: "long" });

    const day = date.getDate();

    if (!holidaysByMonth[monthName]) {
      holidaysByMonth[monthName] = {};
    }

    holidaysByMonth[monthName][day] = {
      name,
      type
    };

  });

  return holidaysByMonth;

}


// ================= GOOD FRIDAY =================
function getGoodFriday(year) {

  const easter = getEasterSunday(year);

  easter.setDate(easter.getDate() - 2);

  return easter;

}


// ================= EASTER SUNDAY (Meeus Algorithm) =================
function getEasterSunday(year) {

  const f = Math.floor;

  const G = year % 19;

  const C = f(year / 100);

  const H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30;

  const I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11));

  const J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7;

  const L = I - J;

  const month = 3 + f((L + 40) / 44);

  const day = L + 28 - 31 * f(month / 4);

  return new Date(year, month - 1, day);

}


// ================= DIWALI =================
function getDiwali(year) {

  const diwaliDates = {
    2025: [9, 20],
    2026: [9, 8],
    2027: [9, 29],
    2028: [9, 17],
    2029: [9, 5],
    2030: [9, 26]
  };

  const [month, day] = diwaliDates[year] || [9, 3];

  return new Date(year, month, day);

}
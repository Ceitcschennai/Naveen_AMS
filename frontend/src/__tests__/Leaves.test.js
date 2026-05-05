import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Simple utility function tests (extracted from Leaves.js for testing)
const calculateDuration = (leave) => {
  if (!leave?.from || !leave?.to) return "-";

  if (leave.durationType === "Hourly") {
    return `${leave.hours} hour(s)`;
  } else if (leave.durationType === "Half Day") {
    return "Half Day";
  } else {
    const fromDate = new Date(leave.from);
    const toDate = new Date(leave.to);
    const timeDiff = Math.abs(toDate - fromDate);
    return `${Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1} day(s)`;
  }
};

const isLeaveCompleted = (leave) => {
  if (!leave?.to) return false;
  const toDate = new Date(leave.to);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  toDate.setHours(0, 0, 0, 0);
  return today > toDate;
};

const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

describe('Leaves Utility Functions', () => {
  describe('calculateDuration', () => {
    test('should return "-" when from or to is missing', () => {
      expect(calculateDuration({})).toBe("-");
      expect(calculateDuration({ from: '2024-01-01' })).toBe("-");
      expect(calculateDuration({ to: '2024-01-02' })).toBe("-");
    });

    test('should return hours for hourly leave type', () => {
      const leave = {
        from: '2024-01-01',
        to: '2024-01-01',
        durationType: 'Hourly',
        hours: 4
      };
      expect(calculateDuration(leave)).toBe("4 hour(s)");
    });

    test('should return "Half Day" for half day leave type', () => {
      const leave = {
        from: '2024-01-01',
        to: '2024-01-01',
        durationType: 'Half Day'
      };
      expect(calculateDuration(leave)).toBe("Half Day");
    });

    test('should calculate days for full day leave', () => {
      const leave = {
        from: '2024-01-01',
        to: '2024-01-03',
        durationType: 'Full Day'
      };
      expect(calculateDuration(leave)).toBe("3 day(s)");
    });
  });

  describe('isLeaveCompleted', () => {
    test('should return false when to date is missing', () => {
      expect(isLeaveCompleted({})).toBe(false);
    });

    test('should return false when to date is in the future', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);
      
      const leave = {
        to: futureDate.toISOString().split('T')[0]
      };
      
      expect(isLeaveCompleted(leave)).toBe(false);
    });

    test('should return true when to date is in the past', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 10);
      
      const leave = {
        to: pastDate.toISOString().split('T')[0]
      };
      
      expect(isLeaveCompleted(leave)).toBe(true);
    });
  });

  describe('capitalize', () => {
    test('should return empty string for empty input', () => {
      expect(capitalize("")).toBe("");
      expect(capitalize(null)).toBe("");
      expect(capitalize(undefined)).toBe("");
    });

    test('should capitalize first letter', () => {
      expect(capitalize("hello")).toBe("Hello");
      expect(capitalize("HELLO")).toBe("Hello");
      expect(capitalize("hELLO")).toBe("Hello");
    });
  });
});

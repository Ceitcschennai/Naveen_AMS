import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

// Mock react-icons to return simple spans instead of text
jest.mock('react-icons/fa', () => ({
  FaTachometerAlt: () => <span data-testid="icon-dashboard" />,
  FaUsers: () => <span data-testid="icon-users" />,
  FaCalendarCheck: () => <span data-testid="icon-attendance" />,
  FaCalendarTimes: () => <span data-testid="icon-leaves" />,
  FaRegCalendarAlt: () => <span data-testid="icon-holidays" />,
  FaBriefcase: () => <span data-testid="icon-workingdays" />,
  FaFileAlt: () => <span data-testid="icon-reports" />,
  FaChartBar: () => <span data-testid="icon-chart" />,
  FaUserCheck: () => <span data-testid="icon-usercheck" />,
  FaChevronDown: () => <span data-testid="icon-chevrondown" />,
  FaChevronUp: () => <span data-testid="icon-chevronup" />,
}));

// Mock useNavigate and useLocation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/Dashboard' }),
}));

const renderSidebar = () => {
  return render(
    <BrowserRouter>
      <Sidebar />
    </BrowserRouter>
  );
};

describe('Sidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  describe('Initial Render', () => {
    test('renders sidebar title', () => {
      renderSidebar();
      
      expect(screen.getByText('CeiTCS')).toBeInTheDocument();
    });

    test('renders sidebar subtitle', () => {
      renderSidebar();
      
      expect(screen.getByText('Attendance Management System')).toBeInTheDocument();
    });

    test('renders toggle button', () => {
      renderSidebar();
      
      expect(screen.getByText('☰')).toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    test('renders Dashboard link', () => {
      renderSidebar();
      
      const dashboardLinks = screen.getAllByText('Dashboard');
      expect(dashboardLinks.length).toBeGreaterThan(0);
    });

    test('renders Employees link', () => {
      renderSidebar();
      
      expect(screen.getByText('Employees')).toBeInTheDocument();
    });

    test('renders Attendance link', () => {
      renderSidebar();
      
      expect(screen.getByText('Attendance')).toBeInTheDocument();
    });

    test('renders Leaves link', () => {
      renderSidebar();
      
      expect(screen.getByText('Leaves')).toBeInTheDocument();
    });

    test('renders Holidays link', () => {
      renderSidebar();
      
      expect(screen.getByText('Holidays')).toBeInTheDocument();
    });

    test('renders Working Days link', () => {
      renderSidebar();
      
      expect(screen.getByText('Working Days')).toBeInTheDocument();
    });

    test('renders Attendance Report link', () => {
      renderSidebar();
      
      expect(screen.getByText('Attendance Report')).toBeInTheDocument();
    });
  });

  describe('Dropdown Menu', () => {
    test('renders dropdown toggle initially closed', () => {
      renderSidebar();
      
      expect(screen.getByText('Attendance Report')).toBeInTheDocument();
      expect(screen.queryByText('Report Overview')).not.toBeInTheDocument();
      expect(screen.queryByText('Individual Report')).not.toBeInTheDocument();
    });

    test('opens dropdown when clicking toggle', () => {
      renderSidebar();
      
      fireEvent.click(screen.getByText('Attendance Report'));
      
      expect(screen.getByText('Report Overview')).toBeInTheDocument();
      expect(screen.getByText('Individual Report')).toBeInTheDocument();
    });

    test('closes dropdown when clicking toggle again', () => {
      renderSidebar();
      
      fireEvent.click(screen.getByText('Attendance Report'));
      expect(screen.getByText('Report Overview')).toBeInTheDocument();
      
      fireEvent.click(screen.getByText('Attendance Report'));
      expect(screen.queryByText('Report Overview')).not.toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    test('navigates to Dashboard when clicking Dashboard link', () => {
      renderSidebar();
      
      const dashboardLink = screen.getAllByText('Dashboard')[0];
      fireEvent.click(dashboardLink);
      
      expect(mockNavigate).toHaveBeenCalledWith('/Dashboard');
    });

    test('navigates to Employees when clicking Employees link', () => {
      renderSidebar();
      
      fireEvent.click(screen.getByText('Employees'));
      
      expect(mockNavigate).toHaveBeenCalledWith('/Employees');
    });

    test('navigates to Attendance when clicking Attendance link', () => {
      renderSidebar();
      
      fireEvent.click(screen.getByText('Attendance'));
      
      expect(mockNavigate).toHaveBeenCalledWith('/Attendance');
    });

    test('navigates to Leaves when clicking Leaves link', () => {
      renderSidebar();
      
      fireEvent.click(screen.getByText('Leaves'));
      
      expect(mockNavigate).toHaveBeenCalledWith('/Leaves');
    });

    test('navigates to Holidays when clicking Holidays link', () => {
      renderSidebar();
      
      fireEvent.click(screen.getByText('Holidays'));
      
      expect(mockNavigate).toHaveBeenCalledWith('/Holidays');
    });

    test('navigates to AttendanceReport when clicking dropdown item', () => {
      renderSidebar();
      
      fireEvent.click(screen.getByText('Attendance Report'));
      fireEvent.click(screen.getByText('Report Overview'));
      
      expect(mockNavigate).toHaveBeenCalledWith('/AttendanceReport');
    });

    test('navigates to IndividualReport when clicking dropdown item', () => {
      renderSidebar();
      
      fireEvent.click(screen.getByText('Attendance Report'));
      fireEvent.click(screen.getByText('Individual Report'));
      
      expect(mockNavigate).toHaveBeenCalledWith('/IndividualReport');
    });
  });

  describe('Toggle Button', () => {
    test('toggles sidebar open/closed', () => {
      renderSidebar();
      
      const toggleBtn = screen.getByText('☰');
      
      fireEvent.click(toggleBtn);
      expect(screen.getByText('✖')).toBeInTheDocument();
      
      fireEvent.click(screen.getByText('✖'));
      expect(screen.getByText('☰')).toBeInTheDocument();
    });
  });
});

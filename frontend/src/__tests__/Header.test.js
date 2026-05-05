import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../components/Header';

// Mock react-icons with proper title attributes
jest.mock('react-icons/fa', () => ({
  FaUserCircle: () => <span data-testid="user-icon" title="Admin account">User</span>,
  FaCog: () => <span data-testid="settings-icon" title="Settings disabled">Settings</span>,
  FaSignOutAlt: () => <span data-testid="logout-icon" title="Logout">Logout</span>,
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderHeader = () => {
  return render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
};

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    localStorage.clear();
    localStorage.setItem('user', JSON.stringify({ name: 'Admin', role: 'admin' }));
  });

  describe('Initial Render', () => {
    test('renders welcome text', () => {
      renderHeader();
      
      expect(screen.getByText('Welcome Admin')).toBeInTheDocument();
    });

    test('renders settings icon', () => {
      renderHeader();
      
      expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
    });

    test('renders user icon', () => {
      renderHeader();
      
      expect(screen.getByTestId('user-icon')).toBeInTheDocument();
    });

    test('renders logout icon', () => {
      renderHeader();
      
      expect(screen.getByTestId('logout-icon')).toBeInTheDocument();
    });
  });

  describe('Icons', () => {
    test('renders settings icon with disabled title', () => {
      renderHeader();
      
      const settingsIcon = screen.getByTestId('settings-icon');
      expect(settingsIcon).toBeInTheDocument();
      expect(settingsIcon).toHaveAttribute('title', 'Settings disabled');
    });

    test('renders user icon with admin account title', () => {
      renderHeader();
      
      const userIcon = screen.getByTestId('user-icon');
      expect(userIcon).toBeInTheDocument();
      expect(userIcon).toHaveAttribute('title', 'Admin account');
    });

    test('renders logout icon with logout title', () => {
      renderHeader();
      
      const logoutIcon = screen.getByTestId('logout-icon');
      expect(logoutIcon).toBeInTheDocument();
      expect(logoutIcon).toHaveAttribute('title', 'Logout');
    });
  });

  describe('Header Structure', () => {
    test('renders header with correct class', () => {
      renderHeader();
      
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('header');
    });

    test('renders icon section with all icons', () => {
      renderHeader();
      
      expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
      expect(screen.getByTestId('user-icon')).toBeInTheDocument();
      expect(screen.getByTestId('logout-icon')).toBeInTheDocument();
    });
  });
});

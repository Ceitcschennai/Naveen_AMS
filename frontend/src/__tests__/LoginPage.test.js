import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../pages/LoginPage';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock usePopup
const mockShowPopup = jest.fn();
jest.mock('../PopupNotification', () => ({
  usePopup: () => ({
    showPopup: mockShowPopup,
  }),
}));

const renderLoginPage = () => {
  return render(<LoginPage />);
};

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    mockShowPopup.mockClear();
  });

  describe('Initial Render', () => {
    test('renders login form with email and password fields', () => {
      renderLoginPage();
      
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });

    test('renders login button', () => {
      renderLoginPage();
      
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    test('renders signup link', () => {
      renderLoginPage();
      
      expect(screen.getByText(/signup\?/i)).toBeInTheDocument();
    });

    test('renders "Welcome" heading', () => {
      renderLoginPage();
      
      expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    });

    test('renders "Employee Login" text', () => {
      renderLoginPage();
      
      expect(screen.getByText(/employee login/i)).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    test('can type in email field', () => {
      renderLoginPage();
      
      const emailInput = screen.getByPlaceholderText('Email');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      
      expect(emailInput.value).toBe('test@example.com');
    });

    test('can type in password field', () => {
      renderLoginPage();
      
      const passwordInput = screen.getByPlaceholderText('Password');
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      
      expect(passwordInput.value).toBe('password123');
    });
  });

  describe('Signup Flow', () => {
    test('shows signup form when clicking signup button', () => {
      renderLoginPage();
      
      fireEvent.click(screen.getByText(/signup\?/i));
      
      expect(screen.getByText(/sign up/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    });

    test('shows "Back to Login" button in signup mode', () => {
      renderLoginPage();
      
      fireEvent.click(screen.getByText(/signup\?/i));
      
      expect(screen.getByText(/back to login/i)).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    test('shows error when submitting empty form', async () => {
      renderLoginPage();
      
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
      
      await waitFor(() => {
        expect(mockShowPopup).toHaveBeenCalledWith('Please enter both email and password.');
      });
    });
  });

  describe('Successful Login', () => {
    test('navigates to EmpDashboard on successful login', async () => {
      axios.post.mockResolvedValueOnce({ 
        data: { token: 'mock-token' } 
      });
      
      renderLoginPage();
      
      fireEvent.change(screen.getByPlaceholderText('Email'), { 
        target: { value: 'test@example.com' } 
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), { 
        target: { value: 'password123' } 
      });
      
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/EmpDashboard');
      });
    });
  });

  describe('Failed Login', () => {
    test('shows error message on login failure', async () => {
      axios.post.mockRejectedValueOnce({ 
        response: { data: { message: 'Invalid credentials' } } 
      });
      
      renderLoginPage();
      
      fireEvent.change(screen.getByPlaceholderText('Email'), { 
        target: { value: 'test@example.com' } 
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), { 
        target: { value: 'wrongpassword' } 
      });
      
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
      
      await waitFor(() => {
        expect(mockShowPopup).toHaveBeenCalledWith('Invalid credentials');
      });
    });
  });

  describe('Admin Login Navigation', () => {
    test('navigates to admin login page when clicking admin icon', () => {
      renderLoginPage();
      
      fireEvent.click(screen.getByTitle('Admin Login'));
      
      expect(mockNavigate).toHaveBeenCalledWith('/AdminLoginpage');
    });
  });
});

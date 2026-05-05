import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminLoginPage from '../pages/AdminLoginpage';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderAdminLoginPage = () => {
  return render(
    <BrowserRouter>
      <AdminLoginPage />
    </BrowserRouter>
  );
};

describe('AdminLoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    localStorage.clear();
  });

  describe('Initial Render', () => {
    test('renders admin login form', () => {
      renderAdminLoginPage();
      
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });

    test('renders login button', () => {
      renderAdminLoginPage();
      
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    test('renders "Welcome" heading', () => {
      renderAdminLoginPage();
      
      expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    });

    test('renders "Admin Login" text', () => {
      renderAdminLoginPage();
      
      expect(screen.getByText(/admin login/i)).toBeInTheDocument();
    });

    test('renders company logo', () => {
      renderAdminLoginPage();
      
      expect(screen.getByAltText('Company Logo')).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    test('can type in email field', () => {
      renderAdminLoginPage();
      
      const emailInput = screen.getByPlaceholderText('Email');
      fireEvent.change(emailInput, { target: { value: 'admin@gmail.com' } });
      
      expect(emailInput.value).toBe('admin@gmail.com');
    });

    test('can type in password field', () => {
      renderAdminLoginPage();
      
      const passwordInput = screen.getByPlaceholderText('Password');
      fireEvent.change(passwordInput, { target: { value: 'p123' } });
      
      expect(passwordInput.value).toBe('p123');
    });
  });

  describe('Successful Admin Login', () => {
    test('navigates to Dashboard on successful admin login', () => {
      renderAdminLoginPage();
      
      fireEvent.change(screen.getByPlaceholderText('Email'), { 
        target: { value: 'admin@gmail.com' } 
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), { 
        target: { value: 'p123' } 
      });
      
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
      
      expect(mockNavigate).toHaveBeenCalledWith('/Dashboard');
    });

    test('clears form fields on successful login', () => {
      renderAdminLoginPage();
      
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      
      fireEvent.change(emailInput, { target: { value: 'admin@gmail.com' } });
      fireEvent.change(passwordInput, { target: { value: 'p123' } });
      
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
      
      expect(emailInput.value).toBe('');
      expect(passwordInput.value).toBe('');
    });
  });

  describe('Failed Admin Login', () => {
    test('shows error message on invalid credentials', () => {
      renderAdminLoginPage();
      
      fireEvent.change(screen.getByPlaceholderText('Email'), { 
        target: { value: 'wrong@admin.com' } 
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), { 
        target: { value: 'wrongpassword' } 
      });
      
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
      
      expect(screen.getByText(/invalid admin credentials/i)).toBeInTheDocument();
    });

    test('shows error with wrong password', () => {
      renderAdminLoginPage();
      
      fireEvent.change(screen.getByPlaceholderText('Email'), { 
        target: { value: 'admin@gmail.com' } 
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), { 
        target: { value: 'wrongpassword' } 
      });
      
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
      
      expect(screen.getByText(/invalid admin credentials/i)).toBeInTheDocument();
    });

    test('shows error with wrong email', () => {
      renderAdminLoginPage();
      
      fireEvent.change(screen.getByPlaceholderText('Email'), { 
        target: { value: 'admin@yahoo.com' } 
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), { 
        target: { value: 'p123' } 
      });
      
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
      
      expect(screen.getByText(/invalid admin credentials/i)).toBeInTheDocument();
    });

    test('does not navigate on invalid credentials', () => {
      renderAdminLoginPage();
      
      fireEvent.change(screen.getByPlaceholderText('Email'), { 
        target: { value: 'wrong@admin.com' } 
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), { 
        target: { value: 'wrongpassword' } 
      });
      
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
      
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    test('clears form on successful login', () => {
      renderAdminLoginPage();
      
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      
      fireEvent.change(emailInput, { target: { value: 'admin@gmail.com' } });
      fireEvent.change(passwordInput, { target: { value: 'p123' } });
      
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
      
      // Fields should be cleared after successful login
      expect(emailInput.value).toBe('');
      expect(passwordInput.value).toBe('');
    });
  });

  describe('Form Reset on Mount', () => {
    test('form fields are empty on initial render', () => {
      renderAdminLoginPage();
      
      expect(screen.getByPlaceholderText('Email').value).toBe('');
      expect(screen.getByPlaceholderText('Password').value).toBe('');
    });

    test('no error message on initial render', () => {
      renderAdminLoginPage();
      
      expect(screen.queryByText(/invalid admin credentials/i)).not.toBeInTheDocument();
    });
  });
});

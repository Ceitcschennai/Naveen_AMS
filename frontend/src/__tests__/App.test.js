import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock the axios calls
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login page at root path', () => {
    // App.js already contains BrowserRouter, so render directly
    render(<App />);
    
    // The root path should render LoginPage with "Welcome" and "Employee Login" text
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
    expect(screen.getByText(/Employee Login/i)).toBeInTheDocument();
  });

  test('renders without crashing', () => {
    expect(() => render(<App />)).not.toThrow();
  });
});

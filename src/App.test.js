import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import SecretSantaGame from './components/SecretSantaGame';

// Mock Papa Parse
jest.mock('papaparse', () => ({
  parse: jest.fn((file, config) => {
    // Simulate successful CSV parsing
    if (file.name === 'current_employees.csv') {
      config.complete({
        data: [
          { Employee_Name: 'John Doe', Employee_EmailID: 'john.doe@acme.com' },
          { Employee_Name: 'Jane Smith', Employee_EmailID: 'jane.smith@acme.com' }
        ]
      });
    } else if (file.name === 'previous_assignments.csv') {
      config.complete({
        data: [
          {
            Employee_Name: 'John Doe',
            Employee_EmailID: 'john.doe@acme.com',
            Secret_Child_Name: 'Jane Smith',
            Secret_Child_EmailID: 'jane.smith@acme.com'
          }
        ]
      });
    }
  }),
  unparse: jest.fn(() => 'csv-content')
}));

// Mock URL.createObjectURL and URL.revokeObjectURL
window.URL.createObjectURL = jest.fn(() => 'mock-url');
window.URL.revokeObjectURL = jest.fn();

describe('Secret Santa Game Application', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders main application title', () => {
    render(<App />);
    expect(screen.getByText(/Secret Santa Game/i)).toBeInTheDocument();
  });

  test('renders SecretSantaGame component with upload sections', () => {
    render(<SecretSantaGame />);
    
    // Check for file upload sections
    expect(screen.getByText(/Upload Current Employees/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload Previous Assignments/i)).toBeInTheDocument();
    
    // Check for buttons
    expect(screen.getByText(/Generate Assignments/i)).toBeInTheDocument();
    expect(screen.getByText(/Download Assignments/i)).toBeInTheDocument();
  });

  test('handles current employees file upload', async () => {
    render(<SecretSantaGame />);
    
    const file = new File(
      ['Employee_Name,Employee_EmailID\nJohn Doe,john.doe@acme.com'],
      'current_employees.csv',
      { type: 'text/csv' }
    );
    
    const input = screen.getByLabelText(/Upload Current Employees/i);
    await userEvent.upload(input, file);
    
    // Verify Papa Parse was called
    expect(Papa.parse).toHaveBeenCalled();
  });

  test('handles previous assignments file upload', async () => {
    render(<SecretSantaGame />);
    
    const file = new File(
      ['Employee_Name,Employee_EmailID,Secret_Child_Name,Secret_Child_EmailID\n'],
      'previous_assignments.csv',
      { type: 'text/csv' }
    );
    
    const input = screen.getByLabelText(/Upload Previous Assignments/i);
    await userEvent.upload(input, file);
    
    expect(Papa.parse).toHaveBeenCalled();
  });

  test('generates assignments when button is clicked', async () => {
    render(<SecretSantaGame />);
    
    // Upload current employees first
    const file = new File(
      ['Employee_Name,Employee_EmailID\nJohn Doe,john.doe@acme.com'],
      'current_employees.csv',
      { type: 'text/csv' }
    );
    
    const input = screen.getByLabelText(/Upload Current Employees/i);
    await userEvent.upload(input, file);
    
    // Click generate button
    const generateButton = screen.getByText(/Generate Assignments/i);
    fireEvent.click(generateButton);
    
    // Check if assignments table appears
    await waitFor(() => {
      expect(screen.getByText(/Preview Assignments/i)).toBeInTheDocument();
    });
  });

  test('shows error when generating assignments without uploading employees', () => {
    render(<SecretSantaGame />);
    
    const generateButton = screen.getByText(/Generate Assignments/i);
    fireEvent.click(generateButton);
    
    expect(screen.getByText(/Please upload current employees file first/i)).toBeInTheDocument();
  });

  test('downloads assignments when download button is clicked', async () => {
    render(<SecretSantaGame />);
    
    // Mock document.createElement
    const mockAnchor = { click: jest.fn() };
    jest.spyOn(document, 'createElement').mockImplementation(() => mockAnchor);
    
    // Upload file and generate assignments first
    const file = new File(
      ['Employee_Name,Employee_EmailID\nJohn Doe,john.doe@acme.com'],
      'current_employees.csv',
      { type: 'text/csv' }
    );
    
    const input = screen.getByLabelText(/Upload Current Employees/i);
    await userEvent.upload(input, file);
    
    const generateButton = screen.getByText(/Generate Assignments/i);
    fireEvent.click(generateButton);
    
    // Click download button
    const downloadButton = screen.getByText(/Download Assignments/i);
    fireEvent.click(downloadButton);
    
    expect(mockAnchor.click).toHaveBeenCalled();
  });

  test('validates assignment rules', async () => {
    render(<SecretSantaGame />);
    
    // Upload current employees with multiple entries
    const file = new File([
      'Employee_Name,Employee_EmailID\n' +
      'John Doe,john.doe@acme.com\n' +
      'Jane Smith,jane.smith@acme.com\n' +
      'Bob Jones,bob.jones@acme.com'
    ], 'current_employees.csv', { type: 'text/csv' });
    
    const input = screen.getByLabelText(/Upload Current Employees/i);
    await userEvent.upload(input, file);
    
    const generateButton = screen.getByText(/Generate Assignments/i);
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      const assignments = screen.getByText(/Preview Assignments/i);
      expect(assignments).toBeInTheDocument();
      
      // Verify no self-assignments
      const rows = screen.getAllByRole('row');
      rows.slice(1).forEach(row => {
        const cells = row.querySelectorAll('td');
        const santa = cells[0].textContent;
        const child = cells[1].textContent;
        expect(santa).not.toBe(child);
      });
    });
  });

  test('handles file parsing errors gracefully', async () => {
    // Mock Papa Parse to simulate an error
    const mockError = new Error('Invalid CSV format');
    Papa.parse.mockImplementationOnce((file, config) => {
      config.error(mockError);
    });
    
    render(<SecretSantaGame />);
    
    const file = new File(['invalid,csv,format'], 'invalid.csv', { type: 'text/csv' });
    const input = screen.getByLabelText(/Upload Current Employees/i);
    await userEvent.upload(input, file);
    
    expect(screen.getByText(/Error parsing current employees file/i)).toBeInTheDocument();
  });
});
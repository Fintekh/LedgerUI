import { renderHook, waitFor, act } from '@testing-library/react';
import { useEmployees } from '../useEmployees';
import * as api from '../../services/api';

// Mock the API service - use our mock file with explicit implementation
jest.mock('../../services/api', () => require('../../services/__mocks__/api'));

describe('useEmployees hook', () => {
  const mockEmployees = [
    {
      id: 'e1',
      name: 'John Smith',
      title: 'Senior Developer',
      position: 'Senior Developer',
      department: 'Engineering',
      email: 'john.smith@example.com',
      skills: [],
      hireDate: '2020-01-15',
      status: 'active',
      costRate: 75,
      capacity: 40,
      jobProfile: 'Senior Software Engineer',
      employeeType: 'employee'
    },
    {
      id: 'e2',
      name: 'Emily Johnson',
      title: 'UX Designer',
      position: 'UX Designer',
      department: 'Design',
      email: 'emily.johnson@example.com',
      skills: [],
      hireDate: '2021-03-10',
      status: 'active',
      costRate: 65,
      capacity: 40,
      jobProfile: 'Principal Engineer',
      employeeType: 'employee'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Setup default mock implementations
    (api.employees.getAll as jest.Mock).mockResolvedValue(mockEmployees);
    (api.employees.getById as jest.Mock).mockImplementation((id) => 
      Promise.resolve(mockEmployees.find(e => e.id === id))
    );
    (api.employees.create as jest.Mock).mockImplementation((data) => 
      Promise.resolve({ id: 'new-id', ...data })
    );
    (api.employees.update as jest.Mock).mockImplementation((id, data) => 
      Promise.resolve({ id, ...data })
    );
    (api.employees.remove as jest.Mock).mockResolvedValue(undefined);
    (api.employees.getByDepartment as jest.Mock).mockImplementation((department) => 
      Promise.resolve(mockEmployees.filter(e => e.department === department))
    );
  });

  test('should fetch employees on mount', async () => {
    const { result } = renderHook(() => useEmployees());

    // Initially loading
    expect(result.current.loading).toBe(true);
    
    // Wait for API call to resolve
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    expect(api.employees.getAll).toHaveBeenCalledTimes(1);
    expect(result.current.employees).toEqual(mockEmployees);
    expect(result.current.error).toBeNull();
  });

  test('should create a new employee', async () => {
    const { result } = renderHook(() => useEmployees());
    
    // Wait for initial load
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    const newEmployee = {
      name: 'Sarah Parker',
      title: 'DevOps Engineer',
      position: 'DevOps Engineer',
      department: 'Operations',
      email: 'sarah.parker@example.com',
      skills: [],
      hireDate: '2022-05-01',
      status: 'active',
      costRate: 80,
      capacity: 40,
      employeeType: 'employee'
    };
    
    let createdEmployee;
    await act(async () => {
      createdEmployee = await result.current.createEmployee(newEmployee);
    });
    
    expect(api.employees.create).toHaveBeenCalledWith(newEmployee);
    expect(result.current.employees).toHaveLength(mockEmployees.length + 1);
    expect(createdEmployee).toEqual({
      id: 'new-id',
      ...newEmployee
    });
  });

  test('should update an existing employee', async () => {
    const { result } = renderHook(() => useEmployees());
    
    // Wait for initial load
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    const updatedData = {
      title: 'Senior UX Designer',
      position: 'Senior UX Designer'
    };
    
    let updatedEmployee;
    await act(async () => {
      updatedEmployee = await result.current.updateEmployee('e2', updatedData);
    });
    
    expect(api.employees.update).toHaveBeenCalledWith('e2', updatedData);
    expect(updatedEmployee).toEqual({
      id: 'e2',
      ...updatedData
    });
    const foundEmployee = result.current.employees.find(e => e.id === 'e2');
    expect(foundEmployee).toBeDefined();
    expect(foundEmployee?.title).toBe('Senior UX Designer');
  });

  test('should delete an employee', async () => {
    const { result } = renderHook(() => useEmployees());
    
    // Wait for initial load
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    await act(async () => {
      await result.current.deleteEmployee('e1');
    });
    
    expect(api.employees.remove).toHaveBeenCalledWith('e1');
    expect(result.current.employees).toHaveLength(mockEmployees.length - 1);
    expect(result.current.employees.find(e => e.id === 'e1')).toBeUndefined();
  });

  test('should get an employee by id', async () => {
    const { result } = renderHook(() => useEmployees());
    
    // Wait for initial load
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    let employee;
    await act(async () => {
      employee = await result.current.getEmployeeById('e2');
    });
    
    expect(api.employees.getById).toHaveBeenCalledWith('e2');
    expect(employee).toEqual(mockEmployees[1]);
  });

  test('should get employees by department', async () => {
    const { result } = renderHook(() => useEmployees());
    
    // Wait for initial load
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    let engineers;
    await act(async () => {
      engineers = await result.current.getEmployeesByDepartment('Engineering');
    });
    
    expect(api.employees.getByDepartment).toHaveBeenCalledWith('Engineering');
    expect(engineers).toEqual([mockEmployees[0]]);
  });

  test('should handle API errors on initial load', async () => {
    // Mock API to throw an error
    const apiError = new Error('API error');
    (api.employees.getAll as jest.Mock).mockRejectedValue(apiError);
    
    const { result } = renderHook(() => useEmployees());
    
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    expect(result.current.error).toEqual(apiError);
    expect(result.current.employees).toEqual([]);
  });

  test('should handle errors when creating employee', async () => {
    const { result } = renderHook(() => useEmployees());
    
    // Wait for initial load
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    // Mock API to throw an error for create
    const apiError = new Error('Failed to create employee');
    (api.employees.create as jest.Mock).mockRejectedValue(apiError);
    
    const newEmployee = {
      name: 'Error Employee',
      title: 'Test',
      position: 'Test',
      department: 'Testing',
      email: 'test@example.com',
      skills: [],
      hireDate: '2023-01-01',
      status: 'active',
      costRate: 50,
      capacity: 40,
      employeeType: 'employee'
    };
    
    // Try to create (will throw)
    let error;
    await act(async () => {
      try {
        await result.current.createEmployee(newEmployee);
      } catch (e) {
        error = e;
      }
    });
    
    expect(error).toBe(apiError);
    expect(result.current.error).toEqual(apiError);
    // Employees list should remain unchanged
    expect(result.current.employees).toEqual(mockEmployees);
  });

  test('should handle errors when updating employee', async () => {
    const { result } = renderHook(() => useEmployees());
    
    // Wait for initial load
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    // Mock API to throw an error for update
    const apiError = new Error('Failed to update employee');
    (api.employees.update as jest.Mock).mockRejectedValue(apiError);
    
    const updatedData = {
      title: 'Updated Title'
    };
    
    // Try to update (will throw)
    let error;
    await act(async () => {
      try {
        await result.current.updateEmployee('e1', updatedData);
      } catch (e) {
        error = e;
      }
    });
    
    expect(error).toBe(apiError);
    expect(result.current.error).toEqual(apiError);
    // Employees list should remain unchanged
    expect(result.current.employees).toEqual(mockEmployees);
  });

  test('should handle errors when deleting employee', async () => {
    const { result } = renderHook(() => useEmployees());
    
    // Wait for initial load
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    // Mock API to throw an error for delete
    const apiError = new Error('Failed to delete employee');
    (api.employees.remove as jest.Mock).mockRejectedValue(apiError);
    
    // Try to delete (will throw)
    let error;
    await act(async () => {
      try {
        await result.current.deleteEmployee('e1');
      } catch (e) {
        error = e;
      }
    });
    
    expect(error).toBe(apiError);
    expect(result.current.error).toEqual(apiError);
    // Employees list should remain unchanged
    expect(result.current.employees).toEqual(mockEmployees);
  });

  test('should handle errors when fetching employee by id', async () => {
    const { result } = renderHook(() => useEmployees());
    
    // Wait for initial load
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    // Mock API to throw an error for getById
    const apiError = new Error('Failed to fetch employee');
    (api.employees.getById as jest.Mock).mockRejectedValue(apiError);
    
    // Try to get by id (will throw)
    let error;
    await act(async () => {
      try {
        await result.current.getEmployeeById('nonexistent-id');
      } catch (e) {
        error = e;
      }
    });
    
    expect(error).toBe(apiError);
    expect(result.current.error).toEqual(apiError);
  });

  test('should handle errors when fetching employees by department', async () => {
    const { result } = renderHook(() => useEmployees());
    
    // Wait for initial load
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    // Mock API to throw an error for getByDepartment
    const apiError = new Error('Failed to fetch employees by department');
    (api.employees.getByDepartment as jest.Mock).mockRejectedValue(apiError);
    
    // Try to get by department (will throw)
    let error;
    await act(async () => {
      try {
        await result.current.getEmployeesByDepartment('unknown');
      } catch (e) {
        error = e;
      }
    });
    
    expect(error).toBe(apiError);
    expect(result.current.error).toEqual(apiError);
  });

  test('should handle non-Error objects as errors', async () => {
    const { result } = renderHook(() => useEmployees());
    
    // Wait for initial load
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    // Mock API to throw a non-Error object
    (api.employees.create as jest.Mock).mockRejectedValue('String error');
    
    // Try to create (will throw)
    await act(async () => {
      try {
        await result.current.createEmployee({
          name: 'Test User', 
          title: 'Test',
          position: 'Test',
          department: 'Testing',
          email: 'test@example.com',
          skills: [],
          hireDate: '2023-01-01',
          status: 'active',
          costRate: 50,
          capacity: 40,
          employeeType: 'employee'
        });
      } catch (e) {
        // Expected to throw
      }
    });
    
    // Verify error is properly wrapped
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toContain('An error occurred while creating employee');
  });

  test('should handle refresh of employee data', async () => {
    const { result } = renderHook(() => useEmployees());
    
    // Wait for initial load
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    // Update the mock data that will be returned
    const updatedMockEmployees = [...mockEmployees, {
      id: 'e3',
      name: 'New Test Employee',
      title: 'Tester',
      position: 'Tester',
      department: 'QA',
      email: 'tester@example.com',
      skills: [],
      hireDate: '2023-05-01',
      status: 'active',
      costRate: 60,
      capacity: 40,
      employeeType: 'employee'
    }];
    
    (api.employees.getAll as jest.Mock).mockResolvedValue(updatedMockEmployees);
    
    // Trigger a refresh
    await act(async () => {
      await result.current.fetchEmployees();
    });
    
    expect(api.employees.getAll).toHaveBeenCalledTimes(2); // Initial + refresh call
    expect(result.current.employees).toEqual(updatedMockEmployees);
    expect(result.current.employees.length).toBe(3);
  });
});

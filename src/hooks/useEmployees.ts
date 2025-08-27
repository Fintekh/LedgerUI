import { useState, useEffect, useCallback } from 'react';
import { Employee } from '../types/employee';
import * as api from '../services/api';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch all employees
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.employees.getAll();
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while fetching employees'));
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new employee
  const createEmployee = useCallback(async (employeeData: Omit<Employee, 'id'>) => {
    try {
      setLoading(true);
      const newEmployee = await api.employees.create(employeeData);
      setEmployees((prev) => [...prev, newEmployee]);
      return newEmployee;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while creating employee'));
      console.error('Error creating employee:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing employee
  const updateEmployee = useCallback(async (id: string, employeeData: Partial<Employee>) => {
    try {
      setLoading(true);
      const updatedEmployee = await api.employees.update(id, employeeData);
      setEmployees((prev) =>
        prev.map((employee) => (employee.id === id ? updatedEmployee : employee))
      );
      return updatedEmployee;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while updating employee'));
      console.error('Error updating employee:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete an employee
  const deleteEmployee = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await api.employees.remove(id);
      setEmployees((prev) => prev.filter((employee) => employee.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while deleting employee'));
      console.error('Error deleting employee:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get a single employee by ID
  const getEmployeeById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const employee = await api.employees.getById(id);
      return employee;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while fetching employee'));
      console.error('Error fetching employee:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get employees by department
  const getEmployeesByDepartment = useCallback(async (department: string) => {
    try {
      setLoading(true);
      const filteredEmployees = await api.employees.getByDepartment(department);
      return filteredEmployees;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while fetching employees by department'));
      console.error('Error fetching employees by department:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById,
    getEmployeesByDepartment,
  };
}
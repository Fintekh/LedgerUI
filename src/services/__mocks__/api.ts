// Mock file for api.ts during testing
import { Vendor } from '../../types/vendor';
import { Allocation } from '../../types/allocation';
import { Employee } from '../../types/employee';
import { Project } from '../../types/project';
import { Skill } from '../../types/skill';
import { SkillCategory } from '../../types/skill';
import { TimeEntry, WeeklyTimesheet } from '../../types/timeEntry';

// Don't use import.meta.env here - this mock is just for testing
const API_BASE_URL = 'http://test-api-url';

// Mock data
const mockVendors: Vendor[] = [
  {
    id: 'v1',
    name: 'Mock Vendor 1',
    contactEmail: 'vendor1@example.com',
    contactPhone: '123-456-7890',
    status: 'active'
  },
  {
    id: 'v2',
    name: 'Mock Vendor 2',
    contactEmail: 'vendor2@example.com',
    status: 'inactive'
  }
];

// Add current month allocations for May 2025
const currentMonth = '2025-05';

// Rest of the mock code...

// Rest of the mock file...

// Mock employees for allocations
const mockEmployees: Employee[] = [
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
  },
  {
    id: 'e3',
    name: 'Michael Brown',
    title: 'Project Manager',
    position: 'Project Manager',
    department: 'Management',
    email: 'michael.brown@example.com',
    skills: [],
    hireDate: '2019-06-20',
    status: 'active',
    costRate: 85,
    capacity: 40,
    jobProfile: 'Principal Project Manager',
    employeeType: 'employee'
  }
];

// Mock projects for allocations
const mockProjects: Project[] = [
  {
    id: 'p1',
    name: 'Website Redesign',
    description: 'Revamp the company website with new design and features',
    startDate: '2025-01-15',
    endDate: '2025-09-30',
    status: 'active',
    budget: 120000
  },
  {
    id: 'p2',
    name: 'Mobile App Development',
    description: 'Create a new mobile app for iOS and Android',
    startDate: '2025-03-01',
    endDate: '2025-12-15',
    status: 'active',
    budget: 200000
  }
];

// Mock allocations - including current month data (2025-05)
const mockAllocations: Allocation[] = [
  // Historical allocations
  {
    id: 'a1',
    employeeId: 'e1',
    projectId: 'p2',
    month: '2023-06',
    percentage: 75,
    notes: 'Lead developer for mobile app frontend'
  },
  {
    id: 'a2',
    employeeId: 'e1',
    projectId: 'p1',
    month: '2023-06',
    percentage: 25,
    notes: 'Consulting on redesign technical aspects'
  },
  // Current month allocations (May 2025)
  {
    id: 'a101',
    employeeId: 'e1',
    projectId: 'p1',
    month: currentMonth,
    percentage: 50,
    notes: 'Working on website redesign frontend implementation'
  },
  {
    id: 'a102',
    employeeId: 'e1',
    projectId: 'p2',
    month: currentMonth,
    percentage: 30,
    notes: 'Supporting mobile app development'
  },
  {
    id: 'a103',
    employeeId: 'e2',
    projectId: 'p1',
    month: currentMonth,
    percentage: 80,
    notes: 'Leading UX design for website redesign'
  },
  {
    id: 'a104',
    employeeId: 'e3',
    projectId: 'p1',
    month: currentMonth,
    percentage: 40,
    notes: 'Project management for website redesign'
  },
  {
    id: 'a105',
    employeeId: 'e3',
    projectId: 'p2',
    month: currentMonth,
    percentage: 40,
    notes: 'Project management for mobile app'
  }
];

// Mock skills
const mockSkills: Skill[] = [
  {
    id: 's1',
    name: 'JavaScript',
    category: 'Frontend'
  },
  {
    id: 's2',
    name: 'Python',
    category: 'Backend'
  },
  {
    id: 's3',
    name: 'React',
    category: 'Frontend'
  }
];

// Mock API functions
export const vendors = {
  getAll: jest.fn().mockResolvedValue(mockVendors),
  getById: jest.fn().mockImplementation((id: string) => {
    const vendor = mockVendors.find(v => v.id === id);
    return Promise.resolve(vendor);
  }),
  create: jest.fn().mockImplementation((data: Omit<Vendor, 'id'>) => {
    const newVendor = { ...data, id: `v${mockVendors.length + 1}` };
    return Promise.resolve(newVendor);
  }),
  update: jest.fn().mockImplementation((id: string, data: Partial<Vendor>) => {
    const updatedVendor = { ...data, id } as Vendor;
    return Promise.resolve(updatedVendor);
  }),
  delete: jest.fn().mockResolvedValue(true),
  remove: jest.fn().mockResolvedValue(undefined)
};

// Allocation API functions
export const allocations = {
  getAll: jest.fn().mockResolvedValue(mockAllocations),
  getById: jest.fn().mockImplementation((id: string) => {
    const allocation = mockAllocations.find(a => a.id === id);
    return Promise.resolve(allocation);
  }),
  getByMonth: jest.fn().mockImplementation((month: string) => {
    const filteredAllocations = mockAllocations.filter(a => a.month === month);
    return Promise.resolve(filteredAllocations);
  }),
  getByEmployeeId: jest.fn().mockImplementation((employeeId: string) => {
    const filteredAllocations = mockAllocations.filter(a => a.employeeId === employeeId);
    return Promise.resolve(filteredAllocations);
  }),
  getByProjectId: jest.fn().mockImplementation((projectId: string) => {
    const filteredAllocations = mockAllocations.filter(a => a.projectId === projectId);
    return Promise.resolve(filteredAllocations);
  }),
  create: jest.fn().mockImplementation((data: Omit<Allocation, 'id'>) => {
    const newAllocation = { ...data, id: `a${mockAllocations.length + 1}` };
    return Promise.resolve(newAllocation);
  }),
  update: jest.fn().mockImplementation((id: string, data: Partial<Allocation>) => {
    const updatedAllocation = { ...data, id } as Allocation;
    return Promise.resolve(updatedAllocation);
  }),
  remove: jest.fn().mockResolvedValue(undefined)
};

// Employee API functions
export const employees = {
  getAll: jest.fn().mockResolvedValue(mockEmployees),
  getById: jest.fn().mockImplementation((id: string) => {
    const employee = mockEmployees.find(e => e.id === id);
    return Promise.resolve(employee);
  }),
  create: jest.fn().mockImplementation((data: Omit<Employee, 'id'>) => {
    const newEmployee = { ...data, id: `e${mockEmployees.length + 1}` };
    return Promise.resolve(newEmployee);
  }),
  update: jest.fn().mockImplementation((id: string, data: Partial<Employee>) => {
    const updatedEmployee = { ...data, id } as Employee;
    return Promise.resolve(updatedEmployee);
  }),
  remove: jest.fn().mockResolvedValue(undefined),
  getByDepartment: jest.fn().mockImplementation((department: string) => {
    const filteredEmployees = mockEmployees.filter(e => e.department === department);
    return Promise.resolve(filteredEmployees);
  })
};

// Project API functions
export const projects = {
  getAll: jest.fn().mockResolvedValue(mockProjects),
  getById: jest.fn().mockImplementation((id: string) => {
    const project = mockProjects.find(p => p.id === id);
    return Promise.resolve(project);
  }),
  create: jest.fn().mockImplementation((data: Omit<Project, 'id'>) => {
    const newProject = { ...data, id: `p${mockProjects.length + 1}` };
    return Promise.resolve(newProject);
  }),
  update: jest.fn().mockImplementation((id: string, data: Partial<Project>) => {
    const updatedProject = { ...data, id } as Project;
    return Promise.resolve(updatedProject);
  }),
  remove: jest.fn().mockResolvedValue(undefined),
  getByStatus: jest.fn().mockImplementation((status: string) => {
    const filteredProjects = mockProjects.filter(p => p.status === status);
    return Promise.resolve(filteredProjects);
  })
};

// Skills API functions
export const skills = {
  getAll: jest.fn().mockResolvedValue(mockSkills),
  getById: jest.fn().mockImplementation((id: string) => {
    const skill = mockSkills.find(s => s.id === id);
    return Promise.resolve(skill);
  }),
  create: jest.fn().mockImplementation((data: Omit<Skill, 'id'>) => {
    const newSkill = { ...data, id: `s${mockSkills.length + 1}` };
    return Promise.resolve(newSkill);
  }),
  update: jest.fn().mockImplementation((id: string, data: Partial<Skill>) => {
    const updatedSkill = { ...data, id } as Skill;
    return Promise.resolve(updatedSkill);
  }),
  remove: jest.fn().mockResolvedValue(undefined),
  getByCategory: jest.fn().mockImplementation((category: string) => {
    const filteredSkills = mockSkills.filter(s => s.category === category);
    return Promise.resolve(filteredSkills);
  })
};

// Time Entries API functions 
export const timeEntries = {
  getByEmployeeAndWeek: jest.fn().mockImplementation((employeeId: string, weekStartDate: string) => {
    // Return empty array by default
    return Promise.resolve([]);
  }),
  create: jest.fn().mockImplementation((data: any) => {
    return Promise.resolve({ ...data, id: 'te-mock-id' });
  }),
  patch: jest.fn().mockImplementation((id: string, data: any) => {
    return Promise.resolve({ id, ...data });
  }),
  remove: jest.fn().mockImplementation((id: string) => {
    return Promise.resolve({ id });
  })
};

// Timesheets API functions
export const timesheets = {
  getByEmployeeAndWeek: jest.fn().mockImplementation((employeeId: string, weekStartDate: string) => {
    return Promise.resolve([]);
  }),
  create: jest.fn().mockImplementation((data: any) => {
    return Promise.resolve({ ...data, id: 'ts-mock-id' });
  }),
  patch: jest.fn().mockImplementation((id: string, data: any) => {
    return Promise.resolve({ id, ...data });
  })
};

// Generic API functions
export const getAll = jest.fn().mockImplementation((resource: string) => {
  return Promise.resolve([]);
});

export const getById = jest.fn().mockImplementation((resource: string, id: string) => {
  return Promise.resolve({ id });
});

export const create = jest.fn().mockImplementation((resource: string, data: any) => {
  return Promise.resolve({ ...data, id: 'mock-id' });
});

export const update = jest.fn().mockImplementation((resource: string, id: string, data: any) => {
  return Promise.resolve({ id, ...data });
});

export const remove = jest.fn().mockImplementation((resource: string, id: string) => {
  return Promise.resolve({ id });
});

export default {
  vendors,
  allocations,
  employees,
  projects,
  skills,
  timeEntries,
  timesheets,
  getAll,
  getById,
  create,
  update,
  remove
};

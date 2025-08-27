import { TimeEntry, WeeklyTimesheet } from '../../types/timeEntry';

// Mock data for time entries
const mockTimeEntries: TimeEntry[] = [
  {
    id: 'te1',
    employeeId: 'e1',
    projectId: 'p1',
    weekStartDate: '2025-05-05',
    hours: {
      monday: 4,
      tuesday: 4,
      wednesday: 2,
      thursday: 2,
      friday: 0,
      saturday: 0,
      sunday: 0
    },
    status: 'draft',
    notes: 'Working on database migration'
  },
  {
    id: 'te2',
    employeeId: 'e1',
    projectId: 'p2',
    weekStartDate: '2025-05-05',
    hours: {
      monday: 2,
      tuesday: 2,
      wednesday: 4,
      thursday: 4,
      friday: 2,
      saturday: 0,
      sunday: 0
    },
    status: 'draft',
    notes: 'UI improvements'
  }
];

// Mock timesheet data
const mockTimesheet: WeeklyTimesheet = {
  employeeId: 'e1',
  weekStartDate: '2025-05-05',
  entries: mockTimeEntries,
  totalHours: 32.5,
  status: 'draft'
};

// Define reusable mock functions that can be accessed from tests
const fetchTimesheet = jest.fn().mockResolvedValue(mockTimesheet);
const addTimeEntry = jest.fn().mockResolvedValue(true);
const updateTimeEntry = jest.fn().mockResolvedValue(true);
const deleteTimeEntry = jest.fn().mockResolvedValue(true);
const submitTimesheet = jest.fn().mockResolvedValue(true);
const saveDraftTimesheet = jest.fn().mockResolvedValue(true);
const createDraftTimesheet = jest.fn().mockResolvedValue(true);
const sendBackTimesheet = jest.fn().mockResolvedValue(true);

// Default mock implementation
const useTimeEntries = jest.fn().mockReturnValue({
  timesheet: mockTimesheet,
  loading: false,
  error: null,
  fetchTimesheet,
  addTimeEntry,
  updateTimeEntry,
  deleteTimeEntry,
  submitTimesheet,
  saveDraftTimesheet,
  createDraftTimesheet,
  sendBackTimesheet
});

// Mock control functions for tests
export const resetMockFunctions = () => {
  fetchTimesheet.mockClear();
  addTimeEntry.mockClear();
  updateTimeEntry.mockClear();
  deleteTimeEntry.mockClear();
  submitTimesheet.mockClear();
  saveDraftTimesheet.mockClear();
  createDraftTimesheet.mockClear();
  sendBackTimesheet.mockClear();
};

export const setMockTimesheet = (customTimesheet: WeeklyTimesheet | null) => {
  useTimeEntries.mockImplementation(() => ({
    timesheet: customTimesheet,
    loading: false,
    error: null,
    fetchTimesheet,
    addTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
    submitTimesheet,
    saveDraftTimesheet,
    createDraftTimesheet,
    sendBackTimesheet
  }));
};

export const setMockLoading = (isLoading: boolean) => {
  useTimeEntries.mockImplementation(() => ({
    timesheet: mockTimesheet,
    loading: isLoading,
    error: null,
    fetchTimesheet,
    addTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
    submitTimesheet,
    saveDraftTimesheet,
    createDraftTimesheet,
    sendBackTimesheet
  }));
};

export const setMockError = (errorMessage: string | null) => {
  useTimeEntries.mockImplementation(() => ({
    timesheet: mockTimesheet,
    loading: false,
    error: errorMessage,
    fetchTimesheet,
    addTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
    submitTimesheet,
    saveDraftTimesheet,
    createDraftTimesheet,
    sendBackTimesheet
  }));
};

export default useTimeEntries;

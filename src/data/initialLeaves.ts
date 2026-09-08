import { EmployeeLeave, SaturdayAttendance } from '../types';

export const initialLeaves: EmployeeLeave[] = [
  {
    "id": "leave-1",
    "employee": "محمد حنفى",
    "leaveType": "إجازة اعتيادي",
    "startDate": "2026-09-02",
    "endDate": "2026-09-03",
    "daysCount": 2,
    "notes": "",
    "entryDate": "2026-09-05 23:52"
  },
  {
    "id": "leave-2",
    "employee": "شيماء",
    "leaveType": "إجازة اعتيادي",
    "startDate": "2026-09-01",
    "endDate": "2026-09-01",
    "daysCount": 1,
    "notes": "",
    "entryDate": "2026-09-05 23:17"
  },
  {
    "id": "leave-3",
    "employee": "محمد حنفى",
    "leaveType": "إذن مسائى",
    "startDate": "2026-08-12",
    "endDate": "2026-08-12",
    "daysCount": 1,
    "notes": "",
    "entryDate": "2026-08-30 23:39"
  },
  {
    "id": "leave-4",
    "employee": "شيماء",
    "leaveType": "إجازة اعتيادي",
    "startDate": "2026-08-18",
    "endDate": "2026-08-18",
    "daysCount": 1,
    "notes": "",
    "entryDate": "2026-08-24 00:24"
  },
  {
    "id": "leave-5",
    "employee": "محمد حنفى",
    "leaveType": "إذن مسائى",
    "startDate": "2026-08-20",
    "endDate": "2026-08-20",
    "daysCount": 1,
    "notes": "",
    "entryDate": "2026-08-20 00:01"
  },
  {
    "id": "leave-6",
    "employee": "أمير طلعت",
    "leaveType": "إذن صباحى",
    "startDate": "2026-08-18",
    "endDate": "2026-08-18",
    "daysCount": 1,
    "notes": "",
    "entryDate": "2026-08-18 01:10"
  },
  {
    "id": "leave-7",
    "employee": "محمد حنفى",
    "leaveType": "إجازة اعتيادي",
    "startDate": "2026-08-13",
    "endDate": "2026-08-13",
    "daysCount": 1,
    "notes": "",
    "entryDate": "2026-08-12 23:41"
  },
  {
    "id": "leave-8",
    "employee": "شيماء",
    "leaveType": "إذن مسائى",
    "startDate": "2026-08-06",
    "endDate": "2026-08-06",
    "daysCount": 1,
    "notes": "",
    "entryDate": "2026-08-12 23:26"
  },
  {
    "id": "leave-9",
    "employee": "محمد حنفى",
    "leaveType": "إجازة اعتيادي",
    "startDate": "2026-08-02",
    "endDate": "2026-08-06",
    "daysCount": 5,
    "notes": "اجازة سنوية",
    "entryDate": "2026-08-12 23:10"
  },
  {
    "id": "leave-10",
    "employee": "أمير طلعت",
    "leaveType": "إجازة اعتيادي",
    "startDate": "2026-08-09",
    "endDate": "2026-08-09",
    "daysCount": 1,
    "notes": "",
    "entryDate": "2026-08-12 23:10"
  }
];

export const initialSaturdayAttendances: SaturdayAttendance[] = [
  {
    "id": 1,
    "employee": "أمير طلعت",
    "date": "2026-08-01",
    "notes": "حضور سبت نوبتجية"
  },
  {
    "id": 2,
    "employee": "محمد حنفى",
    "date": "2026-08-01",
    "notes": "حضور سبت نوبتجية"
  },
  {
    "id": 3,
    "employee": "شيماء",
    "date": "2026-08-08",
    "notes": "حضور سبت نوبتجية"
  },
  {
    "id": 4,
    "employee": "أمير طلعت",
    "date": "2026-08-15",
    "notes": "حضور سبت نوبتجية"
  },
  {
    "id": 5,
    "employee": "شيماء",
    "date": "2026-08-22",
    "notes": "حضور سبت نوبتجية"
  },
  {
    "id": 6,
    "employee": "محمد حنفى",
    "date": "2026-08-29",
    "notes": "حضور سبت نوبتجية"
  }
];

export const initialNightShifts: string[] = [
  "2026-09-06",
  "2026-09-02"
];

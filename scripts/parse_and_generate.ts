import fs from 'fs';
import path from 'path';

const content = fs.readFileSync('scripts/raw_input.txt', 'utf8');

// Helper to parse CSV lines respecting quotes
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// 1. Prayer times
// الفجر 05:06 • الظهر 12:53 • العصر 16:27 • المغرب 19:12 • العشاء 20:31
const prayerMatch = content.match(/الفجر\s*(\d{2}:\d{2})\s*•\s*الظهر\s*(\d{2}:\d{2})\s*•\s*العصر\s*(\d{2}:\d{2})\s*•\s*المغرب\s*(\d{2}:\d{2})\s*•\s*العشاء\s*(\d{2}:\d{2})/);
const prayerTimes = prayerMatch ? {
  fajr: prayerMatch[1],
  dhuhr: prayerMatch[2],
  asr: prayerMatch[3],
  maghrib: prayerMatch[4],
  isha: prayerMatch[5],
  lastFetchedDate: '2026-09-05'
} : {
  fajr: '05:06',
  dhuhr: '12:53',
  asr: '16:27',
  maghrib: '19:12',
  isha: '20:31',
  lastFetchedDate: '2026-09-05'
};
console.log('Parsed prayer times:', prayerTimes);

// 2. Night shifts (يوم السهر)
const nightShiftMatch = content.match(/يوم السهر\r?\n([\s\S]*?)(?=\r?\n\r?\n|الموظف,النوع)/);
const nightShifts: string[] = [];
if (nightShiftMatch) {
  const lines = nightShiftMatch[1].split(/\r?\n/).map(l => l.trim()).filter(l => /^\d{4}-\d{2}-\d{2}$/.test(l));
  nightShifts.push(...lines);
}
console.log('Parsed night shifts:', nightShifts);

// 3. Leaves
// الموظف,النوع,من يوم,إلى يوم,عدد الأيام,ملاحظات,تاريخ الإدخال
const leavesMatch = content.match(/الموظف,النوع,من يوم,إلى يوم,عدد الأيام,ملاحظات,تاريخ الإدخال\r?\n([\s\S]*?)(?=\r?\n\r?\n|م,رقم التليفون)/);
interface RawLeave {
  id: string;
  employee: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  notes: string;
  entryDate?: string;
}
const leaves: RawLeave[] = [];
if (leavesMatch) {
  const lines = leavesMatch[1].split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  lines.forEach((line, idx) => {
    const cols = parseCSVLine(line);
    if (cols.length >= 5) {
      leaves.push({
        id: `leave-${idx + 1}`,
        employee: cols[0],
        leaveType: cols[1],
        startDate: cols[2],
        endDate: cols[3],
        daysCount: parseInt(cols[4], 10) || 1,
        notes: cols[5] || '',
        entryDate: cols[6] || ''
      });
    }
  });
}
console.log(`Parsed ${leaves.length} leaves`);

// 4. Directory
// م,رقم التليفون,الإدارة,الاسم,تاريخ الإدخال
const dirMatch = content.match(/م,رقم التليفون,الإدارة,الاسم,تاريخ الإدخال\r?\n([\s\S]*?)(?=\r?\n\r?\n|رقم,اليوم,التاريخ)/);
interface RawDir {
  id: number;
  code: string;
  department: string;
  name: string;
  entryDate?: string;
}
const directory: RawDir[] = [];
if (dirMatch) {
  const lines = dirMatch[1].split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  lines.forEach((line) => {
    const cols = parseCSVLine(line);
    if (cols.length >= 4) {
      const id = parseInt(cols[0], 10);
      directory.push({
        id,
        code: cols[1] || '',
        department: cols[2] || '',
        name: cols[3] || '',
        entryDate: cols[4] || ''
      });
    }
  });
}
console.log(`Parsed ${directory.length} directory entries`);

// 5. Tasks (319 records)
// رقم,اليوم,التاريخ,القسم,المهمة,المهندس المسؤول,الحالة,الملاحظات,تاريخ الإدخال
const tasksMatch = content.match(/رقم,اليوم,التاريخ,القسم,المهمة,المهندس المسؤول,الحالة,الملاحظات,تاريخ الإدخال\r?\n([\s\S]*)/);
interface RawTask {
  id: number;
  number: number;
  day: string;
  date: string;
  department: string;
  description: string;
  technician: string;
  done: boolean;
  notes: string;
  entryDate?: string;
}
const tasks: RawTask[] = [];
if (tasksMatch) {
  const lines = tasksMatch[1].split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  lines.forEach((line) => {
    const cols = parseCSVLine(line);
    if (cols.length >= 7 && /^\d+$/.test(cols[0])) {
      const id = parseInt(cols[0], 10);
      const day = cols[1] || '';
      const date = cols[2] || '';
      const department = cols[3] || '';
      const description = cols[4] || '';
      const technician = cols[5] || '';
      const statusStr = cols[6] || '';
      const done = statusStr.includes('تم');
      const notes = cols[7] || '';
      const entryDate = cols[8] || '';
      tasks.push({
        id,
        number: id,
        day,
        date,
        department,
        description,
        technician,
        done,
        notes,
        entryDate
      });
    }
  });
}
console.log(`Parsed ${tasks.length} tasks`);

// Generate src/data/initialTasks.ts
const tasksTs = `import { Task } from '../types';

export const initialTasks: Task[] = ${JSON.stringify(tasks, null, 2)};
`;
fs.writeFileSync('src/data/initialTasks.ts', tasksTs, 'utf8');

// Generate src/data/initialDirectory.ts
const dirTs = `import { DirectoryEntry } from '../types';

export const initialDirectory: DirectoryEntry[] = ${JSON.stringify(directory, null, 2)};
`;
fs.writeFileSync('src/data/initialDirectory.ts', dirTs, 'utf8');

// Generate src/data/initialLeaves.ts
const saturdayAttendances = [
  { id: 1, employee: 'أمير طلعت', date: '2026-08-01', notes: 'حضور سبت نوبتجية' },
  { id: 2, employee: 'محمد حنفى', date: '2026-08-01', notes: 'حضور سبت نوبتجية' },
  { id: 3, employee: 'شيماء', date: '2026-08-08', notes: 'حضور سبت نوبتجية' },
  { id: 4, employee: 'أمير طلعت', date: '2026-08-15', notes: 'حضور سبت نوبتجية' },
  { id: 5, employee: 'شيماء', date: '2026-08-22', notes: 'حضور سبت نوبتجية' },
  { id: 6, employee: 'محمد حنفى', date: '2026-08-29', notes: 'حضور سبت نوبتجية' }
];

const leavesTs = `import { EmployeeLeave, SaturdayAttendance } from '../types';

export const initialLeaves: EmployeeLeave[] = ${JSON.stringify(leaves, null, 2)};

export const initialSaturdayAttendances: SaturdayAttendance[] = ${JSON.stringify(saturdayAttendances, null, 2)};

export const initialNightShifts: string[] = ${JSON.stringify(nightShifts, null, 2)};
`;
fs.writeFileSync('src/data/initialLeaves.ts', leavesTs, 'utf8');

// Also create src/data/initialNightShifts.ts
const nightShiftsTs = `export const initialNightShifts: string[] = ${JSON.stringify(nightShifts, null, 2)};
`;
fs.writeFileSync('src/data/initialNightShifts.ts', nightShiftsTs, 'utf8');

console.log('Data files generated successfully!');

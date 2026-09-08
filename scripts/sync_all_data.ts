import fs from 'fs';
import path from 'path';
import { initialTasks } from '../src/data/initialTasks';
import { initialDirectory } from '../src/data/initialDirectory';
import { initialLeaves, initialSaturdayAttendances, initialNightShifts } from '../src/data/initialLeaves';
import { initialMedicalNetwork } from '../src/data/initialMedicalNetwork';

const publicDataDir = path.join(process.cwd(), 'public', 'data');
if (!fs.existsSync(publicDataDir)) {
  fs.mkdirSync(publicDataDir, { recursive: true });
}

// CSV Helper
function toCSV<T>(data: T[], headers: string[], keys: (keyof T | string)[]): string {
  const headerRow = headers.join(',');
  const rows = data.map(item => {
    return keys.map(k => {
      const val = (item as any)[k];
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    }).join(',');
  });
  return '\uFEFF' + [headerRow, ...rows].join('\r\n');
}

console.log('--- Generating Export Files in public/data ---');

// 1. Tasks
fs.writeFileSync(path.join(publicDataDir, 'tasks.json'), JSON.stringify(initialTasks, null, 2), 'utf8');
const tasksCsv = toCSV(
  initialTasks,
  ['رقم', 'اليوم', 'التاريخ', 'الإدارة / القسم', 'بيان المهمة', 'المهندس المسؤول', 'الحالة', 'الملاحظات', 'تاريخ الإدخال'],
  ['number', 'day', 'date', 'department', 'description', 'technician', 'done', 'notes', 'entryDate']
);
fs.writeFileSync(path.join(publicDataDir, 'tasks.csv'), tasksCsv, 'utf8');
console.log(`Generated tasks.json & tasks.csv (${initialTasks.length} tasks)`);

// 2. Directory
fs.writeFileSync(path.join(publicDataDir, 'directory.json'), JSON.stringify(initialDirectory, null, 2), 'utf8');
const dirCsv = toCSV(
  initialDirectory,
  ['م', 'رقم التليفون / التحويلة', 'الإدارة / القطاع', 'الاسم / المنصب', 'تاريخ الإدخال'],
  ['id', 'code', 'department', 'name', 'entryDate']
);
fs.writeFileSync(path.join(publicDataDir, 'directory.csv'), dirCsv, 'utf8');
console.log(`Generated directory.json & directory.csv (${initialDirectory.length} entries)`);

// 3. Leaves
fs.writeFileSync(path.join(publicDataDir, 'leaves.json'), JSON.stringify(initialLeaves, null, 2), 'utf8');
const leavesCsv = toCSV(
  initialLeaves,
  ['الموظف', 'النوع', 'من يوم', 'إلى يوم', 'عدد الأيام', 'ملاحظات', 'تاريخ الإدخال'],
  ['employee', 'leaveType', 'startDate', 'endDate', 'daysCount', 'notes', 'entryDate']
);
fs.writeFileSync(path.join(publicDataDir, 'leaves.csv'), leavesCsv, 'utf8');
console.log(`Generated leaves.json & leaves.csv (${initialLeaves.length} leaves)`);

// 4. Saturday Attendances
fs.writeFileSync(path.join(publicDataDir, 'saturday_attendances.json'), JSON.stringify(initialSaturdayAttendances, null, 2), 'utf8');
const satCsv = toCSV(
  initialSaturdayAttendances,
  ['م', 'الموظف', 'التاريخ', 'الملاحظات'],
  ['id', 'employee', 'date', 'notes']
);
fs.writeFileSync(path.join(publicDataDir, 'saturday_attendances.csv'), satCsv, 'utf8');
console.log(`Generated saturday_attendances.json & csv (${initialSaturdayAttendances.length} records)`);

// 5. Night Shifts
fs.writeFileSync(path.join(publicDataDir, 'night_shifts.json'), JSON.stringify(initialNightShifts, null, 2), 'utf8');
const nightCsv = '\uFEFF' + ['يوم السهر', ...initialNightShifts.map(d => `"${d}"`)].join('\r\n');
fs.writeFileSync(path.join(publicDataDir, 'night_shifts.csv'), nightCsv, 'utf8');
console.log(`Generated night_shifts.json & csv (${initialNightShifts.length} night shifts)`);

// 6. Medical Network
fs.writeFileSync(path.join(publicDataDir, 'medical_network.json'), JSON.stringify(initialMedicalNetwork, null, 2), 'utf8');
const medCsv = toCSV(
  initialMedicalNetwork,
  ['كود', 'المحافظة', 'اسم الجهة / الطبيب', 'المنطقة', 'فئة الشبكة', 'الفرع', 'التخصص', 'النوع', 'العنوان', 'الهاتف'],
  ['providerId', 'governorate', 'providerName', 'area', 'networkType', 'mainBranch', 'specialty', 'providerType', 'address', 'telephone']
);
fs.writeFileSync(path.join(publicDataDir, 'medical_network.csv'), medCsv, 'utf8');
console.log(`Generated medical_network.json & csv (${initialMedicalNetwork.length} providers)`);

// 7. Full Backup
const fullBackup = {
  version: '2.5',
  exportedAt: new Date().toISOString(),
  system: 'منظومة الدعم الفني والعمليات - الهيئة العامة للرقابة على الصادرات والواردات',
  counts: {
    tasks: initialTasks.length,
    directory: initialDirectory.length,
    leaves: initialLeaves.length,
    saturdayAttendances: initialSaturdayAttendances.length,
    nightShifts: initialNightShifts.length,
    medicalNetwork: initialMedicalNetwork.length
  },
  prayerTimes: {
    fajr: '05:06',
    dhuhr: '12:53',
    asr: '16:27',
    maghrib: '19:12',
    isha: '20:31',
    lastFetchedDate: '2026-09-05'
  },
  tasks: initialTasks,
  directory: initialDirectory,
  leaves: initialLeaves,
  saturdayAttendances: initialSaturdayAttendances,
  nightShifts: initialNightShifts,
  medicalNetwork: initialMedicalNetwork
};
fs.writeFileSync(path.join(publicDataDir, 'full_backup.json'), JSON.stringify(fullBackup, null, 2), 'utf8');
console.log('Generated full_backup.json');

console.log('--- All export files generated successfully! ---');

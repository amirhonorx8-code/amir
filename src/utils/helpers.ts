import { Task, LeaveType } from '../types';

export const ARABIC_MONTHS: { [key: string]: string } = {
  Jan: 'يناير',
  Feb: 'فبراير',
  Mar: 'مارس',
  Apr: 'أبريل',
  May: 'مايو',
  Jun: 'يونيو',
  Jul: 'يوليو',
  Aug: 'أغسطس',
  Sep: 'سبتمبر',
  Oct: 'أكتوبر',
  Nov: 'نوفمبر',
  Dec: 'ديسمبر',
};

export const ARABIC_WEEKDAYS = [
  'الأحد',
  'الاثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
];

/**
 * Parse any task date string into a Date object
 */
export function parseTaskDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  
  // Format "11 Aug 2026" or "2026-08-11"
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const monthName = parts[1];
    const year = parseInt(parts[2], 10);
    const monthIndex = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ].indexOf(monthName);
    if (monthIndex !== -1 && !isNaN(day) && !isNaN(year)) {
      return new Date(year, monthIndex, day);
    }
  }

  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date() : d;
}

/**
 * Get Arabic weekday name for a Date or date string
 */
export function getArabicDay(dateInput: Date | string): string {
  const d = typeof dateInput === 'string' ? parseTaskDate(dateInput) : dateInput;
  return ARABIC_WEEKDAYS[d.getDay()] || '';
}

/**
 * Format date in full Arabic (e.g. "11 أغسطس 2026")
 */
export function formatArabicDate(dateInput: Date | string): string {
  const d = typeof dateInput === 'string' ? parseTaskDate(dateInput) : dateInput;
  const day = d.getDate();
  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Format month-year in Arabic (e.g. "أغسطس 2026")
 */
export function formatArabicMonthYear(dateInput: Date | string): string {
  const d = typeof dateInput === 'string' ? parseTaskDate(dateInput) : dateInput;
  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Convert date to input format YYYY-MM-DD
 */
export function toInputDateFormat(dateInput: Date | string): string {
  const d = typeof dateInput === 'string' ? parseTaskDate(dateInput) : dateInput;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Check if a task is overdue:
 * Phase 37: Any OPEN task more than 2 days past its work_date counts as "متأخرة" (overdue)
 */
export function isTaskOverdue(task: Task): boolean {
  if (task.done) return false;
  const taskDate = parseTaskDate(task.date);
  const now = new Date();
  const diffDays = (now.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays > 2;
}

/**
 * Stable 6-color palette for departments
 */
const DEPT_COLORS = [
  'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-200 dark:border-blue-800',
  'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-200 dark:border-emerald-800',
  'bg-violet-50 text-violet-800 border-violet-200 dark:bg-violet-950/50 dark:text-violet-200 dark:border-violet-800',
  'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-200 dark:border-amber-800',
  'bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-200 dark:border-cyan-800',
  'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-200 dark:border-rose-800',
];

export function getDeptBadgeClass(department: string): string {
  if (!department) return DEPT_COLORS[0];
  let hash = 0;
  for (let i = 0; i < department.length; i++) {
    hash = department.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % DEPT_COLORS.length;
  return DEPT_COLORS[index];
}

/**
 * Colors for leave types
 */
export function getLeaveTypeBadgeClass(type: LeaveType): string {
  switch (type) {
    case 'إجازة اعتيادي':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 border border-blue-300 dark:border-blue-700';
    case 'إجازة عارضة':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 border border-amber-300 dark:border-amber-700';
    case 'إذن صباحى':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700';
    case 'إذن مسائى':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200 border border-purple-300 dark:border-purple-700';
    case 'مأمورية':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200 border border-rose-300 dark:border-rose-700';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  }
}

/**
 * Export tasks to CSV with UTF-8 BOM so Excel opens Arabic correctly
 */
export function exportTasksToCSV(tasks: Task[], fileName: string = 'سجل_المهام_اليومية.csv'): void {
  const headers = ['م', 'اليوم', 'التاريخ', 'الإدارة / الجهة', 'بيان المهمة', 'الحالة', 'المهندس المسؤول', 'ملاحظات'];
  
  const rows = tasks.map(t => [
    t.number || t.id,
    `"${(t.day || '').replace(/"/g, '""')}"`,
    `"${(t.date || '').replace(/"/g, '""')}"`,
    `"${(t.department || '').replace(/"/g, '""')}"`,
    `"${(t.description || '').replace(/"/g, '""')}"`,
    t.done ? 'تم الإنجاز' : 'قيد التنفيذ',
    `"${(t.technician || '').replace(/"/g, '""')}"`,
    `"${(t.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\r\n');

  // Add UTF-8 BOM so Excel decodes Arabic characters properly
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

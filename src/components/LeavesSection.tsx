import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Plus, 
  Edit3, 
  Trash2, 
  Clock, 
  FileCheck, 
  ChevronRight, 
  ChevronLeft
} from 'lucide-react';
import { EmployeeLeave, LeaveType } from '../types';
import { 
  formatArabicDate, 
  formatArabicMonthYear, 
  getLeaveTypeBadgeClass, 
  parseTaskDate 
} from '../utils/helpers';

interface LeavesSectionProps {
  leaves: EmployeeLeave[];
  onAddLeave: () => void;
  onEditLeave: (leave: EmployeeLeave) => void;
  onDeleteLeave: (leave: EmployeeLeave) => void;
}

export const LeavesSection: React.FC<LeavesSectionProps> = ({
  leaves,
  onAddLeave,
  onEditLeave,
  onDeleteLeave,
}) => {
  // Filters for leaves
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [showAllLeaves, setShowAllLeaves] = useState<boolean>(false);

  // Distinct employees
  const employees = useMemo(() => {
    const set = new Set<string>();
    leaves.forEach(l => {
      if (l.employee) set.add(l.employee);
    });
    return Array.from(set);
  }, [leaves]);

  // Distinct months for leave records
  const leaveMonths = useMemo(() => {
    const map = new Map<string, string>();
    leaves.forEach(l => {
      const d = parseTaskDate(l.startDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = formatArabicMonthYear(d);
      map.set(key, label);
    });
    return Array.from(map.entries()).map(([key, label]) => ({ key, label }));
  }, [leaves]);

  // Set default month to latest available if available
  const activeMonthKey = selectedMonth === 'all' && leaveMonths.length > 0 
    ? leaveMonths[0].key 
    : selectedMonth;

  // Filtered leaves for the table
  const filteredLeaves = useMemo(() => {
    return leaves.filter(l => {
      if (selectedEmployee !== 'all' && l.employee !== selectedEmployee) return false;
      if (selectedMonth !== 'all') {
        const d = parseTaskDate(l.startDate);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (key !== selectedMonth) return false;
      }
      return true;
    });
  }, [leaves, selectedEmployee, selectedMonth]);

  // Sort leaves by date descending (newest first)
  const sortedLeaves = useMemo(() => {
    return [...filteredLeaves].sort((a, b) => {
      const timeA = a.entryDate ? new Date(a.entryDate.replace(' ', 'T')).getTime() : parseTaskDate(a.startDate).getTime();
      const timeB = b.entryDate ? new Date(b.entryDate.replace(' ', 'T')).getTime() : parseTaskDate(b.startDate).getTime();
      return timeB - timeA;
    });
  }, [filteredLeaves]);

  // Display only the last 3 actions/records by default
  const displayedLeaves = useMemo(() => {
    if (showAllLeaves) return sortedLeaves;
    return sortedLeaves.slice(0, 3);
  }, [sortedLeaves, showAllLeaves]);

  // Leave counts per type
  const typeCounts = useMemo(() => {
    const counts: Record<LeaveType, number> = {
      'إجازة اعتيادي': 0,
      'إجازة عارضة': 0,
      'إذن صباحى': 0,
      'إذن مسائى': 0,
      'مأمورية': 0,
      'حضور سبت': 0,
    };
    leaves.forEach(l => {
      if (counts[l.leaveType] !== undefined) {
        counts[l.leaveType] += l.daysCount || 1;
      }
    });
    return counts;
  }, [leaves]);

  // Data for the leave timeline chart
  const chartData = useMemo(() => {
    // If month is 'all', pick the first/latest month or current month
    const targetMonth = activeMonthKey !== 'all' ? activeMonthKey : (leaveMonths[0]?.key || '2026-08');
    const [year, month] = targetMonth.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();

    // Group leaves by employee in this month
    const empMap = new Map<string, {
      totalDays: number;
      dates: Date[];
      dateStrings: string[];
      leaveRanges: Array<{
        type: LeaveType;
        startDay: number;
        endDay: number;
        title: string;
      }>;
    }>();

    // Initialize all employees
    employees.forEach(emp => {
      empMap.set(emp, { totalDays: 0, dates: [], dateStrings: [], leaveRanges: [] });
    });

    leaves.forEach(l => {
      const start = parseTaskDate(l.startDate);
      const end = parseTaskDate(l.endDate || l.startDate);

      const sYear = start.getFullYear();
      const sMonth = start.getMonth() + 1;

      if (sYear === year && sMonth === month) {
        const empEntry = empMap.get(l.employee) || { totalDays: 0, dates: [], dateStrings: [], leaveRanges: [] };
        const sDay = Math.max(1, start.getDate());
        const eDay = Math.min(daysInMonth, end.getDate());
        
        empEntry.totalDays += l.daysCount;
        empEntry.leaveRanges.push({
          type: l.leaveType,
          startDay: sDay,
          endDay: eDay,
          title: `${l.leaveType} (${formatArabicDate(start)} إلى ${formatArabicDate(end)})`
        });

        // Add date objects
        for (let d = sDay; d <= eDay; d++) {
          const curDate = new Date(year, month - 1, d);
          empEntry.dates.push(curDate);
          empEntry.dateStrings.push(formatArabicDate(curDate));
        }

        empMap.set(l.employee, empEntry);
      }
    });

    return {
      daysInMonth,
      employees: Array.from(empMap.entries()).filter(([_, data]) => data.totalDays > 0 || employees.length <= 5)
    };
  }, [leaves, employees, activeMonthKey, leaveMonths]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 my-8 space-y-6">

      {/* 1. Leave Chart Section (Matching Photo 2) */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="bg-gradient-to-r from-[#182a48] via-[#1a3152] to-[#132238] text-white p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 shadow-inner">
              <span className="text-xl" role="img" aria-label="إجازات">🌴</span>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-wide">
                إجازات الموظفين خلال شهر سبتمبر 2026
              </h2>
              <p className="text-xs text-blue-200 mt-0.5">
                شريط الإجازات والأذونات والمأموريات وحضور السبت لكل موظف
              </p>
            </div>
          </div>

          {/* Month Selector for the Chart */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => {
                const curIdx = leaveMonths.findIndex(m => m.key === activeMonthKey);
                if (curIdx < leaveMonths.length - 1) setSelectedMonth(leaveMonths[curIdx + 1].key);
              }}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-blue-100 flex items-center gap-1 transition-all"
            >
              <ChevronRight className="w-3.5 h-3.5" />
              <span>السابق</span>
            </button>

            <span className="text-xs font-bold bg-amber-400 text-slate-900 px-3 py-1.5 rounded-lg shadow-sm">
              الشهر: سبتمبر 2026 (أغسطس 2026)
            </span>

            <button
              onClick={() => {
                const curIdx = leaveMonths.findIndex(m => m.key === activeMonthKey);
                if (curIdx > 0) setSelectedMonth(leaveMonths[curIdx - 1].key);
              }}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-blue-100 flex items-center gap-1 transition-all"
            >
              <span>التالي</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Timeline with Days 1 to 30 Header */}
        <div className="p-4 sm:p-6 space-y-4 overflow-x-auto">
          {/* Day Numbers Row (1 to 30) */}
          <div className="min-w-[650px] pr-28 pl-4">
            <div className="grid grid-cols-30 text-center text-[10px] font-bold text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-1.5">
              {Array.from({ length: 30 }, (_, i) => (
                <div key={i + 1} className="font-mono">
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Employee Timeline Rows */}
          {chartData.employees.map(([empName, data]) => {
            const initialChar = empName.trim().charAt(0) || 'م';
            return (
              <div key={empName} className="flex items-center gap-3 min-w-[650px]">
                {/* Employee Badge with initial */}
                <div className="w-24 shrink-0 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-sm shrink-0">
                    {initialChar}
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">
                      {empName}
                    </div>
                    <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                      {data.totalDays} {data.totalDays === 1 ? 'يوم' : 'أيام'}
                    </div>
                  </div>
                </div>

                {/* Timeline Bar */}
                <div className="flex-1 h-7 bg-slate-100 dark:bg-slate-700/50 rounded-lg relative overflow-hidden flex border border-slate-200 dark:border-slate-600">
                  {/* Grid divisions for 30 days */}
                  <div className="absolute inset-0 grid grid-cols-30 divide-x divide-x-reverse divide-slate-200/50 dark:divide-slate-600/40 pointer-events-none" />

                  {/* Colored ranges */}
                  {data.leaveRanges.map((range, idx) => {
                    const leftPercent = ((range.startDay - 1) / 30) * 100;
                    const widthPercent = ((range.endDay - range.startDay + 1) / 30) * 100;

                    let bgColor = 'bg-blue-500';
                    if (range.type === 'إجازة عارضة') bgColor = 'bg-orange-500';
                    if (range.type === 'إذن صباحى') bgColor = 'bg-amber-500';
                    if (range.type === 'إذن مسائى') bgColor = 'bg-rose-500';
                    if (range.type === 'مأمورية') bgColor = 'bg-purple-600';
                    if (range.type === 'حضور سبت') bgColor = 'bg-emerald-600';

                    return (
                      <div
                        key={idx}
                        title={range.title}
                        style={{
                          position: 'absolute',
                          right: `${leftPercent}%`,
                          width: `${Math.max(widthPercent, 3.2)}%`,
                          top: 2,
                          bottom: 2,
                        }}
                        className={`${bgColor} rounded-md text-white text-[10px] font-bold flex items-center justify-center shadow-sm cursor-pointer hover:brightness-110 transition-all truncate px-1`}
                      >
                        {range.type}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend for Leave Types Matching Photo 2 */}
        <div className="p-3.5 border-t border-slate-100 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center flex-wrap gap-4 text-xs font-bold text-slate-700 dark:text-slate-300">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>إجازة اعتيادي</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span>إجازة عارضة</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>إذن صباحي</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>إذن مسائي</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
            <span>مأمورية</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>حضور سبت</span>
          </span>
        </div>
      </div>

      {/* 2. Leaves Log Table & Management (Matching Photo 2) */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#182a48] via-[#1a3152] to-[#132238] text-white p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 shadow-inner">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black">الإجازات والإذونات والمأموريات</h2>
                <span className="bg-amber-400 text-slate-900 text-xs font-black px-2.5 py-0.5 rounded-full">
                  {showAllLeaves ? `${sortedLeaves.length} سجل` : `آخر ${displayedLeaves.length} إجراءات`}
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                {showAllLeaves 
                  ? `عرض كافة سجلات وإجراءات الموظفين (${sortedLeaves.length} إجراء)` 
                  : 'معروض آخر 3 إجراءات مسجلة فقط'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => {
                if (selectedMonth !== 'all') setSelectedMonth('all');
                setShowAllLeaves(prev => !prev);
              }}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all"
            >
              {showAllLeaves ? 'عرض آخر 3 إجراءات فقط' : `عرض كافة السجلات (${sortedLeaves.length})`}
            </button>
            <button
              onClick={onAddLeave}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 no-print"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>إضافة سجل</span>
            </button>
          </div>
        </div>

        {/* Filter Bar: Leave Type Badges + Employee Filter Chips */}
        <div className="p-4 bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex flex-col gap-3">
          
          {/* Type Filter Badges */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">النوع:</span>
            <span className="bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 px-2.5 py-1 rounded-lg font-bold border border-blue-200 dark:border-blue-800">
              إجازة اعتيادي: {typeCounts['إجازة اعتيادي']}
            </span>
            <span className="bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 px-2.5 py-1 rounded-lg font-bold border border-orange-200 dark:border-orange-800">
              إجازة عارضة: {typeCounts['إجازة عارضة']}
            </span>
            <span className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 px-2.5 py-1 rounded-lg font-bold border border-amber-200 dark:border-amber-800">
              إذن صباحي: {typeCounts['إذن صباحى']}
            </span>
            <span className="bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 px-2.5 py-1 rounded-lg font-bold border border-rose-200 dark:border-rose-800">
              إذن مسائي: {typeCounts['إذن مسائى']}
            </span>
            <span className="bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 px-2.5 py-1 rounded-lg font-bold border border-purple-200 dark:border-purple-800">
              مأمورية: {typeCounts['مأمورية']}
            </span>
            <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-1 rounded-lg font-bold border border-emerald-200 dark:border-emerald-800">
              حضور سبت: {typeCounts['حضور سبت'] || 0}
            </span>
          </div>

          {/* Employee Filter Chips */}
          <div className="flex items-center flex-wrap gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">الموظف:</span>
            <button
              onClick={() => setSelectedEmployee('all')}
              className={`text-xs px-3 py-1 rounded-lg transition-all font-bold ${
                selectedEmployee === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100'
              }`}
            >
              الكل
            </button>
            {employees.map(emp => (
              <button
                key={emp}
                onClick={() => setSelectedEmployee(emp)}
                className={`text-xs px-3 py-1 rounded-lg transition-all font-bold ${
                  selectedEmployee === emp
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100'
                }`}
              >
                {emp}
              </button>
            ))}
          </div>
        </div>

        {/* Leaves Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-[#1F3A5F] text-white border-b border-blue-900">
                <th className="py-3 px-4 font-bold w-12 text-center">م</th>
                <th className="py-3 px-4 font-bold">اسم الموظف</th>
                <th className="py-3 px-4 font-bold">النوع</th>
                <th className="py-3 px-4 font-bold">من تاريخ</th>
                <th className="py-3 px-4 font-bold">إلى تاريخ</th>
                <th className="py-3 px-4 font-bold text-center">المدة (أيام)</th>
                <th className="py-3 px-4 font-bold">ملاحظات وبيان الغرض</th>
                <th className="py-3 px-4 font-bold text-center w-24 no-print">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {displayedLeaves.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    لا توجد سجلات مطابقة للشروط
                  </td>
                </tr>
              ) : (
                displayedLeaves.map((l, index) => (
                  <tr 
                    key={l.id} 
                    className="hover:bg-blue-50/40 dark:hover:bg-slate-700/40 transition-colors"
                  >
                    <td className="py-3 px-4 text-center text-slate-400 font-mono">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {l.employee}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${getLeaveTypeBadgeClass(l.leaveType)}`}>
                        {l.leaveType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {formatArabicDate(l.startDate)}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {formatArabicDate(l.endDate || l.startDate)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded font-bold bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono">
                        {l.daysCount}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate" title={l.notes}>
                      {l.notes || '—'}
                    </td>
                    <td className="py-3 px-4 text-center no-print">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEditLeave(l)}
                          title="تعديل السجل"
                          className="p-1 rounded text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteLeave(l)}
                          title="حذف السجل"
                          className="p-1 rounded text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Informative Footer Bar for Display Limit */}
        {!showAllLeaves && sortedLeaves.length > 3 && (
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
              <span>
                يتم عرض <strong>آخر 3 إجراءات</strong> مسجلة فقط في سجل الإجازات (إجمالي الإجراءات المسجلة: {sortedLeaves.length}).
              </span>
            </div>
            <button
              onClick={() => setShowAllLeaves(true)}
              className="font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
            >
              عرض كافة الإجراءات ({sortedLeaves.length})
            </button>
          </div>
        )}

      </div>

    </div>
  );
};

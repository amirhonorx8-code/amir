import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Edit3, 
  Trash2, 
  Plus, 
  Search, 
  ArrowUpDown, 
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Check
} from 'lucide-react';
import { Task } from '../types';
import { 
  formatArabicDate, 
  getDeptBadgeClass, 
  isTaskOverdue, 
  parseTaskDate 
} from '../utils/helpers';

interface WelcomeTaskTableProps {
  tasks: Task[];
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onToggleTaskDone: (task: Task) => void;
  onNavigateToFullLog: () => void;
  weekFilterActive: boolean;
  onToggleWeekFilter: () => void;
}

export const WelcomeTaskTable: React.FC<WelcomeTaskTableProps> = ({
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTaskDone,
  onNavigateToFullLog,
  weekFilterActive,
  onToggleWeekFilter,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 15;
  const [sortAsc, setSortAsc] = useState<boolean>(false); // default newest first

  // Filter tasks for week if active
  const filteredTasks = useMemo(() => {
    let list = [...tasks];

    if (weekFilterActive) {
      // Find latest date in tasks
      let maxTimestamp = 0;
      tasks.forEach(t => {
        const time = parseTaskDate(t.date).getTime();
        if (time > maxTimestamp) maxTimestamp = time;
      });
      const weekStart = maxTimestamp - 7 * 24 * 60 * 60 * 1000;
      list = list.filter(t => parseTaskDate(t.date).getTime() >= weekStart);
    }

    // Sort by date then id (newest first by default)
    list.sort((a, b) => {
      const timeA = parseTaskDate(a.date).getTime();
      const timeB = parseTaskDate(b.date).getTime();
      if (timeA !== timeB) {
        return sortAsc ? timeA - timeB : timeB - timeA;
      }
      return sortAsc ? (a.id - b.id) : (b.id - a.id);
    });

    return list;
  }, [tasks, weekFilterActive, sortAsc]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / pageSize));
  const pageIndex = Math.min(currentPage, totalPages);
  const displayedTasks = filteredTasks.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);

  const startRecord = filteredTasks.length === 0 ? 0 : (pageIndex - 1) * pageSize + 1;
  const endRecord = Math.min(pageIndex * pageSize, filteredTasks.length);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 my-8">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        
        {/* Header (Matching Photo 2) */}
        <div className="bg-gradient-to-r from-[#182a48] via-[#1a3152] to-[#132238] text-white p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 shadow-inner">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-wide">Work Task Log</h2>
                <span className="bg-amber-400 text-slate-900 text-xs font-black px-2.5 py-0.5 rounded-full">
                  {filteredTasks.length}
                </span>
                {weekFilterActive && (
                  <span className="bg-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    هذا الأسبوع
                  </span>
                )}
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                سجل المهام اليومية — إجمالي {tasks.length} مهمة
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2 no-print self-end sm:self-auto">
            {/* Add Task Modal Trigger */}
            <button
              onClick={onAddTask}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>إضافة مهمة</span>
            </button>

            {/* Go to full log & search */}
            <button
              onClick={onNavigateToFullLog}
              className="text-xs px-3.5 py-2 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-all border border-white/15"
            >
              <Search className="w-3.5 h-3.5 text-amber-300" />
              <span>بحث وتصفية</span>
            </button>

            {/* Week toggle button */}
            <button
              onClick={onToggleWeekFilter}
              className={`text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all border ${
                weekFilterActive
                  ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-blue-100 border-white/15'
              }`}
            >
              <CalendarRange className="w-3.5 h-3.5" />
              <span>هذا الأسبوع</span>
            </button>
          </div>
        </div>

        {/* Live Result Counter & Sort Bar (Phase 15) */}
        <div className="px-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
          <div className="font-semibold">
            عرض {startRecord} إلى {endRecord} من إجمالي {filteredTasks.length} مهمة
          </div>

          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="flex items-center gap-1 text-slate-700 dark:text-slate-200 hover:text-blue-600 font-bold"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>الترتيب: {sortAsc ? 'الأقدم أولاً' : 'الأحدث أولاً'}</span>
          </button>
        </div>

        {/* Tasks Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-[#1F3A5F] text-white border-b border-blue-900">
                <th className="py-3 px-3 font-bold w-12 text-center">م</th>
                <th 
                  onClick={() => setSortAsc(!sortAsc)}
                  className="py-3 px-4 font-bold cursor-pointer hover:bg-white/10 transition-colors w-32"
                >
                  <div className="flex items-center gap-1">
                    <span>التاريخ واليوم</span>
                    <ArrowUpDown className="w-3 h-3 text-blue-300" />
                  </div>
                </th>
                <th className="py-3 px-4 font-bold w-48">الإدارة / الجهة</th>
                <th className="py-3 px-4 font-bold">بيان المهمة</th>
                <th className="py-3 px-4 font-bold w-28 text-center">الحالة</th>
                <th className="py-3 px-4 font-bold w-40">المهندس المسؤول</th>
                <th className="py-3 px-4 font-bold max-w-xs">ملاحظات</th>
                <th className="py-3 px-4 font-bold text-center w-24 no-print">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {displayedTasks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    لا توجد مهام مطابقة
                  </td>
                </tr>
              ) : (
                displayedTasks.map((t, idx) => {
                  const overdue = isTaskOverdue(t);
                  return (
                    <tr
                      key={t.id}
                      onClick={() => onEditTask(t)}
                      className={`cursor-pointer transition-colors group ${
                        overdue
                          ? 'bg-red-50/70 dark:bg-red-950/25 border-r-4 border-r-red-500'
                          : idx % 2 === 0
                            ? 'bg-white dark:bg-slate-800'
                            : 'bg-slate-50/50 dark:bg-slate-800/40'
                      } hover:bg-blue-50/70 dark:hover:bg-slate-700/50`}
                    >
                      {/* Row number */}
                      <td className="py-3 px-3 text-center font-mono text-slate-400 font-semibold">
                        {t.number || t.id}
                      </td>

                      {/* Day & Date */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {t.day || '—'}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {formatArabicDate(t.date)}
                        </div>
                      </td>

                      {/* Department badge */}
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-lg border text-[11px] font-bold max-w-full truncate ${getDeptBadgeClass(t.department)}`}>
                          {t.department || 'عام'}
                        </span>
                      </td>

                      {/* Description */}
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-2" title={t.description}>
                          {t.description}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {t.done ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>تم الإنجاز</span>
                          </span>
                        ) : overdue ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800 animate-alert-pulse">
                            <AlertCircle className="w-3 h-3 text-red-600" />
                            <span>متأخرة</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>قيد التنفيذ</span>
                          </span>
                        )}
                      </td>

                      {/* Responsible Engineer */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                          <span>{t.technician || '—'}</span>
                        </div>
                      </td>

                      {/* Notes (truncated desktop tooltip) */}
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 max-w-xs truncate" title={t.notes}>
                        {t.notes || '—'}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center no-print" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Toggle Done checkbox */}
                          <button
                            onClick={() => onToggleTaskDone(t)}
                            title={t.done ? 'تحديد كغير منجز' : 'تحديد كمنجز'}
                            className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                              t.done 
                                ? 'bg-emerald-600 text-white' 
                                : 'border border-slate-300 dark:border-slate-600 hover:border-emerald-500'
                            }`}
                          >
                            {t.done && <Check className="w-4 h-4 stroke-[3]" />}
                          </button>

                          {/* Edit Pen */}
                          <button
                            onClick={() => onEditTask(t)}
                            title="تعديل المهمة"
                            className="p-1 rounded text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete Trash */}
                          <button
                            onClick={() => onDeleteTask(t)}
                            title="حذف المهمة"
                            className="p-1 rounded text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar (Phase 7) */}
        {totalPages > 1 && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between no-print">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={pageIndex <= 1}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronRight className="w-4 h-4" />
              <span>السابق</span>
            </button>

            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              صفحة {pageIndex} من {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={pageIndex >= totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <span>التالي</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

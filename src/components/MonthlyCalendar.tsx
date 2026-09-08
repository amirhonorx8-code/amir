import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink,
  Edit2
} from 'lucide-react';
import { Task } from '../types';
import { parseTaskDate, formatArabicMonthYear } from '../utils/helpers';

interface MonthlyCalendarProps {
  tasks: Task[];
  onEditTask?: (task: Task) => void;
  onToggleTaskDone?: (task: Task) => void;
  onNavigateToFullLog?: () => void;
}

export const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
  tasks,
  onEditTask,
  onToggleTaskDone,
  onNavigateToFullLog
}) => {
  // Extract all available months from tasks
  const monthsData = useMemo(() => {
    const map = new Map<string, { year: number; month: number; count: number; date: Date }>();
    
    tasks.forEach(t => {
      const d = parseTaskDate(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!map.has(key)) {
        map.set(key, { year: d.getFullYear(), month: d.getMonth(), count: 0, date: d });
      }
      map.get(key)!.count += 1;
    });

    const sortedKeys = Array.from(map.keys()).sort().reverse();
    return sortedKeys.map(k => ({
      key: k,
      ...map.get(k)!
    }));
  }, [tasks]);

  // Selected Month (defaults to latest month with tasks or current date)
  const [selectedMonthKey, setSelectedMonthKey] = useState<string>(() => {
    return monthsData.length > 0 ? monthsData[0].key : `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  });

  // Selected Day to inspect
  const [selectedDayNum, setSelectedDayNum] = useState<number | null>(null);

  // Current Year & Month numbers
  const [currentYear, currentMonth] = useMemo(() => {
    const [y, m] = selectedMonthKey.split('-').map(Number);
    return [y, m - 1]; // 0-indexed month
  }, [selectedMonthKey]);

  // Navigate prev / next month
  const handlePrevMonth = () => {
    let newMonth = currentMonth - 1;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    const key = `${newYear}-${String(newMonth + 1).padStart(2, '0')}`;
    setSelectedMonthKey(key);
    setSelectedDayNum(null);
  };

  const handleNextMonth = () => {
    let newMonth = currentMonth + 1;
    let newYear = currentYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    const key = `${newYear}-${String(newMonth + 1).padStart(2, '0')}`;
    setSelectedMonthKey(key);
    setSelectedDayNum(null);
  };

  // Days calculation for current month
  const { daysInMonth, firstDayOfWeek, tasksByDay } = useMemo(() => {
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const startDay = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun, 1 = Mon ...
    
    // Group tasks of this month by day number
    const byDay: Record<number, Task[]> = {};
    tasks.forEach(t => {
      const d = parseTaskDate(t.date);
      if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
        const dayNum = d.getDate();
        if (!byDay[dayNum]) byDay[dayNum] = [];
        byDay[dayNum].push(t);
      }
    });

    return {
      daysInMonth: totalDays,
      firstDayOfWeek: startDay,
      tasksByDay: byDay,
    };
  }, [currentYear, currentMonth, tasks]);

  // Today marker calculation
  const today = new Date();
  const isCurrentMonthToday = today.getFullYear() === currentYear && today.getMonth() === currentMonth;
  const todayDateNum = today.getDate();

  // Current month's tasks for selected day
  const selectedDayTasks = useMemo(() => {
    if (selectedDayNum === null) return [];
    return tasksByDay[selectedDayNum] || [];
  }, [selectedDayNum, tasksByDay]);

  const monthDisplayName = useMemo(() => {
    const d = new Date(currentYear, currentMonth, 1);
    return formatArabicMonthYear(d);
  }, [currentYear, currentMonth]);

  const weekDayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 mb-8 no-print">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        
        {/* Navy Header Banner */}
        <div className="bg-gradient-to-r from-[#1F3A5F] to-[#132743] text-white px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base md:text-lg">
                التقويم الشهري التفاعلي للمهام
              </h3>
              <p className="text-xs text-blue-200 font-medium">
                توزيع مهام الدعم الفني اليومية • اضغط على أي يوم لعرض تفاصيل مهامه
              </p>
            </div>
          </div>

          {/* Month Navigator Controls */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="الشهر السابق"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <span className="px-3 py-1 rounded-lg bg-white/15 text-sm font-bold min-w-[130px] text-center">
              {monthDisplayName}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="الشهر التالي"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Month Quick Chips */}
        <div className="bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
            الأشهر المتوفرة:
          </span>
          {monthsData.slice(0, 8).map((m) => {
            const isSelected = m.key === selectedMonthKey;
            const d = new Date(m.year, m.month, 1);
            return (
              <button
                key={m.key}
                onClick={() => {
                  setSelectedMonthKey(m.key);
                  setSelectedDayNum(null);
                }}
                className={`text-xs px-3 py-1 rounded-full whitespace-nowrap font-bold transition-all ${
                  isSelected
                    ? 'bg-[#1F3A5F] text-white shadow-xs'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'
                }`}
              >
                {formatArabicMonthYear(d)} ({m.count})
              </button>
            );
          })}
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1.5 mb-2 text-center">
            {weekDayNames.map((d, i) => (
              <div 
                key={i} 
                className={`py-1.5 text-xs font-black rounded-lg ${
                  i === 5 || i === 6 // Friday or Saturday
                    ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Days cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Blank cells for offset before first day */}
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
              <div key={`blank-${idx}`} className="h-16 sm:h-20 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200/50 dark:border-slate-700/40" />
            ))}

            {/* Actual day cells */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dayTasks = tasksByDay[dayNum] || [];
              const taskCount = dayTasks.length;
              const isSelected = selectedDayNum === dayNum;
              const doneCount = dayTasks.filter(t => t.done).length;

              // Color classes based on task count
              let bgClass = 'bg-white dark:bg-slate-800 hover:bg-blue-50/50 dark:hover:bg-slate-700/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200';
              if (taskCount > 0 && taskCount <= 2) {
                bgClass = 'bg-blue-50/80 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/60 text-blue-900 dark:text-blue-200 hover:bg-blue-100/70';
              } else if (taskCount >= 3 && taskCount <= 5) {
                bgClass = 'bg-blue-100/90 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 text-blue-950 dark:text-blue-100 font-bold hover:bg-blue-200/80';
              } else if (taskCount >= 6) {
                bgClass = 'bg-[#1F3A5F] text-white border-[#132743] hover:bg-[#254673] shadow-xs';
              }

              if (isSelected) {
                bgClass += ' ring-2 ring-amber-500 scale-[1.02] shadow-md z-10';
              }

              const isToday = isCurrentMonthToday && todayDateNum === dayNum;

              return (
                <button
                  key={dayNum}
                  onClick={() => setSelectedDayNum(isSelected ? null : dayNum)}
                  className={`h-16 sm:h-20 p-2 rounded-xl border transition-all flex flex-col justify-between text-right relative overflow-hidden group ${bgClass}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1">
                      <span className="text-sm sm:text-base font-black font-mono">
                        {dayNum}
                      </span>
                      {isToday && (
                        <span title="اليوم الحالي" className="text-xs">📌</span>
                      )}
                    </div>
                    {taskCount > 0 && (
                      <span 
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          taskCount >= 6 
                            ? 'bg-amber-400 text-slate-950' 
                            : 'bg-blue-600 text-white dark:bg-blue-500'
                        }`}
                      >
                        {taskCount}
                      </span>
                    )}
                  </div>

                  {taskCount > 0 ? (
                    <div className="w-full">
                      <div className="text-[10px] truncate opacity-90 hidden sm:block">
                        {doneCount}/{taskCount} منجز
                      </div>
                      <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-1 mt-1 overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full rounded-full" 
                          style={{ width: `${Math.round((doneCount / taskCount) * 100)}%` }} 
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:block">
                      لا مهام
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day's Tasks Drawer */}
        {selectedDayNum !== null && (
          <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 p-4 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600" />
                <h4 className="font-black text-sm text-slate-800 dark:text-white">
                  مهام يوم {selectedDayNum} {monthDisplayName} ({selectedDayTasks.length} مهام)
                </h4>
              </div>
              <button
                onClick={() => setSelectedDayNum(null)}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold"
              >
                إغلاق ✕
              </button>
            </div>

            {selectedDayTasks.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-500">
                لا توجد مهام مسجلة في هذا اليوم.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {selectedDayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 bg-white dark:bg-slate-700/60 rounded-xl border border-slate-200 dark:border-slate-600 flex items-start justify-between gap-2 text-xs"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-500 dark:text-slate-400">
                          #{task.number || task.id}
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">
                          {task.department}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          task.done
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        }`}>
                          {task.done ? 'تمت' : 'مفتوحة'}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 font-medium">
                        {task.description}
                      </p>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <span>المهندس المسؤول: <strong>{task.technician || 'غير محدد'}</strong></span>
                        {task.notes && <span>• {task.notes}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {onToggleTaskDone && (
                        <button
                          onClick={() => onToggleTaskDone(task)}
                          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300"
                          title={task.done ? 'تعيين كمفتوحة' : 'تعيين كمنجزة'}
                        >
                          <CheckCircle2 className={`w-4 h-4 ${task.done ? 'text-emerald-600' : 'text-slate-400'}`} />
                        </button>
                      )}
                      {onEditTask && (
                        <button
                          onClick={() => onEditTask(task)}
                          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 text-blue-600"
                          title="تعديل المهمة"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer with Legend and Jump to Full Log */}
        <div className="bg-slate-50 dark:bg-slate-800/80 px-5 py-3 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          {/* Legend */}
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 flex-wrap">
            <span className="font-bold text-slate-500 dark:text-slate-400">كثافة المهام:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-blue-100 border border-blue-200 inline-block" />
              <span>1–2 مهام</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-blue-200 border border-blue-300 inline-block" />
              <span>3–5 مهام</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-[#1F3A5F] border border-[#132743] inline-block" />
              <span className="font-bold">6+ مهام</span>
            </div>
            <div className="flex items-center gap-1">
              <span>📌</span>
              <span>اليوم الحالي</span>
            </div>
          </div>

          {/* Full log month link */}
          {onNavigateToFullLog && (
            <button
              onClick={onNavigateToFullLog}
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>عرض سجل شهر {monthDisplayName} كاملاً</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

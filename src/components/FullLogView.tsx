import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  Filter, 
  ArrowUpDown, 
  LayoutGrid, 
  List, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Edit3, 
  Trash2, 
  Check, 
  Building2, 
  UserCheck, 
  Layers, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Task, FilterState } from '../types';
import { 
  formatArabicDate, 
  formatArabicMonthYear, 
  getDeptBadgeClass, 
  isTaskOverdue, 
  parseTaskDate 
} from '../utils/helpers';

interface FullLogViewProps {
  tasks: Task[];
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onToggleTaskDone: (task: Task) => void;
  initialFilter?: Partial<FilterState>;
}

export const FullLogView: React.FC<FullLogViewProps> = ({
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTaskDone,
  initialFilter,
}) => {
  // View mode: Cards vs Table
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');

  // Filter state
  const [searchQuery, setSearchQuery] = useState<string>(initialFilter?.searchQuery || '');
  const [selectedDept, setSelectedDept] = useState<string>(initialFilter?.department || 'all');
  const [selectedTech, setSelectedTech] = useState<string>(initialFilter?.technician || 'all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'done' | 'open' | 'overdue'>(initialFilter?.status || 'all');
  const [periodFilter, setPeriodFilter] = useState<'all' | 'week' | 'month'>(initialFilter?.period || 'all');
  const [selectedMonth, setSelectedMonth] = useState<string>(initialFilter?.month || 'all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'department' | 'technician'>('newest');

  // Suggestion dropdown state (Phase 35, 36)
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(e.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute month list with counts (Phase 13)
  const monthCounts = useMemo(() => {
    const map = new Map<string, { key: string; label: string; count: number }>();
    tasks.forEach(t => {
      const d = parseTaskDate(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = formatArabicMonthYear(d);
      const existing = map.get(key) || { key, label, count: 0 };
      existing.count += 1;
      map.set(key, existing);
    });
    return Array.from(map.values()).sort((a, b) => b.key.localeCompare(a.key));
  }, [tasks]);

  // Compute department breakdown with counts (most-used first)
  const departmentStats = useMemo(() => {
    const map = new Map<string, number>();
    tasks.forEach(t => {
      const d = t.department?.trim() || 'غير محدد';
      map.set(d, (map.get(d) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [tasks]);

  // Compute engineer breakdown with counts (most-used first)
  const technicianStats = useMemo(() => {
    const map = new Map<string, number>();
    tasks.forEach(t => {
      const tech = t.technician?.trim() || 'غير محدد';
      map.set(tech, (map.get(tech) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [tasks]);

  // Day suggestions
  const dayStats = useMemo(() => {
    const map = new Map<string, number>();
    tasks.forEach(t => {
      if (t.day) map.set(t.day, (map.get(t.day) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [tasks]);

  // Dynamic suggestions list for dropdown (Phase 35)
  const filteredSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const depts = departmentStats
      .filter(d => !q || d.name.toLowerCase().includes(q))
      .slice(0, 4)
      .map(d => ({ type: 'إدارة', ...d }));

    const techs = technicianStats
      .filter(t => !q || t.name.toLowerCase().includes(q))
      .slice(0, 4)
      .map(t => ({ type: 'مهندس', ...t }));

    const days = dayStats
      .filter(d => !q || d.name.toLowerCase().includes(q))
      .slice(0, 3)
      .map(d => ({ type: 'يوم', ...d }));

    return [...depts, ...techs, ...days];
  }, [searchQuery, departmentStats, technicianStats, dayStats]);

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let result = tasks.filter(t => {
      // Search query in department, technician, description, notes, day
      if (q) {
        const inDept = (t.department || '').toLowerCase().includes(q);
        const inTech = (t.technician || '').toLowerCase().includes(q);
        const inDesc = (t.description || '').toLowerCase().includes(q);
        const inNotes = (t.notes || '').toLowerCase().includes(q);
        const inDay = (t.day || '').toLowerCase().includes(q);
        const inDate = (t.date || '').toLowerCase().includes(q);
        if (!inDept && !inTech && !inDesc && !inNotes && !inDay && !inDate) {
          return false;
        }
      }

      // Department filter
      if (selectedDept !== 'all' && t.department !== selectedDept) {
        return false;
      }

      // Technician filter
      if (selectedTech !== 'all' && t.technician !== selectedTech) {
        return false;
      }

      // Status filter
      if (statusFilter === 'done' && !t.done) return false;
      if (statusFilter === 'open' && t.done) return false;
      if (statusFilter === 'overdue' && !isTaskOverdue(t)) return false;

      // Month filter
      if (selectedMonth !== 'all') {
        const d = parseTaskDate(t.date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (key !== selectedMonth) return false;
      }

      // Period filter (week vs month)
      if (periodFilter === 'week') {
        const maxTime = Math.max(...tasks.map(x => parseTaskDate(x.date).getTime()));
        const weekStart = maxTime - 7 * 24 * 60 * 60 * 1000;
        if (parseTaskDate(t.date).getTime() < weekStart) return false;
      } else if (periodFilter === 'month') {
        const maxTime = Math.max(...tasks.map(x => parseTaskDate(x.date).getTime()));
        const dMax = new Date(maxTime);
        const dCur = parseTaskDate(t.date);
        if (dCur.getFullYear() !== dMax.getFullYear() || dCur.getMonth() !== dMax.getMonth()) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return parseTaskDate(b.date).getTime() - parseTaskDate(a.date).getTime() || b.id - a.id;
      }
      if (sortBy === 'oldest') {
        return parseTaskDate(a.date).getTime() - parseTaskDate(b.date).getTime() || a.id - b.id;
      }
      if (sortBy === 'department') {
        return (a.department || '').localeCompare(b.department || '');
      }
      if (sortBy === 'technician') {
        return (a.technician || '').localeCompare(b.technician || '');
      }
      return 0;
    });

    return result;
  }, [tasks, searchQuery, selectedDept, selectedTech, statusFilter, selectedMonth, periodFilter, sortBy]);

  // Completion metrics
  const doneCount = useMemo(() => filteredTasks.filter(t => t.done).length, [filteredTasks]);
  const openCount = useMemo(() => filteredTasks.filter(t => !t.done).length, [filteredTasks]);
  const overdueCount = useMemo(() => filteredTasks.filter(t => isTaskOverdue(t)).length, [filteredTasks]);
  const completionPercent = filteredTasks.length > 0 ? Math.round((doneCount / filteredTasks.length) * 100) : 0;

  // Clear all filters (Phase 13)
  const isAnyFilterActive = searchQuery || selectedDept !== 'all' || selectedTech !== 'all' || statusFilter !== 'all' || selectedMonth !== 'all' || periodFilter !== 'all';
  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedDept('all');
    setSelectedTech('all');
    setStatusFilter('all');
    setPeriodFilter('all');
    setSelectedMonth('all');
  };

  // Keyboard navigation for search dropdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex(i => (i + 1) % filteredSuggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex(i => (i - 1 + filteredSuggestions.length) % filteredSuggestions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestionIndex >= 0 && activeSuggestionIndex < filteredSuggestions.length) {
        const item = filteredSuggestions[activeSuggestionIndex];
        setSearchQuery(item.name);
        setShowSuggestions(false);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 my-8 space-y-6">

      {/* 1. Top Section: Advanced Search & Comprehensive Filters Panel (Phase 33, 34) */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-5">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/60 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-700 dark:text-blue-300">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">البحث والتصفية المتقدمة</h2>
              <p className="text-xs text-slate-500">ابحث بالاسم، الإدارة، المهندس، أو الملاحظات</p>
            </div>
          </div>

          {/* Result counter & Clear Button (Phase 13, 15) */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/60 px-3 py-1.5 rounded-xl">
              عرض {filteredTasks.length} من {tasks.length} مهمة
            </span>

            {isAnyFilterActive && (
              <button
                onClick={handleClearAllFilters}
                className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 px-3 py-1.5 rounded-xl flex items-center gap-1 border border-red-200 dark:border-red-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>مسح كل الفلاتر</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Input with Live Suggestions Dropdown (Phase 34, 35) */}
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute right-4 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
                setActiveSuggestionIndex(-1);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              placeholder="ابحث في بيان المهمة، الإدارة، المهندس المسؤول، أو الملاحظات..."
              className="w-full h-12 pr-12 pl-10 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title="مسح البحث"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Suggestions Dropdown (Phase 35) */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div 
              ref={dropdownRef}
              className="absolute z-30 top-full mt-1.5 w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden py-1 divide-y divide-slate-100 dark:divide-slate-700/60"
            >
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-800/80">
                اقتراحات الأكثر استخداماً:
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredSuggestions.map((item, idx) => (
                  <button
                    key={`${item.type}-${item.name}`}
                    onClick={() => {
                      setSearchQuery(item.name);
                      setShowSuggestions(false);
                    }}
                    className={`w-full text-right px-4 py-2 text-xs flex items-center justify-between transition-colors ${
                      activeSuggestionIndex === idx 
                        ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 font-bold">
                        {item.type}
                      </span>
                      <span className="font-semibold">{item.name}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {item.count} مهمة
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Filter Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          {/* Status Filter Chips (Phase 29) */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-600 dark:text-slate-300">حالة المهمة:</label>
            <div className="flex items-center flex-wrap gap-1">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'done', label: 'تم إنجازها' },
                { id: 'open', label: 'مفتوحة' },
                { id: 'overdue', label: 'متأخرة' },
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id as any)}
                  className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                    statusFilter === st.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Period Filter Chips */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-600 dark:text-slate-300">الفترة الزمنية:</label>
            <div className="flex items-center flex-wrap gap-1">
              {[
                { id: 'all', label: 'كافة الأوقات' },
                { id: 'week', label: 'هذا الأسبوع' },
                { id: 'month', label: 'هذا الشهر' },
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    setPeriodFilter(p.id as any);
                    setSelectedMonth('all');
                  }}
                  className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                    periodFilter === p.id
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Months Chips with Counts (Phase 13) */}
          <div className="space-y-1.5 lg:col-span-2">
            <label className="font-bold text-slate-600 dark:text-slate-300">تصفية حسب الشهر:</label>
            <div className="flex items-center flex-wrap gap-1">
              <button
                onClick={() => setSelectedMonth('all')}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                  selectedMonth === 'all'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                كل الشهور
              </button>
              {monthCounts.map(m => (
                <button
                  key={m.key}
                  onClick={() => {
                    setSelectedMonth(m.key);
                    setPeriodFilter('all');
                  }}
                  className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                    selectedMonth === m.key
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <span>{m.label}</span>
                  <span className="opacity-70 mr-1 font-mono">({m.count})</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 2. Visual Analytics & Breakdown Cards (Phase 8, 15, 17) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Departments Breakdown with Clickable Bars (Phase 8, 15) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">أكثر الإدارات طلباً للدعم</h3>
            </div>
            {selectedDept !== 'all' && (
              <button
                onClick={() => setSelectedDept('all')}
                className="text-[10px] text-blue-600 hover:underline font-bold"
              >
                إلغاء الفلتر
              </button>
            )}
          </div>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {departmentStats.slice(0, 6).map(dept => {
              const maxCount = departmentStats[0]?.count || 1;
              const widthPct = Math.round((dept.count / maxCount) * 100);
              const isSelected = selectedDept === dept.name;

              return (
                <div
                  key={dept.name}
                  onClick={() => setSelectedDept(isSelected ? 'all' : dept.name)}
                  className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                    isSelected ? 'bg-blue-50 dark:bg-blue-900/40 border border-blue-300' : 'hover:bg-slate-50 dark:hover:bg-slate-700/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold truncate max-w-[190px]">{dept.name}</span>
                    <span className="font-mono text-slate-500 font-bold">{dept.count}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div 
                      style={{ width: `${widthPct}%` }}
                      className={`h-full rounded-full transition-all ${isSelected ? 'bg-blue-600' : 'bg-blue-400 dark:bg-blue-500'}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 2: Responsible Engineers Breakdown with Clickable Bars (Phase 8, 15) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">المهندس المسؤول (توزيع المهام)</h3>
            </div>
            {selectedTech !== 'all' && (
              <button
                onClick={() => setSelectedTech('all')}
                className="text-[10px] text-emerald-600 hover:underline font-bold"
              >
                إلغاء الفلتر
              </button>
            )}
          </div>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {technicianStats.slice(0, 6).map(tech => {
              const maxCount = technicianStats[0]?.count || 1;
              const widthPct = Math.round((tech.count / maxCount) * 100);
              const isSelected = selectedTech === tech.name;

              return (
                <div
                  key={tech.name}
                  onClick={() => setSelectedTech(isSelected ? 'all' : tech.name)}
                  className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                    isSelected ? 'bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-300' : 'hover:bg-slate-50 dark:hover:bg-slate-700/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold truncate max-w-[190px]">{tech.name}</span>
                    <span className="font-mono text-slate-500 font-bold">{tech.count}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div 
                      style={{ width: `${widthPct}%` }}
                      className={`h-full rounded-full transition-all ${isSelected ? 'bg-emerald-600' : 'bg-emerald-400 dark:bg-emerald-500'}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 3: Completion Donut & Metrics (Phase 17, 20) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 flex flex-col justify-between">
          <div className="border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>معدل إنجاز المهام الكلي</span>
            </h3>
          </div>

          <div className="flex items-center justify-center gap-6 my-4">
            {/* Visual Conic Gradient Donut Meter */}
            <div 
              style={{
                background: `conic-gradient(#10B981 0% ${completionPercent}%, #F59E0B ${completionPercent}% 100%)`
              }}
              className="w-28 h-28 rounded-full flex items-center justify-center p-3 shadow-inner relative"
            >
              <div className="w-full h-full bg-white dark:bg-slate-800 rounded-full flex flex-col items-center justify-center shadow-sm">
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {completionPercent}%
                </span>
                <span className="text-[10px] text-slate-400 font-bold">منجز</span>
              </div>
            </div>

            {/* Metrics Legend */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-600 dark:text-slate-300">تم الإنجاز:</span>
                <span className="font-bold text-emerald-600 font-mono">{doneCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-slate-600 dark:text-slate-300">قيد التنفيذ:</span>
                <span className="font-bold text-amber-600 font-mono">{openCount}</span>
              </div>
              {overdueCount > 0 && (
                <div className="flex items-center gap-2 text-red-600">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="font-bold">متأخرة:</span>
                  <span className="font-bold font-mono">{overdueCount}</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-[11px] text-center text-slate-400 border-t border-slate-100 dark:border-slate-700/60 pt-2">
            تم تحديث البيانات بناءً على الفلاتر النشطة
          </div>
        </div>

      </div>

      {/* 3. Task List Header Bar: Sort & View Mode Switch (Cards vs Table) */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <ArrowUpDown className="w-4 h-4 text-blue-600" />
            <span className="font-bold">الترتيب:</span>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="newest">الأحدث أولاً</option>
            <option value="oldest">الأقدم أولاً</option>
            <option value="department">حسب الإدارة</option>
            <option value="technician">حسب المهندس المسؤول</option>
          </select>
        </div>

        {/* View Mode Toggle: Table vs Cards */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setViewMode('table')}
              title="عرض كجدول"
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 shadow'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">جدول</span>
            </button>

            <button
              onClick={() => setViewMode('cards')}
              title="عرض كبطاقات"
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 font-bold transition-all ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 shadow'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">بطاقات</span>
            </button>
          </div>
        </div>

      </div>

      {/* 4. Display Content: Cards Grid OR Full Table */}
      {viewMode === 'cards' ? (
        /* Cards View (Phase 3, 14, 17) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              لا توجد مهام مطابقة للشروط
            </div>
          ) : (
            filteredTasks.map(t => {
              const overdue = isTaskOverdue(t);
              return (
                <div
                  key={t.id}
                  onClick={() => onEditTask(t)}
                  className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between relative ${
                    overdue
                      ? 'bg-red-50/50 dark:bg-red-950/20 border-red-300 dark:border-red-800'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top line: Number + Date + Status */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                          #{t.number || t.id}
                        </span>
                        <span className="font-bold text-slate-600 dark:text-slate-300">
                          {t.day || ''} {formatArabicDate(t.date)}
                        </span>
                      </div>

                      {t.done ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                          تم
                        </span>
                      ) : overdue ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 animate-alert-pulse">
                          متأخرة
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                          قيد التنفيذ
                        </span>
                      )}
                    </div>

                    {/* Department */}
                    <div>
                      <span className={`inline-block px-2.5 py-1 rounded-lg border text-[11px] font-bold ${getDeptBadgeClass(t.department)}`}>
                        {t.department || 'عام'}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="font-bold text-slate-900 dark:text-white text-sm line-clamp-3">
                      {t.description}
                    </p>

                    {/* Notes if any */}
                    {t.notes && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="font-bold ml-1 text-slate-600 dark:text-slate-300">ملاحظة:</span>
                        <span>{t.notes}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer of card: Responsible Engineer + Quick Actions */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-700 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>{t.technician || '—'}</span>
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onToggleTaskDone(t)}
                        title={t.done ? 'تحديد كغير منجز' : 'تحديد كمنجز'}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                          t.done 
                            ? 'bg-emerald-600 text-white' 
                            : 'border border-slate-300 dark:border-slate-600 hover:border-emerald-500'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </button>

                      <button
                        onClick={() => onEditTask(t)}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/40"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteTask(t)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Full Table View */
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-[#1F3A5F] text-white border-b border-blue-900">
                  <th className="py-3 px-3 font-bold w-12 text-center">م</th>
                  <th className="py-3 px-4 font-bold w-32">اليوم والتاريخ</th>
                  <th className="py-3 px-4 font-bold w-48">الإدارة / الجهة</th>
                  <th className="py-3 px-4 font-bold">بيان المهمة</th>
                  <th className="py-3 px-4 font-bold w-28 text-center">الحالة</th>
                  <th className="py-3 px-4 font-bold w-40">المهندس المسؤول</th>
                  <th className="py-3 px-4 font-bold max-w-xs">ملاحظات</th>
                  <th className="py-3 px-4 font-bold text-center w-24 no-print">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      لا توجد نتائج مطابقة للشروط
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((t, idx) => {
                    const overdue = isTaskOverdue(t);
                    return (
                      <tr
                        key={t.id}
                        onClick={() => onEditTask(t)}
                        className={`cursor-pointer transition-colors ${
                          overdue
                            ? 'bg-red-50/70 dark:bg-red-950/25 border-r-4 border-r-red-500'
                            : idx % 2 === 0
                              ? 'bg-white dark:bg-slate-800'
                              : 'bg-slate-50/50 dark:bg-slate-800/40'
                        } hover:bg-blue-50/70 dark:hover:bg-slate-700/50`}
                      >
                        <td className="py-3 px-3 text-center font-mono text-slate-400 font-semibold">
                          {t.number || t.id}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-bold text-slate-900 dark:text-white">{t.day || '—'}</div>
                          <div className="text-[11px] text-slate-500">{formatArabicDate(t.date)}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2.5 py-1 rounded-lg border text-[11px] font-bold ${getDeptBadgeClass(t.department)}`}>
                            {t.department || 'عام'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-2" title={t.description}>
                            {t.description}
                          </p>
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          {t.done ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>تم الإنجاز</span>
                            </span>
                          ) : overdue ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 animate-alert-pulse">
                              <AlertCircle className="w-3 h-3" />
                              <span>متأخرة</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                              <Clock className="w-3 h-3" />
                              <span>قيد التنفيذ</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-bold text-slate-800 dark:text-slate-200">
                          {t.technician || '—'}
                        </td>
                        <td className="py-3 px-4 text-slate-500 dark:text-slate-400 max-w-xs truncate" title={t.notes}>
                          {t.notes || '—'}
                        </td>
                        <td className="py-3 px-4 text-center no-print" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => onToggleTaskDone(t)}
                              title={t.done ? 'تحديد كغير منجز' : 'تحديد كمنجز'}
                              className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                                t.done 
                                  ? 'bg-emerald-600 text-white' 
                                  : 'border border-slate-300 dark:border-slate-600 hover:border-emerald-500'
                              }`}
                            >
                              {t.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </button>
                            <button
                              onClick={() => onEditTask(t)}
                              className="p-1 rounded text-blue-600 hover:bg-blue-100"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteTask(t)}
                              className="p-1 rounded text-red-600 hover:bg-red-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
        </div>
      )}

    </div>
  );
};

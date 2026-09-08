import React, { useState, useMemo } from 'react';
import { 
  MoonStar, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  User, 
  ShieldAlert, 
  Trash2, 
  Printer, 
  Download,
  Filter,
  Sparkles,
  Info
} from 'lucide-react';
import { AppUser, NightShiftRecord } from '../types';
import { formatArabicMonthYear, formatArabicDate } from '../utils/helpers';

interface NightShiftCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  nightShiftRecords: NightShiftRecord[];
  onToggleNightShift: (date: string) => void;
  onDeleteNightShiftRecord?: (id: string) => void;
  currentUser: AppUser;
  isAuthenticated: boolean;
  onOpenLoginModal: (desc?: string, prefill?: string) => void;
}

export const NightShiftCalendarModal: React.FC<NightShiftCalendarModalProps> = ({
  isOpen,
  onClose,
  nightShiftRecords,
  onToggleNightShift,
  onDeleteNightShiftRecord,
  currentUser,
  isAuthenticated,
  onOpenLoginModal,
}) => {
  // Default selected month: September 2026 or current month
  const [selectedYearMonth, setSelectedYearMonth] = useState<string>(() => {
    // If any records exist, pick the year-month of the latest record, else 2026-09
    if (nightShiftRecords.length > 0) {
      const dates = nightShiftRecords.map(r => r.date).sort().reverse();
      const latest = dates[0];
      if (latest && latest.length >= 7) {
        return latest.substring(0, 7);
      }
    }
    return '2026-09';
  });

  // Filter: 'all' or 'my'
  const [filterMode, setFilterMode] = useState<'all' | 'my'>('all');

  // Parse current Year and Month (0-indexed)
  const [year, month] = useMemo(() => {
    const parts = selectedYearMonth.split('-');
    const y = parseInt(parts[0], 10) || 2026;
    const m = (parseInt(parts[1], 10) || 9) - 1;
    return [y, m];
  }, [selectedYearMonth]);

  // Navigate months
  const handlePrevMonth = () => {
    let newM = month - 1;
    let newY = year;
    if (newM < 0) {
      newM = 11;
      newY -= 1;
    }
    setSelectedYearMonth(`${newY}-${String(newM + 1).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    let newM = month + 1;
    let newY = year;
    if (newM > 11) {
      newM = 0;
      newY += 1;
    }
    setSelectedYearMonth(`${newY}-${String(newM + 1).padStart(2, '0')}`);
  };

  const handleCurrentMonth = () => {
    const now = new Date();
    setSelectedYearMonth(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
  };

  // Month Display Name in Arabic
  const monthNameArabic = useMemo(() => {
    const d = new Date(year, month, 1);
    return formatArabicMonthYear(d);
  }, [year, month]);

  // Days calculations: Saturday-first (0 = Saturday, ..., 6 = Friday)
  const { totalDays, startDayOfWeekOffset } = useMemo(() => {
    const daysInMonthCount = new Date(year, month + 1, 0).getDate();
    // JS standard getDay: 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
    const jsDay = new Date(year, month, 1).getDay();
    // Egyptian / Arab work week starts on Saturday:
    // Sat = 0, Sun = 1, Mon = 2, Tue = 3, Wed = 4, Thu = 5, Fri = 6
    const satOffset = (jsDay + 1) % 7;
    return {
      totalDays: daysInMonthCount,
      startDayOfWeekOffset: satOffset
    };
  }, [year, month]);

  // Group records for current month
  const currentMonthRecords = useMemo(() => {
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    return nightShiftRecords.filter(r => r.date.startsWith(prefix));
  }, [nightShiftRecords, year, month]);

  // Map of date string to records for that date
  const recordsByDate = useMemo(() => {
    const map = new Map<string, NightShiftRecord[]>();
    nightShiftRecords.forEach(r => {
      if (!map.has(r.date)) {
        map.set(r.date, []);
      }
      map.get(r.date)!.push(r);
    });
    return map;
  }, [nightShiftRecords]);

  // Count for active user this month
  const myShiftsCountThisMonth = useMemo(() => {
    if (!currentUser || currentUser.id === 'guest') return 0;
    return currentMonthRecords.filter(r => r.userId === currentUser.id).length;
  }, [currentMonthRecords, currentUser]);

  // Total shifts this month (unique dates marked)
  const totalUniqueDaysThisMonth = useMemo(() => {
    const dates = new Set(currentMonthRecords.map(r => r.date));
    return dates.size;
  }, [currentMonthRecords]);

  // User toggle click on a specific date
  const handleDayClick = (dateStr: string) => {
    if (!isAuthenticated || currentUser.id === 'guest' || !currentUser.canAdd) {
      onOpenLoginModal('تسجيل يوم سهر في التقويم لحسابك');
      return;
    }
    onToggleNightShift(dateStr);
  };

  // Day of week names starting Saturday
  const weekDays = [
    { name: 'السبت', isWeekend: true },
    { name: 'الأحد', isWeekend: false },
    { name: 'الإثنين', isWeekend: false },
    { name: 'الثلاثاء', isWeekend: false },
    { name: 'الأربعاء', isWeekend: false },
    { name: 'الخميس', isWeekend: false },
    { name: 'الجمعة', isWeekend: true },
  ];

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto no-print"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-white dark:bg-slate-850 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header with Dark Navy & Gold Moon theme */}
        <div className="bg-gradient-to-r from-[#101d32] via-[#162744] to-[#1c3358] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-400/20">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-inner shrink-0">
              <MoonStar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  تقويم أيام السهر الشهري
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  نظام النوبتجيات
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                ضع علامة على اليوم الذي سهرت فيه فقط ليقوم النظام بتسجيله واحتساب إجمالي أيام السهر تلقائياً.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* User status badge */}
            <div className="flex items-center gap-2 bg-black/25 border border-white/10 px-3 py-1.5 rounded-xl text-xs">
              <User className="w-4 h-4 text-amber-400" />
              <div className="text-right">
                <div className="text-[10px] text-slate-400">حسابك الحالي:</div>
                <div className="font-bold text-white flex items-center gap-1">
                  <span>{currentUser?.name || 'زائر'}</span>
                  {isAuthenticated && currentUser.id !== 'guest' ? (
                    <span className="text-[10px] text-emerald-400">✓ معتمد</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onOpenLoginModal('تسجيل الدخول لتسجيل أيام السهر')}
                      className="text-[10px] text-amber-300 underline font-bold hover:text-amber-200 mr-1"
                    >
                      (دخول)
                    </button>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors"
              title="إغلاق النافذة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Month Navigation & Real-time Metrics Bar */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Month Selector Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors shadow-xs flex items-center gap-1 text-xs font-bold"
              title="الشهر السابق"
            >
              <ChevronRight className="w-4 h-4" />
              <span className="hidden sm:inline">السابق</span>
            </button>

            <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center min-w-[170px] shadow-xs">
              <span className="font-black text-sm text-slate-800 dark:text-slate-100 flex items-center justify-center gap-2">
                <CalendarIcon className="w-4 h-4 text-amber-500" />
                {monthNameArabic}
              </span>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors shadow-xs flex items-center gap-1 text-xs font-bold"
              title="الشهر القادم"
            >
              <span className="hidden sm:inline">القادم</span>
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleCurrentMonth}
              className="px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold transition-colors"
            >
              اليوم
            </button>
          </div>

          {/* Quick Real-Time Counters */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* My shifts counter */}
            <div className="flex-1 sm:flex-initial px-3.5 py-2 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-300 dark:border-amber-500/30 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {myShiftsCountThisMonth}
              </div>
              <div className="text-right">
                <div className="text-[10px] text-amber-800 dark:text-amber-300 font-medium">أيام سهري هذا الشهر</div>
                <div className="text-xs font-black text-amber-900 dark:text-amber-100">
                  {currentUser?.id !== 'guest' ? `${myShiftsCountThisMonth} يوم للمهندس ${currentUser?.name}` : 'سجل الدخول'}
                </div>
              </div>
            </div>

            {/* Total shifts counter for team */}
            <div className="flex-1 sm:flex-initial px-3.5 py-2 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {totalUniqueDaysThisMonth}
              </div>
              <div className="text-right">
                <div className="text-[10px] text-indigo-800 dark:text-indigo-300 font-medium">إجمالي أيام السهر المسجلة</div>
                <div className="text-xs font-black text-indigo-900 dark:text-indigo-100">
                  {totalUniqueDaysThisMonth} يوم في {monthNameArabic}
                </div>
              </div>
            </div>

            {/* Filter mode */}
            {currentUser?.id !== 'guest' && (
              <div className="flex items-center bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => setFilterMode('all')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    filterMode === 'all'
                      ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  الكل ({totalUniqueDaysThisMonth})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('my')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    filterMode === 'my'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  سهراتي فقط ({myShiftsCountThisMonth})
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Guide notice */}
        <div className="px-5 py-2 bg-blue-50/80 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/40 text-[11px] text-blue-800 dark:text-blue-300 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>
              💡 <strong>طريقة الاستخدام:</strong> اضغط مباشرة على خانة أي يوم لوضع علامة السهر (🌙) وتثبيته في كشف أيام السهر. الضغط مرة أخرى يزيل العلامة.
            </span>
          </div>
          {currentUser.id === 'guest' && (
            <span className="text-amber-700 dark:text-amber-400 font-bold">
              🔒 أنت في وضع المشاهدة — سجل الدخول لتتمكن من وضع العلامات.
            </span>
          )}
        </div>

        {/* Interactive Calendar Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Calendar Grid Container */}
          <div className="border border-slate-200 dark:border-slate-700/80 rounded-2xl overflow-hidden bg-white dark:bg-slate-800/80 shadow-xs">
            
            {/* Day Header Row (Saturday to Friday) */}
            <div className="grid grid-cols-7 bg-[#162744] text-white text-center text-xs font-black divide-x divide-x-reverse divide-white/10">
              {weekDays.map((w, idx) => (
                <div 
                  key={idx} 
                  className={`py-3 px-1 ${w.isWeekend ? 'bg-indigo-950/80 text-amber-300' : ''}`}
                >
                  <span>{w.name}</span>
                  {w.isWeekend && (
                    <span className="text-[9px] block text-amber-400/70 font-normal">عطلة</span>
                  )}
                </div>
              ))}
            </div>

            {/* Calendar Cells Grid */}
            <div className="grid grid-cols-7 divide-x divide-y divide-x-reverse divide-slate-200 dark:divide-slate-700/60 bg-slate-50 dark:bg-slate-900/40">
              
              {/* Empty leading cells */}
              {Array.from({ length: startDayOfWeekOffset }).map((_, i) => (
                <div 
                  key={`empty-${i}`} 
                  className="min-h-[90px] sm:min-h-[105px] bg-slate-100/60 dark:bg-slate-900/30 p-2 opacity-30"
                />
              ))}

              {/* Day cells for the month */}
              {Array.from({ length: totalDays }).map((_, dayIdx) => {
                const dayNum = dayIdx + 1;
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const recordsForDay = recordsByDate.get(dateStr) || [];
                
                // Is this day marked by current user?
                const isMarkedByMe = currentUser && currentUser.id !== 'guest' 
                  ? recordsForDay.some(r => r.userId === currentUser.id)
                  : false;

                // Is marked by anyone?
                const isMarkedByAnyone = recordsForDay.length > 0;

                // Today check
                const now = new Date();
                const isToday = now.getFullYear() === year && now.getMonth() === month && now.getDate() === dayNum;

                // Weekend check (Saturday = 0 offset, Friday = 6 offset in our grid)
                const gridPos = (startDayOfWeekOffset + dayIdx) % 7;
                const isWeekend = gridPos === 0 || gridPos === 6; // Saturday or Friday

                // Filter condition: if filterMode === 'my', hide or dim if not marked by me
                const matchesFilter = filterMode === 'all' || isMarkedByMe;

                return (
                  <div
                    key={dateStr}
                    onClick={() => handleDayClick(dateStr)}
                    className={`min-h-[90px] sm:min-h-[105px] p-2 relative group cursor-pointer transition-all flex flex-col justify-between ${
                      isMarkedByMe
                        ? 'bg-gradient-to-br from-amber-500/15 via-indigo-950/40 to-slate-900/60 dark:from-amber-950/40 dark:via-indigo-950/60 dark:to-slate-900 border-2 border-amber-400 dark:border-amber-400 shadow-md ring-1 ring-amber-400/50'
                        : isMarkedByAnyone
                        ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800'
                        : isWeekend
                        ? 'bg-slate-100/70 dark:bg-slate-800/40 hover:bg-amber-50/50 dark:hover:bg-slate-750'
                        : 'bg-white dark:bg-slate-800 hover:bg-amber-50/40 dark:hover:bg-slate-750'
                    } ${!matchesFilter && filterMode === 'my' ? 'opacity-30' : 'opacity-100'}`}
                  >
                    {/* Top Row: Date Number & Checkbox/Indicator */}
                    <div className="flex items-center justify-between">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black transition-colors ${
                        isToday
                          ? 'bg-red-600 text-white shadow-xs'
                          : isMarkedByMe
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'text-slate-800 dark:text-slate-200 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                      }`}>
                        {dayNum}
                      </span>

                      {/* Interactive checkbox indicator */}
                      <div className="flex items-center gap-1">
                        {isMarkedByMe ? (
                          <div 
                            className="w-6 h-6 rounded-md bg-amber-500 text-white flex items-center justify-center shadow-xs group-hover:bg-amber-600 transition-colors"
                            title="تم وضع علامة السهر لهذا اليوم (اضغط للإلغاء)"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : (
                          <div 
                            className="w-6 h-6 rounded-md border border-slate-300 dark:border-slate-600 group-hover:border-amber-400 flex items-center justify-center text-[10px] text-slate-400 group-hover:text-amber-500 transition-all opacity-40 group-hover:opacity-100"
                            title="اضغط لوضع علامة السهر"
                          >
                            +
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Middle: Badges of users who checked this day */}
                    <div className="my-1.5 space-y-1">
                      {isMarkedByAnyone ? (
                        recordsForDay.map(record => {
                          const isCurrentUser = currentUser && record.userId === currentUser.id;
                          return (
                            <div
                              key={record.id}
                              className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold flex items-center justify-between gap-1 shadow-2xs ${
                                isCurrentUser
                                  ? 'bg-amber-500 text-white font-black'
                                  : 'bg-indigo-100 dark:bg-indigo-900/80 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700'
                              }`}
                              title={`سهر مسجل: ${record.userName} (${record.date})`}
                            >
                              <span className="flex items-center gap-1 truncate">
                                <MoonStar className="w-3 h-3 text-amber-300 shrink-0" />
                                <span className="truncate">{record.userName}</span>
                              </span>
                              {isCurrentUser && (
                                <span className="text-[9px] bg-black/20 px-1 rounded">أنا</span>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-[10px] text-slate-300 dark:text-slate-600 font-mono text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          سهر +
                        </div>
                      )}
                    </div>

                    {/* Bottom row: prompt status */}
                    <div className="text-[9px] text-right font-medium">
                      {isMarkedByMe ? (
                        <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-0.5 justify-end">
                          <span>مسجل لك</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        </span>
                      ) : isMarkedByAnyone ? (
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                          {recordsForDay.length} مهندس
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                          {isWeekend ? 'عطلة' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Log Table of Recorded Night Shifts in this Month */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
            <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <MoonStar className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  جدول أيام السهر المعتمدة لشهر {monthNameArabic} ({currentMonthRecords.length} فترة سهر)
                </h3>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                إجمالي الأيام المسجلة لحسابك: <strong className="text-amber-600 dark:text-amber-400 font-black">{myShiftsCountThisMonth} يوم</strong>
              </div>
            </div>

            {currentMonthRecords.length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs">
                <MoonStar className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                <p className="font-bold">لم يتم وضع علامة على أي يوم سهر في هذا الشهر بعد.</p>
                <p className="mt-1 text-[11px]">اضغط على أي يوم في التقويم أعلاه لتسجيل نوبتجية السهر الخاصة بك فوراً.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-700/60 max-h-60 overflow-y-auto">
                {currentMonthRecords
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((rec, index) => {
                    const isMyRecord = currentUser && rec.userId === currentUser.id;
                    return (
                      <div 
                        key={rec.id}
                        className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-750 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                            {index + 1}
                          </span>
                          <div>
                            <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                              <span>{formatArabicDate(rec.date)}</span>
                              <span className="text-[10px] text-slate-400 font-mono">({rec.date})</span>
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                              <span>المهندس: <strong>{rec.userName}</strong></span>
                              {rec.notes && <span>• {rec.notes}</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isMyRecord 
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                              : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300'
                          }`}>
                            {isMyRecord ? '✓ سهرتك المعتمدة' : 'سهر معتمد'}
                          </span>

                          {(isMyRecord || currentUser.canDelete) && (
                            <button
                              type="button"
                              onClick={() => {
                                if (onDeleteNightShiftRecord) {
                                  onDeleteNightShiftRecord(rec.id);
                                } else {
                                  onToggleNightShift(rec.date);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="إلغاء هذا اليوم"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-600 dark:text-slate-400">
            🌙 يتم حفظ كافة علامات وأيام السهر تلقائياً في قاعدة البيانات ويتم تحديث كارت الواجهة الرئيسية فوراً.
          </div>

          <div className="flex items-center gap-2">
            {/* Print button */}
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الكشف</span>
            </button>

            {/* Export CSV button */}
            <button
              type="button"
              onClick={() => {
                const escapeVal = (val: any) => {
                  if (val === null || val === undefined) return '""';
                  const s = String(val).replace(/"/g, '""');
                  return '"' + s + '"';
                };
                const headers = ['م', 'التاريخ', 'اسم المهندس', 'كود المهندس', 'الملاحظات'];
                const headerRow = '\uFEFF' + headers.map(escapeVal).join(',');
                const rows = currentMonthRecords.map((r, i) => [
                  i + 1,
                  r.date,
                  r.userName,
                  r.userId,
                  r.notes || 'سهر معتمد'
                ].map(escapeVal).join(','));
                const csvContent = [headerRow, ...rows].join('\r\n');
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `night_shifts_${selectedYearMonth}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="px-3.5 py-2 rounded-xl bg-[#162744] hover:bg-[#1f3760] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>تصدير CSV</span>
            </button>

            {/* Done button */}
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black transition-colors shadow-xs"
            >
              تم
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

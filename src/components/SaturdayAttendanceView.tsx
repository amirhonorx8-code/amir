import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Printer, 
  Download, 
  UserCheck, 
  Users, 
  Clock, 
  ShieldAlert,
  FileSpreadsheet,
  Moon,
  Lock
} from 'lucide-react';
import { SaturdayAttendance, AppUser } from '../types';
import { formatArabicDate, formatArabicMonthYear, parseTaskDate } from '../utils/helpers';

interface SaturdayAttendanceViewProps {
  attendances: SaturdayAttendance[];
  onAddAttendance: (attendance: Omit<SaturdayAttendance, 'id'>) => void;
  onEditAttendance: (attendance: SaturdayAttendance) => void;
  onDeleteAttendance: (id: number) => void;
  currentUser: AppUser;
  onExportCSV: () => void;
  onOpenExportCenter: () => void;
  nightShifts?: string[];
  onAddNightShift?: (date: string) => void;
  onDeleteNightShift?: (date: string) => void;
  onOpenNightShiftsCalendar?: () => void;
  onTriggerLogin?: (actionDesc: string) => void;
}

export const SaturdayAttendanceView: React.FC<SaturdayAttendanceViewProps> = ({
  attendances,
  onAddAttendance,
  onEditAttendance,
  onDeleteAttendance,
  currentUser,
  onExportCSV,
  onOpenExportCenter,
  nightShifts = ['2026-09-06', '2026-09-02'],
  onAddNightShift,
  onDeleteNightShift,
  onOpenNightShiftsCalendar,
  onTriggerLogin
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [newNightDate, setNewNightDate] = useState(new Date().toISOString().split('T')[0]);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SaturdayAttendance | null>(null);
  const [formData, setFormData] = useState({
    employee: 'أمير طلعت',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Distinct Employees
  const employees = useMemo(() => {
    const set = new Set<string>();
    attendances.forEach(a => {
      if (a.employee) set.add(a.employee);
    });
    return Array.from(set);
  }, [attendances]);

  // Distinct Months
  const months = useMemo(() => {
    const map = new Map<string, string>();
    attendances.forEach(a => {
      if (a.date) {
        const d = parseTaskDate(a.date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const label = formatArabicMonthYear(d);
        map.set(key, label);
      }
    });
    return Array.from(map.entries()).map(([key, label]) => ({ key, label }));
  }, [attendances]);

  // Filtered attendances
  const filteredAttendances = useMemo(() => {
    return attendances.filter(item => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const empMatch = item.employee?.toLowerCase().includes(q);
        const notesMatch = item.notes?.toLowerCase().includes(q);
        const dateMatch = item.date?.includes(q);
        if (!empMatch && !notesMatch && !dateMatch) return false;
      }

      // Employee Filter
      if (selectedEmployee !== 'all' && item.employee !== selectedEmployee) {
        return false;
      }

      // Month Filter
      if (selectedMonth !== 'all' && item.date) {
        const d = parseTaskDate(item.date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (key !== selectedMonth) return false;
      }

      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [attendances, searchQuery, selectedEmployee, selectedMonth]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      employee: 'أمير طلعت',
      date: new Date().toISOString().split('T')[0],
      notes: 'حضور سبت نوبتجية'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: SaturdayAttendance) => {
    setEditingItem(item);
    setFormData({
      employee: item.employee,
      date: item.date,
      notes: item.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employee.trim() || !formData.date) return;

    if (editingItem) {
      onEditAttendance({
        ...editingItem,
        employee: formData.employee.trim(),
        date: formData.date,
        notes: formData.notes.trim()
      });
    } else {
      onAddAttendance({
        employee: formData.employee.trim(),
        date: formData.date,
        notes: formData.notes.trim()
      });
    }
    setIsModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Page Header & Stats */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                <Calendar className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-xl font-black text-slate-900 dark:text-white">
                  كشف حضور وتشغيل السبت (نوبتجيات السبت)
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  سجل مناوبات وحضور العاملين بنظم المعلومات والتطبيقات يوم السبت وفق جدول التشغيل المعتمد
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap no-print">
            {currentUser.canAdd ? (
              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة نوبتجية سبت</span>
              </button>
            ) : (
              <button
                onClick={() => onTriggerLogin?.('إضافة نوبتجية سبت جديدة')}
                className="flex items-center gap-2 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
                title="تسجيل الدخول لإضافة نوبتجية"
              >
                <Lock className="w-4 h-4" />
                <span>إضافة نوبتجية (تسجيل دخول)</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all"
              title="طباعة الكشف"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة</span>
            </button>

            <button
              onClick={onOpenExportCenter}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 rounded-xl text-xs font-semibold transition-all"
              title="تصدير وتحميل البيانات"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>مركز التصدير (JSON/CSV)</span>
            </button>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-700/60">
          <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30">
            <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-400">إجمالي المناوبات المسجلة</span>
            <div className="text-2xl font-black text-indigo-950 dark:text-indigo-200 mt-1">{attendances.length}</div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">عدد الموظفين المناوبين</span>
            <div className="text-2xl font-black text-emerald-950 dark:text-emerald-200 mt-1">{employees.length}</div>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
            <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">المطابق للبحث والفلترة</span>
            <div className="text-2xl font-black text-amber-950 dark:text-amber-200 mt-1">{filteredAttendances.length}</div>
          </div>

          <div className="p-3 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30">
            <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-400">أحدث سبت مسجل</span>
            <div className="text-sm font-bold text-purple-950 dark:text-purple-200 mt-2 truncate">
              {attendances.length > 0 ? attendances[attendances.length - 1].date : 'لا يوجد'}
            </div>
          </div>
        </div>

        {/* Night Shifts Section (يوم السهر) */}
        <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              <Moon className="w-4 h-4 text-indigo-500" />
            </span>
            <div>
              <span className="text-xs font-black text-slate-800 dark:text-slate-200">سجل أيام السهر (النوبتجيات المسائية):</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mr-2">المناوبة المسائية لغرفة العمليات المركزية</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onOpenNightShiftsCalendar && (
              <button
                type="button"
                onClick={onOpenNightShiftsCalendar}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black flex items-center gap-1.5 shadow-xs transition-all no-print"
              >
                <Moon className="w-3.5 h-3.5 fill-current" />
                <span>فتح التقويم الشهري التفاعلي للسهر 🌙</span>
              </button>
            )}

            {nightShifts.map((dateStr) => (
              <span 
                key={dateStr}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
              >
                <span>{formatArabicDate(dateStr)}</span>
                <span className="text-[10px] text-indigo-400 font-mono">({dateStr})</span>
                {currentUser.canDelete && onDeleteNightShift && (
                  <button
                    onClick={() => onDeleteNightShift(dateStr)}
                    className="hover:text-red-500 p-0.5 rounded transition-colors"
                    title="حذف التاريخ"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}

            {currentUser.canAdd && onAddNightShift && (
              <div className="inline-flex items-center gap-1.5 no-print">
                <input
                  type="date"
                  value={newNightDate}
                  onChange={(e) => setNewNightDate(e.target.value)}
                  className="h-7 px-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (newNightDate && !nightShifts.includes(newNightDate)) {
                      onAddNightShift(newNightDate);
                    }
                  }}
                  className="h-7 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                >
                  + إضافة سهر
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center gap-3 no-print">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث باسم الموظف، الملاحظات، أو التاريخ..."
            className="w-full pl-4 pr-10 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              مسح
            </button>
          )}
        </div>

        {/* Employee Select */}
        <div className="w-full md:w-52">
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">جميع الموظفين ({employees.length})</option>
            {employees.map(emp => (
              <option key={emp} value={emp}>{emp}</option>
            ))}
          </select>
        </div>

        {/* Month Select */}
        <div className="w-full md:w-52">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">جميع الأشهر ({months.length})</option>
            {months.map(m => (
              <option key={m.key} value={m.key}>{m.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Table of Saturday Attendances */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
                <th className="py-3.5 px-4 w-14 text-center">م</th>
                <th className="py-3.5 px-4">اسم الموظف المناوب</th>
                <th className="py-3.5 px-4">يوم وتاريخ النوبتجية</th>
                <th className="py-3.5 px-4">طبيعة المهمة والملاحظات</th>
                <th className="py-3.5 px-4 w-28 text-center no-print">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-xs">
              {filteredAttendances.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    لا توجد سجلات مطابقة لمعايير البحث الحالية
                  </td>
                </tr>
              ) : (
                filteredAttendances.map((item, idx) => {
                  const dateObj = parseTaskDate(item.date);
                  return (
                    <tr 
                      key={item.id} 
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="py-3 px-4 text-center text-slate-400 font-mono">
                        {item.id}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
                            {item.employee.charAt(0)}
                          </span>
                          <span>{item.employee}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-semibold text-[11px] border border-amber-200 dark:border-amber-800">
                            السبت
                          </span>
                          <span>{formatArabicDate(dateObj)}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({item.date})</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {item.notes ? (
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 font-medium">
                            {item.notes}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">حضور نوبتجية سبت اعتيادية</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center no-print">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              if (!currentUser.canEdit) {
                                onTriggerLogin?.(`تعديل نوبتجية ${item.employee}`);
                              } else {
                                handleOpenEdit(item);
                              }
                            }}
                            className={`p-1.5 rounded-lg transition-colors ${
                              currentUser.canEdit 
                                ? 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40' 
                                : 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                            }`}
                            title={currentUser.canEdit ? "تعديل النوبتجية" : "تسجيل الدخول لتعديل النوبتجية"}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => {
                              if (!currentUser.canDelete) {
                                onTriggerLogin?.(`حذف نوبتجية ${item.employee}`);
                              } else {
                                if (window.confirm(`هل أنت متأكد من حذف نوبتجية ${item.employee} بتاريخ ${item.date}؟`)) {
                                  onDeleteAttendance(item.id);
                                }
                              }
                            }}
                            className={`p-1.5 rounded-lg transition-colors ${
                              currentUser.canDelete 
                                ? 'text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40' 
                                : 'text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                            }`}
                            title={currentUser.canDelete ? "حذف النوبتجية" : "تسجيل الدخول لحذف النوبتجية"}
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

        {/* Footer info */}
        <div className="p-4 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500 flex items-center justify-between">
          <span>إجمالي السجلات المعروضة: {filteredAttendances.length}</span>
          <span className="font-mono text-[11px]">محدث وفق نظام التشغيل المعتمد</span>
        </div>
      </div>

      {/* 4. Modal for Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <span>{editingItem ? 'تعديل نوبتجية السبت' : 'إضافة نوبتجية سبت جديدة'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-right">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  اسم الموظف المناوب <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.employee}
                  onChange={(e) => setFormData({ ...formData, employee: e.target.value })}
                  placeholder="مثال: أمير طلعت / محمد حنفي / شيماء..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  تاريخ يوم السبت <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ملاحظات أو موقع العمل
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="مثال: حضور سبت نوبتجية غرفة السيرفرات والبصمة"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all"
                >
                  {editingItem ? 'حفظ التعديلات' : 'إضافة النوبتجية'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

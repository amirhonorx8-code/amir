import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Trash2, 
  AlertTriangle, 
  Calendar, 
  Building, 
  User, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Volume2
} from 'lucide-react';
import { Task, EmployeeLeave, LeaveType, PrayerTimes, DirectoryEntry, MedicalNetworkEntry } from '../types';
import { 
  getArabicDay, 
  parseTaskDate, 
  toInputDateFormat, 
  formatArabicDate,
  getLeaveTypeBadgeClass
} from '../utils/helpers';

/* ----------------------------------------------------
 * 1. Task Modal (Add / Edit)
 * ---------------------------------------------------- */
interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'number'> & { id?: number }) => void;
  initialTask?: Task | null;
  departments: string[];
  technicians: string[];
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask,
  departments,
  technicians,
}) => {
  const [dateStr, setDateStr] = useState<string>('');
  const [dayStr, setDayStr] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [technician, setTechnician] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [done, setDone] = useState<boolean>(true);

  useEffect(() => {
    if (initialTask) {
      const formattedDate = toInputDateFormat(initialTask.date);
      setDateStr(formattedDate);
      setDayStr(initialTask.day || getArabicDay(formattedDate));
      setDepartment(initialTask.department || '');
      setTechnician(initialTask.technician || '');
      setDescription(initialTask.description || '');
      setNotes(initialTask.notes || '');
      setDone(initialTask.done !== false);
    } else {
      const today = new Date();
      const todayFormatted = toInputDateFormat(today);
      setDateStr(todayFormatted);
      setDayStr(getArabicDay(today));
      setDepartment('');
      setTechnician('');
      setDescription('');
      setNotes('');
      setDone(true);
    }
  }, [initialTask, isOpen]);

  // When date changes, auto update day name in Arabic (Phase 5)
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDateStr(val);
    if (val) {
      setDayStr(getArabicDay(val));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    onSave({
      id: initialTask ? initialTask.id : undefined,
      date: dateStr ? formatArabicDate(dateStr) : initialTask?.date || '11 Aug 2026',
      day: dayStr,
      department: department.trim(),
      technician: technician.trim(),
      description: description.trim(),
      notes: notes.trim(),
      done,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1F3A5F] to-[#132743] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛠️</span>
            <h3 className="font-bold text-base">
              {initialTask ? 'تعديل مهمة دعم فني' : 'إضافة مهمة جديدة'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto text-xs">
          {/* Date & Day */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span>التاريخ:</span>
                <span className="text-slate-400 font-normal">(اختياري)</span>
              </label>
              <input
                type="date"
                value={dateStr}
                onChange={handleDateChange}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                <span>اليوم:</span>
                <span className="text-slate-400 font-normal">(اختياري)</span>
              </label>
              <input
                type="text"
                list="day-suggestions"
                value={dayStr}
                onChange={(e) => setDayStr(e.target.value)}
                placeholder="مثال: الأحد"
                className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <datalist id="day-suggestions">
                {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map((d, i) => (
                  <option key={i} value={d} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Department with Datalist Suggestions */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-blue-500" />
              <span>الإدارة / الجهة:</span>
              <span className="text-slate-400 font-normal">(اختياري)</span>
            </label>
            <input
              type="text"
              list="department-suggestions"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="اختر أو اكتب اسم الإدارة / الفرع..."
              className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <datalist id="department-suggestions">
              {departments.map((d, i) => (
                <option key={i} value={d} />
              ))}
            </datalist>
          </div>

          {/* Responsible Engineer with Datalist Suggestions */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-blue-500" />
              <span>المهندس المسؤول:</span>
              <span className="text-slate-400 font-normal">(اختياري)</span>
            </label>
            <input
              type="text"
              list="technician-suggestions"
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
              placeholder="اختر أو اكتب اسم المهندس المسؤول..."
              className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <datalist id="technician-suggestions">
              {technicians.map((t, i) => (
                <option key={i} value={t} />
              ))}
            </datalist>
          </div>

          {/* Task Description */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              <span>بيان المهمة والإجراء المنفذ:</span>
              <span className="text-slate-400 font-normal">(اختياري)</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب تفاصيل العطل أو الإجراء (مثال: تفعيل برنامج النافذة، إضافة بصمة...)"
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-200">
              ملاحظات إضافية (أرقام بصمات، إيميلات، استكمال...):
              <span className="text-slate-400 font-normal mr-1">(اختياري)</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: رقم 3453 أو قيد التنفيذ..."
              className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Checkbox */}
          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="task-done-checkbox"
              checked={done}
              onChange={(e) => setDone(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
            />
            <label htmlFor="task-done-checkbox" className="font-bold text-slate-700 dark:text-slate-200 cursor-pointer">
              تم إنجاز المهمة بالكامل (منجز)
            </label>
          </div>

          {/* Buttons */}
          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-5 py-2 rounded-xl flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>{initialTask ? 'حفظ التعديلات' : 'إضافة المهمة'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


/* ----------------------------------------------------
 * 2. Leave / Mission Modal (Add / Edit)
 * ---------------------------------------------------- */
interface LeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (leaveData: Omit<EmployeeLeave, 'id'> & { id?: string }) => void;
  initialLeave?: EmployeeLeave | null;
  employees: string[];
  recentLeaves?: EmployeeLeave[];
}

export const LeaveModal: React.FC<LeaveModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialLeave,
  employees,
  recentLeaves,
}) => {
  const [employee, setEmployee] = useState<string>('');
  const [leaveType, setLeaveType] = useState<LeaveType>('إجازة اعتيادي');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [daysCount, setDaysCount] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (initialLeave) {
      setEmployee(initialLeave.employee || '');
      setLeaveType(initialLeave.leaveType || 'إجازة اعتيادي');
      setStartDate(initialLeave.startDate || '');
      setEndDate(initialLeave.endDate || initialLeave.startDate || '');
      setDaysCount(initialLeave.daysCount || 1);
      setNotes(initialLeave.notes || '');
    } else {
      const today = toInputDateFormat(new Date());
      setEmployee('');
      setLeaveType('إجازة اعتيادي');
      setStartDate(today);
      setEndDate(today);
      setDaysCount(1);
      setNotes('');
    }
  }, [initialLeave, isOpen]);

  // Recalculate days count on date change
  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    const end = endDate || val;
    calculateDays(val, end);
  };

  const handleEndDateChange = (val: string) => {
    setEndDate(val);
    const start = startDate || val;
    calculateDays(start, val);
  };

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) {
      setDaysCount(1);
      return;
    }
    const d1 = parseTaskDate(start);
    const d2 = parseTaskDate(end);
    const diff = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    setDaysCount(Math.max(1, diff));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee.trim()) return;

    onSave({
      id: initialLeave ? initialLeave.id : undefined,
      employee: employee.trim(),
      leaveType,
      startDate,
      endDate: endDate || startDate,
      daysCount,
      notes: notes.trim(),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col"
      >
        <div className="bg-gradient-to-r from-[#1F3A5F] to-[#132743] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <h3 className="font-bold text-base">
              {initialLeave ? 'تعديل سجل إجازة / إذن' : 'إضافة سجل إجازة أو إذن أو مأمورية'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Employee Name with suggestions */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-200">
              اسم الموظف: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              list="employee-suggestions-list"
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
              placeholder="مثال: أمير طلعت، شيماء عبدالحميد، محمد حنفى..."
              className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <datalist id="employee-suggestions-list">
              {employees.map((e, i) => (
                <option key={i} value={e} />
              ))}
            </datalist>
          </div>

          {/* Leave Type */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-200">
              النوع:
            </label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as LeaveType)}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
            >
              <option value="إجازة اعتيادي">إجازة اعتيادي</option>
              <option value="إجازة عارضة">إجازة عارضة</option>
              <option value="إذن صباحى">إذن صباحى</option>
              <option value="إذن مسائى">إذن مسائى</option>
              <option value="مأمورية">مأمورية عمل</option>
              <option value="حضور سبت">حضور سبت (نوبتجية)</option>
            </select>
          </div>

          {/* Dates: From & To */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-200">
                من تاريخ:
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-200">
                إلى تاريخ:
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Calculated Days Count */}
          <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-200 dark:border-slate-600 flex items-center justify-between">
            <span className="font-bold text-slate-700 dark:text-slate-200">إجمالي عدد الأيام المحسوبة:</span>
            <span className="text-base font-black text-blue-600 dark:text-blue-400 font-mono">
              {daysCount} {daysCount === 1 ? 'يوم' : 'أيام'}
            </span>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-200">
              ملاحظات أو سبب الإجازة:
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: ظرف شخصي، مأمورية دعم لفرع الإسكندرية..."
              className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Recent 3 Actions in Add Leave Log */}
          {recentLeaves && recentLeaves.length > 0 && !initialLeave && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                  آخر 3 إجراءات مسجلة في سجل الإجازات:
                </span>
                <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                  آخر 3 فقط
                </span>
              </div>
              <div className="space-y-1.5">
                {recentLeaves.slice(0, 3).map((item, idx) => (
                  <div 
                    key={item.id || idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-[11px]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-100">{item.employee}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getLeaveTypeBadgeClass(item.leaveType)}`}>
                        {item.leaveType}
                      </span>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-[10px]">
                      {formatArabicDate(item.startDate)} • {item.daysCount} {item.daysCount === 1 ? 'يوم' : 'أيام'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-5 py-2 rounded-xl flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>حفظ السجل</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


/* ----------------------------------------------------
 * 3. Delete Confirmation Modal (Phase 9)
 * ---------------------------------------------------- */
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemTitle: string;
  itemType?: 'task' | 'leave' | 'directory' | 'medical';
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemTitle,
  itemType = 'task',
}) => {
  if (!isOpen) return null;

  const getItemTypeName = () => {
    switch (itemType) {
      case 'task': return 'هذه المهمة';
      case 'leave': return 'هذا السجل';
      case 'directory': return 'هذه التحويلة الهاتفية';
      case 'medical': return 'هذه الجهة الطبية';
      default: return 'هذا العنصر';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4"
      >
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto">
          <Trash2 className="w-6 h-6" />
        </div>

        <div className="text-center space-y-1">
          <h3 className="font-black text-slate-900 dark:text-white text-base">تأكيد الحذف</h3>
          <p className="text-xs text-slate-500">
            هل أنت متأكد من حذف {getItemTypeName()}؟
          </p>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/60 p-2 rounded-lg truncate">
            {itemTitle}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold"
          >
            إلغاء
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md"
          >
            نعم، احذف
          </button>
        </div>
      </div>
    </div>
  );
};


/* ----------------------------------------------------
 * 4. Urgent Memo Modal (Phase 30)
 * ---------------------------------------------------- */
interface UrgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  urgentText: string;
  urgentActive: boolean;
  onSave: (text: string, active: boolean) => void;
}

export const UrgentModal: React.FC<UrgentModalProps> = ({
  isOpen,
  onClose,
  urgentText,
  urgentActive,
  onSave,
}) => {
  const [text, setText] = useState<string>(urgentText);
  const [active, setActive] = useState<boolean>(urgentActive);

  useEffect(() => {
    setText(urgentText);
    setActive(urgentActive);
  }, [urgentText, urgentActive, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
      >
        <div className="bg-red-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-300 animate-alert-pulse" />
            <h3 className="font-bold text-base">تنبيه عاجل وشريط متحرك</h3>
          </div>
          <button onClick={onClose} className="p-1 text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300">
            اكتب نص التنبيه العاجل الذي سيظهر في الشريط الأحمر المتحرك أعلى الصفحة لجميع المستخدمين:
          </p>

          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="مثال: تنبيه هام: سيتم إيقاف خوادم فرع الإسكندرية للصيانة الدورية اليوم الساعة 3 عصراً..."
            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
          />

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="urgent-active-checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
            />
            <label htmlFor="urgent-active-checkbox" className="font-bold text-slate-700 dark:text-slate-200 cursor-pointer">
              تفعيل التنبيه العاجل والشريط المتحرك الآن
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 font-bold"
            >
              إلغاء
            </button>
            <button
              onClick={() => {
                onSave(text.trim(), active);
                onClose();
              }}
              className="bg-red-700 hover:bg-red-600 text-white font-black px-5 py-2 rounded-xl flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>حفظ التنبيه</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


/* ----------------------------------------------------
 * 5. General Memo Modal (نوت للتذكير الدائم 📌)
 * ---------------------------------------------------- */
interface MemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  memoText: string;
  onSave: (text: string) => void;
}

export const MemoModal: React.FC<MemoModalProps> = ({
  isOpen,
  onClose,
  memoText,
  onSave,
}) => {
  const [text, setText] = useState<string>(memoText);

  useEffect(() => {
    setText(memoText);
  }, [memoText, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-amber-700 to-amber-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📌</span>
            <h3 className="font-black text-base">نوت للتذكير 📌 (تذكير دائم)</h3>
          </div>
          <button onClick={onClose} className="p-1 text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-center font-bold">
            مش هيتقفل لوحده — يفضل محفوظ لحد ما تمسحه بنفسك
          </div>

          <textarea
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="اكتب رسالة التذكير أو المهام الطارئة التي تريد تثبيتها هنا..."
            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
          />

          <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={() => {
                setText('');
                onSave('');
                onClose();
              }}
              className="px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900 font-bold"
            >
              مسح التذكير
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  onSave(text.trim());
                  onClose();
                }}
                className="bg-amber-700 hover:bg-amber-600 text-white font-black px-5 py-2 rounded-xl flex items-center gap-1.5 shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التذكير</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


/* ----------------------------------------------------
 * 6. Prayer Times Modal (Phase 38, 39, 40)
 * ---------------------------------------------------- */
interface PrayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  prayerTimes: PrayerTimes;
  onSave: (times: { fajr: string; dhuhr: string; asr: string; maghrib: string; isha: string }) => void;
  onTestAlert: () => void;
}

export const PrayerModal: React.FC<PrayerModalProps> = ({
  isOpen,
  onClose,
  prayerTimes,
  onSave,
  onTestAlert,
}) => {
  const [fajr, setFajr] = useState<string>(prayerTimes.fajr || '05:06');
  const [dhuhr, setDhuhr] = useState<string>(prayerTimes.dhuhr || '12:53');
  const [asr, setAsr] = useState<string>(prayerTimes.asr || '16:27');
  const [maghrib, setMaghrib] = useState<string>(prayerTimes.maghrib || '19:12');
  const [isha, setIsha] = useState<string>(prayerTimes.isha || '20:31');

  useEffect(() => {
    setFajr(prayerTimes.fajr || '05:06');
    setDhuhr(prayerTimes.dhuhr || '12:53');
    setAsr(prayerTimes.asr || '16:27');
    setMaghrib(prayerTimes.maghrib || '19:12');
    setIsha(prayerTimes.isha || '20:31');
  }, [prayerTimes, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
      >
        <div className="bg-emerald-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🕌</span>
            <h3 className="font-bold text-base">مواعيد الصلاة (القاهرة)</h3>
          </div>
          <button onClick={onClose} className="p-1 text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300">
            تُظهر المنظومة تنبيهاً مرئياً على الشاشة فور حلول موعد الأذان:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-200">
                الفجر:
              </label>
              <input
                type="text"
                value={fajr}
                onChange={(e) => setFajr(e.target.value)}
                placeholder="05:06"
                className="w-full h-9 px-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-200">
                الظهر:
              </label>
              <input
                type="text"
                value={dhuhr}
                onChange={(e) => setDhuhr(e.target.value)}
                placeholder="12:53"
                className="w-full h-9 px-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-200">
                العصر:
              </label>
              <input
                type="text"
                value={asr}
                onChange={(e) => setAsr(e.target.value)}
                placeholder="16:27"
                className="w-full h-9 px-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-200">
                المغرب:
              </label>
              <input
                type="text"
                value={maghrib}
                onChange={(e) => setMaghrib(e.target.value)}
                placeholder="19:12"
                className="w-full h-9 px-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-slate-700 dark:text-slate-200">
                العشاء:
              </label>
              <input
                type="text"
                value={isha}
                onChange={(e) => setIsha(e.target.value)}
                placeholder="20:31"
                className="w-full h-9 px-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onTestAlert();
              onClose();
            }}
            className="w-full py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-100"
          >
            <Volume2 className="w-4 h-4" />
            <span>تجربة تنبيه الأذان (لمدة دقيقتين)</span>
          </button>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 font-bold"
            >
              إلغاء
            </button>
            <button
              onClick={() => {
                onSave({
                  fajr: fajr.trim(),
                  dhuhr: dhuhr.trim(),
                  asr: asr.trim(),
                  maghrib: maghrib.trim(),
                  isha: isha.trim()
                });
                onClose();
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-5 py-2 rounded-xl flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>حفظ المواعيد</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


/* ----------------------------------------------------
 * 7. Directory Modal (Add / Edit)
 * ---------------------------------------------------- */
interface DirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<DirectoryEntry, 'id'> & { id?: number }) => void;
  initialEntry?: DirectoryEntry | null;
}

export const DirectoryModal: React.FC<DirectoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialEntry,
}) => {
  const [code, setCode] = useState('');
  const [department, setDepartment] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    if (initialEntry) {
      setCode(initialEntry.code || '');
      setDepartment(initialEntry.department || '');
      setName(initialEntry.name || '');
    } else {
      setCode('');
      setDepartment('');
      setName('');
    }
  }, [initialEntry, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !department.trim()) return;

    onSave({
      id: initialEntry ? initialEntry.id : undefined,
      code: code.trim(),
      department: department.trim(),
      name: name.trim(),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col"
      >
        <div className="bg-[#1F3A5F] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📞</span>
            <h3 className="font-bold text-base">
              {initialEntry ? 'تعديل تحويلة داخلية' : 'إضافة تحويلة هاتفية جديدة'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-200">
              كود التحويلة: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="مثال: 1231 أو 1110..."
              className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
              dir="ltr"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-200">
              الإدارة / القطاع: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="مثال: الشبكات والصيانة، العلاقات العامة..."
              className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-200">
              اسم المسؤول / المنصب:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: م. محمد فايز، أ. أمير..."
              className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 font-bold"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-black px-5 py-2 rounded-xl flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>حفظ التحويلة</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


/* ----------------------------------------------------
 * 8. Medical Network Modal (Add / Edit)
 * ---------------------------------------------------- */
interface MedicalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<MedicalNetworkEntry, 'id'> & { id?: number }) => void;
  initialEntry?: MedicalNetworkEntry | null;
}

export const MedicalModal: React.FC<MedicalModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialEntry,
}) => {
  const [governorate, setGovernorate] = useState('القاهرة');
  const [providerName, setProviderName] = useState('');
  const [area, setArea] = useState('');
  const [networkType, setNetworkType] = useState('B');
  const [specialty, setSpecialty] = useState('جميع التخصصات');
  const [providerType, setProviderType] = useState('مستشفي');
  const [address, setAddress] = useState('');
  const [telephone, setTelephone] = useState('');

  useEffect(() => {
    if (initialEntry) {
      setGovernorate(initialEntry.governorate || 'القاهرة');
      setProviderName(initialEntry.providerName || '');
      setArea(initialEntry.area || '');
      setNetworkType(initialEntry.networkType || 'B');
      setSpecialty(initialEntry.specialty || 'جميع التخصصات');
      setProviderType(initialEntry.providerType || 'مستشفي');
      setAddress(initialEntry.address || '');
      setTelephone(initialEntry.telephone || '');
    } else {
      setGovernorate('القاهرة');
      setProviderName('');
      setArea('');
      setNetworkType('B');
      setSpecialty('جميع التخصصات');
      setProviderType('مستشفي');
      setAddress('');
      setTelephone('');
    }
  }, [initialEntry, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerName.trim() || !governorate.trim()) return;

    onSave({
      id: initialEntry ? initialEntry.id : undefined,
      governorate: governorate.trim(),
      providerName: providerName.trim(),
      area: area.trim(),
      networkType,
      specialty: specialty.trim(),
      providerType,
      address: address.trim(),
      telephone: telephone.trim(),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="bg-rose-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏥</span>
            <h3 className="font-bold text-base">
              {initialEntry ? 'تعديل بيانات الجهة الطبية' : 'إضافة جهة طبية للشبكة المعتمدة'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-200">
                المحافظة: <span className="text-red-500">*</span>
              </label>
              <select
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="القاهرة">القاهرة</option>
                <option value="الجيزة">الجيزة</option>
                <option value="الاسكندرية">الإسكندرية</option>
                <option value="القليوبية">القليوبية</option>
                <option value="الشرقية">الشرقية</option>
                <option value="الدقهلية">الدقهلية</option>
                <option value="البحيرة">البحيرة</option>
                <option value="المنوفية">المنوفية</option>
                <option value="الغربية">الغربية</option>
                <option value="كفر الشيخ">كفر الشيخ</option>
                <option value="دمياط">دمياط</option>
                <option value="السويس">السويس</option>
                <option value="بورسعيد">بورسعيد</option>
                <option value="الاسماعيلية">الإسماعيلية</option>
                <option value="بني سويف">بني سويف</option>
                <option value="الفيوم">الفيوم</option>
                <option value="المنيا">المنيا</option>
                <option value="اسيوط">أسيوط</option>
                <option value="سوهاج">سوهاج</option>
                <option value="قنا">قنا</option>
                <option value="الاقصر">الأقصر</option>
                <option value="اسوان">أسوان</option>
                <option value="البحر الاحمر">البحر الأحمر</option>
                <option value="شمال سيناء">شمال سيناء</option>
                <option value="جنوب سيناء">جنوب سيناء</option>
                <option value="مرسي مطروح">مطروح</option>
                <option value="الوادي الجديد">الوادي الجديد</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-200">
                نوع الخدمة:
              </label>
              <select
                value={providerType}
                onChange={(e) => setProviderType(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-semibold"
              >
                <option value="مستشفي">مستشفى</option>
                <option value="صيدليه">صيدلية</option>
                <option value="معمل تحاليل">معمل تحاليل</option>
                <option value="مركز اشعه">مركز أشعة</option>
                <option value="مركز متخصص">مركز أسنان / تخصصي</option>
                <option value="مركز طبي">مركز طبي / عيادات</option>
                <option value="بصريات">مركز بصريات ونظارات</option>
                <option value="طبيب">طبيب استشاري</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-200">
              اسم الجهة / الطبيب: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
              placeholder="مثال: مستشفى كليوباترا، معامل الفا..."
              className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-200">
                المنطقة / الحي:
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="مثال: مصر الجديدة، المهندسين..."
                className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-200">
                فئة الشبكة:
              </label>
              <select
                value={networkType}
                onChange={(e) => setNetworkType(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="A+">فئة A+ (VIP)</option>
                <option value="A">فئة A</option>
                <option value="B">فئة B</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-200">
              التخصص:
            </label>
            <input
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="مثال: جميع التخصصات، جراحة عظام، أطفال..."
              className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-200">
              العنوان التفصيلي:
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="مثال: 39 شارع كليوباترا ميدان صلاح الدين"
              className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-200">
              رقم الهاتف / الخط الساخن:
            </label>
            <input
              type="text"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="مثال: 19668 أو 0224143931..."
              className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
              dir="ltr"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 font-bold"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="bg-rose-600 hover:bg-rose-500 text-white font-black px-5 py-2 rounded-xl flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>حفظ الجهة الطبية</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};


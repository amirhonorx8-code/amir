import React, { useState, useRef } from 'react';
import { 
  Download, 
  Upload, 
  Database, 
  FileSpreadsheet, 
  FileCode, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  HardDrive,
  ShieldCheck,
  FolderArchive
} from 'lucide-react';
import { Task, DirectoryEntry, MedicalNetworkEntry, SaturdayAttendance, EmployeeLeave } from '../types';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  directory: DirectoryEntry[];
  medicalNetwork: MedicalNetworkEntry[];
  saturdayAttendances: SaturdayAttendance[];
  leaves: EmployeeLeave[];
  nightShifts?: string[];
  onImportFullBackup: (data: {
    tasks?: Task[];
    directory?: DirectoryEntry[];
    medicalNetwork?: MedicalNetworkEntry[];
    saturdayAttendances?: SaturdayAttendance[];
    leaves?: EmployeeLeave[];
    nightShifts?: string[];
  }) => void;
  onResetToDefaults: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  tasks,
  directory,
  medicalNetwork,
  saturdayAttendances,
  leaves,
  nightShifts = [],
  onImportFullBackup,
  onResetToDefaults
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'export' | 'import'>('export');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Helper to trigger direct browser download
  const downloadFile = (content: string, filename: string, type: 'json' | 'csv') => {
    const mime = type === 'json' ? 'application/json;charset=utf-8;' : 'text/csv;charset=utf-8;';
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toCSV = (items: any[], headers: string[], keys: string[]) => {
    const escapeVal = (val: any) => {
      if (val === null || val === undefined) return '""';
      const s = String(val).replace(/"/g, '""');
      return '"' + s + '"';
    };
    const headerRow = '\uFEFF' + headers.map(escapeVal).join(',');
    const rows = items.map(item => keys.map(k => escapeVal(item[k])).join(','));
    return [headerRow, ...rows].join('\r\n');
  };

  // Export handlers
  const handleExportTasks = (format: 'json' | 'csv') => {
    if (format === 'json') {
      downloadFile(JSON.stringify(tasks, null, 2), `tasks_export_${new Date().toISOString().split('T')[0]}.json`, 'json');
    } else {
      const csv = toCSV(
        tasks,
        ['م', 'اليوم', 'التاريخ', 'الإدارة / القسم', 'وصف المهمة', 'الحالة', 'المهندس المسؤول', 'ملاحظات'],
        ['number', 'day', 'date', 'department', 'description', 'done', 'technician', 'notes']
      );
      downloadFile(csv, `tasks_export_${new Date().toISOString().split('T')[0]}.csv`, 'csv');
    }
  };

  const handleExportDirectory = (format: 'json' | 'csv') => {
    if (format === 'json') {
      downloadFile(JSON.stringify(directory, null, 2), `directory_export_${new Date().toISOString().split('T')[0]}.json`, 'json');
    } else {
      const csv = toCSV(
        directory,
        ['الكود / التحويلة', 'الإدارة / القطاع', 'الاسم / المنصب'],
        ['code', 'department', 'name']
      );
      downloadFile(csv, `directory_export_${new Date().toISOString().split('T')[0]}.csv`, 'csv');
    }
  };

  const handleExportMedical = (format: 'json' | 'csv') => {
    if (format === 'json') {
      downloadFile(JSON.stringify(medicalNetwork, null, 2), `medical_network_export_${new Date().toISOString().split('T')[0]}.json`, 'json');
    } else {
      const csv = toCSV(
        medicalNetwork,
        ['كود', 'المحافظة', 'اسم الجهة / الطبيب', 'المنطقة', 'فئة الشبكة', 'الفرع', 'التخصص', 'النوع', 'العنوان', 'الهاتف'],
        ['providerId', 'governorate', 'providerName', 'area', 'networkType', 'mainBranch', 'specialty', 'providerType', 'address', 'telephone']
      );
      downloadFile(csv, `medical_network_export_${new Date().toISOString().split('T')[0]}.csv`, 'csv');
    }
  };

  const handleExportSaturday = (format: 'json' | 'csv') => {
    if (format === 'json') {
      downloadFile(JSON.stringify(saturdayAttendances, null, 2), `saturday_attendances_${new Date().toISOString().split('T')[0]}.json`, 'json');
    } else {
      const csv = toCSV(
        saturdayAttendances,
        ['م', 'الموظف', 'التاريخ', 'الملاحظات'],
        ['id', 'employee', 'date', 'notes']
      );
      downloadFile(csv, `saturday_attendances_${new Date().toISOString().split('T')[0]}.csv`, 'csv');
    }
  };

  const handleExportLeaves = (format: 'json' | 'csv') => {
    if (format === 'json') {
      downloadFile(JSON.stringify(leaves, null, 2), `employee_leaves_${new Date().toISOString().split('T')[0]}.json`, 'json');
    } else {
      const csv = toCSV(
        leaves,
        ['الموظف', 'نوع الإجازة', 'تاريخ البدء', 'تاريخ الانتهاء', 'عدد الأيام', 'ملاحظات'],
        ['employee', 'leaveType', 'startDate', 'endDate', 'daysCount', 'notes']
      );
      downloadFile(csv, `employee_leaves_${new Date().toISOString().split('T')[0]}.csv`, 'csv');
    }
  };

  const handleExportFullBackup = () => {
    const fullBackup = {
      version: '2.5',
      exportedAt: new Date().toISOString(),
      source: 'IT Support Task Log System',
      counts: {
        tasks: tasks.length,
        directory: directory.length,
        medicalNetwork: medicalNetwork.length,
        saturdayAttendances: saturdayAttendances.length,
        leaves: leaves.length,
        nightShifts: nightShifts.length
      },
      tasks,
      directory,
      medicalNetwork,
      saturdayAttendances,
      leaves,
      nightShifts
    };
    downloadFile(JSON.stringify(fullBackup, null, 2), `full_system_backup_${new Date().toISOString().split('T')[0]}.json`, 'json');
  };

  // Handle File Import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportStatus(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        // Check format: is it full backup or single table array?
        if (parsed && typeof parsed === 'object') {
          if (Array.isArray(parsed)) {
            // Check if it's tasks, directory, or medical
            if (parsed.length > 0 && 'department' in parsed[0] && 'description' in parsed[0]) {
              onImportFullBackup({ tasks: parsed });
              setImportStatus(`تم بنجاح استيراد ${parsed.length} مهمة`);
            } else if (parsed.length > 0 && 'code' in parsed[0] && 'department' in parsed[0]) {
              onImportFullBackup({ directory: parsed });
              setImportStatus(`تم بنجاح استيراد ${parsed.length} رقم تحويلة`);
            } else if (parsed.length > 0 && 'providerName' in parsed[0]) {
              onImportFullBackup({ medicalNetwork: parsed });
              setImportStatus(`تم بنجاح استيراد ${parsed.length} جهة طبية`);
            } else {
              setImportError('الملف لا يحتوي على صيغة مألوفة لأي من الجداول.');
            }
          } else if (parsed.tasks || parsed.directory || parsed.medicalNetwork || parsed.saturdayAttendances || parsed.leaves || parsed.nightShifts) {
            // Full backup format
            onImportFullBackup(parsed);
            const counts = [
              parsed.tasks?.length ? `${parsed.tasks.length} مهمة` : '',
              parsed.directory?.length ? `${parsed.directory.length} تحويلة` : '',
              parsed.medicalNetwork?.length ? `${parsed.medicalNetwork.length} جهة طبية` : '',
              parsed.saturdayAttendances?.length ? `${parsed.saturdayAttendances.length} نوبتجية سبت` : '',
              parsed.leaves?.length ? `${parsed.leaves.length} إجازة` : '',
              parsed.nightShifts?.length ? `${parsed.nightShifts.length} يوم سهر` : ''
            ].filter(Boolean).join('، ');
            setImportStatus(`تم بنجاح استرجاع النسخة الاحتياطية الشاملة (${counts})`);
          } else {
            setImportError('ملف النسخة الاحتياطية غير صالح.');
          }
        }
      } catch (err: any) {
        setImportError(`خطأ في قراءة ملف JSON: ${err.message}`);
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-150 text-right flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
              <Database className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                مركز إدارة وتصدير البيانات والنسخ الاحتياطي
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                تحويل الجداول لملفات مستقلة (JSON / CSV)، والاحتفاظ بنسخ احتياطية شاملة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 my-4 shrink-0">
          <button
            onClick={() => setActiveSubTab('export')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeSubTab === 'export'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>تصدير وتحميل الملفات (JSON / CSV)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('import')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeSubTab === 'import'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>استرجاع نسخة احتياطية (Restore)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto space-y-4 pr-1 pl-1 flex-1">
          {activeSubTab === 'export' ? (
            <div className="space-y-4">
              {/* Master Full Backup Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-l from-indigo-900 to-slate-900 text-white border border-indigo-700/40 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <FolderArchive className="w-5 h-5 text-indigo-400" />
                      <h3 className="font-bold text-sm">النسخة الاحتياطية الشاملة لجميع الجداول</h3>
                    </div>
                    <p className="text-xs text-indigo-200 mt-1">
                      ملف JSON كامل يضم المهام ({tasks.length})، دليل الهاتف ({directory.length})، الشبكة الطبية ({medicalNetwork.length})، نوبتجيات السبت ({saturdayAttendances.length})، الإجازات ({leaves.length})، وأيام السهر ({nightShifts.length}).
                    </p>
                  </div>
                  <button
                    onClick={handleExportFullBackup}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-xs font-bold shadow-md transition-all shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>تحميل النسخة الشاملة (JSON)</span>
                  </button>
                </div>
              </div>

              {/* Individual Tables Grid */}
              <div className="grid grid-cols-1 gap-3">
                {/* 1. Tasks */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                      <span>📋 سجل المهام الفنية (Tasks Table)</span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-[10px]">
                        {tasks.length} مهمة
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      الأقسام، وصف العطل، الفني المسؤول، التواريخ، وحالة الإنجاز
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleExportTasks('json')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-all shadow-sm"
                    >
                      <FileCode className="w-3.5 h-3.5 text-amber-500" />
                      <span>JSON</span>
                    </button>
                    <button
                      onClick={() => handleExportTasks('csv')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Excel (CSV)</span>
                    </button>
                  </div>
                </div>

                {/* 2. Directory */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                      <span>☎️ دليل الهواتف والتحويلات الداخلية (Directory)</span>
                      <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 text-[10px]">
                        {directory.length} تحويلة
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      الإدارات المركزية، الفروع، والمكاتب الفنية
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleExportDirectory('json')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-all shadow-sm"
                    >
                      <FileCode className="w-3.5 h-3.5 text-amber-500" />
                      <span>JSON</span>
                    </button>
                    <button
                      onClick={() => handleExportDirectory('csv')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Excel (CSV)</span>
                    </button>
                  </div>
                </div>

                {/* 3. Medical Network */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                      <span>🏥 الشبكة الطبية والجهات العلاجية (Medical Network)</span>
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 text-[10px]">
                        {medicalNetwork.length} جهة
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      المستشفيات، المعامل، المراكز الطبية، الصيدليات، وأرقام الطوارئ
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleExportMedical('json')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-all shadow-sm"
                    >
                      <FileCode className="w-3.5 h-3.5 text-amber-500" />
                      <span>JSON</span>
                    </button>
                    <button
                      onClick={() => handleExportMedical('csv')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Excel (CSV)</span>
                    </button>
                  </div>
                </div>

                {/* 4. Saturday Attendance */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                      <span>📅 كشف نوبتجيات وتشغيل السبت (Saturday Attendances)</span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-[10px]">
                        {saturdayAttendances.length} نوبتجية
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      جدول تشغيل السبت ومناوبات الموظفين المعتمدة
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleExportSaturday('json')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-all shadow-sm"
                    >
                      <FileCode className="w-3.5 h-3.5 text-amber-500" />
                      <span>JSON</span>
                    </button>
                    <button
                      onClick={() => handleExportSaturday('csv')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Excel (CSV)</span>
                    </button>
                  </div>
                </div>

                {/* 5. Leaves */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                      <span>🏖️ إجازات وأذونات العاملين (Leaves & Permissions)</span>
                      <span className="px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 text-[10px]">
                        {leaves.length} سجل
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      الإجازات الاعتيادية، العارضة، والأذونات الصباحية والمسائية
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleExportLeaves('json')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-all shadow-sm"
                    >
                      <FileCode className="w-3.5 h-3.5 text-amber-500" />
                      <span>JSON</span>
                    </button>
                    <button
                      onClick={() => handleExportLeaves('csv')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Excel (CSV)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Import Upload Area */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="p-8 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-900/30"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept=".json" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
                <Upload className="w-10 h-10 text-indigo-500 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  اضغط لاختيار ملف نسخة احتياطية (JSON)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  يمكنك استيراد ملف النسخة الشاملة (Full Backup) أو ملف جدول منفصل (Tasks/Directory/Medical)
                </p>
              </div>

              {/* Status or Error alerts */}
              {importStatus && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{importStatus}</span>
                </div>
              )}

              {importError && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              {/* Reset to Defaults button */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">إعادة تعيين البيانات للمصدر الأصلي</h4>
                  <p className="text-[11px] text-slate-500">استرجاع بيانات قاعدة البيانات المستخرجة الأصلية</p>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('هل أنت متأكد من إعادة ضبط البيانات إلى القيم المستخرجة الأصلية؟')) {
                      onResetToDefaults();
                      setImportStatus('تمت إعادة تعيين البيانات بنجاح إلى النسخة الأصلية.');
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-red-50 hover:text-red-600 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-semibold transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>إعادة ضبط المصنع</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>البيانات مشفرة ومحفوظة بأمان محلياً في متصفحك</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Phone, 
  Building, 
  User, 
  Copy, 
  Check, 
  Plus, 
  Printer, 
  Download,
  Trash2,
  Edit2
} from 'lucide-react';
import { DirectoryEntry } from '../types';

interface DirectoryViewProps {
  entries: DirectoryEntry[];
  onAddEntry: () => void;
  onEditEntry: (entry: DirectoryEntry) => void;
  onDeleteEntry: (entry: DirectoryEntry) => void;
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({
  entries,
  onAddEntry,
  onEditEntry,
  onDeleteEntry,
}) => {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Departments list for filter
  const departments = useMemo(() => {
    const set = new Set<string>();
    entries.forEach(e => {
      if (e.department) set.add(e.department);
    });
    return Array.from(set);
  }, [entries]);

  // Filtered entries
  const filtered = useMemo(() => {
    return entries.filter(e => {
      const matchDept = selectedDept === 'all' || e.department === selectedDept;
      const q = search.trim().toLowerCase();
      const matchQuery = !q || 
        (e.name && e.name.toLowerCase().includes(q)) ||
        (e.department && e.department.toLowerCase().includes(q)) ||
        (e.code && e.code.includes(q));
      return matchDept && matchQuery;
    });
  }, [entries, search, selectedDept]);

  const handleCopy = (id: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    const headers = ['كود التحويلة', 'الإدارة / القطاع', 'الاسم / المنصب'];
    const rows = filtered.map(e => [
      `"${e.code}"`,
      `"${e.department.replace(/"/g, '""')}"`,
      `"${(e.name || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `دليل_تليفونات_الهيئة_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Title & Action Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
              <Phone className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                دليل الهاتف والتحويلات الداخلية للهيئة
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                أرقام وتحويلات قيادات الهيئة، الإدارات المركزية، الفروع، والمكاتب الفنية
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          <button
            onClick={onAddEntry}
            className="flex-1 md:flex-none h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة تحويلة جديدة</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="h-10 px-3.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-50"
            title="تصدير إكسيل"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">تصدير CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="h-10 px-3.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-50"
            title="طباعة الدليل"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">طباعة</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Chips */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث برقم التحويلة، اسم الإدارة، أو اسم المسؤول..."
            className="w-full h-11 pr-10 pl-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              مسح
            </button>
          )}
        </div>

        {/* Department Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedDept('all')}
            className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-colors ${
              selectedDept === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            كافة الإدارات ({entries.length})
          </button>
          {departments.slice(0, 10).map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-colors ${
                selectedDept === dept
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filtered.map(entry => (
          <div
            key={entry.id}
            className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3 group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1 flex-1">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md inline-block">
                  {entry.department || 'إدارة عامة'}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  {entry.name || 'بدون اسم محدد'}
                </h3>
              </div>

              {/* Code Badge */}
              <button
                onClick={() => handleCopy(entry.id, entry.code)}
                title="اضغط لنسخ الرقم"
                className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-800 dark:text-slate-200 hover:text-blue-600 px-3 py-1.5 rounded-xl font-mono text-sm font-black border border-slate-200 dark:border-slate-600 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-blue-500" />
                <span>{entry.code}</span>
                {copiedId === entry.id ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-400">
              <span className="text-[10px]">تحويلة داخلية</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEditEntry(entry)}
                  className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                  title="تعديل"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteEntry(entry)}
                  className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                  title="حذف"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700">
          <Phone className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
            لم يتم العثور على تحويلات مطابقة
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            جرب البحث بكلمات أخرى أو اختر إدارة مختلفة
          </p>
        </div>
      )}

    </div>
  );
};

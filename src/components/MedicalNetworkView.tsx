import React, { useState, useMemo } from 'react';
import { 
  Search, 
  HeartPulse, 
  MapPin, 
  Phone, 
  Hospital, 
  Pill, 
  FlaskConical, 
  Scan, 
  Smile, 
  Glasses, 
  UserCheck, 
  Plus, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Trash2, 
  Edit2 
} from 'lucide-react';
import { MedicalNetworkEntry } from '../types';

interface MedicalNetworkViewProps {
  entries: MedicalNetworkEntry[];
  onAddEntry: () => void;
  onEditEntry: (entry: MedicalNetworkEntry) => void;
  onDeleteEntry: (entry: MedicalNetworkEntry) => void;
}

export const MedicalNetworkView: React.FC<MedicalNetworkViewProps> = ({
  entries,
  onAddEntry,
  onEditEntry,
  onDeleteEntry,
}) => {
  const [search, setSearch] = useState('');
  const [selectedGov, setSelectedGov] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Governorates list
  const governorates = useMemo(() => {
    const set = new Set<string>();
    entries.forEach(e => {
      if (e.governorate) set.add(e.governorate);
    });
    return Array.from(set);
  }, [entries]);

  // Provider Types list
  const providerTypes = useMemo(() => {
    const set = new Set<string>();
    entries.forEach(e => {
      if (e.providerType) set.add(e.providerType);
    });
    return Array.from(set);
  }, [entries]);

  // Filtered
  const filtered = useMemo(() => {
    return entries.filter(e => {
      const matchGov = selectedGov === 'all' || e.governorate === selectedGov;
      const matchType = selectedType === 'all' || e.providerType === selectedType;
      const q = search.trim().toLowerCase();
      const matchQuery = !q ||
        (e.providerName && e.providerName.toLowerCase().includes(q)) ||
        (e.area && e.area.toLowerCase().includes(q)) ||
        (e.specialty && e.specialty.toLowerCase().includes(q)) ||
        (e.address && e.address.toLowerCase().includes(q)) ||
        (e.telephone && e.telephone.includes(q));
      return matchGov && matchType && matchQuery;
    });
  }, [entries, search, selectedGov, selectedType]);

  const handleCopyPhone = (id: number, phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    const headers = ['المحافظة', 'الجهة الطبية', 'المنطقة', 'التخصص', 'النوع', 'الفئة', 'العنوان', 'الهاتف'];
    const rows = filtered.map(e => [
      `"${e.governorate}"`,
      `"${e.providerName.replace(/"/g, '""')}"`,
      `"${(e.area || '').replace(/"/g, '""')}"`,
      `"${(e.specialty || '').replace(/"/g, '""')}"`,
      `"${(e.providerType || '').replace(/"/g, '""')}"`,
      `"${e.networkType || ''}"`,
      `"${(e.address || '').replace(/"/g, '""')}"`,
      `"${(e.telephone || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `دليل_الشبكة_الطبية_${selectedGov}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryIcon = (type: string) => {
    if (type.includes('مستشفي')) return <Hospital className="w-4 h-4 text-rose-500" />;
    if (type.includes('صيدليه')) return <Pill className="w-4 h-4 text-emerald-500" />;
    if (type.includes('تحاليل')) return <FlaskConical className="w-4 h-4 text-indigo-500" />;
    if (type.includes('اشعه')) return <Scan className="w-4 h-4 text-amber-500" />;
    if (type.includes('اسنان')) return <Smile className="w-4 h-4 text-sky-500" />;
    if (type.includes('بصريات')) return <Glasses className="w-4 h-4 text-purple-500" />;
    return <HeartPulse className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl">
              <HeartPulse className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                دليل الشبكة الطبية المعتمدة للعاملين
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                مستشفيات، معامل تحاليل، مراكز أشعة، صيدليات، مراكز أسنان وبصريات بجميع محافظات الجمهورية
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          <button
            onClick={onAddEntry}
            className="flex-1 md:flex-none h-10 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة جهة طبية</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="h-10 px-3.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-50"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">تصدير CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="h-10 px-3.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-50"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">طباعة</span>
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث باسم المستشفى، المعمل، الصيدلية، الطبيب، التخصص، أو العنوان..."
            className="w-full h-11 pr-10 pl-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
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

        {/* Governorates Filters */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 block">
            تصفية بالمحافظة:
          </label>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedGov('all')}
              className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-colors ${
                selectedGov === 'all'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              كل المحافظات ({entries.length})
            </button>
            {governorates.map(gov => (
              <button
                key={gov}
                onClick={() => setSelectedGov(gov)}
                className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-colors ${
                  selectedGov === gov
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {gov}
              </button>
            ))}
          </div>
        </div>

        {/* Provider Types Filters */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 block">
            نوع الخدمة الطبية:
          </label>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-colors ${
                selectedType === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              الكل
            </button>
            {providerTypes.map(t => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-colors flex items-center gap-1 ${
                  selectedType === t
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {getCategoryIcon(t)}
                <span>{t}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Grid of Medical Providers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(entry => (
          <div
            key={entry.id}
            className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3 group"
          >
            <div className="space-y-2">
              
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700">
                    {getCategoryIcon(entry.providerType)}
                  </span>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {entry.providerType}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                    {entry.governorate}
                  </span>
                  {entry.networkType && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[10px] font-black">
                      فئة {entry.networkType}
                    </span>
                  )}
                </div>
              </div>

              {/* Provider Name */}
              <h3 className="font-black text-slate-900 dark:text-white text-sm">
                {entry.providerName}
              </h3>

              {/* Specialty & Area */}
              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                {entry.specialty && (
                  <p className="font-semibold text-rose-600 dark:text-rose-400 text-[11px]">
                    {entry.specialty}
                  </p>
                )}
                <p className="flex items-start gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{entry.area ? `${entry.area} — ` : ''}{entry.address || 'العنوان غير مدرج'}</span>
                </p>
              </div>

            </div>

            {/* Telephone & Controls */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
              {entry.telephone ? (
                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${entry.telephone.split('-')[0].trim()}`}
                    className="flex items-center gap-1 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span dir="ltr">{entry.telephone}</span>
                  </a>
                  <button
                    onClick={() => handleCopyPhone(entry.id, entry.telephone)}
                    title="نسخ رقم الهاتف"
                    className="p-1 rounded text-slate-400 hover:text-slate-600"
                  >
                    {copiedId === entry.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              ) : (
                <span className="text-[11px] text-slate-400">لا يوجد هاتف مسجل</span>
              )}

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
          <HeartPulse className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
            لم يتم العثور على جهات طبية مطابقة
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            جرب اختيار محافظة أخرى أو نوع خدمة مختلف
          </p>
        </div>
      )}

    </div>
  );
};

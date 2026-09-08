import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Music, 
  CalendarDays, 
  CalendarRange, 
  Zap, 
  Pin, 
  Compass,
  Play,
  Pause,
  SkipForward,
  Volume2
} from 'lucide-react';
import { PrayerTimes } from '../types';
import { pianoEngine, PIANO_TRACKS, TrackInfo } from '../utils/audioPlayer';

interface StatsRowProps {
  totalCount: number;
  doneCount: number;
  openCount: number;
  monthCount: number;
  weekCount: number;
  monthName: string;
  urgentActive: boolean;
  urgentText: string;
  memoText: string;
  prayerTimes: PrayerTimes;
  prayerCountdownText: string;
  onFilterTotal: () => void;
  onFilterDone: () => void;
  onFilterOpen: () => void;
  onFilterMonth: () => void;
  onFilterWeek: () => void;
  onOpenUrgentModal: () => void;
  onOpenMemoModal: () => void;
  onOpenPrayerModal: () => void;
  activeFilter?: string;
}

export const StatsRow: React.FC<StatsRowProps> = ({
  totalCount,
  doneCount,
  openCount,
  monthCount,
  weekCount,
  monthName,
  urgentActive,
  urgentText,
  memoText,
  prayerTimes,
  prayerCountdownText,
  onFilterTotal,
  onFilterDone,
  onFilterOpen,
  onFilterMonth,
  onFilterWeek,
  onOpenUrgentModal,
  onOpenMemoModal,
  onOpenPrayerModal,
  activeFilter,
}) => {
  // Audio state for Calm Piano Card
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<TrackInfo>(PIANO_TRACKS[0]);
  const [isMusicMenuOpen, setIsMusicMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = pianoEngine.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setCurrentTrack(state.track);
    });
    return () => unsubscribe();
  }, []);

  const handleToggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    pianoEngine.toggle();
  };

  const handleNextTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    pianoEngine.nextTrack();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 my-5 no-print">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        
        {/* 1. Calm Piano Music Player Card 🎵 (Replaces Total Tasks card) */}
        <div
          onClick={() => setIsMusicMenuOpen(!isMusicMenuOpen)}
          className={`relative flex flex-col items-center justify-between p-3 rounded-2xl border text-center transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer select-none group ${
            isPlaying
              ? 'bg-gradient-to-b from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-slate-800 border-indigo-300 dark:border-indigo-700 ring-2 ring-indigo-300 dark:ring-indigo-800'
              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700'
          }`}
          title="موسيقى البيانو الهادئة للتركيز أثناء العمل"
        >
          {/* Header icon with Equalizer */}
          <div className="flex items-center gap-1.5 mb-1">
            <button
              onClick={handleToggleMusic}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-90 ${
                isPlaying 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-200'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 mr-0.5" />}
            </button>

            {/* Equalizer Bars */}
            <div className="flex items-end gap-0.5 h-4 w-5 px-0.5">
              <span className={`w-0.5 bg-indigo-500 rounded-full transition-all ${isPlaying ? 'h-3.5 animate-pulse' : 'h-1'}`} />
              <span className={`w-0.5 bg-indigo-600 rounded-full transition-all ${isPlaying ? 'h-4 animate-bounce' : 'h-1.5'}`} />
              <span className={`w-0.5 bg-blue-500 rounded-full transition-all ${isPlaying ? 'h-2 animate-pulse' : 'h-1'}`} />
              <span className={`w-0.5 bg-indigo-400 rounded-full transition-all ${isPlaying ? 'h-3.5 animate-bounce' : 'h-2'}`} />
            </div>
          </div>

          <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 truncate max-w-[95px]">
            {currentTrack.composer}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[95px] mt-0.5">
            {currentTrack.title}
          </span>

          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold">
              {isPlaying ? 'قيد التشغيل' : 'موسيقى هادئة 🎵'}
            </span>
            <button
              onClick={handleNextTrack}
              title="المقطوعة التالية"
              className="text-slate-400 hover:text-indigo-600 p-0.5 rounded"
            >
              <SkipForward className="w-3 h-3" />
            </button>
          </div>

          {/* Quick Track Selection Dropdown */}
          {isMusicMenuOpen && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute top-full left-0 right-0 mt-2 z-30 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 text-right space-y-1 min-w-[160px]"
            >
              <div className="text-[10px] font-black text-slate-400 pb-1 border-b border-slate-100 dark:border-slate-700">
                اختر المقطوعة (بيانو هادئ):
              </div>
              {PIANO_TRACKS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    pianoEngine.selectTrack(t.id);
                    setIsMusicMenuOpen(false);
                  }}
                  className={`w-full text-right px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    currentTrack.id === t.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="truncate">{t.composer}</span>
                  {currentTrack.id === t.id && isPlaying && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. Done Tasks */}
        <button
          onClick={onFilterDone}
          className={`flex flex-col items-center justify-between p-3 rounded-2xl border text-center transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 ${
            activeFilter === 'done'
              ? 'bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-400'
              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-1">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{doneCount}</span>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">تم إنجازها</span>
          <span className="text-[9px] text-emerald-500 dark:text-emerald-400 font-semibold">
            {totalCount > 0 ? `${Math.round((doneCount / totalCount) * 100)}%` : '0%'}
          </span>
        </button>

        {/* 3. Open Tasks */}
        <button
          onClick={onFilterOpen}
          className={`relative flex flex-col items-center justify-between p-3 rounded-2xl border text-center transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 ${
            activeFilter === 'open'
              ? 'bg-amber-600 text-white border-amber-700 ring-2 ring-amber-400'
              : openCount > 0
                ? 'bg-amber-50/70 dark:bg-amber-950/30 text-slate-800 dark:text-slate-100 border-amber-300 dark:border-amber-800'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700'
          }`}
        >
          {openCount > 0 && (
            <span className="absolute -top-1.5 -left-1.5 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 text-[9px] text-white font-bold items-center justify-center">!</span>
            </span>
          )}
          <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-1">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-xl font-black text-amber-600 dark:text-amber-400">{openCount}</span>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">مفتوحة</span>
          <span className="text-[9px] text-amber-600 dark:text-amber-400 font-semibold">
            {openCount > 0 ? 'تتطلب متابعة' : 'مكتملة'}
          </span>
        </button>

        {/* 4. Month Tasks */}
        <button
          onClick={onFilterMonth}
          className={`flex flex-col items-center justify-between p-3 rounded-2xl border text-center transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 ${
            activeFilter === 'month'
              ? 'bg-indigo-600 text-white border-indigo-700 ring-2 ring-indigo-400'
              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-1">
            <CalendarDays className="w-4 h-4" />
          </div>
          <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">{monthCount}</span>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">مهام الشهر</span>
          <span className="text-[9px] text-indigo-500 dark:text-indigo-400 font-semibold truncate max-w-[80px]">
            {monthName}
          </span>
        </button>

        {/* 5. Week Tasks */}
        <button
          onClick={onFilterWeek}
          className={`flex flex-col items-center justify-between p-3 rounded-2xl border text-center transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 ${
            activeFilter === 'week'
              ? 'bg-purple-600 text-white border-purple-700 ring-2 ring-purple-400'
              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-1">
            <CalendarRange className="w-4 h-4" />
          </div>
          <span className="text-xl font-black text-purple-600 dark:text-purple-400">{weekCount}</span>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">مهام الأسبوع</span>
          <span className="text-[9px] text-purple-500 dark:text-purple-400 font-semibold">آخر 7 أيام</span>
        </button>

        {/* 6. Urgent Box (Phase 30) */}
        <button
          onClick={onOpenUrgentModal}
          className={`relative flex flex-col items-center justify-between p-3 rounded-2xl border text-center transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 ${
            urgentActive && urgentText.trim()
              ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-300 dark:border-red-800 animate-alert-pulse'
              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700'
          }`}
        >
          {urgentActive && urgentText.trim() && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-red-600 text-white text-[8px] font-bold rounded-full">
              نشط
            </span>
          )}
          <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400 mb-1">
            <Zap className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold truncate max-w-[90px]">
            {urgentText.trim() ? urgentText.slice(0, 16) + '...' : 'لا يوجد عاجل'}
          </span>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">تنبيه عاجل</span>
          <span className="text-[9px] text-red-600 dark:text-red-400 font-semibold">اضغط للتعديل</span>
        </button>

        {/* 7. Permanent Sticky Reminder Note 📌 (نوت للتذكير الدائم) */}
        <button
          onClick={onOpenMemoModal}
          className="flex flex-col items-center justify-between p-3 rounded-2xl border text-center transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60 text-slate-800 dark:text-slate-100"
          title="نوت للتذكير الدائم — لا يتم حذفه إلا يدوياً"
        >
          <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-700 dark:text-amber-400 mb-1">
            <Pin className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold truncate max-w-[90px] text-amber-900 dark:text-amber-200">
            {memoText.trim() ? memoText.slice(0, 16) + '...' : 'نوت للتذكير 📌'}
          </span>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">تذكير دائم 📌</span>
          <span className="text-[9px] text-amber-700 dark:text-amber-400 font-semibold">
            اضغط للتدوين / المسح
          </span>
        </button>

        {/* 8. Prayer Times (Aladhan Cairo) */}
        <button
          onClick={onOpenPrayerModal}
          className="flex flex-col items-center justify-between p-3 rounded-2xl border text-center transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-1">
            <Compass className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
            {prayerTimes.dhuhr ? `الظهر ${prayerTimes.dhuhr}` : 'مواعيد الصلاة'}
          </span>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            {prayerTimes.asr ? `العصر ${prayerTimes.asr}` : 'القاهرة'}
          </span>
          <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold truncate max-w-[90px]">
            {prayerCountdownText || 'مواقيت الصلاة'}
          </span>
        </button>

      </div>
    </div>
  );
};


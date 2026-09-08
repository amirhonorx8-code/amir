import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  CalendarDays, 
  CalendarRange, 
  Phone, 
  Siren, 
  Edit3, 
  Calculator, 
  MoonStar, 
  HeartPulse, 
  Globe, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Monitor, 
  LayoutGrid, 
  User, 
  MessageSquare, 
  History, 
  LogOut, 
  Compass, 
  Sparkles, 
  Bot, 
  Building2, 
  Video, 
  MessageCircle, 
  Shield, 
  ChevronDown,
  Volume2,
  Lock,
  Key,
  LogIn,
  Eye
} from 'lucide-react';
import { AppUser, APP_USERS, PrayerTimes } from '../types';
import { pianoEngine, PIANO_TRACKS, TrackInfo } from '../utils/audioPlayer';

interface GoeicFrontPageProps {
  totalCount: number;
  doneCount: number;
  openCount: number;
  weekCount: number;
  monthCount: number;
  latestMonthName: string;
  urgentText?: string;
  urgentActive?: boolean;
  memoText?: string;
  prayerTimes?: PrayerTimes;
  prayerCountdownText?: string;
  directoryCount?: number;
  medicalCount?: number;
  nightShiftDaysCount?: number;
  nightShiftsCount?: number;
  currentUser?: AppUser;
  currentUserEmail?: string;
  isAuthenticated?: boolean;
  onOpenLoginModal?: (prefill?: string) => void;
  onSelectUser?: (user: AppUser) => void;
  onOpenUrgentModal?: () => void;
  onOpenMemoModal?: () => void;
  onOpenPrayerModal?: () => void;
  onOpenCalculatorModal?: () => void;
  onOpenDiscussionsModal?: () => void;
  onOpenChatbotModal?: () => void;
  onOpenAdhkarModal?: () => void;
  onOpenDuasModal?: () => void;
  onOpenQuranModal?: () => void;
  onOpenTasbihModal?: () => void;
  onOpenBackupModal?: () => void;
  onNavigateToDirectory?: () => void;
  onOpenDirectory?: () => void;
  onNavigateToMedical?: () => void;
  onOpenMedical?: () => void;
  onNavigateToSaturday?: () => void;
  onOpenSaturday?: () => void;
  onNavigateToNightShifts?: () => void;
  onOpenNightShiftsCalendar?: () => void;
  onNavigateToCalendar?: () => void;
  onOpenCalendar?: () => void;
  onFilterTotal?: () => void;
  onFilterDone?: () => void;
  onFilterOpen?: () => void;
  onFilterWeek?: () => void;
  onFilterMonth?: () => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
}

export const GoeicFrontPage: React.FC<GoeicFrontPageProps> = ({
  totalCount,
  doneCount,
  openCount,
  weekCount,
  monthCount,
  latestMonthName = 'سبتمبر 2026',
  urgentText = '',
  urgentActive = false,
  memoText = '',
  prayerTimes = { fajr: '05:06', dhuhr: '12:53', asr: '16:27', maghrib: '19:12', isha: '20:31' },
  prayerCountdownText = '',
  directoryCount = 110,
  medicalCount = 420,
  nightShiftDaysCount,
  nightShiftsCount,
  currentUser,
  currentUserEmail,
  isAuthenticated = false,
  onOpenLoginModal,
  onSelectUser,
  onOpenUrgentModal,
  onOpenMemoModal,
  onOpenPrayerModal,
  onOpenCalculatorModal,
  onOpenDiscussionsModal,
  onOpenChatbotModal,
  onOpenAdhkarModal,
  onOpenDuasModal,
  onOpenQuranModal,
  onOpenTasbihModal,
  onOpenBackupModal,
  onNavigateToDirectory,
  onOpenDirectory,
  onNavigateToMedical,
  onOpenMedical,
  onNavigateToSaturday,
  onOpenSaturday,
  onNavigateToNightShifts,
  onOpenNightShiftsCalendar,
  onNavigateToCalendar,
  onOpenCalendar,
  onFilterTotal,
  onFilterDone,
  onFilterOpen,
  onFilterWeek,
  onFilterMonth,
  onToggleFullscreen,
  isFullscreen = false,
}) => {
  // Safe resolved user
  const activeUser = currentUser || APP_USERS[0];
  const userDisplayEmail = currentUserEmail || (activeUser.id === 'amir' ? 'amir.goeic2000@gmail.com' : `${activeUser.id}@goeic.gov.eg`);
  const effectiveNightShiftDays = nightShiftDaysCount !== undefined ? nightShiftDaysCount : (nightShiftsCount !== undefined ? nightShiftsCount : 0);
  const handleDirectory = onNavigateToDirectory || onOpenDirectory || (() => {});
  const handleMedical = onNavigateToMedical || onOpenMedical || (() => {});
  const handleSaturday = onNavigateToSaturday || onOpenSaturday || (() => {});
  const handleNightShifts = onOpenNightShiftsCalendar || onNavigateToNightShifts || handleSaturday;
  const handleCalendar = onNavigateToCalendar || onOpenCalendar || (() => {});
  const handleFilterDone = onFilterDone || (() => {});
  const handleFilterOpen = onFilterOpen || (() => {});
  const handleFilterWeek = onFilterWeek || (() => {});
  const handleFilterMonth = onFilterMonth || (() => {});
  // Audio state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<TrackInfo>(PIANO_TRACKS[0]);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);

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

  const handlePrevMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    pianoEngine.prevTrack();
  };

  const handleNextMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    pianoEngine.nextTrack();
  };

  // Format today's Arabic date string
  const todayArabicString = 'اليوم هو الأحد 6 سبتمبر 2026';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-2 pb-6 select-none font-['Cairo',sans-serif]">
      
      {/* 1. Egyptian Flag Ribbon (Matching Official Government Portal) */}
      <div 
        className="w-full h-1.5 rounded-full mb-3 shadow-xs no-print" 
        style={{ background: 'linear-gradient(to bottom, #CE1126 0 33.3%, #FFFFFF 33.3% 66.6%, #000000 66.6% 100%)' }} 
      />

      {/* 2. Official Document Frame Accent */}
      <div className="gov-doc-frame no-print" aria-hidden="true">
        <span className="frame-corner frame-corner-tl" />
        <span className="frame-corner frame-corner-tr" />
        <span className="frame-corner frame-corner-bl" />
        <span className="frame-corner frame-corner-br" />
      </div>

      {/* 3. Urgent Marquee Alert Banner with WhatsApp Broadcast (Matching Rails Template) */}
      {urgentActive && urgentText.trim() && (
        <div 
          className="w-full mb-4 rounded-2xl p-2.5 sm:p-3 text-white shadow-lg flex items-center gap-3 border-b-2 border-red-900 no-print"
          style={{ background: 'linear-gradient(to left, #B91C1C 0%, #DC2626 100%)' }}
          dir="rtl"
        >
          <span 
            className="px-3 py-1 rounded-full text-xs font-black shrink-0 flex items-center gap-1.5 bg-white text-red-700 shadow-sm animate-pulse"
          >
            <Siren className="w-3.5 h-3.5" />
            عاجل
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap text-xs sm:text-sm font-bold tracking-wide">
              {urgentText}
            </div>
          </div>
          <a
            href={`https://wa.me/?text=${encodeURIComponent('🚨 تنبيه عاجل من منظومة الهيئة العامة للرقابة على الصادرات والواردات: ' + urgentText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md transition-all active:scale-90"
            title="مشاركة عبر واتساب"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>
      )}

      {/* ========================================================
          1. DARK NAVY FLOATING HEADER CARD (جمهورية مصر العربية)
          ======================================================== */}
      <div 
        id="official-banner" 
        className="w-full text-white rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-visible border border-slate-700/60"
        style={{ background: 'linear-gradient(to left, #1F3A5F 0%, #132743 100%)' }}
        dir="rtl"
      >
        
        {/* Top Header Row with Eagle Emblems and Titles */}
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Right Emblem: GOEIC Official Emblem with golden glow ring */}
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-white p-0.5 border-2 border-amber-400/80 gold-glow flex items-center justify-center shrink-0 overflow-hidden shadow-xl">
            <img 
              src="/goeic_logo.png" 
              alt="شعار الهيئة العامة للرقابة على الصادرات والواردات" 
              className="w-full h-full object-contain rounded-full" 
              referrerPolicy="no-referrer" 
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('/images.jpeg')) {
                  target.src = '/images.jpeg';
                }
              }}
            />
          </div>

          {/* Center Titles */}
          <div className="text-center flex-1 min-w-0">
            <div className="text-amber-300 text-xs sm:text-sm font-semibold opacity-90 tracking-wider">
              جمهورية مصر العربية
            </div>
            <h1 className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1 title-glow-white text-white">
              إدارة التشغيل
            </h1>
            <h2 className="text-xl sm:text-3xl font-extrabold mt-0.5 leading-tight tracking-tight text-white">
              سجل المهام اليومية
            </h2>
          </div>

          {/* Left Emblem: Ministry / GOEIC Logo with golden glow */}
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-white p-0.5 border-2 border-amber-400/80 gold-glow flex items-center justify-center shrink-0 overflow-hidden shadow-xl">
            <img 
              src="/goeic_logo.png" 
              alt="شعار الهيئة العامة للرقابة على الصادرات والواردات" 
              className="w-full h-full object-contain rounded-full" 
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('/images.png')) {
                  target.src = '/images.png';
                }
              }}
            />
          </div>

        </div>

        {/* Golden divider strip under official banner */}
        <div 
          className="mx-auto mt-4" 
          style={{ 
            width: '85%', 
            height: '3px', 
            borderRadius: '9999px', 
            background: 'linear-gradient(to left, #B8860B, #FFD700, #FFD700, #B8860B)', 
            boxShadow: '0 0 12px rgba(212,175,55,0.55)' 
          }} 
        />

        {/* Horizontal Navigation Pill Bar */}
        <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-center flex-wrap gap-2 text-xs font-bold">
          
          {/* 1. وضع العرض (Presentation / Fullscreen) */}
          <button 
            onClick={onToggleFullscreen}
            className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl flex items-center gap-2 transition-all border ${
              isFullscreen 
                ? 'bg-amber-500 text-slate-900 border-amber-400 shadow-md' 
                : 'bg-white/10 hover:bg-white/15 text-white border-white/15'
            }`}
          >
            <Monitor className="w-4 h-4 text-blue-300" />
            <span>{isFullscreen ? 'الخروج من العرض' : 'وضع العرض'}</span>
          </button>

          {/* 2. لوحة المهام */}
          <button 
            onClick={() => window.scrollTo({ top: 900, behavior: 'smooth' })}
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 flex items-center gap-2 transition-all"
          >
            <LayoutGrid className="w-4 h-4 text-emerald-400" />
            <span>لوحة المهام</span>
          </button>

          {/* 3. User Account & Permissions Switcher */}
          <div className="relative">
            {isAuthenticated && activeUser.id !== 'guest' ? (
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-600/30 to-indigo-600/30 hover:bg-white/20 text-white border border-emerald-400/40 flex items-center gap-2 transition-all"
              >
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>{activeUser.name}</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">كامل الصلاحيات</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800/90 text-slate-300 border border-slate-700 hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5"
                  title="أنت في وضع الزائر (مشاهدة فقط)"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>زائر (مشاهدة فقط)</span>
                </button>
                <button 
                  onClick={() => onOpenLoginModal?.()}
                  className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 text-slate-950 font-black border border-amber-300 shadow-md flex items-center gap-2 transition-all active:scale-95"
                  title="تسجيل الدخول لتفعيل كامل الصلاحيات"
                >
                  <Lock className="w-4 h-4 text-slate-950" />
                  <span>تسجيل الدخول</span>
                </button>
              </div>
            )}

            {isUserMenuOpen && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute top-full right-0 mt-2 z-50 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 min-w-[260px] text-right space-y-1 text-slate-900 dark:text-slate-100"
              >
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    المستخدم الحالي: {activeUser.name}
                  </div>
                  <div className={`text-[11px] font-medium ${
                    isAuthenticated && activeUser.id !== 'guest'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}>
                    {isAuthenticated && activeUser.id !== 'guest'
                      ? '✓ كامل الصلاحيات مفعلة (إضافة، تعديل، حذف)'
                      : '👁️ وضع المشاهدة فقط — لا يمكن التعديل أو الحذف دون تسجيل الدخول'}
                  </div>
                </div>

                <div className="py-1">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    حسابات المنظومة (كامل الصلاحيات للجميع):
                  </div>
                  {APP_USERS.filter(u => u.id !== 'guest').map((u) => {
                    const isSelected = isAuthenticated && u.id === activeUser.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          if (isSelected) return;
                          onOpenLoginModal?.(`تسجيل الدخول لحساب: ${u.name}`, u.username);
                        }}
                        className={`w-full text-right p-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          isSelected 
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800' 
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Key className="w-3.5 h-3.5 text-amber-500" />
                          <div>
                            <div className="font-black text-xs">{u.name}</div>
                            <div className="text-[10px] text-slate-400">{u.username}</div>
                          </div>
                        </div>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">
                          {isSelected ? 'نشط' : 'دخول'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenLoginModal?.();
                    }}
                    className="w-full text-right p-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 flex items-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>دليل الحسابات وكلمات المرور</span>
                  </button>

                  {isAuthenticated && (
                    <button
                      onClick={() => {
                        const guestUser = APP_USERS.find(u => u.id === 'guest') || APP_USERS[0];
                        onSelectUser?.(guestUser);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-right p-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5 rotate-180" />
                      <span>تسجيل الخروج (وضع المشاهدة فقط)</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 4. شات بوت الهيئة الذكي (Requested Chatbot) */}
          <button 
            onClick={onOpenChatbotModal}
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-black border border-amber-300 shadow-md flex items-center gap-2 transition-all active:scale-95"
            title="شات بوت ذكي يستخرج كل معلوماته من بيانات التطبيق"
          >
            <Bot className="w-4 h-4 text-slate-950" />
            <span>شات بوت الهيئة</span>
            <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
          </button>

          {/* 5. المحادثات الفردية والجماعية */}
          <button 
            onClick={onOpenDiscussionsModal}
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 flex items-center gap-2 transition-all relative"
          >
            <MessageSquare className="w-4 h-4 text-purple-300" />
            <span>المحادثات</span>
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
          </button>

          {/* 6. سجل التعديلات */}
          <button 
            onClick={onOpenBackupModal}
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 flex items-center gap-2 transition-all"
          >
            <History className="w-4 h-4 text-cyan-300" />
            <span>سجل التعديلات</span>
          </button>

          {/* 7. خروج */}
          <button 
            onClick={() => onSelectUser?.(APP_USERS.find(u => u.id === 'guest') || APP_USERS[0])}
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-400/40 flex items-center gap-1.5 transition-all"
          >
            <span>خروج</span>
            <LogOut className="w-3.5 h-3.5 rotate-180" />
          </button>

        </div>
      </div>

      {/* Golden Separator Line & Task Log Counter Label */}
      <div className="flex items-center justify-between my-3 px-2">
        <div className="h-[2px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent flex-1" />
        <div className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200 px-3 tracking-wide">
          {totalCount} — Work Task Log مهمة
        </div>
      </div>

      {/* ========================================================
          2. GOEIC BUILDING HERO CARD
          ======================================================== */}
      <div className="relative w-full rounded-3xl overflow-hidden shadow-lg border border-slate-300 dark:border-slate-700 h-52 sm:h-64 bg-slate-900 flex items-center justify-center mb-6 group">
        {/* Architectural Glass Building Backdrop */}
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80" 
          alt="مبنى الهيئة العامة للرقابة على الصادرات والواردات" 
          className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-900/25 to-slate-950/40" />

        {/* Center Frosted Glass Banner */}
        <div className="relative z-10 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl px-6 sm:px-12 py-4 sm:py-5 shadow-2xl border border-white/70 dark:border-slate-700 text-center max-w-xl mx-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-1.5 rounded-full bg-white p-0.5 border-2 border-amber-500/80 flex items-center justify-center shadow-md overflow-hidden">
            <img 
              src="/goeic_logo.png" 
              alt="شعار الهيئة العامة للرقابة على الصادرات والواردات" 
              className="w-full h-full object-contain rounded-full" 
              referrerPolicy="no-referrer" 
            />
          </div>
          <h2 className="text-base sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
            الهيئة العامة للرقابة على الصادرات والواردات
          </h2>
          <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 mt-1">
            {todayArabicString}
          </p>
        </div>
      </div>

      {/* ========================================================
          3. THE 10 INTERACTIVE FEATURE & METRIC CARDS (2x5 GRID)
          ======================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 mb-6">
        
        {/* --- ROW 1 --- */}

        {/* Card 1: موسيقى هادئة */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-between text-center transition-all hover:shadow-md">
          <div className="w-10 h-10 rounded-full bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-1">
            <Volume2 className="w-5 h-5" />
          </div>
          <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
            موسيقى هادئة
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[120px] mt-0.5">
            {currentTrack.title} — {currentTrack.composer}
          </div>
          
          {/* Audio Controls */}
          <div className="flex items-center justify-center gap-2 mt-2">
            <button 
              onClick={handlePrevMusic}
              className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors"
              title="السابق"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={handleToggleMusic}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-white transition-transform active:scale-90 ${
                isPlaying ? 'bg-teal-600 shadow-md' : 'bg-slate-800 dark:bg-slate-600'
              }`}
              title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </button>
            <button 
              onClick={handleNextMusic}
              className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors"
              title="التالي"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1 mt-2 overflow-hidden">
            <div className={`bg-teal-500 h-full rounded-full transition-all ${isPlaying ? 'w-2/3 animate-pulse' : 'w-1/4'}`} />
          </div>
          <div className="text-[9px] text-slate-400 dark:text-slate-500 mt-1">
            من 9 التشغيل التلقائي متوفر
          </div>
        </div>

        {/* Card 2: 319 تم إنجازها */}
        <button 
          onClick={handleFilterDone}
          className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center transition-all hover:shadow-md active:scale-95 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 my-0.5">
            {doneCount}
          </div>
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
            تم إنجازها
          </div>
        </button>

        {/* Card 3: 0 مفتوحة */}
        <button 
          onClick={handleFilterOpen}
          className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center transition-all hover:shadow-md active:scale-95 group"
        >
          <div className="w-10 h-10 rounded-full bg-red-500/15 text-red-600 dark:text-red-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <Clock className="w-6 h-6" />
          </div>
          <div className="text-3xl font-black text-red-600 dark:text-red-400 my-0.5">
            {openCount}
          </div>
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
            مفتوحة
          </div>
        </button>

        {/* Card 4: أرقام التليفونات (رقم 110) */}
        <button 
          onClick={handleDirectory}
          className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center transition-all hover:shadow-md active:scale-95 group"
        >
          <div className="w-10 h-10 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <Phone className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
            أرقام التليفونات
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            رقم {directoryCount}
          </div>
        </button>

        {/* Card 5: عاجل (اضغط للكتابة) */}
        <button 
          onClick={onOpenUrgentModal}
          className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center transition-all hover:shadow-md active:scale-95 group"
        >
          <div className="w-10 h-10 rounded-full bg-red-600/15 text-red-600 dark:text-red-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform animate-pulse">
            <Siren className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-red-600 dark:text-red-400">
            عاجل
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[120px]">
            {urgentActive && urgentText.trim() ? urgentText.slice(0, 15) : 'اضغط للكتابة'}
          </div>
        </button>

        {/* --- ROW 2 --- */}

        {/* Card 6: 50 مهام هذا الأسبوع */}
        <button 
          onClick={handleFilterWeek}
          className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center transition-all hover:shadow-md active:scale-95 group"
        >
          <div className="w-10 h-10 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400 my-0.5">
            {weekCount}
          </div>
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
            مهام هذا الأسبوع
          </div>
        </button>

        {/* Card 7: نوت للتذكير */}
        <button 
          onClick={onOpenMemoModal}
          className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center transition-all hover:shadow-md active:scale-95 group"
        >
          <div className="w-10 h-10 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <Edit3 className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-amber-700 dark:text-amber-300">
            نوت للتذكير
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[120px]">
            {memoText.trim() ? memoText.slice(0, 15) : 'اضغط للكتابة'}
          </div>
        </button>

        {/* Card 8: مواعيد الصلاة */}
        <div 
          onClick={onOpenPrayerModal}
          className="bg-white dark:bg-slate-800 rounded-2xl p-3 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-between text-center transition-all hover:shadow-md cursor-pointer relative"
        >
          <div className="w-9 h-9 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-1">
            <Compass className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
            مواعيد الصلاة
          </div>
          <div className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
            الفجر {prayerTimes.fajr || '05:06'} • الظهر {prayerTimes.dhuhr || '12:53'} • العصر {prayerTimes.asr || '16:27'} • المغرب {prayerTimes.maghrib || '19:12'} • العشاء {prayerTimes.isha || '20:31'}
          </div>
          <div className="my-1.5 px-3 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-xs">
            {prayerCountdownText || 'الأذان بعد 177 دقيقة'}
          </div>

          {/* Quick Islamic Features Buttons (Matching application.html.erb) */}
          <div className="w-full grid grid-cols-2 gap-1 pt-1.5 border-t border-slate-100 dark:border-slate-700/60">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenAdhkarModal?.();
              }}
              className="py-1 px-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800/50 transition-colors"
            >
              🌅 الأذكار
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDuasModal?.();
              }}
              className="py-1 px-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-[10px] font-bold border border-blue-200 dark:border-blue-800/50 transition-colors"
            >
              🤲 الأدعية
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenQuranModal?.();
              }}
              className="py-1 px-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-700 dark:text-amber-300 text-[10px] font-bold border border-amber-200 dark:border-amber-800/50 transition-colors"
            >
              📖 المصحف
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenTasbihModal?.();
              }}
              className="py-1 px-1 rounded-lg bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 text-teal-700 dark:text-teal-300 text-[10px] font-bold border border-teal-200 dark:border-teal-800/50 transition-colors"
            >
              📿 السبحة
            </button>
          </div>
        </div>

        {/* Card 9: التقويم الشهري */}
        <button 
          onClick={handleCalendar}
          className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center transition-all hover:shadow-md active:scale-95 group"
        >
          <div className="w-10 h-10 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <CalendarRange className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
            التقويم الشهري
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {latestMonthName || 'سبتمبر 2026'} • {monthCount} مهمة
          </div>
        </button>

        {/* Card 10: آلة حاسبة */}
        <button 
          onClick={onOpenCalculatorModal}
          className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center transition-all hover:shadow-md active:scale-95 group"
        >
          <div className="w-10 h-10 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <Calculator className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
            آلة حاسبة
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            عمليات حسابية سريعة
          </div>
        </button>

      </div>

      {/* ========================================================
          4. MINI METRICS BAR (أيام السهر | الشبكة الطبية | مهام شهر)
          ======================================================== */}
      <div className="w-full bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-200 dark:divide-slate-700 mb-6">
        
        {/* Left: أيام السهر */}
        <button 
          onClick={handleNightShifts}
          className="flex items-center justify-center gap-3.5 p-3 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-xl transition-colors text-right group cursor-pointer"
          title="اضغط لفتح تقويم أيام السهر الشهري وتسجيل نوبتجياتك"
        >
          <div className="w-11 h-11 rounded-full bg-[#182a48] text-amber-300 flex items-center justify-center shadow-md group-hover:scale-105 group-hover:bg-amber-400 group-hover:text-slate-900 transition-all">
            <MoonStar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <span>أيام السهر</span>
              <span className="text-[10px] bg-amber-400/20 text-amber-600 dark:text-amber-400 font-mono px-1.5 py-0.5 rounded font-bold">
                تقويم شهري
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {effectiveNightShiftDays > 0 ? `${effectiveNightShiftDays} يوم سهر مسجل` : 'لا توجد أيام مسجلة'} • اضغط للتسجيل
            </div>
          </div>
        </button>

        {/* Center: الشبكة الطبية */}
        <button 
          onClick={handleMedical}
          className="flex items-center justify-center gap-3.5 p-3 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-xl transition-colors text-right"
        >
          <div className="w-11 h-11 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-sm">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span>الشبكة الطبية</span>
              <span className="text-lg font-black text-rose-600 dark:text-rose-400">
                {medicalCount.toLocaleString()}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              مقدم خدمة — اضغط للاستعراض
            </div>
          </div>
        </button>

        {/* Right: مهام شهر سبتمبر 2026 */}
        <button 
          onClick={onFilterMonth}
          className="flex items-center justify-center gap-3.5 p-3 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-xl transition-colors text-right"
        >
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-end gap-2">
              <span>مهام شهر سبتمبر 2026</span>
              <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                {monthCount}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              من إجمالي {totalCount} مهمة
            </div>
          </div>
        </button>

      </div>

      {/* ========================================================
          5. QUICK LINKS SECTION ("روابط سريعة" — 5 مواقع)
          ======================================================== */}
      <div className="w-full bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
        
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                روابط سريعة
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                مواقع العمل اليومية — اضغط على الأيقونة للانتقال
              </p>
            </div>
          </div>
          <span className="text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full">
            🌐 5 مواقع
          </span>
        </div>

        {/* 5 Cards Grid with Building Background & Frosted White Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          
          {/* Link 1: يوتيوب */}
          <a 
            href="https://www.youtube.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative rounded-2xl overflow-hidden h-28 border border-slate-200 dark:border-slate-700 flex items-center justify-center group shadow-sm hover:shadow-md transition-all"
          >
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80" 
              alt="يوتيوب" 
              className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-110 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-slate-900/30" />
            <div className="relative z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl p-2.5 text-center w-[85%] border border-white/60 dark:border-slate-700 shadow-md">
              <div className="w-8 h-8 mx-auto rounded-full bg-red-600 text-white flex items-center justify-center shadow-md mb-1">
                <Video className="w-4 h-4" />
              </div>
              <div className="font-black text-xs text-slate-900 dark:text-white">يوتيوب</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">YouTube</div>
            </div>
          </a>

          {/* Link 2: واتساب */}
          <a 
            href="https://web.whatsapp.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative rounded-2xl overflow-hidden h-28 border border-slate-200 dark:border-slate-700 flex items-center justify-center group shadow-sm hover:shadow-md transition-all"
          >
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80" 
              alt="واتساب" 
              className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-110 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-slate-900/30" />
            <div className="relative z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl p-2.5 text-center w-[85%] border border-white/60 dark:border-slate-700 shadow-md">
              <div className="w-8 h-8 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md mb-1">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="font-black text-xs text-slate-900 dark:text-white">واتساب</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">WhatsApp</div>
            </div>
          </a>

          {/* Link 3: بوابة الخدمات */}
          <a 
            href="https://www.goeic.gov.eg" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative rounded-2xl overflow-hidden h-28 border border-slate-200 dark:border-slate-700 flex items-center justify-center group shadow-sm hover:shadow-md transition-all"
          >
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80" 
              alt="بوابة الخدمات" 
              className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-110 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-slate-900/30" />
            <div className="relative z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl p-2.5 text-center w-[85%] border border-white/60 dark:border-slate-700 shadow-md">
              <div className="w-8 h-8 mx-auto rounded-full bg-[#182a48] text-white flex items-center justify-center shadow-md mb-1">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="font-black text-xs text-slate-900 dark:text-white">بوابة الخدمات</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">mgoeic.gov.eg</div>
            </div>
          </a>

          {/* Link 4: ChatGPT */}
          <a 
            href="https://chatgpt.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative rounded-2xl overflow-hidden h-28 border border-slate-200 dark:border-slate-700 flex items-center justify-center group shadow-sm hover:shadow-md transition-all"
          >
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80" 
              alt="ChatGPT" 
              className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-110 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-slate-900/30" />
            <div className="relative z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl p-2.5 text-center w-[85%] border border-white/60 dark:border-slate-700 shadow-md">
              <div className="w-8 h-8 mx-auto rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-md mb-1">
                <Bot className="w-4 h-4" />
              </div>
              <div className="font-black text-xs text-slate-900 dark:text-white">ChatGPT</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">شات جي بي تي</div>
            </div>
          </a>

          {/* Link 5: Gemini */}
          <a 
            href="https://gemini.google.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative rounded-2xl overflow-hidden h-28 border border-slate-200 dark:border-slate-700 flex items-center justify-center group shadow-sm hover:shadow-md transition-all"
          >
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80" 
              alt="جيميناري" 
              className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-110 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-slate-900/30" />
            <div className="relative z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl p-2.5 text-center w-[85%] border border-white/60 dark:border-slate-700 shadow-md">
              <div className="w-8 h-8 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md mb-1">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="font-black text-xs text-slate-900 dark:text-white">جيميناي</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Gemini</div>
            </div>
          </a>

        </div>
      </div>

    </div>
  );
};

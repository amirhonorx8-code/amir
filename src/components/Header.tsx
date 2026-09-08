import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Printer, 
  Sun, 
  Moon, 
  Plus, 
  AlertTriangle, 
  Clock, 
  LayoutDashboard, 
  ListFilter,
  Volume2,
  Phone,
  HeartPulse,
  UserCheck,
  Shield,
  Download,
  Check,
  Calendar,
  Database,
  RotateCcw,
  Lock,
  Key,
  LogIn,
  LogOut,
  Eye
} from 'lucide-react';
import { AppUser, APP_USERS } from '../types';

export type ActiveTab = 'welcome' | 'fullLog' | 'directory' | 'medical' | 'saturday';

interface HeaderProps {
  currentTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenNewTaskModal: () => void;
  onExportCSV: () => void;
  onPrint: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  urgentText: string;
  urgentActive: boolean;
  onOpenUrgentModal: () => void;
  prayerBannerText: string | null;
  totalCount: number;
  openCount: number;
  overdueCount: number;
  currentUser: AppUser;
  onSelectUser: (user: AppUser) => void;
  isAuthenticated?: boolean;
  onOpenLoginModal?: (prefill?: string) => void;
  canInstallPWA?: boolean;
  onInstallPWA?: () => void;
  onOpenBackupModal?: () => void;
  onReloadOfficialData?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenNewTaskModal,
  onExportCSV,
  onPrint,
  theme,
  onToggleTheme,
  urgentText,
  urgentActive,
  onOpenUrgentModal,
  prayerBannerText,
  totalCount,
  openCount,
  overdueCount,
  currentUser,
  onSelectUser,
  isAuthenticated = false,
  onOpenLoginModal,
  canInstallPWA,
  onInstallPWA,
  onOpenBackupModal,
  onReloadOfficialData,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);

  return (
    <header className="w-full select-none">
      {/* 1. Egyptian Flag Strip (Red, White, Black) */}
      <div className="w-full h-2 flex no-print">
        <div className="flex-1 bg-[#C8102E]" title="علم جمهورية مصر العربية - الأحمر" />
        <div className="flex-1 bg-white" title="علم جمهورية مصر العربية - الأبيض" />
        <div className="flex-1 bg-black" title="علم جمهورية مصر العربية - الأسود" />
      </div>

      {/* 2. Urgent Scrolling Marquee Banner (Phase 30) */}
      {urgentActive && urgentText.trim() && (
        <div 
          onClick={onOpenUrgentModal}
          className="bg-amber-600 hover:bg-amber-700 text-white text-sm py-2 px-4 flex items-center gap-3 overflow-hidden cursor-pointer transition-colors shadow-inner no-print"
          title="اضغط للتعديل أو الإيقاف"
        >
          <div className="flex items-center gap-1.5 shrink-0 bg-red-700 px-2.5 py-0.5 rounded-full font-bold text-xs animate-alert-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>عاجل وهام</span>
          </div>
          <div className="flex-1 overflow-hidden whitespace-nowrap">
            <div className="animate-marquee font-medium">
              {urgentText}
            </div>
          </div>
          <span className="text-xs text-amber-200 shrink-0 underline">تعديل</span>
        </div>
      )}

      {/* 3. Prayer Call Notification Banner (Phase 40) */}
      {prayerBannerText && (
        <div className="bg-emerald-700 text-white text-sm py-2 px-4 flex items-center justify-center gap-2 shadow-md animate-alert-pulse no-print">
          <Volume2 className="w-4 h-4 text-emerald-200" />
          <span className="font-bold">{prayerBannerText}</span>
        </div>
      )}

      {/* 4. Official Navy Government Header */}
      <div className="bg-gradient-to-r from-[#1F3A5F] via-[#1A3152] to-[#132743] text-white py-4 px-4 sm:px-6 shadow-xl border-b border-blue-900/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Title with Eagle Emblem */}
          <div className="flex items-center gap-3.5 text-center md:text-right">
            {/* Official GOEIC Emblem in circular badge */}
            <div className="w-14 h-14 rounded-full bg-white p-0.5 border-2 border-amber-400/80 shadow-lg flex items-center justify-center shrink-0 overflow-hidden">
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

            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-amber-300/90 text-xs font-semibold tracking-wide">
                <span>جمهورية مصر العربية</span>
                <span className="opacity-50">•</span>
                <span>قطاع تكنولوجيا المعلومات</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                سجل المهام اليومية والدعم الفني
              </h1>
              <p className="text-xs text-blue-200/80 font-normal">
                متابعة مهام الشبكات، البصمة، النماذج الإحصائية، وصيانة الأجهزة
              </p>
            </div>
          </div>

          {/* Quick Status Badges */}
          <div className="flex items-center flex-wrap gap-2 justify-center">
            <div className="bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg border border-white/10 text-xs flex items-center gap-1.5 backdrop-blur-sm">
              <span className="text-blue-200">الإجمالي:</span>
              <span className="font-bold text-sm text-white">{totalCount}</span>
            </div>

            <div className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 backdrop-blur-sm transition-all ${
              openCount > 0 
                ? 'bg-amber-500/20 text-amber-200 border-amber-400/40 animate-alert-pulse' 
                : 'bg-white/10 text-blue-100 border-white/10'
            }`}>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>مفتوحة:</span>
              <span className="font-bold text-sm text-white">{openCount}</span>
            </div>

            {overdueCount > 0 && (
              <div className="bg-red-500/25 text-red-200 border border-red-400/50 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 animate-alert-pulse shadow-sm">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span>متأخرة:</span>
                <span className="font-bold text-sm text-white">{overdueCount}</span>
              </div>
            )}
          </div>

          {/* Actions & Tab Navigation */}
          <div className="flex items-center flex-wrap gap-2 justify-center no-print">
            {/* View Switch Buttons */}
            <div className="bg-black/25 p-1 rounded-xl flex items-center gap-1 border border-white/10 flex-wrap">
              <button
                onClick={() => onSelectTab('welcome')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentTab === 'welcome' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-blue-200 hover:text-white hover:bg-white/5'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>الرئيسية</span>
              </button>

              <button
                onClick={() => onSelectTab('fullLog')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentTab === 'fullLog' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-blue-200 hover:text-white hover:bg-white/5'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>السجل والبحث</span>
              </button>

              <button
                onClick={() => onSelectTab('directory')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentTab === 'directory' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-blue-200 hover:text-white hover:bg-white/5'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>دليل الهاتف</span>
              </button>

              <button
                onClick={() => onSelectTab('medical')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentTab === 'medical' 
                    ? 'bg-rose-600 text-white shadow-md' 
                    : 'text-rose-200 hover:text-white hover:bg-white/5'
                }`}
              >
                <HeartPulse className="w-3.5 h-3.5" />
                <span>الشبكة الطبية</span>
              </button>

              <button
                onClick={() => onSelectTab('saturday')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentTab === 'saturday' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-indigo-200 hover:text-white hover:bg-white/5'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>نوبتجيات السبت</span>
              </button>
            </div>

            {/* User Authentication & Switcher */}
            <div className="relative">
              {isAuthenticated && currentUser.id !== 'guest' ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border border-white/20 shadow-sm ${currentUser.badgeColor}`}
                  title={`المستخدم الحالي: ${currentUser.name} (${currentUser.description})`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>{currentUser.name}</span>
                  <span className="text-[10px] bg-black/25 px-1.5 py-0.5 rounded font-bold">
                    كامل الصلاحيات
                  </span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-700/80 hover:bg-slate-600 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-600 shadow-sm"
                    title="أنت في وضع الزائر (مشاهدة فقط)"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>زائر (مشاهدة فقط)</span>
                  </button>
                  <button
                    onClick={() => onOpenLoginModal?.()}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md border border-amber-300 transition-all active:scale-95"
                    title="تسجيل الدخول لتفعيل كامل الصلاحيات"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>دخول</span>
                  </button>
                </div>
              )}

              {isUserMenuOpen && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 min-w-[260px] text-right space-y-1 text-slate-900 dark:text-slate-100"
                >
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 text-xs">
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      المستخدم الحالي: {currentUser.name}
                    </div>
                    <div className={`text-[11px] font-medium ${
                      isAuthenticated && currentUser.id !== 'guest' 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {isAuthenticated && currentUser.id !== 'guest'
                        ? '✓ كامل الصلاحيات مفعلة (إضافة، تعديل، حذف)'
                        : '👁️ وضع المشاهدة فقط — لا يمكن التعديل أو الحذف دون تسجيل الدخول'}
                    </div>
                  </div>

                  <div className="py-1">
                    <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      حسابات المنظومة (كامل الصلاحيات للجميع):
                    </div>
                    {APP_USERS.filter(u => u.id !== 'guest').map((u) => {
                      const isSelected = isAuthenticated && u.id === currentUser.id;
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
                              ? 'bg-blue-50 dark:bg-blue-950/60 font-bold border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-700/60'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Key className="w-3.5 h-3.5 text-amber-500" />
                            <div>
                              <div className="font-black text-xs">{u.name}</div>
                              <div className="text-[10px] text-slate-400">{u.username}</div>
                            </div>
                          </div>
                          {isSelected ? (
                            <Check className="w-4 h-4 text-blue-600" />
                          ) : (
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-500">
                              دخول
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-1">
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
                          onSelectUser(guestUser);
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

            {/* Quick Add Task Button */}
            <button
              onClick={() => {
                if (!isAuthenticated || !currentUser.canAdd) {
                  onOpenLoginModal?.('إضافة مهمة جديدة');
                } else {
                  onOpenNewTaskModal();
                }
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>إضافة مهمة</span>
            </button>

            {/* Install PWA Button (if browser supports install prompt) */}
            {canInstallPWA && onInstallPWA && (
              <button
                onClick={onInstallPWA}
                title="تثبيت التطبيق كبرنامج مستقل PWA على جهازك"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-md transition-all animate-bounce"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">تثبيت PWA</span>
              </button>
            )}

            {/* Export CSV */}
            <button
              onClick={onExportCSV}
              title="تصدير ملف إكسيل Excel عربي"
              className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 border border-white/15 transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden sm:inline">تصدير CSV</span>
            </button>

            {/* Backup & Data Center Button */}
            {onOpenBackupModal && (
              <button
                onClick={onOpenBackupModal}
                title="مركز تصدير وتحميل البيانات والنسخ الاحتياطي (JSON / CSV)"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-indigo-400/40 transition-all shadow-sm"
              >
                <Database className="w-3.5 h-3.5 text-indigo-200" />
                <span className="hidden md:inline">مركز البيانات (JSON/CSV)</span>
              </button>
            )}

            {/* Force Reload Official Data Button */}
            {onReloadOfficialData && (
              <button
                onClick={onReloadOfficialData}
                title="تحديث واستعادة كافة بيانات سبتمبر الرسمية كاملة (319 مهمة • 110 دليل هاتف • 10 إجازات • 2 سهر • صلاة)"
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-amber-400/40 transition-all shadow-md active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-200" />
                <span className="hidden lg:inline">تحديث/إضافة البيانات (319)</span>
                <span className="lg:hidden">تحديث (319)</span>
              </button>
            )}

            {/* Print Button */}
            <button
              onClick={onPrint}
              title="طباعة التقرير"
              className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 border border-white/15 transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-blue-200" />
              <span className="hidden sm:inline">طباعة</span>
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={onToggleTheme}
              title={theme === 'light' ? 'التحويل إلى الوضع الليلي' : 'التحويل إلى الوضع الفاتح'}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-amber-300" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle, RotateCcw, AlertTriangle, Sun, Moon, ArrowRight, Home, Bot } from 'lucide-react';
import { Header, ActiveTab } from './components/Header';
import { StatsRow } from './components/StatsRow';
import { LeavesSection } from './components/LeavesSection';
import { WelcomeTaskTable } from './components/WelcomeTaskTable';
import { MonthlyCalendar } from './components/MonthlyCalendar';
import { FullLogView } from './components/FullLogView';
import { DirectoryView } from './components/DirectoryView';
import { MedicalNetworkView } from './components/MedicalNetworkView';
import { SaturdayAttendanceView } from './components/SaturdayAttendanceView';
import { BackupModal } from './components/BackupModal';
import { GoeicFrontPage } from './components/GoeicFrontPage';
import { QuickCalculatorModal } from './components/QuickCalculatorModal';
import { DiscussionsModal } from './components/DiscussionsModal';
import { GoeicChatbotModal } from './components/GoeicChatbotModal';
import { FeedbackBubble } from './components/FeedbackBubble';
import { AdhkarModal, DuasModal, QuranModal, TasbihModal } from './components/IslamicModals';
import { LoginAuthModal } from './components/LoginAuthModal';
import { NightShiftCalendarModal } from './components/NightShiftCalendarModal';
import { 
  TaskModal, 
  LeaveModal, 
  DeleteConfirmModal, 
  UrgentModal, 
  MemoModal, 
  PrayerModal,
  DirectoryModal,
  MedicalModal
} from './components/Modals';
import { Task, EmployeeLeave, PrayerTimes, FilterState, DirectoryEntry, MedicalNetworkEntry, SaturdayAttendance, NightShiftRecord, AppUser, APP_USERS } from './types';
import { initialTasks } from './data/initialTasks';
import { initialLeaves } from './data/initialLeaves';
import { initialSaturdayAttendances } from './data/initialSaturdayAttendance';
import { initialNightShifts } from './data/initialNightShifts';
import { initialDirectory } from './data/initialDirectory';
import { initialMedicalNetwork } from './data/initialMedicalNetwork';
import { 
  exportTasksToCSV, 
  formatArabicMonthYear, 
  isTaskOverdue, 
  parseTaskDate 
} from './utils/helpers';
import { getStoredAuthSession, saveAuthSession, clearAuthSession } from './utils/auth';

export default function App() {
  // Current User & Authentication Session
  const [currentUser, setCurrentUser] = useState<AppUser>(() => {
    return getStoredAuthSession().user;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return getStoredAuthSession().isAuthenticated;
  });

  // Login Authentication Modal State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [loginModalActionDesc, setLoginModalActionDesc] = useState<string>('');
  const [loginModalPrefill, setLoginModalPrefill] = useState<string>('');

  const handleSelectUser = (user: AppUser) => {
    if (user.id === 'guest') {
      clearAuthSession();
      const guestUser: AppUser = {
        ...user,
        canAdd: false,
        canEdit: false,
        canDelete: false,
        role: 'guest'
      };
      setCurrentUser(guestUser);
      setIsAuthenticated(false);
      return;
    }

    // Entering any authorized user account strictly requires entering that account's password
    if (!isAuthenticated || currentUser.id !== user.id) {
      setLoginModalActionDesc(`تسجيل الدخول بحساب: ${user.name}`);
      setLoginModalPrefill(user.username);
      setIsLoginModalOpen(true);
      return;
    }
  };

  const handleOpenLoginModal = (actionDesc?: string, prefill?: string) => {
    setLoginModalActionDesc(actionDesc || 'تسجيل الدخول لتنفيذ العمليات المصرح بها');
    setLoginModalPrefill(prefill || '');
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = (user: AppUser) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
  };

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstallPWA, setCanInstallPWA] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPWA(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult && choiceResult.outcome === 'accepted') {
      setCanInstallPWA(false);
    }
    setDeferredPrompt(null);
  };

  // Theme state (default 'light' as per Phase 18)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('it_app_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('it_app_theme', theme);
  }, [theme]);

  // Tab: 'welcome' | 'fullLog' | 'directory' | 'medical'
  const [currentTab, setCurrentTab] = useState<ActiveTab>('welcome');

  // Directory Entries State
  const [directoryEntries, setDirectoryEntries] = useState<DirectoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem('it_directory_entries');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= initialDirectory.length) return parsed;
      }
    } catch (e) {
      console.error('Error loading directory entries', e);
    }
    return initialDirectory;
  });

  useEffect(() => {
    try {
      localStorage.setItem('it_directory_entries', JSON.stringify(directoryEntries));
    } catch (e) {
      console.error('Error saving directory entries', e);
    }
  }, [directoryEntries]);

  // Medical Network Entries State
  const [medicalEntries, setMedicalEntries] = useState<MedicalNetworkEntry[]>(() => {
    try {
      const saved = localStorage.getItem('it_medical_entries');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= initialMedicalNetwork.length) return parsed;
      }
    } catch (e) {
      console.error('Error loading medical entries', e);
    }
    return initialMedicalNetwork;
  });

  useEffect(() => {
    try {
      localStorage.setItem('it_medical_entries', JSON.stringify(medicalEntries));
    } catch (e) {
      console.error('Error saving medical entries', e);
    }
  }, [medicalEntries]);

  // Tasks State
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('it_tasks_log');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= initialTasks.length) return parsed;
      }
    } catch (e) {
      console.error('Error loading tasks from localStorage', e);
    }
    return initialTasks;
  });

  useEffect(() => {
    try {
      localStorage.setItem('it_tasks_log', JSON.stringify(tasks));
    } catch (e) {
      console.error('Error saving tasks to localStorage', e);
    }
  }, [tasks]);

  // Leaves State
  const [leaves, setLeaves] = useState<EmployeeLeave[]>(() => {
    try {
      const saved = localStorage.getItem('it_employee_leaves');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= initialLeaves.length) return parsed;
      }
    } catch (e) {
      console.error('Error loading leaves', e);
    }
    return initialLeaves;
  });

  useEffect(() => {
    try {
      localStorage.setItem('it_employee_leaves', JSON.stringify(leaves));
    } catch (e) {
      console.error('Error saving leaves', e);
    }
  }, [leaves]);

  // Saturday Attendances State
  const [saturdayAttendances, setSaturdayAttendances] = useState<SaturdayAttendance[]>(() => {
    try {
      const saved = localStorage.getItem('it_saturday_attendances');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= initialSaturdayAttendances.length) return parsed;
      }
    } catch (e) {
      console.error('Error loading saturday attendances', e);
    }
    return initialSaturdayAttendances;
  });

  useEffect(() => {
    try {
      localStorage.setItem('it_saturday_attendances', JSON.stringify(saturdayAttendances));
    } catch (e) {
      console.error('Error saving saturday attendances', e);
    }
  }, [saturdayAttendances]);

  // Backup & Data Center Modal State
  const [isBackupModalOpen, setIsBackupModalOpen] = useState<boolean>(false);
  const [showSyncToast, setShowSyncToast] = useState<boolean>(false);

  const handleAddSaturday = (attendance: Omit<SaturdayAttendance, 'id'>) => {
    if (!isAuthenticated || !currentUser.canAdd) {
      handleOpenLoginModal('إضافة نوبتجية سبت');
      return;
    }
    const nextId = saturdayAttendances.length > 0 ? Math.max(...saturdayAttendances.map(a => a.id)) + 1 : 1;
    const newItem: SaturdayAttendance = { id: nextId, ...attendance };
    setSaturdayAttendances(prev => [newItem, ...prev]);
  };

  const handleEditSaturday = (attendance: SaturdayAttendance) => {
    if (!isAuthenticated || !currentUser.canEdit) {
      handleOpenLoginModal(`تعديل نوبتجية ${attendance.employee}`);
      return;
    }
    setSaturdayAttendances(prev => prev.map(a => a.id === attendance.id ? attendance : a));
  };

  const handleDeleteSaturday = (id: number) => {
    if (!isAuthenticated || !currentUser.canDelete) {
      handleOpenLoginModal('حذف نوبتجية السبت');
      return;
    }
    setSaturdayAttendances(prev => prev.filter(a => a.id !== id));
  };

  // Night Shifts State (يوم السهر والتقويم الشهري التفاعلي)
  const [isNightShiftModalOpen, setIsNightShiftModalOpen] = useState<boolean>(false);
  
  const [nightShiftRecords, setNightShiftRecords] = useState<NightShiftRecord[]>(() => {
    try {
      const saved = localStorage.getItem('it_night_shifts_records');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      // Migrate from legacy it_night_shifts or initialNightShifts
      const legacySaved = localStorage.getItem('it_night_shifts');
      const dates: string[] = legacySaved ? JSON.parse(legacySaved) : initialNightShifts;
      if (Array.isArray(dates) && dates.length > 0) {
        return dates.map((d: string, idx: number) => ({
          id: `ns-init-${idx}-${d}`,
          date: d,
          userId: 'amir',
          userName: 'أمير طلعت',
          notes: 'نوبتجية سهر معتمدة',
          createdAt: d
        }));
      }
    } catch (e) {
      console.error('Error loading night shift records', e);
    }
    return initialNightShifts.map((d, idx) => ({
      id: `ns-init-${idx}-${d}`,
      date: d,
      userId: 'amir',
      userName: 'أمير طلعت',
      notes: 'نوبتجية سهر معتمدة',
      createdAt: d
    }));
  });

  const [nightShifts, setNightShifts] = useState<string[]>(() => {
    return Array.from(new Set(nightShiftRecords.map(r => r.date))).sort().reverse();
  });

  useEffect(() => {
    try {
      const dates = Array.from(new Set(nightShiftRecords.map(r => r.date))).sort().reverse();
      setNightShifts(dates);
      localStorage.setItem('it_night_shifts', JSON.stringify(dates));
      localStorage.setItem('it_night_shifts_records', JSON.stringify(nightShiftRecords));
    } catch (e) {
      console.error('Error saving night shift records', e);
    }
  }, [nightShiftRecords]);

  // Calculate unique days with night shifts in the current active month (September 2026)
  const currentMonthNightShiftCount = useMemo(() => {
    const prefix = '2026-09';
    const monthRecords = nightShiftRecords.filter(r => r.date.startsWith(prefix));
    const uniqueDates = new Set(monthRecords.map(r => r.date));
    return uniqueDates.size;
  }, [nightShiftRecords]);

  // Toggle night shift mark for the logged-in user on a specific date
  const handleToggleNightShift = (date: string) => {
    if (!date) return;
    if (!isAuthenticated || currentUser.id === 'guest' || !currentUser.canAdd) {
      handleOpenLoginModal('تسجيل يوم سهر في التقويم لحسابك');
      return;
    }

    const currentUserId = currentUser.id;
    const currentUserName = currentUser.name || currentUser.arabicName || 'المهندس';

    setNightShiftRecords(prev => {
      const existingIdx = prev.findIndex(r => r.date === date && r.userId === currentUserId);
      if (existingIdx >= 0) {
        // Unmark: remove the current user's night shift on this date
        return prev.filter((_, i) => i !== existingIdx);
      } else {
        // Mark: register the day for current user
        const newRecord: NightShiftRecord = {
          id: `ns-${date}-${currentUserId}-${Date.now()}`,
          date,
          userId: currentUserId,
          userName: currentUserName,
          notes: 'نوبتجية سهر مسجلة',
          createdAt: new Date().toISOString()
        };
        return [newRecord, ...prev];
      }
    });
  };

  const handleDeleteNightShiftRecord = (id: string) => {
    if (!isAuthenticated || !currentUser.canDelete) {
      handleOpenLoginModal('إلغاء نوبتجية سهر');
      return;
    }
    setNightShiftRecords(prev => prev.filter(r => r.id !== id));
  };

  const handleAddNightShift = (date: string) => {
    if (!date) return;
    if (!isAuthenticated || !currentUser.canAdd) {
      handleOpenLoginModal('إضافة نوبتجية سهر');
      return;
    }
    handleToggleNightShift(date);
  };

  const handleDeleteNightShift = (date: string) => {
    if (!isAuthenticated || !currentUser.canDelete) {
      handleOpenLoginModal('حذف نوبتجية سهر');
      return;
    }
    setNightShiftRecords(prev => prev.filter(d => d.date !== date));
  };

  // Force Reload and Apply All Official Data
  const handleForceReloadOfficialData = () => {
    setTasks(initialTasks);
    setDirectoryEntries(initialDirectory);
    setLeaves(initialLeaves);
    setSaturdayAttendances(initialSaturdayAttendances);
    setNightShifts(initialNightShifts);
    setNightShiftRecords(initialNightShifts.map((d, idx) => ({
      id: `ns-init-${idx}-${d}`,
      date: d,
      userId: 'amir',
      userName: 'أمير طلعت',
      notes: 'نوبتجية سهر معتمدة',
      createdAt: d
    })));
    setMedicalEntries(initialMedicalNetwork);
    setPrayerTimes({
      fajr: '05:06',
      dhuhr: '12:53',
      asr: '16:27',
      maghrib: '19:12',
      isha: '20:31',
      lastFetchedDate: '2026-09-05'
    });
    setMemoText('');
    setUrgentText('');
    setUrgentActive(false);

    try {
      localStorage.setItem('it_tasks_log', JSON.stringify(initialTasks));
      localStorage.setItem('it_directory_entries', JSON.stringify(initialDirectory));
      localStorage.setItem('it_employee_leaves', JSON.stringify(initialLeaves));
      localStorage.setItem('it_saturday_attendances', JSON.stringify(initialSaturdayAttendances));
      localStorage.setItem('it_night_shifts', JSON.stringify(initialNightShifts));
      localStorage.setItem('it_medical_entries', JSON.stringify(initialMedicalNetwork));
      localStorage.setItem('it_prayer_times', JSON.stringify({
        fajr: '05:06',
        dhuhr: '12:53',
        asr: '16:27',
        maghrib: '19:12',
        isha: '20:31',
        lastFetchedDate: '2026-09-05'
      }));
      localStorage.setItem('it_urgent_text', '');
      localStorage.setItem('it_urgent_active', 'false');
      localStorage.setItem('it_general_memo', '');
      localStorage.setItem('it_data_version', 'v7.0_sep2026_full_319_sync');
    } catch (e) {
      console.error(e);
    }
    setShowSyncToast(true);
    setTimeout(() => setShowSyncToast(false), 6000);
  };

  // Auto-sync fresh data on upgrade
  useEffect(() => {
    const DATA_VERSION = 'v7.0_sep2026_full_319_sync';
    const savedVersion = localStorage.getItem('it_data_version');
    const savedTasks = localStorage.getItem('it_tasks_log');
    let taskCount = 0;
    try {
      if (savedTasks) taskCount = JSON.parse(savedTasks).length;
    } catch {}

    if (savedVersion !== DATA_VERSION || taskCount < initialTasks.length) {
      handleForceReloadOfficialData();
    }
  }, []);

  const handleImportFullBackup = (data: {
    tasks?: Task[];
    directory?: DirectoryEntry[];
    medicalNetwork?: MedicalNetworkEntry[];
    saturdayAttendances?: SaturdayAttendance[];
    leaves?: EmployeeLeave[];
    nightShifts?: string[];
  }) => {
    if (data.tasks && Array.isArray(data.tasks)) {
      setTasks(data.tasks);
      localStorage.setItem('it_tasks_log', JSON.stringify(data.tasks));
    }
    if (data.directory && Array.isArray(data.directory)) {
      setDirectoryEntries(data.directory);
      localStorage.setItem('it_directory_entries', JSON.stringify(data.directory));
    }
    if (data.medicalNetwork && Array.isArray(data.medicalNetwork)) {
      setMedicalEntries(data.medicalNetwork);
      localStorage.setItem('it_medical_entries', JSON.stringify(data.medicalNetwork));
    }
    if (data.saturdayAttendances && Array.isArray(data.saturdayAttendances)) {
      setSaturdayAttendances(data.saturdayAttendances);
      localStorage.setItem('it_saturday_attendances', JSON.stringify(data.saturdayAttendances));
    }
    if (data.leaves && Array.isArray(data.leaves)) {
      setLeaves(data.leaves);
      localStorage.setItem('it_employee_leaves', JSON.stringify(data.leaves));
    }
    if (data.nightShifts && Array.isArray(data.nightShifts)) {
      setNightShifts(data.nightShifts);
      localStorage.setItem('it_night_shifts', JSON.stringify(data.nightShifts));
    }
  };

  const handleResetToDefaults = () => {
    handleForceReloadOfficialData();
  };

  // Urgent Notice State (Phase 30)
  const [urgentText, setUrgentText] = useState<string>(() => {
    return localStorage.getItem('it_urgent_text') || '';
  });
  const [urgentActive, setUrgentActive] = useState<boolean>(() => {
    const saved = localStorage.getItem('it_urgent_active');
    return saved !== null ? saved === 'true' : false;
  });

  const handleSaveUrgent = (text: string, active: boolean) => {
    setUrgentText(text);
    setUrgentActive(active);
    localStorage.setItem('it_urgent_text', text);
    localStorage.setItem('it_urgent_active', String(active));
  };

  // Permanent Reminder Note State 📌 (نوت للتذكير الدائم - مسح يدوي فقط)
  const [memoText, setMemoText] = useState<string>(() => {
    try {
      return localStorage.getItem('it_general_memo') || '';
    } catch {
      return '';
    }
  });

  const handleSaveMemo = (text: string) => {
    setMemoText(text);
    if (text) {
      localStorage.setItem('it_general_memo', text);
    } else {
      localStorage.removeItem('it_general_memo');
    }
  };

  // Prayer Times State (Phase 38, 39, 40)
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes>(() => {
    try {
      const saved = localStorage.getItem('it_prayer_times');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      fajr: '05:06',
      dhuhr: '12:53',
      asr: '16:27',
      maghrib: '19:12',
      isha: '20:31',
      lastFetchedDate: '2026-09-05'
    };
  });

  const [prayerBannerText, setPrayerBannerText] = useState<string | null>(null);

  const handleSavePrayer = (times: { fajr: string; dhuhr: string; asr: string; maghrib: string; isha: string }) => {
    const updated = { ...prayerTimes, ...times };
    setPrayerTimes(updated);
    localStorage.setItem('it_prayer_times', JSON.stringify(updated));
  };

  const handleTestPrayerAlert = () => {
    setPrayerBannerText('حان الآن موعد أذان الظهر حسب التوقيت المحلي لمدينة القاهرة');
    setTimeout(() => {
      setPrayerBannerText(null);
    }, 120000); // auto-hide after 2 minutes (Phase 40)
  };

  const handleOpenDiscussionsModal = () => {
    if (!isAuthenticated || currentUser.id === 'guest') {
      handleOpenLoginModal('المشاركة في محادثات المنظومة');
      return;
    }
    setIsDiscussionsModalOpen(true);
  };

  // Check prayer time once per minute
  useEffect(() => {
    const checkPrayerTime = () => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMins = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMins}`;

      if (currentTimeStr === prayerTimes.fajr) {
        setPrayerBannerText('حان الآن موعد أذان الفجر حسب التوقيت المحلي لمدينة القاهرة');
        setTimeout(() => setPrayerBannerText(null), 120000);
      } else if (currentTimeStr === prayerTimes.dhuhr) {
        setPrayerBannerText('حان الآن موعد أذان الظهر حسب التوقيت المحلي لمدينة القاهرة');
        setTimeout(() => setPrayerBannerText(null), 120000);
      } else if (currentTimeStr === prayerTimes.asr) {
        setPrayerBannerText('حان الآن موعد أذان العصر حسب التوقيت المحلي لمدينة القاهرة');
        setTimeout(() => setPrayerBannerText(null), 120000);
      } else if (currentTimeStr === prayerTimes.maghrib) {
        setPrayerBannerText('حان الآن موعد أذان المغرب حسب التوقيت المحلي لمدينة القاهرة');
        setTimeout(() => setPrayerBannerText(null), 120000);
      } else if (currentTimeStr === prayerTimes.isha) {
        setPrayerBannerText('حان الآن موعد أذان العشاء حسب التوقيت المحلي لمدينة القاهرة');
        setTimeout(() => setPrayerBannerText(null), 120000);
      }
    };

    checkPrayerTime();
    const timer = setInterval(checkPrayerTime, 60000);
    return () => clearInterval(timer);
  }, [prayerTimes]);

  // Prayer Countdown Text
  const prayerCountdownText = useMemo(() => {
    return `الفجر: ${prayerTimes.fajr || '05:06'} • الظهر: ${prayerTimes.dhuhr || '12:53'} • العصر: ${prayerTimes.asr || '16:27'} • المغرب: ${prayerTimes.maghrib || '19:12'} • العشاء: ${prayerTimes.isha || '20:31'}`;
  }, [prayerTimes]);

  // Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState<boolean>(false);
  const [editingLeave, setEditingLeave] = useState<EmployeeLeave | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string | number; title: string; type: 'task' | 'leave' | 'directory' | 'medical' } | null>(null);

  const [isUrgentModalOpen, setIsUrgentModalOpen] = useState<boolean>(false);
  const [isMemoModalOpen, setIsMemoModalOpen] = useState<boolean>(false);
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState<boolean>(false);

  // Directory Modal States
  const [isDirectoryModalOpen, setIsDirectoryModalOpen] = useState<boolean>(false);
  const [editingDirectory, setEditingDirectory] = useState<DirectoryEntry | null>(null);

  // Medical Modal States
  const [isMedicalModalOpen, setIsMedicalModalOpen] = useState<boolean>(false);
  const [editingMedical, setEditingMedical] = useState<MedicalNetworkEntry | null>(null);

  // Active filter state passed to FullLogView if clicked from stats
  const [passedFilter, setPassedFilter] = useState<Partial<FilterState>>({});
  const [weekFilterActive, setWeekFilterActive] = useState<boolean>(false);

  // Lists for datalist suggestions
  const allDepartments = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach(t => {
      if (t.department?.trim()) set.add(t.department.trim());
    });
    return Array.from(set);
  }, [tasks]);

  const allTechnicians = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach(t => {
      if (t.technician?.trim()) set.add(t.technician.trim());
    });
    return Array.from(set);
  }, [tasks]);

  const allEmployees = useMemo(() => {
    const set = new Set<string>();
    leaves.forEach(l => {
      if (l.employee?.trim()) set.add(l.employee.trim());
    });
    return Array.from(set);
  }, [leaves]);

  // Key metrics
  const totalCount = tasks.length;
  const doneCount = useMemo(() => tasks.filter(t => t.done).length, [tasks]);
  const openCount = useMemo(() => tasks.filter(t => !t.done).length, [tasks]);
  const overdueCount = useMemo(() => tasks.filter(t => isTaskOverdue(t)).length, [tasks]);

  // Month & Week tasks
  const { monthCount, latestMonthName, weekCount } = useMemo(() => {
    let maxTime = 0;
    tasks.forEach(t => {
      const time = parseTaskDate(t.date).getTime();
      if (time > maxTime) maxTime = time;
    });

    const dMax = new Date(maxTime || Date.now());
    const mCount = tasks.filter(t => {
      const d = parseTaskDate(t.date);
      return d.getFullYear() === dMax.getFullYear() && d.getMonth() === dMax.getMonth();
    }).length;

    const weekStart = maxTime - 7 * 24 * 60 * 60 * 1000;
    const wCount = tasks.filter(t => parseTaskDate(t.date).getTime() >= weekStart).length;

    return {
      monthCount: mCount,
      latestMonthName: formatArabicMonthYear(dMax),
      weekCount: wCount,
    };
  }, [tasks]);

  // Task CRUD handlers
  const handleSaveTask = (taskData: Omit<Task, 'id' | 'number'> & { id?: number }) => {
    if (taskData.id) {
      // Edit
      if (!isAuthenticated || !currentUser.canEdit) {
        handleOpenLoginModal('تعديل المهمة');
        return;
      }
      setTasks(prev => prev.map(t => (t.id === taskData.id ? { ...t, ...taskData } as Task : t)));
    } else {
      // New
      if (!isAuthenticated || !currentUser.canAdd) {
        handleOpenLoginModal('إضافة مهمة جديدة');
        return;
      }
      const nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
      const newTask: Task = {
        ...taskData,
        id: nextId,
        number: nextId,
      };
      setTasks(prev => [newTask, ...prev]);
    }
    setIsTaskModalOpen(false);
  };

  const handleToggleTaskDone = (task: Task) => {
    if (!isAuthenticated || !currentUser.canEdit) {
      handleOpenLoginModal(`تغيير حالة إنجاز المهمة #${task.number || task.id}`);
      return;
    }
    setTasks(prev => prev.map(t => (t.id === task.id ? { ...t, done: !t.done } : t)));
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    if (!isAuthenticated || !currentUser.canDelete) {
      handleOpenLoginModal(`تأكيد حذف: ${itemToDelete.title}`);
      return;
    }
    if (itemToDelete.type === 'task') {
      setTasks(prev => prev.filter(t => t.id !== itemToDelete.id));
    } else if (itemToDelete.type === 'leave') {
      setLeaves(prev => prev.filter(l => l.id !== itemToDelete.id));
    } else if (itemToDelete.type === 'directory') {
      setDirectoryEntries(prev => prev.filter(d => d.id !== itemToDelete.id));
    } else if (itemToDelete.type === 'medical') {
      setMedicalEntries(prev => prev.filter(m => m.id !== itemToDelete.id));
    }
    setItemToDelete(null);
    setIsDeleteModalOpen(false);
  };

  // Leave CRUD handlers
  const handleSaveLeave = (leaveData: Omit<EmployeeLeave, 'id'> & { id?: string }) => {
    if (leaveData.id) {
      // Edit
      if (!isAuthenticated || !currentUser.canEdit) {
        handleOpenLoginModal('تعديل الإجازة');
        return;
      }
      setLeaves(prev => prev.map(l => (l.id === leaveData.id ? { ...l, ...leaveData } as EmployeeLeave : l)));
    } else {
      // New
      if (!isAuthenticated || !currentUser.canAdd) {
        handleOpenLoginModal('إضافة إجازة جديدة');
        return;
      }
      const newLeave: EmployeeLeave = {
        ...leaveData,
        id: `leave-${Date.now()}`,
      };
      setLeaves(prev => [newLeave, ...prev]);
    }
    setIsLeaveModalOpen(false);
  };

  // Directory CRUD handlers
  const handleSaveDirectory = (entryData: Omit<DirectoryEntry, 'id'> & { id?: number }) => {
    if (entryData.id) {
      if (!isAuthenticated || !currentUser.canEdit) {
        handleOpenLoginModal('تعديل بيانات الدليل');
        return;
      }
      setDirectoryEntries(prev => prev.map(d => d.id === entryData.id ? { ...d, ...entryData } as DirectoryEntry : d));
    } else {
      if (!isAuthenticated || !currentUser.canAdd) {
        handleOpenLoginModal('إضافة جهة اتصال للدليل');
        return;
      }
      const nextId = directoryEntries.length > 0 ? Math.max(...directoryEntries.map(d => d.id)) + 1 : 1;
      const newEntry: DirectoryEntry = {
        ...entryData,
        id: nextId,
      };
      setDirectoryEntries(prev => [newEntry, ...prev]);
    }
    setIsDirectoryModalOpen(false);
  };

  // Medical CRUD handlers
  const handleSaveMedical = (entryData: Omit<MedicalNetworkEntry, 'id'> & { id?: number }) => {
    if (entryData.id) {
      if (!isAuthenticated || !currentUser.canEdit) {
        handleOpenLoginModal('تعديل جهة بالشبكة الطبية');
        return;
      }
      setMedicalEntries(prev => prev.map(m => m.id === entryData.id ? { ...m, ...entryData } as MedicalNetworkEntry : m));
    } else {
      if (!isAuthenticated || !currentUser.canAdd) {
        handleOpenLoginModal('إضافة جهة للشبكة الطبية');
        return;
      }
      const nextId = medicalEntries.length > 0 ? Math.max(...medicalEntries.map(m => m.id)) + 1 : 1;
      const newEntry: MedicalNetworkEntry = {
        ...entryData,
        id: nextId,
      };
      setMedicalEntries(prev => [newEntry, ...prev]);
    }
    setIsMedicalModalOpen(false);
  };

  // Stats Card Click Handlers
  const handleFilterTotal = () => {
    setPassedFilter({ status: 'all', period: 'all', month: 'all' });
    setWeekFilterActive(false);
    setCurrentTab('welcome');
  };

  const handleFilterDone = () => {
    setPassedFilter({ status: 'done' });
    setCurrentTab('fullLog');
  };

  const handleFilterOpen = () => {
    setPassedFilter({ status: 'open' });
    setCurrentTab('fullLog');
  };

  const handleFilterMonth = () => {
    setPassedFilter({ period: 'month' });
    setCurrentTab('fullLog');
  };

  const handleFilterWeek = () => {
    setWeekFilterActive(prev => !prev);
  };

  // State for new Front Page modals & Fullscreen (Matching Photo 1 & 2)
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState<boolean>(false);
  const [isDiscussionsModalOpen, setIsDiscussionsModalOpen] = useState<boolean>(false);
  const [isChatbotModalOpen, setIsChatbotModalOpen] = useState<boolean>(false);
  const [isAdhkarModalOpen, setIsAdhkarModalOpen] = useState<boolean>(false);
  const [isDuasModalOpen, setIsDuasModalOpen] = useState<boolean>(false);
  const [isQuranModalOpen, setIsQuranModalOpen] = useState<boolean>(false);
  const [isTasbihModalOpen, setIsTasbihModalOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#CDEBF9] dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors flex flex-col font-['Cairo',sans-serif]">
      
      {/* Top Utility Bar with Sync & Theme */}
      <div className="w-full bg-[#111e33] text-white py-1.5 px-4 text-xs flex items-center justify-between no-print border-b border-white/10 shadow-sm z-30">
        <div className="flex items-center gap-2">
          <span className="text-base" role="img" aria-label="علم مصر">🇪🇬</span>
          <span className="font-bold text-slate-200">جمهورية مصر العربية — الإدارة المركزية لتكنولوجيا المعلومات</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleForceReloadOfficialData}
            title="إعادة تحميل وتثبيت بيانات سبتمبر الرسمية كاملة (319 مهمة)"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all text-[11px] shadow-sm active:scale-95"
          >
            <RotateCcw className="w-3 h-3" />
            <span>تحديث البيانات الرسمية ({tasks.length})</span>
          </button>

          {canInstallPWA && (
            <button
              onClick={handleInstallPWA}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all text-[11px]"
            >
              <span>تثبيت التطبيق</span>
            </button>
          )}

          <button
            onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-blue-200 transition-all"
            title="تبديل المظهر (فاتح / داكن)"
          >
            {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Sync Outdated Warning Banner (if browser cached an older dataset) */}
      {(tasks.length < initialTasks.length || directoryEntries.length < initialDirectory.length) && (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-4">
          <div className="bg-amber-500/20 border-2 border-amber-500/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-950 dark:text-amber-100 shadow-md">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 animate-bounce" />
              <div>
                <p className="font-black text-sm">تنبيه: متصفحك يعرض بيانات قديمة ({tasks.length} مهمة من أصل {initialTasks.length})</p>
                <p className="text-xs opacity-90 mt-0.5">اضغط على زر التحديث لإضافة وتطبيق كامل بيانات سبتمبر (319 مهمة، 110 تحويلة هاتف، 10 إجازات، 2 سهر، مواعيد الصلاة).</p>
              </div>
            </div>
            <button
              onClick={handleForceReloadOfficialData}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-black rounded-xl text-xs shadow-lg flex items-center gap-2 shrink-0 transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إضافة وتحديث البيانات الرسمية الآن</span>
            </button>
          </div>
        </div>
      )}

      {/* Sync Success Floating Toast */}
      {showSyncToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400 animate-bounce text-sm font-bold">
          <CheckCircle className="w-5 h-5 text-emerald-200 shrink-0" />
          <span>تمت إضافة وتحديث كافة البيانات في التطبيق بنجاح: 319 مهمة، 110 دليل هاتف، 10 إجازات، 2 سهر، مواعيد الصلاة!</span>
        </div>
      )}

      {/* Header bar on secondary tabs */}
      {currentTab !== 'welcome' && (
        <>
          <Header
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            onOpenNewTaskModal={() => {
              if (!isAuthenticated || !currentUser.canAdd) {
                handleOpenLoginModal('إضافة مهمة جديدة');
                return;
              }
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
            onExportCSV={() => exportTasksToCSV(tasks)}
            onPrint={() => window.print()}
            theme={theme}
            onToggleTheme={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}
            urgentText={urgentText}
            urgentActive={urgentActive}
            onOpenUrgentModal={() => setIsUrgentModalOpen(true)}
            prayerBannerText={prayerBannerText}
            totalCount={totalCount}
            openCount={openCount}
            overdueCount={overdueCount}
            currentUser={currentUser}
            onSelectUser={handleSelectUser}
            isAuthenticated={isAuthenticated}
            onOpenLoginModal={handleOpenLoginModal}
            canInstallPWA={canInstallPWA}
            onInstallPWA={handleInstallPWA}
            onOpenBackupModal={() => setIsBackupModalOpen(true)}
            onReloadOfficialData={handleForceReloadOfficialData}
          />
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 no-print">
            <button
              onClick={() => setCurrentTab('welcome')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#182a48] to-[#1a3152] text-white text-xs font-black shadow-md hover:brightness-110 transition-all active:scale-95"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة للواجهة الرئيسية (الرئيسية)</span>
            </button>
          </div>
        </>
      )}

      {/* 3. Main Views */}
      <main className="flex-1">
        {currentTab === 'welcome' && (
          <div className="space-y-6">
            {/* 1. Official GOEIC Front Page Matching Photo 1 & Photo 2 */}
            <GoeicFrontPage
              totalCount={totalCount}
              doneCount={doneCount}
              openCount={openCount}
              weekCount={weekCount}
              monthCount={monthCount}
              latestMonthName={latestMonthName}
              directoryCount={directoryEntries.length}
              medicalCount={medicalEntries.length}
              nightShiftsCount={currentMonthNightShiftCount}
              nightShiftDaysCount={currentMonthNightShiftCount}
              onOpenNightShiftsCalendar={() => setIsNightShiftModalOpen(true)}
              onNavigateToNightShifts={() => setIsNightShiftModalOpen(true)}
              urgentText={urgentText}
              urgentActive={urgentActive}
              memoText={memoText}
              prayerTimes={prayerTimes}
              prayerCountdownText={prayerCountdownText}
              currentUser={currentUser || APP_USERS[0]}
              currentUserEmail={currentUser?.id === 'amir' ? 'amir.goeic2000@gmail.com' : `${currentUser?.id || 'amir'}@goeic.gov.eg`}
              onSelectUser={handleSelectUser}
              isAuthenticated={isAuthenticated}
              onOpenLoginModal={handleOpenLoginModal}
              onFilterTotal={handleFilterTotal}
              onFilterDone={handleFilterDone}
              onFilterOpen={handleFilterOpen}
              onFilterWeek={handleFilterWeek}
              onFilterMonth={handleFilterMonth}
              onNavigateToDirectory={() => setCurrentTab('directory')}
              onOpenDirectory={() => setCurrentTab('directory')}
              onNavigateToMedical={() => setCurrentTab('medical')}
              onOpenMedical={() => setCurrentTab('medical')}
              onNavigateToSaturday={() => setCurrentTab('saturday')}
              onOpenSaturday={() => setCurrentTab('saturday')}
              onNavigateToCalendar={() => {
                const el = document.getElementById('monthly-calendar-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenCalendar={() => {
                const el = document.getElementById('monthly-calendar-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenUrgentModal={() => setIsUrgentModalOpen(true)}
              onOpenMemoModal={() => setIsMemoModalOpen(true)}
              onOpenPrayerModal={() => setIsPrayerModalOpen(true)}
              onOpenCalculatorModal={() => setIsCalculatorModalOpen(true)}
              onOpenDiscussionsModal={handleOpenDiscussionsModal}
              onOpenChatbotModal={() => setIsChatbotModalOpen(true)}
              onOpenAdhkarModal={() => setIsAdhkarModalOpen(true)}
              onOpenDuasModal={() => setIsDuasModalOpen(true)}
              onOpenQuranModal={() => setIsQuranModalOpen(true)}
              onOpenTasbihModal={() => setIsTasbihModalOpen(true)}
              onOpenBackupModal={() => setIsBackupModalOpen(true)}
              onToggleFullscreen={handleToggleFullscreen}
              isFullscreen={isFullscreen}
            />

            {/* Leaves Section: Chart first, then Table (Phase 23-27, 32) */}
            <LeavesSection
              leaves={leaves}
              onAddLeave={() => {
                if (!isAuthenticated || !currentUser.canAdd) {
                  handleOpenLoginModal('إضافة إجازة جديدة');
                  return;
                }
                setEditingLeave(null);
                setIsLeaveModalOpen(true);
              }}
              onEditLeave={(l) => {
                if (!isAuthenticated || !currentUser.canEdit) {
                  handleOpenLoginModal(`تعديل إجازة ${l.employee}`);
                  return;
                }
                setEditingLeave(l);
                setIsLeaveModalOpen(true);
              }}
              onDeleteLeave={(l) => {
                if (!isAuthenticated || !currentUser.canDelete) {
                  handleOpenLoginModal(`حذف إجازة ${l.employee}`);
                  return;
                }
                setItemToDelete({
                  id: l.id,
                  title: `${l.employee} - ${l.leaveType} (${l.startDate})`,
                  type: 'leave'
                });
                setIsDeleteModalOpen(true);
              }}
            />

            {/* Monthly Interactive Calendar */}
            <div id="monthly-calendar-section">
              <MonthlyCalendar
                tasks={tasks}
                onEditTask={(t) => {
                  if (!isAuthenticated || !currentUser.canEdit) {
                    handleOpenLoginModal(`تعديل المهمة #${t.number || t.id}`);
                    return;
                  }
                  setEditingTask(t);
                  setIsTaskModalOpen(true);
                }}
                onToggleTaskDone={handleToggleTaskDone}
                onNavigateToFullLog={() => setCurrentTab('fullLog')}
              />
            </div>

            {/* Welcome Page Tasks Table (Phase 2, 6, 7, 8, 31, 42) */}
            <WelcomeTaskTable
              tasks={tasks}
              onAddTask={() => {
                if (!isAuthenticated || !currentUser.canAdd) {
                  handleOpenLoginModal('إضافة مهمة جديدة');
                  return;
                }
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              onEditTask={(t) => {
                if (!isAuthenticated || !currentUser.canEdit) {
                  handleOpenLoginModal(`تعديل المهمة #${t.number || t.id}`);
                  return;
                }
                setEditingTask(t);
                setIsTaskModalOpen(true);
              }}
              onDeleteTask={(t) => {
                if (!isAuthenticated || !currentUser.canDelete) {
                  handleOpenLoginModal(`حذف المهمة #${t.number || t.id}`);
                  return;
                }
                setItemToDelete({
                  id: t.id,
                  title: `#${t.number || t.id} - ${t.description}`,
                  type: 'task'
                });
                setIsDeleteModalOpen(true);
              }}
              onToggleTaskDone={handleToggleTaskDone}
              onNavigateToFullLog={() => setCurrentTab('fullLog')}
              weekFilterActive={weekFilterActive}
              onToggleWeekFilter={() => setWeekFilterActive(prev => !prev)}
            />
          </div>
        )}

        {currentTab === 'fullLog' && (
          /* Full Log & Advanced Search View (Phase 3, 4, 13, 14, 15, 17, 34, 35) */
          <FullLogView
            tasks={tasks}
            onAddTask={() => {
              if (!isAuthenticated || !currentUser.canAdd) {
                handleOpenLoginModal('إضافة مهمة جديدة');
                return;
              }
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
            onEditTask={(t) => {
              if (!isAuthenticated || !currentUser.canEdit) {
                handleOpenLoginModal(`تعديل المهمة #${t.number || t.id}`);
                return;
              }
              setEditingTask(t);
              setIsTaskModalOpen(true);
            }}
            onDeleteTask={(t) => {
              if (!isAuthenticated || !currentUser.canDelete) {
                handleOpenLoginModal(`حذف المهمة #${t.number || t.id}`);
                return;
              }
              setItemToDelete({
                id: t.id,
                title: `#${t.number || t.id} - ${t.description}`,
                type: 'task'
              });
              setIsDeleteModalOpen(true);
            }}
            onToggleTaskDone={handleToggleTaskDone}
            initialFilter={passedFilter}
          />
        )}

        {currentTab === 'directory' && (
          /* Directory View for Internal Telephones & Extensions */
          <DirectoryView
            entries={directoryEntries}
            onAddEntry={() => {
              if (!isAuthenticated || !currentUser.canAdd) {
                handleOpenLoginModal('إضافة جهة اتصال للدليل');
                return;
              }
              setEditingDirectory(null);
              setIsDirectoryModalOpen(true);
            }}
            onEditEntry={(entry) => {
              if (!isAuthenticated || !currentUser.canEdit) {
                handleOpenLoginModal(`تعديل بيانات ${entry.department} (${entry.name || ''})`);
                return;
              }
              setEditingDirectory(entry);
              setIsDirectoryModalOpen(true);
            }}
            onDeleteEntry={(entry) => {
              if (!isAuthenticated || !currentUser.canDelete) {
                handleOpenLoginModal(`حذف تحويلة ${entry.code} - ${entry.department}`);
                return;
              }
              setItemToDelete({
                id: entry.id,
                title: `تحويلة ${entry.code} - ${entry.department} (${entry.name || 'بدون اسم'})`,
                type: 'directory'
              });
              setIsDeleteModalOpen(true);
            }}
          />
        )}

        {currentTab === 'medical' && (
          /* Medical Network View for Healthcare Providers */
          <MedicalNetworkView
            entries={medicalEntries}
            onAddEntry={() => {
              if (!isAuthenticated || !currentUser.canAdd) {
                handleOpenLoginModal('إضافة جهة بالشبكة الطبية');
                return;
              }
              setEditingMedical(null);
              setIsMedicalModalOpen(true);
            }}
            onEditEntry={(entry) => {
              if (!isAuthenticated || !currentUser.canEdit) {
                handleOpenLoginModal(`تعديل ${entry.providerName}`);
                return;
              }
              setEditingMedical(entry);
              setIsMedicalModalOpen(true);
            }}
            onDeleteEntry={(entry) => {
              if (!isAuthenticated || !currentUser.canDelete) {
                handleOpenLoginModal(`حذف ${entry.providerName}`);
                return;
              }
              setItemToDelete({
                id: entry.id,
                title: `${entry.providerName} (${entry.governorate} - ${entry.providerType})`,
                type: 'medical'
              });
              setIsDeleteModalOpen(true);
            }}
          />
        )}

        {currentTab === 'saturday' && (
          <SaturdayAttendanceView
            attendances={saturdayAttendances}
            onAddAttendance={handleAddSaturday}
            onEditAttendance={handleEditSaturday}
            onDeleteAttendance={handleDeleteSaturday}
            nightShifts={nightShifts}
            onAddNightShift={handleAddNightShift}
            onDeleteNightShift={handleDeleteNightShift}
            onOpenNightShiftsCalendar={() => setIsNightShiftModalOpen(true)}
            currentUser={currentUser}
            onTriggerLogin={handleOpenLoginModal}
            onExportCSV={() => {
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
              const csv = toCSV(
                saturdayAttendances,
                ['م', 'الموظف', 'التاريخ', 'الملاحظات'],
                ['id', 'employee', 'date', 'notes']
              );
              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `saturday_attendance_${new Date().toISOString().split('T')[0]}.csv`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }}
            onOpenExportCenter={() => setIsBackupModalOpen(true)}
          />
        )}
      </main>

      {/* 4. Footer */}
      <footer className="w-full bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400 no-print mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-base" role="img" aria-label="علم مصر">🇪🇬</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              جمهورية مصر العربية — الإدارة المركزية لتكنولوجيا المعلومات
            </span>
          </div>
          <div>
            سجل المهام اليومية والدعم الفني والعمليات ودليل الخدمات • الإصدار المعتمد 2026
          </div>
        </div>
      </footer>

      {/* 5. Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        initialTask={editingTask}
        departments={allDepartments}
        technicians={allTechnicians}
      />

      <LeaveModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSave={handleSaveLeave}
        initialLeave={editingLeave}
        employees={allEmployees}
        recentLeaves={leaves}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        itemTitle={itemToDelete?.title || ''}
        itemType={itemToDelete?.type || 'task'}
      />

      <UrgentModal
        isOpen={isUrgentModalOpen}
        onClose={() => setIsUrgentModalOpen(false)}
        urgentText={urgentText}
        urgentActive={urgentActive}
        onSave={handleSaveUrgent}
      />

      <MemoModal
        isOpen={isMemoModalOpen}
        onClose={() => setIsMemoModalOpen(false)}
        memoText={memoText}
        onSave={handleSaveMemo}
      />

      <PrayerModal
        isOpen={isPrayerModalOpen}
        onClose={() => setIsPrayerModalOpen(false)}
        prayerTimes={prayerTimes}
        onSave={handleSavePrayer}
        onTestAlert={handleTestPrayerAlert}
      />

      <DirectoryModal
        isOpen={isDirectoryModalOpen}
        onClose={() => setIsDirectoryModalOpen(false)}
        onSave={handleSaveDirectory}
        initialEntry={editingDirectory}
      />

      <MedicalModal
        isOpen={isMedicalModalOpen}
        onClose={() => setIsMedicalModalOpen(false)}
        onSave={handleSaveMedical}
        initialEntry={editingMedical}
      />

      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        tasks={tasks}
        directory={directoryEntries}
        medicalNetwork={medicalEntries}
        saturdayAttendances={saturdayAttendances}
        leaves={leaves}
        nightShifts={nightShifts}
        onImportFullBackup={handleImportFullBackup}
        onResetToDefaults={handleResetToDefaults}
      />

      {/* Quick Calculator Modal (Matching Photo 1) */}
      <QuickCalculatorModal
        isOpen={isCalculatorModalOpen}
        onClose={() => setIsCalculatorModalOpen(false)}
      />

      {/* Discussions / Team Communication Modal (Matching Photo 1) */}
      <DiscussionsModal
        isOpen={isDiscussionsModalOpen}
        onClose={() => setIsDiscussionsModalOpen(false)}
        currentUserId={currentUser?.id}
        currentUserName={currentUser?.name}
        currentUserEmail={currentUser?.id === 'amir' ? 'amir.goeic2000@gmail.com' : `${currentUser?.id || 'amir'}@goeic.gov.eg`}
      />

      {/* App-Aware AI Chatbot for GOEIC Operations */}
      <GoeicChatbotModal
        isOpen={isChatbotModalOpen}
        onClose={() => setIsChatbotModalOpen(false)}
        tasks={tasks}
        leaves={leaves}
        directoryEntries={directoryEntries}
        medicalEntries={medicalEntries}
        saturdayAttendances={saturdayAttendances}
        nightShifts={nightShifts}
        prayerTimes={prayerTimes}
        urgentText={urgentText}
        memoText={memoText}
        currentUser={currentUser}
      />

      {/* Islamic Utility Modals (Morning Adhkar, Duas, Quran, Tasbih) */}
      <AdhkarModal
        isOpen={isAdhkarModalOpen}
        onClose={() => setIsAdhkarModalOpen(false)}
      />

      <DuasModal
        isOpen={isDuasModalOpen}
        onClose={() => setIsDuasModalOpen(false)}
      />

      <QuranModal
        isOpen={isQuranModalOpen}
        onClose={() => setIsQuranModalOpen(false)}
      />

      <TasbihModal
        isOpen={isTasbihModalOpen}
        onClose={() => setIsTasbihModalOpen(false)}
      />

      {/* Interactive Monthly Night Shift Calendar Modal (كارت أيام السهر بالتقويم الشهري) */}
      <NightShiftCalendarModal
        isOpen={isNightShiftModalOpen}
        onClose={() => setIsNightShiftModalOpen(false)}
        nightShiftRecords={nightShiftRecords}
        onToggleNightShift={handleToggleNightShift}
        onDeleteNightShiftRecord={handleDeleteNightShiftRecord}
        currentUser={currentUser}
        isAuthenticated={isAuthenticated}
        onOpenLoginModal={handleOpenLoginModal}
      />

      {/* Authentication Login Modal */}
      <LoginAuthModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        actionDescription={loginModalActionDesc}
        prefilledUsername={loginModalPrefill}
      />

      {/* Floating GOEIC AI Chatbot Summon Button */}
      <button
        onClick={() => setIsChatbotModalOpen(true)}
        className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-black px-4 py-3 rounded-full shadow-2xl flex items-center gap-2.5 border-2 border-white ring-4 ring-amber-400/30 hover:scale-105 active:scale-95 transition-all no-print cursor-pointer"
        title="شات بوت المنظومة الذكي - اسأل عن المهام والإجازات والدليل والورديات"
      >
        <div className="w-8 h-8 rounded-full bg-[#182a48] flex items-center justify-center text-amber-400 shadow-sm">
          <Bot className="w-4 h-4" />
        </div>
        <div className="text-right">
          <div className="text-xs font-black leading-tight">شات بوت GOEIC</div>
          <div className="text-[10px] opacity-90 leading-tight">اسأل عن أي معلومة</div>
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping mr-1" />
      </button>

      {/* LlamaBot / Leonardo Feedback Bubble with Screenshot Annotator & Video Recorder */}
      <FeedbackBubble
        onOpenDiscussions={handleOpenDiscussionsModal}
        urgentText={urgentText}
        memoText={memoText}
      />

    </div>
  );
}

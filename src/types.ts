export interface Task {
  id: number;
  number: number;
  day: string;
  date: string; // e.g. "11 Aug 2026" or ISO
  department: string;
  description: string;
  done: boolean;
  technician: string; // "المهندس المسؤول"
  notes: string;
  entryDate?: string;
}

export type LeaveType = 
  | 'إجازة اعتيادي'
  | 'إجازة عارضة'
  | 'إذن صباحى'
  | 'إذن مسائى'
  | 'مأمورية'
  | 'حضور سبت';

export interface EmployeeLeave {
  id: string;
  employee: string;
  leaveType: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  daysCount: number;
  notes: string;
  entryDate?: string;
}

export interface SaturdayAttendance {
  id: number;
  employee: string;
  date: string; // YYYY-MM-DD
  notes?: string;
}

export interface NightShiftRecord {
  id: string;
  date: string; // YYYY-MM-DD
  userId: string;
  userName: string;
  userBadgeColor?: string;
  notes?: string;
  createdAt?: string;
}

export interface DirectoryEntry {
  id: number;
  code: string;       // التحويلة الداخلية
  department: string; // الإدارة أو القطاع
  name: string;       // الاسم أو المنصب
  entryDate?: string;
}

export interface MedicalNetworkEntry {
  id: number;
  providerId?: number;
  governorate: string; // المحافظة
  providerName: string; // اسم الجهة أو الطبيب
  area: string;        // المنطقة أو الحي
  networkType: string; // فئة الشبكة (A, B, A+)
  mainBranch?: string; // رئيسي / فرع
  specialty: string;   // التخصص
  providerType: string;// مستشفى / معمل / صيدلية / مركز أشعة / طبيب / بصريات
  degree?: string;     // استشاري / اخصائي / استاذ
  address: string;     // العنوان
  telephone: string;   // الهاتف
  notes?: string;
}

export interface Memo {
  content: string;
  updatedAt: string; // ISO string
}

export interface UrgentNotice {
  content: string;
  active: boolean;
  updatedAt: string;
}

export interface PrayerTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  lastFetchedDate: string;
}

export interface FilterState {
  searchQuery: string;
  department: string;
  technician: string;
  status: 'all' | 'done' | 'open' | 'overdue';
  period: 'all' | 'week' | 'month';
  month: string; // e.g. "2026-08" or "all"
  sortBy: 'newest' | 'oldest' | 'department' | 'technician';
}

export type AppUserRole = 'admin' | 'tamer' | 'editor' | 'readonly' | 'guest';

export interface AppUser {
  id: string;
  name: string;
  arabicName?: string;
  username: string;
  defaultPassword?: string;
  email?: string;
  role: AppUserRole;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  description: string;
  badgeColor: string;
  profilePic?: string;
  bioAudio?: string;
  disabled?: boolean;
  lastSignInAt?: string;
}

export const APP_USERS: AppUser[] = [
  {
    id: 'tamer',
    name: 'تامر محمد',
    arabicName: 'تامر محمد',
    username: 'tamer',
    defaultPassword: 'tamer@2026',
    email: 'tamer@goeic.gov.eg',
    role: 'admin',
    canAdd: true,
    canEdit: true,
    canDelete: true,
    description: 'مسؤول العمليات والدعم الفني — كامل الصلاحيات (إضافة، تعديل، حذف، إدارة)',
    badgeColor: 'bg-emerald-600 text-white',
    disabled: false,
    lastSignInAt: '2026-09-08 08:30:00',
  },
  {
    id: 'shaimaa',
    name: 'شيماء عبدالحميد',
    arabicName: 'شيماء عبدالحميد',
    username: 'shaimaa',
    defaultPassword: 'shaimaa@2026',
    email: 'shaimaa@goeic.gov.eg',
    role: 'admin',
    canAdd: true,
    canEdit: true,
    canDelete: true,
    description: 'مهندسة تشغيل ونظم — كامل الصلاحيات (إضافة، تعديل، حذف، إدارة)',
    badgeColor: 'bg-purple-600 text-white',
    disabled: false,
    lastSignInAt: '2026-09-08 08:10:00',
  },
  {
    id: 'hanafy',
    name: 'محمد حنفي',
    arabicName: 'محمد حنفي',
    username: 'hanafy',
    defaultPassword: 'hanafy@2026',
    email: 'hanafy@goeic.gov.eg',
    role: 'admin',
    canAdd: true,
    canEdit: true,
    canDelete: true,
    description: 'مسؤول تشغيل ومتابعة — كامل الصلاحيات (إضافة، تعديل، حذف، إدارة)',
    badgeColor: 'bg-amber-600 text-white',
    disabled: false,
    lastSignInAt: '2026-09-08 08:20:00',
  },
  {
    id: 'amir',
    name: 'أمير طلعت',
    arabicName: 'أمير طلعت',
    username: 'amir',
    defaultPassword: 'amir@2026',
    email: 'amir.goeic2000@gmail.com',
    role: 'admin',
    canAdd: true,
    canEdit: true,
    canDelete: true,
    description: 'مدير النظام (أدمن) — كامل الصلاحيات (إضافة، تعديل، حذف، إدارة)',
    badgeColor: 'bg-indigo-600 text-white',
    disabled: false,
    bioAudio: 'audio_bio_amir.webm',
    lastSignInAt: '2026-09-08 09:15:00',
  },
  {
    id: 'kody',
    name: 'كودي (Kody)',
    arabicName: 'كودي',
    username: 'kody',
    defaultPassword: 'kody@2026',
    email: 'kody@goeic.gov.eg',
    role: 'admin',
    canAdd: true,
    canEdit: true,
    canDelete: true,
    description: 'مدير النظام (أدمن) — كامل الصلاحيات (إضافة، تعديل، حذف، إدارة)',
    badgeColor: 'bg-blue-600 text-white',
    disabled: false,
    lastSignInAt: '2026-09-08 08:45:00',
  },
  {
    id: 'guest',
    name: 'زائر (مشاهدة فقط)',
    arabicName: 'زائر',
    username: 'guest',
    email: 'guest@goeic.gov.eg',
    role: 'guest',
    canAdd: false,
    canEdit: false,
    canDelete: false,
    description: 'وضع المشاهدة فقط — لا يملك صلاحيات الإضافة أو التعديل أو الحذف (للمطالعة والاستعلام فقط)',
    badgeColor: 'bg-slate-600 text-white',
    disabled: false,
    lastSignInAt: '2026-09-08 07:00:00',
  },
];

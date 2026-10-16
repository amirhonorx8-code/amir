import { AppUser, APP_USERS } from '../types';

export interface AuthSession {
  userId: string;
  userName: string;
  loggedInAt: string;
  authenticated: boolean;
}

export interface UserCredentialInfo {
  id: string;
  name: string;
  arabicName: string;
  username: string;
  passwordDisplay: string;
  roleDescription: string;
  badgeColor: string;
}

export const AUTHORIZED_CREDENTIALS: UserCredentialInfo[] = [
  {
    id: 'tamer',
    name: 'Tamer Mohamed',
    arabicName: 'تامر محمد',
    username: 'tamer',
    passwordDisplay: 'tamer@2026',
    roleDescription: 'مسؤول العمليات والدعم الفني — كامل الصلاحيات (إضافة وتعديل وحذف وإدارة)',
    badgeColor: 'bg-emerald-600 text-white'
  },
  {
    id: 'shaimaa',
    name: 'Shaaimaa Abdelhamid',
    arabicName: 'شيماء عبدالحميد',
    username: 'shaimaa',
    passwordDisplay: 'shaimaa@2026',
    roleDescription: 'مهندسة تشغيل ونظم — كامل الصلاحيات (إضافة وتعديل وحذف وإدارة)',
    badgeColor: 'bg-purple-600 text-white'
  },
  {
    id: 'hanafy',
    name: 'Mohamed Hanafy',
    arabicName: 'محمد حنفي',
    username: 'hanafy',
    passwordDisplay: 'hanafy@2026',
    roleDescription: 'مسؤول تشغيل ومتابعة — كامل الصلاحيات (إضافة وتعديل وحذف وإدارة)',
    badgeColor: 'bg-amber-600 text-white'
  },
  {
    id: 'amir',
    name: 'Amir Talaat',
    arabicName: 'أمير طلعت',
    username: 'amir',
    passwordDisplay: 'amir@2026',
    roleDescription: 'مدير النظام (أدمن) — كامل الصلاحيات (إضافة وتعديل وحذف وإدارة)',
    badgeColor: 'bg-indigo-600 text-white'
  },
  {
    id: 'kody',
    name: 'Kody (AI Admin)',
    arabicName: 'كودي',
    username: 'kody',
    passwordDisplay: 'kody@2026',
    roleDescription: 'مدير النظام (أدمن) — كامل الصلاحيات (إضافة وتعديل وحذف وإدارة)',
    badgeColor: 'bg-blue-600 text-white'
  }
];

const normalizeStr = (str: string = ''): string => {
  return str
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/\s+/g, '')
    .trim();
};

/**
 * Validate user login against username (English, Arabic, id, or email) and password
 */
export function validateLogin(usernameInput: string, passwordInput: string): { 
  success: boolean; 
  user?: AppUser; 
  error?: string;
} {
  const normUser = normalizeStr(usernameInput);
  const rawPass = (passwordInput || '').trim();

  if (!normUser) {
    return { success: false, error: 'يرجى إدخال اسم المستخدم' };
  }
  if (!rawPass) {
    return { success: false, error: 'يرجى إدخال كلمة المرور' };
  }

  // Find candidate user in APP_USERS
  const matchedUser = APP_USERS.find(u => {
    if (u.id === 'guest') return false; // Guest does not have password login
    const idMatch = normalizeStr(u.id) === normUser;
    const usernameMatch = normalizeStr(u.username) === normUser;
    const nameMatch = normalizeStr(u.name) === normUser;
    const arabicMatch = u.arabicName ? normalizeStr(u.arabicName) === normUser : false;
    const emailMatch = u.email ? normalizeStr(u.email.split('@')[0]) === normUser || normalizeStr(u.email) === normUser : false;
    
    // Additional flexible aliases
    const isTamerAlias = (u.id === 'tamer') && (normUser.includes('تامر') || normUser === 'tamer');
    const isShaimaaAlias = (u.id === 'shaimaa') && (normUser.includes('شيماء') || normUser === 'shaimaa');
    const isHanafyAlias = (u.id === 'hanafy') && (normUser.includes('حنف') || normUser === 'hanafy' || normUser === 'mohamed');
    const isAmirAlias = (u.id === 'amir') && (normUser.includes('امير') || normUser === 'amir' || normUser === 'admin');

    return idMatch || usernameMatch || nameMatch || arabicMatch || emailMatch || isTamerAlias || isShaimaaAlias || isHanafyAlias || isAmirAlias;
  });

  if (!matchedUser) {
    return { 
      success: false, 
      error: `اسم المستخدم غير صحيح. الحسابات المصرح لها: تامر محمد (tamer)، شيماء عبدالحميد (shaimaa)، محمد حنفي (hanafy)، أو أمير (amir).` 
    };
  }

  // Check custom password saved in localStorage or default password
  let validPassword = matchedUser.defaultPassword || `${matchedUser.id}@2026`;
  try {
    const savedCustomPasswords = localStorage.getItem('it_user_passwords');
    if (savedCustomPasswords) {
      const parsed = JSON.parse(savedCustomPasswords);
      if (parsed[matchedUser.id]) {
        validPassword = parsed[matchedUser.id];
      }
    }
  } catch (e) {
    console.error(e);
  }

  // Strict check: Only password specific to this user account is accepted
  const isCorrectPassword = rawPass === validPassword;

  if (!isCorrectPassword) {
    return { 
      success: false, 
      error: `كلمة المرور غير صحيحة لحساب "${matchedUser.name}". يرجى إدخال كلمة السر المخصصة لهذا الحساب فقط.` 
    };
  }

  // Success
  return {
    success: true,
    user: matchedUser
  };
}

/**
 * Save user authentication session
 */
export function saveAuthSession(user: AppUser): void {
  try {
    const session: AuthSession = {
      userId: user.id,
      userName: user.name,
      loggedInAt: new Date().toISOString(),
      authenticated: true
    };
    localStorage.setItem('it_auth_session', JSON.stringify(session));
    localStorage.setItem('it_current_user_id', user.id);
  } catch (e) {
    console.error(e);
  }
}

/**
 * Clear authentication session and revert to Guest
 */
export function clearAuthSession(): void {
  try {
    localStorage.removeItem('it_auth_session');
    localStorage.setItem('it_current_user_id', 'guest');
  } catch (e) {
    console.error(e);
  }
}

/**
 * Check if there is an active valid authenticated session.
 * If not authenticated, returns Guest (view only).
 */
export function getStoredAuthSession(): { user: AppUser; isAuthenticated: boolean } {
  const guestUser = APP_USERS.find(u => u.id === 'guest') || {
    id: 'guest',
    name: 'زائر (مشاهدة فقط)',
    arabicName: 'زائر',
    username: 'guest',
    role: 'guest',
    canAdd: false,
    canEdit: false,
    canDelete: false,
    description: 'وضع المشاهدة فقط — لا يملك صلاحيات الإضافة أو التعديل أو الحذف (للمطالعة والاستعلام فقط)',
    badgeColor: 'bg-slate-600 text-white'
  };

  try {
    const sessionStr = localStorage.getItem('it_auth_session');
    const savedUserId = localStorage.getItem('it_current_user_id');

    // If explicit guest mode or no session, return guest
    if (savedUserId === 'guest' || !sessionStr) {
      return { user: guestUser as AppUser, isAuthenticated: false };
    }

    if (sessionStr) {
      const session: AuthSession = JSON.parse(sessionStr);
      if (session && session.authenticated === true && session.userId && session.userId !== 'guest') {
        const found = APP_USERS.find(u => u.id === session.userId);
        if (found) {
          return { 
            user: { ...found, canAdd: true, canEdit: true, canDelete: true, role: 'admin' }, 
            isAuthenticated: true 
          };
        }
      }
    }
  } catch (e) {
    console.error(e);
  }

  // Default: Guest (View only) requiring login to enter any account
  return { 
    user: guestUser as AppUser, 
    isAuthenticated: false 
  };
}

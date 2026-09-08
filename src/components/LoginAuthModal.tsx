import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  User, 
  KeyRound, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Shield,
  Key,
  LogIn
} from 'lucide-react';
import { AppUser, APP_USERS } from '../types';
import { validateLogin, saveAuthSession, AUTHORIZED_CREDENTIALS } from '../utils/auth';

interface LoginAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AppUser) => void;
  actionDescription?: string;
  prefillUsername?: string;
}

export const LoginAuthModal: React.FC<LoginAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  actionDescription,
  prefillUsername = ''
}) => {
  const [username, setUsername] = useState(prefillUsername);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'credentials' | 'change_password'>('login');
  
  // Change password state
  const [changeUser, setChangeUser] = useState('tamer');
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [changeMsg, setChangeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
      setSuccessMessage('');
      setPassword('');
      if (prefillUsername) {
        setUsername(prefillUsername);
      }
    }
  }, [isOpen, prefillUsername]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const res = validateLogin(username, password);
      setIsLoading(false);

      if (res.success && res.user) {
        saveAuthSession(res.user);
        setSuccessMessage(`تم التحقق بنجاح! مرحباً بك يا ${res.user.name}`);
        setTimeout(() => {
          onLoginSuccess(res.user!);
          onClose();
        }, 600);
      } else {
        setErrorMessage(res.error || 'فشل تسجيل الدخول. يرجى التأكد من اسم المستخدم وكلمة المرور.');
      }
    }, 250);
  };

  const handleSelectAccountForLogin = (cred: typeof AUTHORIZED_CREDENTIALS[0]) => {
    setUsername(cred.username);
    setPassword('');
    setErrorMessage('');
    setSuccessMessage('');
    setActiveTab('login');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setChangeMsg(null);

    // Validate old password
    const checkOld = validateLogin(changeUser, oldPass);
    if (!checkOld.success) {
      setChangeMsg({ type: 'error', text: 'كلمة المرور الحالية غير صحيحة.' });
      return;
    }

    if (!newPass || newPass.length < 4) {
      setChangeMsg({ type: 'error', text: 'كلمة المرور الجديدة يجب ألا تقل عن 4 خانات.' });
      return;
    }

    // Save in localStorage
    try {
      const existing = localStorage.getItem('it_user_passwords') || '{}';
      const parsed = JSON.parse(existing);
      parsed[changeUser] = newPass;
      localStorage.setItem('it_user_passwords', JSON.stringify(parsed));
      setChangeMsg({ type: 'success', text: `تم تغيير كلمة المرور بنجاح لحساب ${changeUser}!` });
      setOldPass('');
      setNewPass('');
    } catch (e) {
      setChangeMsg({ type: 'error', text: 'تعذر حفظ كلمة المرور الجديدة.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm no-print font-['Cairo',sans-serif]">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-right"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#182a48] via-[#1b3459] to-[#12233c] text-white p-5 flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#182a48] rounded-[14px] flex items-center justify-center">
                <Lock className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <h3 className="font-black text-lg tracking-tight flex items-center gap-2">
                <span>تسجيل الدخول وتأكيد الصلاحية</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                  أمان GOEIC
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                يلزم تسجيل الدخول باسم مستخدم وكلمة مرور مصرح بها لإجراء التعديل أو الحذف
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose} 
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Trigger Banner (if triggered by a specific click like edit or delete) */}
        {actionDescription && (
          <div className="bg-amber-500/10 dark:bg-amber-950/40 border-b border-amber-500/20 px-5 py-2.5 flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
            <span>الإجراء المطلوب: <strong>{actionDescription}</strong> (يتطلب حساباً مصرحاً له)</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow-sm border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>تسجيل الدخول</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('credentials')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'credentials'
                ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 shadow-sm border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>دليل الحسابات وكلمات المرور</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('change_password')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'change_password'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-sm border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>تغيير كلمة المرور</span>
          </button>
        </div>

        {/* Tab 1: Login Form */}
        {activeTab === 'login' && (
          <div className="p-5 sm:p-6 space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <div className="leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                  اسم المستخدم (Username)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="مثال: tamer أو shaimaa أو hanafy أو amir"
                    className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                  />
                </div>
                <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
                  <span>يقبل الاسم بالعربية أو الإنجليزية (تامر محمد، شيماء عبدالحميد، محمد حنفي، أمير طلعت)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                  كلمة المرور (Password)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور المعتمدة..."
                    className="w-full pr-10 pl-11 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-[#182a48] hover:brightness-110 active:scale-[0.99] text-white font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{isLoading ? 'جارٍ التحقق...' : 'تسجيل الدخول والبدء بالتعديل'}</span>
                </button>
              </div>
            </form>

            {/* Quick User Selection Bar */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="text-[11px] font-bold text-slate-500 mb-2 flex items-center justify-between">
                <span>اختر حسابك لكتابة كلمة السر الخاصة به:</span>
                <span className="text-amber-600 dark:text-amber-400 font-mono">يلزم إدخال كلمة المرور</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {AUTHORIZED_CREDENTIALS.map((cred) => (
                  <button
                    key={cred.id}
                    type="button"
                    onClick={() => handleSelectAccountForLogin(cred)}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 dark:hover:border-indigo-500/50 bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-right transition-all group flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600">
                        {cred.arabicName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {cred.username}
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      اختيار
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Credentials Directory (Detailed Table of Usernames and Passwords) */}
        {activeTab === 'credentials' && (
          <div className="p-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 text-xs">
              <div className="font-bold mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>بيانات الحسابات المعتمدة المصرح لها بإجراء التعديل والحذف:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-blue-700 dark:text-blue-300">
                كل حساب له كلمة مرور خاصة ومستقلة تماماً، ولا يمكن الدخول لأي حساب إلا من خلال كلمة المرور الخاصة به.
              </p>
            </div>

            <div className="space-y-3">
              {AUTHORIZED_CREDENTIALS.map((cred) => (
                <div 
                  key={cred.id} 
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900 dark:text-white">{cred.arabicName}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cred.badgeColor}`}>
                        كامل الصلاحيات
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{cred.roleDescription}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                      <div className="bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded font-mono text-slate-700 dark:text-slate-300">
                        اسم المستخدم: <strong>{cred.username}</strong>
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300/40 px-2 py-0.5 rounded font-mono text-amber-700 dark:text-amber-400 font-bold">
                        كلمة المرور الخاصة: <strong>{cred.passwordDisplay}</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectAccountForLogin(cred)}
                    className="py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all shrink-0"
                  >
                    <span>اختيار الحساب وكتابة كلمة المرور</span>
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 font-medium">
              🔒 <strong>تأكيد الأمان:</strong> الحسابات لا تفتح إلا بكتابة كلمة السر الخاصة بكل مهندس، ولا يوجد تخطٍ أو دخول تلقائي دون التحقق.
            </div>
          </div>
        )}

        {/* Tab 3: Change Password */}
        {activeTab === 'change_password' && (
          <div className="p-5 sm:p-6 space-y-4">
            <div className="text-xs text-slate-500">
              يمكنك تحديث كلمة المرور الخاصة بحسابك لحفظها محلياً على هذا الجهاز:
            </div>

            {changeMsg && (
              <div className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                changeMsg.type === 'success' 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 border border-emerald-200' 
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 border border-rose-200'
              }`}>
                {changeMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                <span>{changeMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                  اختر الحساب المراد تعديل كلمة مروره
                </label>
                <select
                  value={changeUser}
                  onChange={(e) => setChangeUser(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="tamer">تامر محمد (tamer)</option>
                  <option value="shaimaa">شيماء عبدالحميد (shaimaa)</option>
                  <option value="hanafy">محمد حنفي (hanafy)</option>
                  <option value="amir">أمير طلعت (amir)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                  كلمة المرور الحالية
                </label>
                <input
                  type="password"
                  required
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  placeholder="أدخل كلمة المرور الحالية..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                  كلمة المرور الجديدة
                </label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="أدخل كلمة المرور الجديدة (4 أحرف فأكثر)..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  حفظ كلمة المرور الجديدة
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 bg-slate-100/70 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>نظام الحماية والتحقق من الهوية — GOEIC</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-bold px-3 py-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

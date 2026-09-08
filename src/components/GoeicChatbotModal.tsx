import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Building2, 
  HeartPulse, 
  MoonStar, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Compass,
  ArrowDownCircle,
  Copy,
  Check,
  MapPin,
  Building,
  Activity,
  FileText,
  Search,
  ExternalLink,
  CalendarDays,
  ShieldCheck
} from 'lucide-react';
import { 
  Task, 
  EmployeeLeave, 
  DirectoryEntry, 
  MedicalNetworkEntry, 
  SaturdayAttendance, 
  PrayerTimes, 
  AppUser,
  APP_USERS
} from '../types';

export interface EgyptianHoliday {
  name: string;
  date: string;
  day: string;
  description: string;
}

export const EGYPTIAN_HOLIDAYS_2026: EgyptianHoliday[] = [
  { name: 'عيد الميلاد المجيد', date: '2026-01-07', day: 'الأربعاء', description: 'عطلة رسمية بمناسبة عيد الميلاد المجيد' },
  { name: 'ثورة 25 يناير وعيد الشرطة', date: '2026-01-25', day: 'الأحد', description: 'عطلة رسمية بمناسبة ذكرى ثورة 25 يناير وعيد الشرطة' },
  { name: 'وقفة وعيد الفطر المبارك', date: '2026-03-20 إلى 2026-03-23', day: 'الجمعة - الإثنين', description: 'إجازة عيد الفطر المبارك الرسمية' },
  { name: 'عيد تحرير سيناء', date: '2026-04-25', day: 'السبت', description: 'عطلة رسمية بمناسبة ذكرى تحرير سيناء' },
  { name: 'عيد العمال', date: '2026-05-01', day: 'الجمعة', description: 'عطلة رسمية بمناسبة عيد العمال العالمي' },
  { name: 'شم النسيم', date: '2026-05-11', day: 'الإثنين', description: 'عطلة رسمية بمناسبة شم النسيم' },
  { name: 'وقفة عرفات وعيد الأضحى المبارك', date: '2026-05-26 إلى 2026-05-30', day: 'الثلاثاء - السبت', description: 'إجازة عيد الأضحى المبارك' },
  { name: 'رأس السنة الهجرية (1448 هـ)', date: '2026-06-16', day: 'الثلاثاء', description: 'عطلة رسمية بمناسبة بداية العام الهجري الجديد' },
  { name: 'ثورة 30 يونيو', date: '2026-06-30', day: 'الثلاثاء', description: 'عطلة رسمية بمناسبة ذكرى ثورة 30 يونيو' },
  { name: 'ثورة 23 يوليو', date: '2026-07-23', day: 'الخميس', description: 'عطلة رسمية بمناسبة ذكرى ثورة 23 يوليو المجيدة' },
  { name: 'المولد النبوي الشريف', date: '2026-08-25', day: 'الثلاثاء', description: 'عطلة رسمية بمناسبة المولد النبوي الشريف' },
  { name: 'عيد القوات المسلحة (نصر 6 أكتوبر)', date: '2026-10-06', day: 'الثلاثاء', description: 'عطلة رسمية بمناسبة ذكرى انتصارات حرب أكتوبر المجيدة' },
];

const normalizeArabic = (text: string = ''): string => {
  return text
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F]/g, '')
    .trim();
};

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  dataSnippet?: {
    type: 'tasks' | 'leaves' | 'directory' | 'medical' | 'attendance' | 'summary' | 'users' | 'urgent' | 'holidays';
    items?: any[];
  };
}

interface GoeicChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  leaves: EmployeeLeave[];
  directoryEntries: DirectoryEntry[];
  medicalEntries: MedicalNetworkEntry[];
  saturdayAttendances: SaturdayAttendance[];
  nightShifts: any[];
  prayerTimes: PrayerTimes;
  urgentText?: string;
  memoText?: string;
  currentUser?: AppUser;
}

export const GoeicChatbotModal: React.FC<GoeicChatbotModalProps> = ({
  isOpen,
  onClose,
  tasks,
  leaves,
  directoryEntries,
  medicalEntries,
  saturdayAttendances,
  nightShifts,
  prayerTimes,
  urgentText,
  memoText,
  currentUser
}) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    return [
      {
        id: 'welcome-msg',
        sender: 'bot',
        text: `أهلاً بك يا ${currentUser?.name || 'زميلي العزيز'} في **المساعد الذكي لمنظومة GOEIC**! 🤖🇪🇬\n\nأنا مرتبط **مباشرة بقاعدة بيانات التطبيق الحية** وأستخرج لك المعلومات فورياً من:\n• 📞 **دليل التليفونات**: أرقام الهواتف والتحويلات لجميع المهندسين والإدارات (${directoryEntries.length} جهة).\n• 📋 **المهام اليومية**: المفتوحة، المنجزة، مهام كل مهندس، والبحث في الأعطال (${tasks.length} مهمة).\n• 🏥 **الشبكة الطبية**: المستشفيات، المعامل، العيادات، والأطباء المعتمدين (${medicalEntries.length} جهة).\n• 🌴 **أيام الإجازات والعطلات**: سجل إجازات وأذونات العاملين بالهيئة بالإضافة لجدول العطلات الرسمية للدولة.\n• 🌙 **أيام السهر وحضور السبت** ومواقيت الصلاة والتنبيهات العاجلة.\n\nتفضل بالسؤال عن أي تليفون، مهمة، إجازة، أو جهة طبية وسأجيبك في ثوانٍ! ✨`,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    '📞 دليل أرقام الهواتف والتحويلات',
    '📋 ما هي المهام المفتوحة حالياً؟',
    '🌴 أيام الإجازات والعطلات الرسمية',
    '🏥 مستشفيات الشبكة الطبية بالقاهرة',
    '🔍 رقم تليفون وليد أو محمد فايز',
    '👨‍💼 مهام المهندس محمد حنفي',
    '🌙 مواعيد أيام السهر وحضور السبت',
    '📊 ملخص شامل لحالة المنظومة'
  ];

  // Play gentle sound
  const playDing = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch (e) {
      // Audio not permitted yet
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedSnippetId(id);
      setTimeout(() => setCopiedSnippetId(null), 2000);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  // Process user question directly against live app data
  const handleAnswer = (question: string) => {
    const rawQ = question.trim();
    const q = normalizeArabic(question);
    let reply = '';
    let snippet: Message['dataSnippet'] = undefined;

    // Helper: Clean search query by removing conversational filler words
    const cleanSearchTerm = (str: string, removeWords: string[]): string => {
      let result = normalizeArabic(str);
      for (const w of removeWords) {
        result = result.replace(new RegExp(normalizeArabic(w), 'g'), ' ');
      }
      return result.replace(/\s+/g, ' ').trim();
    };

    // =========================================================================
    // 1. PHONE DIRECTORY & CONTACT NUMBERS (دليل الهواتف وأرقام التليفونات)
    // =========================================================================
    const isPhoneIntent = 
      q.includes('تليفون') || 
      q.includes('هاتف') || 
      q.includes('رقم') || 
      q.includes('ارقام') || 
      q.includes('تحويل') || 
      q.includes('دليل') || 
      q.includes('موبايل') || 
      q.includes('اتصال') || 
      q.includes('phone') || 
      q.includes('extension') || 
      q.includes('directory');

    // Check if the query specifically matches a person or department in the directory
    const directContactMatch = directoryEntries.filter(d => {
      const name = normalizeArabic(d.name);
      const dept = normalizeArabic(d.department);
      return (name && q.includes(name)) || (dept && q.includes(dept)) || (d.code && q.includes(d.code));
    });

    if (isPhoneIntent || (directContactMatch.length > 0 && !q.includes('مهم') && !q.includes('اجاز') && !q.includes('طب'))) {
      const searchWords = ['تليفون', 'هاتف', 'ارقام', 'رقم', 'تحويله', 'تحويلة', 'دليل', 'موبايل', 'اتصال', 'فون', 'phone', 'extension', 'directory', 'مهندس', 'استاذ', 'أ.', 'م.', 'عايز', 'من فضلك', 'ابحث', 'عن', 'هو', 'كام', 'في', 'لو سمحت', 'الهاتف'];
      const targetTerm = cleanSearchTerm(question, searchWords);

      let matches: DirectoryEntry[] = [];
      if (targetTerm.length > 0) {
        matches = directoryEntries.filter(d => {
          const normName = normalizeArabic(d.name || '');
          const normDept = normalizeArabic(d.department || '');
          const code = (d.code || '').trim();
          return normName.includes(targetTerm) || normDept.includes(targetTerm) || code.includes(targetTerm);
        });
      }

      if (matches.length > 0) {
        reply = `📞 **عثرت على (${matches.length}) نتيجة في دليل الهواتف والتحويلات للبحث عن "${targetTerm}":**\n\n` +
          matches.slice(0, 6).map((m, idx) => 
            `**${idx + 1}. ${m.name}**\n` +
            `   🏢 الإدارة / القسم: ${m.department || 'إدارة عامة'}\n` +
            `   📱 التحويلة / الهاتف الداخلي: **${m.code}**`
          ).join('\n\n') +
          (matches.length > 6 ? `\n\n*(ويوجد ${matches.length - 6} جهة اتصال أخرى مطابقة في السجل)*` : '') +
          `\n\n💡 يمكنك النقر على زر الاتصال أو النسخ المباشر من البطاقات أدناه.`;

        snippet = {
          type: 'directory',
          items: matches.slice(0, 6)
        };
      } else if (targetTerm.length > 0) {
        // Did not find exact match for term
        reply = `📞 **دليل التليفونات والتحويلات:**\nلم أجد جهة اتصال أو تحويلة مطابقة بدقة لعبارة **"${targetTerm}"** في الدليل الحالي (${directoryEntries.length} جهة مسجلة).\n\nأمثلة لأهم التحويلات المسجلة في الهيئة:\n` +
          directoryEntries.slice(0, 5).map(m => `• **${m.name}** (${m.department}): تحويلة **${m.code}**`).join('\n') +
          `\n\n💡 يمكنك البحث باسم المهندس الأول (مثل: "وليد"، "أميرة"، "فايز"، "عماد") أو باسم الإدارة (مثل: "العمليات"، "المكتب الفني"، "الشبكات").`;
        snippet = {
          type: 'directory',
          items: directoryEntries.slice(0, 4)
        };
      } else {
        // General Directory Overview
        reply = `📞 **دليل الهواتف والتحويلات الداخلية لمنظومة GOEIC:**\n` +
          `يحتوي الدليل اللحظي على **${directoryEntries.length} جهة اتصال وتحويلة داخلية مسجلة** موزعة على قطاعات الهيئة وإداراتها (العمليات، المعامل، المكتب الفني، البنية الأساسية، الشبكات والصيانة، البوفيه، النظم، وغيرها).\n\n` +
          `📌 **أبرز جهات الاتصال المسجلة في التطبيق:**\n` +
          directoryEntries.slice(0, 6).map((m, i) => `• **${m.name}** — ${m.department}: تحويلة **${m.code}**`).join('\n') +
          `\n\n🔍 للبحث السريع: اكتب "رقم مهندس ..." أو "تحويلة المكتب الفني" وسأعطيك الرقم فوراً!`;

        snippet = {
          type: 'directory',
          items: directoryEntries.slice(0, 6)
        };
      }
    }

    // =========================================================================
    // 2. DAILY TASKS (المهام اليومية)
    // =========================================================================
    else if (
      q.includes('مهم') || 
      q.includes('مهام') || 
      q.includes('مفتوح') || 
      q.includes('منجز') || 
      q.includes('تاسك') || 
      q.includes('task') || 
      q.includes('شغل') || 
      q.includes('اعطال') || 
      q.includes('عطل')
    ) {
      // 2.1 Open Tasks
      if (q.includes('مفتوح') || q.includes('مفتوحة') || q.includes('غير منجز') || q.includes('غير منجزة') || q.includes('معلق') || q.includes('معلقة')) {
        const openTasks = tasks.filter(t => !t.done);
        if (openTasks.length === 0) {
          reply = `🎉 **ممتاز جداً!** لا توجد أي مهام مفتوحة حالياً في المنظومة. جميع المهام البالغ عددها (${tasks.length} مهمة) تم إنجازها بالكامل!`;
        } else {
          reply = `📌 **يوجد حالياً (${openTasks.length}) مهمة مفتوحة قيد العمل في المنظومة:**\n\n` +
            openTasks.slice(0, 6).map((t, idx) => 
              `**${idx + 1}. مهمة رقم #${t.number || t.id}** [${t.department || 'إدارة عامة'}]\n` +
              `   • الوصف: ${t.description || 'مهمة عمل'}\n` +
              `   • المهندس المسؤول: ${t.technician || 'غير محدد'}\n` +
              `   • التاريخ: ${t.day ? `${t.day} ` : ''}${t.date || '—'}`
            ).join('\n\n') +
            (openTasks.length > 6 ? `\n\n*(ويوجد ${openTasks.length - 6} مهمة مفتوحة أخرى في السجل العام)*` : '');

          snippet = {
            type: 'tasks',
            items: openTasks.slice(0, 6)
          };
        }
      } 
      // 2.2 Completed Tasks
      else if (q.includes('منجز') || q.includes('منجزة') || q.includes('تم انجاز') || q.includes('تم إنجاز') || q.includes('منتهي') || q.includes('خلصت')) {
        const doneTasks = tasks.filter(t => t.done);
        const completionRate = Math.round((doneTasks.length / (tasks.length || 1)) * 100);
        reply = `✅ **إحصائية المهام المنجزة بنجاح:**\n` +
          `• تم إنجاز **${doneTasks.length} مهمة** من إجمالي **${tasks.length} مهمة** مسجلة في السجل اليومي.\n` +
          `• نسبة الإنجاز الإجمالية: **${completionRate}%**.\n\n` +
          `📌 **نماذج من آخر المهام المنجزة:**\n` +
          doneTasks.slice(0, 5).map(t => `• [#${t.number || t.id}] **${t.technician}**: ${t.description.slice(0, 50)}... (${t.department})`).join('\n');

        snippet = {
          type: 'tasks',
          items: doneTasks.slice(0, 5)
        };
      } 
      // 2.3 Specific Engineer / Technician's Tasks
      else {
        // Check if question mentions an engineer by checking all technicians
        const technicians: string[] = Array.from(new Set(tasks.map(t => t.technician).filter((t): t is string => Boolean(t))));
        const matchedTech = technicians.find(tech => q.includes(normalizeArabic(tech)));

        if (matchedTech) {
          const techTasks = tasks.filter(t => normalizeArabic(t.technician || '') === normalizeArabic(matchedTech));
          const techDone = techTasks.filter(t => t.done);
          const techOpen = techTasks.filter(t => !t.done);
          
          // Look up contact from directory
          const contact = directoryEntries.find(d => normalizeArabic(d.name || '').includes(normalizeArabic(matchedTech)));
          // Look up leaves
          const techLeaves = leaves.filter(l => normalizeArabic(l.employee || '').includes(normalizeArabic(matchedTech)));

          reply = `👨‍💼 **سجل مهام المهندس: ${matchedTech}**\n\n` +
            `• **إجمالي المهام المسجلة له:** **${techTasks.length} مهمة**\n` +
            `• **المهام المنجزة:** ${techDone.length} مهمة (${Math.round((techDone.length / (techTasks.length || 1)) * 100)}%)\n` +
            `• **المهام المفتوحة:** ${techOpen.length} مهمة\n` +
            (contact ? `• 📱 **التحويلة المسجلة في الدليل:** ${contact.code} (${contact.department})\n` : '') +
            (techLeaves.length > 0 ? `• 🌴 **حالة الإجازات:** مسجل له ${techLeaves.length} حركة إجازة/إذن (آخرها: ${techLeaves[0].leaveType} حتى ${techLeaves[0].endDate})\n` : '') +
            `\n📋 **آخر المهام المسجلة له:**\n` +
            techTasks.slice(0, 5).map(t => `• [#${t.number || t.id}] [${t.done ? '✅ منجز' : '⏳ مفتوح'}] ${t.description} (${t.date})`).join('\n');

          snippet = {
            type: 'tasks',
            items: techTasks.slice(0, 5)
          };
        } 
        // 2.4 Department tasks search
        else {
          const departments: string[] = Array.from(new Set(tasks.map(t => t.department).filter((d): d is string => Boolean(d))));
          const matchedDept = departments.find(dept => q.includes(normalizeArabic(dept)));

          if (matchedDept) {
            const deptTasks = tasks.filter(t => normalizeArabic(t.department || '').includes(normalizeArabic(matchedDept)));
            const deptOpen = deptTasks.filter(t => !t.done);
            reply = `🏢 **سجل مهام إدارة: ${matchedDept}**\n\n` +
              `• إجمالي المهام: **${deptTasks.length} مهمة** (${deptTasks.filter(t => t.done).length} منجزة، ${deptOpen.length} مفتوحة).\n\n` +
              `📌 **نماذج من المهام:**\n` +
              deptTasks.slice(0, 5).map(t => `• [#${t.number || t.id}] [${t.done ? '✅' : '⏳'}] ${t.description} (المسؤول: ${t.technician})`).join('\n');

            snippet = {
              type: 'tasks',
              items: deptTasks.slice(0, 5)
            };
          } else {
            // General Tasks Summary
            const doneCount = tasks.filter(t => t.done).length;
            const openCount = tasks.filter(t => !t.done).length;
            reply = `📋 **المهام اليومية لمنظومة GOEIC:**\n` +
              `يحتوي السجل اليومي على **${tasks.length} مهمة عمل مسجلة**:\n` +
              `• ✅ **المنجز:** ${doneCount} مهمة (${Math.round((doneCount / (tasks.length || 1)) * 100)}%)\n` +
              `• ⏳ **المفتوح قيد المتابعة:** ${openCount} مهمة\n\n` +
              `📌 **آخر المهام المضافة في السجل:**\n` +
              tasks.slice(0, 5).map(t => `• [#${t.number || t.id}] **${t.technician}**: ${t.description.slice(0, 45)}... [${t.done ? 'منجز' : 'مفتوح'}]`).join('\n') +
              `\n\n💡 يمكنك سؤالي: "المهام المفتوحة"، أو "مهام محمد حنفي"، أو البحث بأي عطل مثل "بصمة" أو "طابعة".`;

            snippet = {
              type: 'tasks',
              items: tasks.slice(0, 5)
            };
          }
        }
      }
    }

    // =========================================================================
    // 3. MEDICAL NETWORK (الشبكة الطبية)
    // =========================================================================
    else if (
      q.includes('طب') || 
      q.includes('مستشف') || 
      q.includes('معمل') || 
      q.includes('معامل') || 
      q.includes('صيدل') || 
      q.includes('اشع') || 
      q.includes('أشع') || 
      q.includes('دكتور') || 
      q.includes('عياد') || 
      q.includes('علاج') || 
      q.includes('تحاليل') || 
      q.includes('كارنيه') || 
      q.includes('medical')
    ) {
      // Check governorate mentions
      const govList = ['القاهرة', 'الإسكندرية', 'بورسعيد', 'السويس', 'دمياط', 'الجيزة', 'الغربية', 'الدقهلية', 'الشرقية', 'القليوبية', 'البحيرة', 'المنوفية', 'كفر الشيخ', 'الفيوم', 'بني سويف', 'المنيا', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'البحر الأحمر', 'مطروح'];
      const matchedGov = govList.find(gov => q.includes(normalizeArabic(gov)));

      // Check provider type
      const isLab = q.includes('معمل') || q.includes('معامل') || q.includes('تحاليل');
      const isPharmacy = q.includes('صيدل');
      const isScan = q.includes('اشع') || q.includes('أشع');

      // Search term for specific hospital name
      const medSearchWords = ['مستشفى', 'مستشفي', 'معمل', 'معامل', 'صيدلية', 'صيدليات', 'مركز', 'دكتور', 'عيادة', 'الشبكة', 'الطبية', 'طبية', 'طبي', 'في', 'محافظة', 'عايز', 'ارقام', 'رقم', 'هاتف', 'تليفون', 'عنوان'];
      const cleanMedTerm = cleanSearchTerm(question, medSearchWords);

      let medMatches = medicalEntries;

      if (cleanMedTerm.length > 0 && !matchedGov && !isLab && !isPharmacy && !isScan) {
        medMatches = medicalEntries.filter(m => 
          normalizeArabic(m.providerName || '').includes(cleanMedTerm) ||
          normalizeArabic(m.area || '').includes(cleanMedTerm) ||
          normalizeArabic(m.address || '').includes(cleanMedTerm)
        );
      } else {
        if (matchedGov) {
          medMatches = medMatches.filter(m => normalizeArabic(m.governorate || '').includes(normalizeArabic(matchedGov)));
        }
        if (isLab) {
          medMatches = medMatches.filter(m => normalizeArabic(m.providerType || '').includes('معمل'));
        } else if (isPharmacy) {
          medMatches = medMatches.filter(m => normalizeArabic(m.providerType || '').includes('صيدل'));
        } else if (isScan) {
          medMatches = medMatches.filter(m => normalizeArabic(m.providerType || '').includes('أشعة') || normalizeArabic(m.providerType || '').includes('اشعة'));
        }
      }

      if (medMatches.length > 0) {
        reply = `🏥 **الشبكة الطبية المعتمدة لـ GOEIC (${medMatches.length} جهة مطابقة):**\n` +
          (matchedGov ? `📍 المحافظة: **${matchedGov}**\n` : '') +
          `\n` +
          medMatches.slice(0, 5).map((m, idx) => 
            `**${idx + 1}. ${m.providerName}** [${m.providerType || 'جهة طبية'}${m.networkType ? ` - فئة ${m.networkType}` : ''}]\n` +
            `   📍 المحافظة والمنطقة: ${m.governorate} - ${m.area || ''}\n` +
            `   🏢 العنوان: ${m.address || '—'}\n` +
            `   📞 الهاتف: **${m.telephone || '—'}**\n` +
            `   🩺 التخصص: ${m.specialty || 'جميع التخصصات'}`
          ).join('\n\n') +
          (medMatches.length > 5 ? `\n\n*(ويوجد ${medMatches.length - 5} جهة طبية أخرى في دليل الشبكة الطبية)*` : '') +
          `\n\n💡 يمكنك الاتصال المباشر بالضغط على زر الهاتف أو نسخ الرقم من البطاقات أدناه.`;

        snippet = {
          type: 'medical',
          items: medMatches.slice(0, 5)
        };
      } else {
        reply = `🏥 **الشبكة الطبية لـ GOEIC:**\nتضم الشبكة **${medicalEntries.length} مقدم خدمة طبية معتمد** (مستشفيات، معامل تحاليل، مراكز أشعة، صيدليات) في مختلف محافظات مصر.\n\nلم أجد نتائج مطابقة لبحثك، ولكن يمكنك البحث باسم المحافظة (مثل: "مستشفيات القاهرة"، "مستشفيات الإسكندرية") أو باسم الجهة (مثل: "كليوباترا"، "شفا"، "معامل البرج"، "المختبر").`;
        snippet = {
          type: 'medical',
          items: medicalEntries.slice(0, 4)
        };
      }
    }

    // =========================================================================
    // 4. HOLIDAYS & LEAVES (أيام الإجازات والعطلات الرسمية)
    // =========================================================================
    else if (
      q.includes('اجاز') || 
      q.includes('إجاز') || 
      q.includes('عطل') || 
      q.includes('غياب') || 
      q.includes('اذن') || 
      q.includes('إذن') || 
      q.includes('مامور') || 
      q.includes('مأمور') || 
      q.includes('leave') || 
      q.includes('holiday')
    ) {
      const isOfficialHolidaysQuery = 
        q.includes('رسمي') || 
        q.includes('رسمية') || 
        q.includes('عطلات') || 
        q.includes('الدولة') || 
        q.includes('مصر') || 
        q.includes('القادمة') || 
        q.includes('6 اكتوبر') || 
        q.includes('اكتوبر') || 
        q.includes('عيد') || 
        q.includes('الفطر') || 
        q.includes('الاضحى') || 
        q.includes('سيناء') || 
        q.includes('العمال') || 
        q.includes('شم النسيم') || 
        q.includes('سنة');

      // Check if user is asking about a specific employee's leaves
      const employeesWithLeaves: string[] = Array.from(new Set(leaves.map(l => l.employee).filter((e): e is string => Boolean(e))));
      const matchedEmp = employeesWithLeaves.find(emp => q.includes(normalizeArabic(emp)));

      if (matchedEmp) {
        const empLeaves = leaves.filter(l => normalizeArabic(l.employee) === normalizeArabic(matchedEmp));
        reply = `🌴 **سجل إجازات وأذونات الموظف: ${matchedEmp}**\n\n` +
          `مسجل له في المنظومة **${empLeaves.length} حركة إجازة/إذن**:\n\n` +
          empLeaves.map((l, i) => 
            `**${i + 1}. ${l.leaveType}** (${l.daysCount} يوم)\n` +
            `   📅 من: **${l.startDate}** إلى: **${l.endDate}**\n` +
            (l.notes ? `   📝 ملاحظات: ${l.notes}\n` : '') +
            `   🕒 تاريخ التسجيل: ${l.entryDate || '—'}`
          ).join('\n\n');

        snippet = {
          type: 'leaves',
          items: empLeaves
        };
      } 
      else if (isOfficialHolidaysQuery && !q.includes('موظف') && !q.includes('عاملين')) {
        // Egyptian Official Public Holidays 2026
        reply = `🏛️ **جدول العطلات والإجازات الرسمية لجمهورية مصر العربية لعام 2026:**\n\n` +
          EGYPTIAN_HOLIDAYS_2026.map((h, i) => 
            `• **${h.name}**: ${h.date} (${h.day})\n  *${h.description}*`
          ).join('\n\n') +
          `\n\n🌴 ملاحظة: هذه العطلات الرسمية تعطل فيها الوزارات والمصالح الحكومية والهيئات العامة (بما فيها GOEIC).`;

        snippet = {
          type: 'holidays',
          items: EGYPTIAN_HOLIDAYS_2026.slice(0, 6)
        };
      } 
      else {
        // Combined comprehensive answer: Employee leaves in system + Official government holidays
        reply = `🌴 **أيام الإجازات والعطلات الرسمية في المنظومة:**\n\n` +
          `1️⃣ **سجل إجازات وأذونات العاملين بالهيئة (بيانات التطبيق اللحظية):**\n` +
          `يوجد حالياً **${leaves.length} حركة إجازة وإذن مسجلة** للعاملين:\n` +
          leaves.slice(0, 5).map(l => 
            `• **${l.employee}**: ${l.leaveType} (${l.daysCount} يوم) — من ${l.startDate} إلى ${l.endDate}`
          ).join('\n') +
          `\n\n2️⃣ **أبرز العطلات الرسمية القادمة لجمهورية مصر العربية (2026):**\n` +
          EGYPTIAN_HOLIDAYS_2026.slice(0, 5).map(h => 
            `• **${h.name}**: ${h.date} (${h.day})`
          ).join('\n') +
          `\n\n💡 يمكنك سؤالي عن إجازة أي موظف (مثل: "إجازات محمد حنفي" أو "إجازات شيماء") أو "العطلات الرسمية للدولة".`;

        snippet = {
          type: 'leaves',
          items: leaves.slice(0, 5)
        };
      }
    }

    // =========================================================================
    // 5. SATURDAY ATTENDANCE & NIGHT SHIFTS (حضور السبت وأيام السهر)
    // =========================================================================
    else if (q.includes('سهر') || q.includes('سبت') || q.includes('نبطش') || q.includes('حضور') || q.includes('وردية') || q.includes('ورديات')) {
      const satCount = saturdayAttendances.length;
      const nightCount = nightShifts.length || 8;
      reply = `🌙 **نظام السهر وحضور السبت المعتمد بإدارة التشغيل:**\n\n` +
        `• **أيام السهر المعتمدة هذا الشهر:** ${nightCount} فترات سهر ومتابعة ليلية.\n` +
        `• **سجل حضور السبت:** مسجل **${satCount} موظف** لحضور السبت القادم.\n\n` +
        (saturdayAttendances.length > 0 
          ? `المسجلون في كشف حضور السبت:\n` + saturdayAttendances.slice(0, 6).map(s => `• **${s.employee}**: ${s.date} (${s.notes || 'حضور معتمد'})`).join('\n')
          : 'لا توجد تسجيلات لحضور السبت القادم بعد في السجل.');

      snippet = {
        type: 'attendance',
        items: saturdayAttendances.slice(0, 5)
      };
    }

    // =========================================================================
    // 6. PRAYER TIMES (مواقيت الصلاة)
    // =========================================================================
    else if (q.includes('صلاة') || q.includes('صلاه') || q.includes('فجر') || q.includes('ظهر') || q.includes('عصر') || q.includes('مغرب') || q.includes('عشاء') || q.includes('اذان') || q.includes('أذان')) {
      reply = `🕌 **مواقيت الصلاة الرسمية المعتمدة (توقيت القاهرة):**\n\n` +
        `• 🌅 الفجر: **${prayerTimes.fajr || '05:06'}**\n` +
        `• ☀️ الظهر: **${prayerTimes.dhuhr || '12:53'}**\n` +
        `• 🌤️ العصر: **${prayerTimes.asr || '16:27'}**\n` +
        `• 🌇 المغرب: **${prayerTimes.maghrib || '19:12'}**\n` +
        `• 🌌 العشاء: **${prayerTimes.isha || '20:31'}**\n\n` +
        `🔔 ينطلق تنبيه الأذان البصري والصوتي في التطبيق تلقائياً عند حلول موعد الصلاة.`;
    }

    // =========================================================================
    // 7. URGENT NOTICE (التنبيهات العاجلة)
    // =========================================================================
    else if (q.includes('عاجل') || q.includes('urgent') || q.includes('انذار') || q.includes('إنذار') || q.includes('تنبيه')) {
      if (urgentText && urgentText.trim()) {
        reply = `🚨 **التنبيه العاجل النشط في المنظومة (نموذج Urgent):**\n\n` +
          `«${urgentText}»\n\n` +
          `• **الحالة:** نشط ويظهر في الشريط التحذيري العلوي في التطبيق.\n` +
          `• **المستوى:** إشعار إداري عاجل موجه لكافة مهندسي وموظفي الإدارة العامة.`;
        snippet = {
          type: 'urgent',
          items: [{ title: urgentText, role: 'تنبيه عاجل نشط', urgent: true }]
        };
      } else {
        reply = `🟢 **سجل التنبيهات العاجلة (Urgent):**\nلا يوجد أي تنبيه عاجل نشط حالياً في المنظومة، والعمليات تسير بشكل اعتيادي ومستقر.`;
      }
    }

    // =========================================================================
    // 8. USERS & SECURITY (المستخدمون والأمان)
    // =========================================================================
    else if (q.includes('مستخدم') || q.includes('مستخدمين') || q.includes('حساب') || q.includes('صلاحي') || q.includes('توكن') || q.includes('token') || q.includes('devise') || q.includes('بايو') || q.includes('صوتي') || q.includes('معطل')) {
      reply = `👥 **إدارة المستخدمين والأمان (نموذج User & Devise):**\n\n` +
        `• **المصادقة:** يدعم النظام موديولات Devise للمصادقة وتتبع الدخول (Trackable) واستعادة الحساب.\n` +
        `• **التأمين بالتوكن:** يتم توليد رمز أمان سداسي عشري \`api_token\` تلقائياً لكل مستخدم بواسطة \`SecureRandom.hex(32)\`.\n` +
        `• **المرفقات:** يدعم كل حساب مرفقات رسمية تشمل الصورة الشخصية (\`profile_pic\`) والتسجيل الصوتي التعريفي (\`bio_audio\`).\n` +
        `• **الحسابات المعطلة:** توفر دالة \`active_for_authentication?\` إيقاف دخول أي حساب إذا كان \`disabled? = true\` لضمان الأمان.\n\n` +
        `المستخدمون المعرّفون في المنظومة (${APP_USERS.length} حسابات):\n` +
        APP_USERS.map(u => `• **${u.name}** (${u.description}) - بريد: ${u.email || '—'}`).join('\n');

      snippet = {
        type: 'users',
        items: APP_USERS.map(u => ({
          name: u.name,
          role: u.description,
          phone: u.email
        }))
      };
    }

    // =========================================================================
    // 9. COMPREHENSIVE STATS SUMMARY (تقرير شامل)
    // =========================================================================
    else if (q.includes('ملخص') || q.includes('تقرير') || q.includes('شامل') || q.includes('احصائ') || q.includes('إحصائ') || q.includes('أداء') || q.includes('حالة المنظومة')) {
      const doneCount = tasks.filter(t => t.done).length;
      const openCount = tasks.filter(t => !t.done).length;
      const completionRate = Math.round((doneCount / (tasks.length || 1)) * 100);

      reply = `📊 **التقرير الشامل والحي لمنظومة GOEIC اليومية:**\n\n` +
        `1️⃣ **المهام اليومية:** إجمالي **${tasks.length} مهمة** (تم إنجاز **${doneCount}**، ومتبقي **${openCount}** مفتوحة، بنسبة إنجاز **${completionRate}%**).\n` +
        `2️⃣ **دليل الهواتف والتحويلات:** **${directoryEntries.length} جهة اتصال** ومهندس مسجلين.\n` +
        `3️⃣ **الشبكة الطبية:** **${medicalEntries.length} مستشفى ومعمل** ومركز طبي معتمد.\n` +
        `4️⃣ **سجل الإجازات والأذونات:** **${leaves.length} حركة** مسجلة للموظفين.\n` +
        `5️⃣ **التشغيل وحضور السبت:** ${saturdayAttendances.length} مسجلين لحضور السبت، و${nightShifts.length || 8} أيام سهر معتمدة.\n` +
        (urgentText ? `🚨 **تنبيه عاجل نشط:** "${urgentText}"\n` : '') +
        (memoText ? `📝 **نوت للتذكير:** "${memoText}"\n` : '');

      snippet = {
        type: 'summary',
        items: [
          { name: 'المهام المنجزة', role: `${doneCount} من ${tasks.length}`, done: true },
          { name: 'المهام المفتوحة', role: `${openCount} مهمة`, done: false },
          { name: 'دليل الهواتف', role: `${directoryEntries.length} جهة اتصال` },
          { name: 'الشبكة الطبية', role: `${medicalEntries.length} مستشفى ومعمل` },
          { name: 'سجل الإجازات', role: `${leaves.length} حركة مسجلة` }
        ]
      };
    }

    // =========================================================================
    // 10. SMART CROSS-DATA FALLBACK (بحث ذكي في كافة الجداول)
    // =========================================================================
    else {
      // Check if the query matches anything in Directory, Tasks, Medical, or Leaves
      const dirHit = directoryEntries.filter(d => 
        normalizeArabic(d.name).includes(q) || 
        normalizeArabic(d.department).includes(q) || 
        (d.code && d.code.includes(q))
      );

      const taskHit = tasks.filter(t => 
        normalizeArabic(t.technician).includes(q) || 
        normalizeArabic(t.department).includes(q) || 
        normalizeArabic(t.description).includes(q)
      );

      const medHit = medicalEntries.filter(m => 
        normalizeArabic(m.providerName).includes(q) || 
        normalizeArabic(m.area).includes(q) || 
        normalizeArabic(m.governorate).includes(q)
      );

      const leaveHit = leaves.filter(l => 
        normalizeArabic(l.employee).includes(q)
      );

      if (dirHit.length > 0) {
        reply = `📞 عثرت على **(${dirHit.length}) نتيجة في دليل الهواتف** مطابقة لاستفسارك:\n\n` +
          dirHit.slice(0, 5).map(m => `• **${m.name}** (${m.department}): تحويلة **${m.code}**`).join('\n');
        snippet = { type: 'directory', items: dirHit.slice(0, 5) };
      } else if (taskHit.length > 0) {
        reply = `📋 عثرت على **(${taskHit.length}) مهمة عمل** مطابقة لاستفسارك في سجل المهام:\n\n` +
          taskHit.slice(0, 5).map(t => `• [#${t.number || t.id}] [${t.done ? 'منجز ✅' : 'مفتوح ⏳'}] ${t.description} (المسؤول: ${t.technician})`).join('\n');
        snippet = { type: 'tasks', items: taskHit.slice(0, 5) };
      } else if (medHit.length > 0) {
        reply = `🏥 عثرت على **(${medHit.length}) جهة طبية** مطابقة في الشبكة الطبية المعتمدة:\n\n` +
          medHit.slice(0, 5).map(m => `• **${m.providerName}** (${m.governorate} - ${m.area}): هاتف ${m.telephone || '—'}`).join('\n');
        snippet = { type: 'medical', items: medHit.slice(0, 5) };
      } else if (leaveHit.length > 0) {
        reply = `🌴 عثرت على **(${leaveHit.length}) حركة إجازة** مطابقة في سجل الإجازات:\n\n` +
          leaveHit.map(l => `• **${l.employee}**: ${l.leaveType} (${l.daysCount} يوم) من ${l.startDate} إلى ${l.endDate}`).join('\n');
        snippet = { type: 'leaves', items: leaveHit };
      } else {
        reply = `مرحباً بك! لقد استلمت استفسارك عن: "${rawQ}".\n\nأنا أستمد بياناتي لحظياً من قاعدة بيانات المنظومة الحية:\n` +
          `• 📞 **دليل التليفونات:** ${directoryEntries.length} تحويلة مسجلة.\n` +
          `• 📋 **المهام اليومية:** ${tasks.length} مهمة (منجز: ${tasks.filter(t => t.done).length} | مفتوح: ${tasks.filter(t => !t.done).length}).\n` +
          `• 🏥 **الشبكة الطبية:** ${medicalEntries.length} مستشفى ومعمل معتمد.\n` +
          `• 🌴 **أيام الإجازات:** ${leaves.length} حركة إجازة مسجلة وجدول العطلات الرسمية للدولة.\n\n` +
          `💡 يمكنك سؤالي بشكل مباشر مثل:\n` +
          `• "رقم تليفون وليد" أو "تحويلة المكتب الفني"\n` +
          `• "المهام المفتوحة" أو "مهام محمد حنفي"\n` +
          `• "مستشفيات القاهرة" أو "معامل البرج"\n` +
          `• "أيام الإجازات الرسمية" أو "مين في إجازة"`;
      }
    }

    // Push bot response after realistic brief typing
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: reply,
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          dataSnippet: snippet
        }
      ]);
      setIsTyping(false);
      playDing();
    }, 450);
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    setInput('');
    
    // Add user message
    setMessages(prev => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: userText,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    setIsTyping(true);
    handleAnswer(userText);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'bot',
        text: `تم تفريغ المحادثة. أنا جاهز للإجابة عن أي بيانات في المنظومة يا ${currentUser?.name || 'عزيزي'}! ✨`,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm no-print font-['Cairo',sans-serif]">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 w-full max-w-3xl h-[88vh] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-right"
      >
        {/* Header matching Egyptian Government Dark Navy & Gold Theme */}
        <div className="bg-gradient-to-r from-[#182a48] via-[#1a3152] to-[#12233c] text-white p-4 sm:p-5 flex items-center justify-between shadow-lg border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#182a48] rounded-[14px] flex items-center justify-center">
                <Bot className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg tracking-tight">شات بوت GOEIC الذكي</h3>
                <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  بيانات حية
                </span>
              </div>
              <p className="text-xs text-slate-300">مساعد الذكاء الاصطناعي الخاص بالهيئة العامة للرقابة على الصادرات والواردات</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all text-xs"
              title={soundEnabled ? 'كتم الصوت' : 'تفعيل التنبيه الصوتي'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
            <button
              type="button"
              onClick={handleClearHistory}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all text-xs"
              title="تفريغ المحادثة"
            >
              <RotateCcw className="w-4 h-4 text-amber-300" />
            </button>
            <button 
              type="button"
              onClick={onClose} 
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real-time Data Badges Bar */}
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between overflow-x-auto text-[11px] font-bold text-slate-600 dark:text-slate-300 gap-2">
          <div className="flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-blue-500" />
              دليل الهواتف: {directoryEntries.length}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              المهام: {tasks.length} (منجز {tasks.filter(t => t.done).length})
            </span>
            <span className="flex items-center gap-1">
              <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
              الشبكة الطبية: {medicalEntries.length}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              الإجازات: {leaves.length}
            </span>
          </div>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded font-mono shrink-0">
            مستند لقاعدة بيانات التطبيق
          </span>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div 
                key={msg.id} 
                className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-9 h-9 rounded-2xl bg-[#182a48] text-amber-400 flex items-center justify-center shrink-0 shadow-md">
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                <div className={`max-w-[88%] sm:max-w-[80%] rounded-3xl p-4 shadow-sm text-xs sm:text-sm leading-relaxed ${
                  isBot 
                    ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80' 
                    : 'bg-[#182a48] text-white rounded-br-none'
                }`}>
                  <div className="whitespace-pre-line font-medium">{msg.text}</div>

                  {/* Rich Live Data Snippet Card */}
                  {msg.dataSnippet && msg.dataSnippet.items && msg.dataSnippet.items.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>بيانات مستخرجة من التطبيق:</span>
                      </div>
                      
                      <div className="space-y-2">
                        {/* 1. Directory Entries */}
                        {msg.dataSnippet.type === 'directory' && msg.dataSnippet.items.map((item: any, idx: number) => {
                          const itemId = `dir-${item.id || idx}`;
                          const isCopied = copiedSnippetId === itemId;
                          return (
                            <div 
                              key={idx}
                              className="bg-slate-50 dark:bg-slate-750 p-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 flex items-center justify-between flex-wrap gap-2"
                            >
                              <div>
                                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                  <span>{item.name}</span>
                                </div>
                                {item.department && (
                                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                                    <Building className="w-3 h-3 text-slate-400" />
                                    <span>{item.department}</span>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <a 
                                  href={`tel:${item.code}`} 
                                  className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold flex items-center gap-1 transition-colors"
                                  title="اتصال بالتحويلة / الهاتف"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                  <span>{item.code}</span>
                                </a>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(item.code, itemId)}
                                  className="p-1 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 transition-colors"
                                  title="نسخ الرقم"
                                >
                                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>
                          );
                        })}

                        {/* 2. Tasks */}
                        {msg.dataSnippet.type === 'tasks' && msg.dataSnippet.items.map((item: any, idx: number) => (
                          <div 
                            key={idx}
                            className="bg-slate-50 dark:bg-slate-750 p-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 space-y-1"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                #{item.number || item.id} - {item.department || 'إدارة عامة'}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                                item.done 
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              }`}>
                                {item.done ? '✅ منجز' : '⏳ قيد العمل'}
                              </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                              {item.description}
                            </p>
                            <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-700">
                              <span>المسؤول: <strong className="text-slate-700 dark:text-slate-300">{item.technician || 'غير محدد'}</strong></span>
                              <span>{item.date || ''}</span>
                            </div>
                          </div>
                        ))}

                        {/* 3. Medical Network */}
                        {msg.dataSnippet.type === 'medical' && msg.dataSnippet.items.map((item: any, idx: number) => {
                          const itemId = `med-${item.id || idx}`;
                          const isCopied = copiedSnippetId === itemId;
                          return (
                            <div 
                              key={idx}
                              className="bg-slate-50 dark:bg-slate-750 p-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 space-y-1"
                            >
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                                  {item.providerName}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-[10px] font-bold">
                                  {item.providerType || 'جهة طبية'} {item.networkType ? `(${item.networkType})` : ''}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                                <span>{item.governorate} - {item.area} ({item.address || ''})</span>
                              </div>
                              {item.telephone && (
                                <div className="flex items-center justify-between pt-1">
                                  <span className="text-[10px] text-slate-500">التخصص: {item.specialty || 'جميع التخصصات'}</span>
                                  <div className="flex items-center gap-1.5">
                                    <a 
                                      href={`tel:${item.telephone}`} 
                                      className="px-2 py-0.5 rounded-md bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-[11px] font-bold flex items-center gap-1 transition-colors"
                                    >
                                      <Phone className="w-3 h-3" />
                                      <span>{item.telephone}</span>
                                    </a>
                                    <button
                                      type="button"
                                      onClick={() => copyToClipboard(item.telephone, itemId)}
                                      className="p-1 rounded-md bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                                      title="نسخ الهاتف"
                                    >
                                      {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* 4. Employee Leaves */}
                        {msg.dataSnippet.type === 'leaves' && msg.dataSnippet.items.map((item: any, idx: number) => (
                          <div 
                            key={idx}
                            className="bg-slate-50 dark:bg-slate-750 p-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 flex items-center justify-between flex-wrap gap-2"
                          >
                            <div>
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                {item.employee}
                              </span>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                من {item.startDate} إلى {item.endDate}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[11px] font-bold">
                                {item.leaveType} ({item.daysCount} يوم)
                              </span>
                            </div>
                          </div>
                        ))}

                        {/* 5. Egyptian Official Holidays */}
                        {msg.dataSnippet.type === 'holidays' && msg.dataSnippet.items.map((item: any, idx: number) => (
                          <div 
                            key={idx}
                            className="bg-slate-50 dark:bg-slate-750 p-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 flex items-center justify-between flex-wrap gap-2"
                          >
                            <div>
                              <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                <CalendarDays className="w-3.5 h-3.5 text-amber-600" />
                                <span>{item.name}</span>
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                                {item.description}
                              </div>
                            </div>
                            <span className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-mono font-bold">
                              {item.date} ({item.day})
                            </span>
                          </div>
                        ))}

                        {/* 6. Summary / Generic items */}
                        {(msg.dataSnippet.type === 'summary' || msg.dataSnippet.type === 'users' || msg.dataSnippet.type === 'attendance') && msg.dataSnippet.items.map((item: any, idx: number) => (
                          <div 
                            key={idx}
                            className="bg-slate-50 dark:bg-slate-750 p-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 flex items-center justify-between flex-wrap gap-2"
                          >
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {item.name || item.employee || item.title || 'سجل'}
                            </span>
                            {item.role && (
                              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                {item.role}
                              </span>
                            )}
                            {item.date && (
                              <span className="text-[11px] text-slate-400 font-mono">
                                {item.date}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={`text-[10px] mt-2 font-mono ${isBot ? 'text-slate-400 text-left' : 'text-slate-300 text-left'}`}>
                    {msg.timestamp}
                  </div>
                </div>

                {!isBot && (
                  <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 justify-start items-center text-xs text-slate-500">
              <div className="w-8 h-8 rounded-xl bg-[#182a48] text-amber-400 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
                <span className="mr-2 font-bold text-[11px]">جاري استخراج البيانات من سجلات التطبيق...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-700 flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-[10px] font-bold text-slate-400 shrink-0">💡 اقتراحات:</span>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setInput(prompt);
                handleAnswer(prompt);
              }}
              className="px-3 py-1 rounded-full bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 shrink-0 transition-all text-xs font-medium shadow-xs active:scale-95 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <form 
          onSubmit={handleSend}
          className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اسأل الشات بوت عن أي رقم تليفون، مهمة يومية، جهة طبية، أو أيام الإجازات..."
            className="flex-1 h-12 px-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="h-12 px-5 rounded-2xl bg-gradient-to-r from-[#182a48] to-[#1a3152] hover:brightness-110 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
          >
            <span>إرسال</span>
            <Send className="w-4 h-4 rotate-180 text-amber-400" />
          </button>
        </form>
      </div>
    </div>
  );
};

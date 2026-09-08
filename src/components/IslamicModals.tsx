import React, { useState } from 'react';
import { X, BookOpen, Heart, Sparkles, RotateCcw, Volume2, Search, Check, ChevronRight } from 'lucide-react';

/* =========================================================================
   1. أذكار الصباح (Morning Adhkar)
   ========================================================================= */
interface AdhkarItem {
  id: number;
  text: string;
  count: number;
  fadl: string;
}

const MORNING_ADHKAR: AdhkarItem[] = [
  {
    id: 1,
    text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ لا إِلَهَ إِلا اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ.',
    count: 1,
    fadl: 'من قالها حين يصبح حُفظ حتى يمسي'
  },
  {
    id: 2,
    text: 'اللَّهُمَّ أَنْتَ رَبِّي لا إِلَهَ إِلا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لا يَغْفِرُ الذُّنُوبَ إِلا أَنْتَ.',
    count: 1,
    fadl: 'سيد الاستغفار - من قاله موقناً به فمات من يومه دخل الجنة'
  },
  {
    id: 3,
    text: 'اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلائِكَتَكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لا إِلَهَ إِلا أَنْتَ وَحْدَكَ لا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّداً عَبْدُكَ وَرَسُولُكَ.',
    count: 4,
    fadl: 'من قالها أعتقه الله من النار'
  },
  {
    id: 4,
    text: 'بِسْمِ اللَّهِ الَّذِي لا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.',
    count: 3,
    fadl: 'لم يضره شيء حتى يمسي'
  },
  {
    id: 5,
    text: 'رَضِيتُ بِاللَّهِ رَبّاً، وَبِالإِسْلامِ دِيناً، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيّاً.',
    count: 3,
    fadl: 'كان حقاً على الله أن يرضيه يوم القيامة'
  },
  {
    id: 6,
    text: 'حَسْبِيَ اللَّهُ لا إِلَهَ إِلا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ.',
    count: 7,
    fadl: 'كفاه الله ما أهمه من أمر الدنيا والآخرة'
  },
  {
    id: 7,
    text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ.',
    count: 3,
    fadl: 'تعدل عبادة ساعات طوال'
  },
  {
    id: 8,
    text: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ.',
    count: 1,
    fadl: 'دعاء النبي صلى الله عليه وسلم في الصباح والمساء'
  }
];

export const AdhkarModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [completedCounts, setCompletedCounts] = useState<Record<number, number>>({});

  if (!isOpen) return null;

  const handleIncrement = (id: number, max: number) => {
    setCompletedCounts(prev => {
      const current = prev[id] || 0;
      if (current < max) {
        return { ...prev, [id]: current + 1 };
      }
      return prev;
    });
  };

  const handleReset = () => {
    setCompletedCounts({});
  };

  const totalRequired = MORNING_ADHKAR.reduce((acc, it) => acc + it.count, 0);
  const totalDone = Object.values(completedCounts).reduce<number>((acc, c) => acc + (Number(c) || 0), 0);
  const percent = Math.round((totalDone / (totalRequired || 1)) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs no-print">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-right font-['Cairo',sans-serif]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white p-4 sm:p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌅</span>
            <div>
              <h3 className="font-black text-base sm:text-lg">أذكار الصباح والتحصين</h3>
              <p className="text-xs text-emerald-100">بركة اليوم وحصن المسلم اليومي</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleReset}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1 transition-all"
              title="إعادة التصفير"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">تصفير</span>
            </button>
            <button onClick={onClose} className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-5 py-3 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-200">
          <span>إنجاز الأذكار: {totalDone} من {totalRequired}</span>
          <span>{percent}%</span>
        </div>

        {/* List of Adhkar */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1 divide-y divide-slate-100 dark:divide-slate-800">
          {MORNING_ADHKAR.map((item) => {
            const current = completedCounts[item.id] || 0;
            const isDone = current >= item.count;
            return (
              <div 
                key={item.id} 
                onClick={() => handleIncrement(item.id, item.count)}
                className={`pt-3 cursor-pointer rounded-2xl p-3 transition-all ${
                  isDone 
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800/40' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <p className="text-sm sm:text-base font-semibold leading-relaxed text-slate-800 dark:text-slate-100">
                  {item.text}
                </p>
                <div className="mt-2.5 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-900/30 px-2.5 py-0.5 rounded-full font-medium">
                    {item.fadl}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">
                      التكرار: {current} / {item.count}
                    </span>
                    <button 
                      type="button"
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shadow-sm ${
                        isDone 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
                      }`}
                    >
                      {isDone ? '✓ تم' : 'اضغط للعد'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   2. أدعية متنوعة (Du'as with Categories)
   ========================================================================= */
interface DuaItem {
  category: 'work' | 'sustenance' | 'relief' | 'health' | 'parents';
  title: string;
  arabic: string;
  source: string;
}

const DUAS_LIST: DuaItem[] = [
  {
    category: 'work',
    title: 'دعاء بداية العمل وتيسير المهام',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذَا الْعَمَلِ وَخَيْرَ مَا فِيهِ، وَأَعُوذُ بِكَ مِنْ شَرِّ هَذَا الْعَمَلِ وَشَرِّ مَا فِيهِ، اللَّهُمَّ يَسِّرْ لِي أَمْرِي وَاشْرَحْ لِي صَدْرِي.',
    source: 'مأثور'
  },
  {
    category: 'work',
    title: 'دعاء التوفيق والبركة في السعي',
    arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي يَفْقَهُوا قَوْلِي.',
    source: 'سورة طه'
  },
  {
    category: 'sustenance',
    title: 'دعاء جلب الرزق وقضاء الدين',
    arabic: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ.',
    source: 'رواه الترمذي'
  },
  {
    category: 'sustenance',
    title: 'دعاء البركة في الرزق والعطاء',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْماً نَافِعاً، وَرِزْقاً طَيِّباً، وَعَمَلاً مُتَقَبَّلاً.',
    source: 'رواه ابن ماجه'
  },
  {
    category: 'relief',
    title: 'دعاء تفريج الهم والكرب',
    arabic: 'لا إِلَهَ إِلا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ.',
    source: 'دعوة ذي النون'
  },
  {
    category: 'relief',
    title: 'دعاء زوال الحزن والضيق',
    arabic: 'اللَّهُمَّ إِنِّي عَبْدُكَ، ابْنُ عَبْدِكَ، ابْنُ أَمَتِكَ، نَاصِيَتِي بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤُكَ، أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ سَمَّيْتَ بِهِ نَفْسَكَ أَنْ تَجْعَلَ الْقُرْآنَ رَبِيعَ قَلْبِي.',
    source: 'رواه أحمد'
  },
  {
    category: 'health',
    title: 'دعاء العافية والشفاء',
    arabic: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لا إِلَهَ إِلا أَنْتَ.',
    source: 'أبو داود'
  },
  {
    category: 'parents',
    title: 'دعاء للوالدين بالرحمة والمغفرة',
    arabic: 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيراً.',
    source: 'سورة الإسراء'
  }
];

export const DuasModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'work' | 'sustenance' | 'relief' | 'health' | 'parents'>('all');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  if (!isOpen) return null;

  const filtered = activeTab === 'all' ? DUAS_LIST : DUAS_LIST.filter(d => d.category === activeTab);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(idx);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs no-print">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-right font-['Cairo',sans-serif]"
      >
        <div className="bg-gradient-to-r from-blue-800 to-indigo-700 text-white p-4 sm:p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤲</span>
            <div>
              <h3 className="font-black text-base sm:text-lg">أدعية مأثورة ومتنوعة</h3>
              <p className="text-xs text-blue-100">أدعية العمل، الرزق، تفريج الهم، والبركة</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${activeTab === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
          >
            الكل
          </button>
          <button
            onClick={() => setActiveTab('work')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${activeTab === 'work' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
          >
            🏢 العمل والتيسير
          </button>
          <button
            onClick={() => setActiveTab('sustenance')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${activeTab === 'sustenance' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
          >
            💰 الرزق والبركة
          </button>
          <button
            onClick={() => setActiveTab('relief')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${activeTab === 'relief' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
          >
            🕊️ تفريج الهم
          </button>
          <button
            onClick={() => setActiveTab('health')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${activeTab === 'health' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
          >
            ❤️ العافية
          </button>
          <button
            onClick={() => setActiveTab('parents')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${activeTab === 'parents' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
          >
            👨‍👩‍👦 الوالدين
          </button>
        </div>

        {/* List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1">
          {filtered.map((item, idx) => (
            <div key={idx} className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-blue-700 dark:text-blue-300">{item.title}</span>
                <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">{item.source}</span>
              </div>
              <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
                "{item.arabic}"
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleCopy(item.arabic, idx)}
                  className="px-3 py-1 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-600 hover:bg-blue-50 transition-colors flex items-center gap-1"
                >
                  {copiedId === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : null}
                  <span>{copiedId === idx ? 'تم النسخ' : 'نسخ الدعاء'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   3. المصحف الشريف (Holy Quran Browser)
   ========================================================================= */
interface SurahItem {
  id: number;
  name: string;
  english: string;
  ayahs: number;
  type: 'مكية' | 'مدنية';
  preview: string;
}

const SURAHS: SurahItem[] = [
  { id: 1, name: 'الفاتحة', english: 'Al-Fatihah', ayahs: 7, type: 'مكية', preview: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ * الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ * الرَّحْمَٰنِ الرَّحِيمِ * مَالِكِ يَوْمِ الدِّينِ * إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ * اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ * صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ' },
  { id: 2, name: 'البقرة', english: 'Al-Baqarah', ayahs: 286, type: 'مدنية', preview: 'الم * ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ * الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ...' },
  { id: 36, name: 'يس', english: 'Ya-Sin', ayahs: 83, type: 'مكية', preview: 'يس * وَالْقُرْآنِ الْحَكِيمِ * إِنَّكَ لَمِنَ الْمُرْسَلِينَ * عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ...' },
  { id: 55, name: 'الرحمن', english: 'Ar-Rahman', ayahs: 78, type: 'مدنية', preview: 'الرَّحْمَٰنُ * عَلَّمَ الْقُرْآنَ * خَلَقَ الْإِنسَانَ * عَلَّمَهُ الْبَيَانَ * الشَّمْسُ وَالْقَمَرُ بِحُسْبَانٍ...' },
  { id: 56, name: 'الواقعة', english: 'Al-Waqi\'ah', ayahs: 96, type: 'مكية', preview: 'إِذَا وَقَعَتِ الْوَاقِعَةُ * لَيْسَ لِوَقْعَتِهَا كَاذِبَةٌ * خَافِضَةٌ رَّافِعَةٌ...' },
  { id: 67, name: 'الملك', english: 'Al-Mulk', ayahs: 30, type: 'مكية', preview: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ * الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا...' },
  { id: 112, name: 'الإخلاص', english: 'Al-Ikhlas', ayahs: 4, type: 'مكية', preview: 'قُلْ هُوَ اللَّهُ أَحَدٌ * اللَّهُ الصَّمَدُ * لَمْ يَلِدْ وَلَمْ يُولَدْ * وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ' },
  { id: 113, name: 'الفلق', english: 'Al-Falaq', ayahs: 5, type: 'مكية', preview: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ * مِن شَرِّ مَا خَلَقَ * وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ * وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ * وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ' },
  { id: 114, name: 'الناس', english: 'An-Nas', ayahs: 6, type: 'مكية', preview: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ * مَلِكِ النَّاسِ * إِلَٰهِ النَّاسِ * مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ * الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ * مِنَ الْجِنَّةِ وَالنَّاسِ' }
];

export const QuranModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<SurahItem | null>(null);

  if (!isOpen) return null;

  const filtered = SURAHS.filter(s => s.name.includes(search) || s.english.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs no-print">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-right font-['Cairo',sans-serif]"
      >
        <div className="bg-gradient-to-r from-amber-700 to-amber-900 text-white p-4 sm:p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📖</span>
            <div>
              <h3 className="font-black text-base sm:text-lg">المصحف الشريف</h3>
              <p className="text-xs text-amber-100">تلاوة وتدبر آيات الذكر الحكيم</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {selectedSurah ? (
          <div className="p-5 overflow-y-auto flex-1 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3 mb-4">
              <button
                onClick={() => setSelectedSurah(null)}
                className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200"
              >
                ← العودة للسور
              </button>
              <div className="text-center">
                <h4 className="font-black text-base text-amber-700 dark:text-amber-400">سورة {selectedSurah.name}</h4>
                <p className="text-[11px] text-slate-500">{selectedSurah.type} • {selectedSurah.ayahs} آية</p>
              </div>
              <div className="w-16" />
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-center leading-loose font-serif text-base sm:text-lg text-slate-800 dark:text-slate-100 flex-1">
              <p className="mb-4 text-amber-800 dark:text-amber-300 font-bold">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
              <p className="leading-loose tracking-wide">{selectedSurah.preview}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="relative">
                <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ابحث عن اسم السورة..."
                  className="w-full h-10 pr-9 pl-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="p-4 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filtered.map((surah) => (
                <button
                  key={surah.id}
                  onClick={() => setSelectedSurah(surah)}
                  className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 hover:border-amber-400 hover:bg-amber-50/30 dark:hover:bg-slate-750 transition-all flex items-center justify-between text-right group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center justify-center">
                      {surah.id}
                    </span>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 group-hover:text-amber-600">
                        سورة {surah.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {surah.type} • {surah.ayahs} آية
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 rotate-180 group-hover:text-amber-600" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================================================================
   4. السبحة الإلكترونية (Electronic Tasbih)
   ========================================================================= */
export const TasbihModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [count, setCount] = useState<number>(0);
  const [totalCycle, setTotalCycle] = useState<number>(0);
  const [activePhrase, setActivePhrase] = useState<string>('سُبْحَانَ اللَّهِ');
  const [target, setTarget] = useState<number>(33);

  if (!isOpen) return null;

  const phrases = [
    'سُبْحَانَ اللَّهِ',
    'الْحَمْدُ لِلَّهِ',
    'لا إِلَهَ إِلا اللَّهُ',
    'اللَّهُ أَكْبَرُ',
    'أَسْتَغْفِرُ اللَّهَ',
    'لا حَوْلَ وَلا قُوَّةَ إِلا بِاللَّهِ',
    'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ'
  ];

  const handleTap = () => {
    const next = count + 1;
    if (next >= target) {
      setCount(0);
      setTotalCycle(prev => prev + 1);
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
    } else {
      setCount(next);
      if (navigator.vibrate) {
        navigator.vibrate(20);
      }
    }
  };

  const handleReset = () => {
    setCount(0);
    setTotalCycle(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs no-print">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-right font-['Cairo',sans-serif]"
      >
        <div className="bg-gradient-to-r from-teal-800 to-emerald-700 text-white p-4 sm:p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📿</span>
            <div>
              <h3 className="font-black text-base sm:text-lg">السبحة الإلكترونية</h3>
              <p className="text-xs text-teal-100">ذكر وتسبيح متواصل</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex flex-col items-center justify-center space-y-4">
          {/* Phrase Selector */}
          <div className="w-full flex items-center gap-1 overflow-x-auto pb-2 text-xs font-bold">
            {phrases.map((p, i) => (
              <button
                key={i}
                onClick={() => {
                  setActivePhrase(p);
                  setCount(0);
                }}
                className={`px-3 py-1.5 rounded-xl shrink-0 transition-all ${
                  activePhrase === p 
                    ? 'bg-teal-600 text-white shadow-md' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Target options */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-slate-500">الهدف:</span>
            {[33, 100, 1000].map((t) => (
              <button
                key={t}
                onClick={() => setTarget(t)}
                className={`px-2.5 py-1 rounded-lg border ${
                  target === t ? 'bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 border-teal-500 font-bold' : 'border-slate-200 dark:border-slate-700 text-slate-500'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Current Phrase Display */}
          <div className="text-center py-2">
            <span className="text-xl sm:text-2xl font-black text-teal-700 dark:text-teal-400">
              {activePhrase}
            </span>
          </div>

          {/* Giant Click Button */}
          <button
            type="button"
            onClick={handleTap}
            className="w-48 h-48 rounded-full bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 text-white flex flex-col items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all border-4 border-white/40 ring-8 ring-teal-500/20 cursor-pointer select-none"
          >
            <span className="text-5xl font-black font-mono tracking-tight">{count}</span>
            <span className="text-xs font-bold text-teal-100 mt-1">اضغط للتسبيح</span>
            <span className="text-[10px] text-teal-200 mt-0.5">الهدف: {target}</span>
          </button>

          {/* Reset & Stats */}
          <div className="w-full flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400">
            <span>الدورات المكتملة: {totalCycle}</span>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-red-500 hover:text-red-600 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/30"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة ضبط</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

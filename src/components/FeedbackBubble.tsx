import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Crosshair, 
  Camera, 
  Video, 
  Paperclip, 
  Bell, 
  CheckCheck, 
  Trash2, 
  ExternalLink,
  Info,
  Copy,
  Check,
  Sparkles,
  StopCircle,
  Clock,
  Layers
} from 'lucide-react';
import { enableElementSelector, ElementSelectorResult } from '../utils/elementSelector';
import { captureScreenFrame, ScreenshotAttachment } from '../utils/screenshotCapture';
import { videoRecorder, VideoAttachment } from '../utils/videoRecorder';
import { ScreenshotAnnotationModal } from './ScreenshotAnnotationModal';
import { VideoPreviewModal } from './VideoPreviewModal';
import { getConsoleLogs } from '../utils/consoleCapture';

interface FeedbackBubbleProps {
  onOpenDiscussions?: () => void;
  urgentText?: string;
  memoText?: string;
}

interface StoredFeedback {
  id: string;
  text: string;
  createdAt: string;
  url: string;
  element?: ElementSelectorResult;
  screenshot?: { filename: string; size: number };
  video?: { filename: string; size: number };
  file?: { name: string; size: number };
}

interface TeamMessage {
  id: string;
  sender: string;
  avatar: string;
  preview: string;
  time: string;
  unread: boolean;
}

interface SystemNotification {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: 'urgent' | 'memo' | 'task' | 'info';
  read: boolean;
}

export const FeedbackBubble: React.FC<FeedbackBubbleProps> = ({
  onOpenDiscussions,
  urgentText,
  memoText
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'feedback' | 'messages' | 'notifications'>('feedback');
  
  // Feedback state
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedElement, setSelectedElement] = useState<ElementSelectorResult | null>(null);
  const [screenshotAttachment, setScreenshotAttachment] = useState<ScreenshotAttachment | null>(null);
  const [videoAttachment, setVideoAttachment] = useState<VideoAttachment | null>(null);
  const [fileAttachment, setFileAttachment] = useState<File | null>(null);

  // Modals
  const [isAnnotatingScreenshot, setIsAnnotatingScreenshot] = useState(false);
  const [rawScreenshotUrl, setRawScreenshotUrl] = useState<string | null>(null);
  const [isPreviewingVideo, setIsPreviewingVideo] = useState(false);
  const [rawVideoBlob, setRawVideoBlob] = useState<Blob | null>(null);
  
  // Recording HUD state
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState('00:00');

  // Copied alert
  const [copiedError, setCopiedError] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);

  // Messages & Notifications lists
  const [teamMessages, setTeamMessages] = useState<TeamMessage[]>([
    {
      id: '1',
      sender: 'م/ أمير شلبي',
      avatar: '👨‍💼',
      preview: 'تم فحص أجهزة الباركود وتحديث بيانات شبكة وزارة الصحة.',
      time: 'منذ 10 دقائق',
      unread: true
    },
    {
      id: '2',
      sender: 'م/ تامر عزب',
      avatar: '💻',
      preview: 'برجاء مراجعة خطة ورديات السبت القادمة للأقسام.',
      time: 'منذ 45 دقيقة',
      unread: true
    },
    {
      id: '3',
      sender: 'أ/ كودي هاني',
      avatar: '🛡️',
      preview: 'تم إضافة مذكرات إجازة اعتيادية للمراجعة والاعتماد.',
      time: 'منذ ساعتين',
      unread: false
    }
  ]);

  const [notifications, setNotifications] = useState<SystemNotification[]>([
    {
      id: 'n1',
      title: 'تنبيه عاجل من الإدارة',
      desc: urgentText || 'تحديث أجهزة البصمة وتأكيد حضور ورديات نهاية الأسبوع.',
      time: 'اليوم 09:30 ص',
      type: 'urgent',
      read: false
    },
    {
      id: 'n2',
      title: 'مذكرة العمل الداخلية',
      desc: memoText || 'الالتزام بمواعيد تسجيل الدعم الفني عبر البوابة الرسمية.',
      time: 'اليوم 08:00 ص',
      type: 'memo',
      read: false
    },
    {
      id: 'n3',
      title: 'إسناد مهمة جديدة',
      desc: 'تم إسناد مهمة صيانة طابعات الصادرات لمجموعة الدعم الفني.',
      time: 'أمس',
      type: 'task',
      read: true
    }
  ]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Calculate unread badge count
  const unreadMessagesCount = teamMessages.filter((m) => m.unread).length;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const totalBadgeCount = unreadMessagesCount + unreadNotificationsCount;

  // Handle Element Selection
  const handleSelectElement = () => {
    setIsOpen(false);
    enableElementSelector({
      onSelect: (detail) => {
        setSelectedElement(detail);
        setIsOpen(true);
      },
      onCancel: () => {
        setIsOpen(true);
      }
    });
  };

  // Handle Screenshot
  const handleTakeScreenshot = async () => {
    setIsOpen(false);
    const dataUrl = await captureScreenFrame();
    if (dataUrl) {
      setRawScreenshotUrl(dataUrl);
      setIsAnnotatingScreenshot(true);
    } else {
      setIsOpen(true);
    }
  };

  // Handle Video Recording Start
  const handleStartVideoRecording = async () => {
    setIsOpen(false);
    setIsRecordingVideo(true);
    setRecordingTimer('00:00');

    const success = await videoRecorder.startRecording(
      (timeStr) => {
        setRecordingTimer(timeStr);
      },
      (blob) => {
        setIsRecordingVideo(false);
        if (blob) {
          setRawVideoBlob(blob);
          setIsPreviewingVideo(true);
        } else {
          setIsOpen(true);
        }
      }
    );

    if (!success) {
      setIsRecordingVideo(false);
      setIsOpen(true);
    }
  };

  const handleStopVideoRecording = async () => {
    const blob = await videoRecorder.stopRecording();
    setIsRecordingVideo(false);
    if (blob) {
      setRawVideoBlob(blob);
      setIsPreviewingVideo(true);
    } else {
      setIsOpen(true);
    }
  };

  // Handle File Input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileAttachment(e.target.files[0]);
    }
  };

  // Submit Feedback
  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim() && !selectedElement && !screenshotAttachment && !videoAttachment && !fileAttachment) {
      return;
    }

    const newFeedback: StoredFeedback = {
      id: String(Date.now()),
      text: feedbackText.trim(),
      createdAt: new Date().toISOString(),
      url: window.location.pathname,
      element: selectedElement || undefined,
      screenshot: screenshotAttachment ? { filename: screenshotAttachment.filename, size: screenshotAttachment.size } : undefined,
      video: videoAttachment ? { filename: videoAttachment.filename, size: videoAttachment.size } : undefined,
      file: fileAttachment ? { name: fileAttachment.name, size: fileAttachment.size } : undefined
    };

    try {
      const existing = JSON.parse(localStorage.getItem('goeic_user_feedback') || '[]');
      existing.unshift(newFeedback);
      localStorage.setItem('goeic_user_feedback', JSON.stringify(existing.slice(0, 50)));
    } catch {
      // silent
    }

    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setFeedbackText('');
      setSelectedElement(null);
      setScreenshotAttachment(null);
      setVideoAttachment(null);
      setFileAttachment(null);
      setIsOpen(false);
    }, 1800);
  };

  // Copy Debug Report
  const handleCopyErrorReport = () => {
    const logs = getConsoleLogs().slice(-10);
    const report = `=== تقرير الخطأ والملاحظات الفنية (GOEIC Feedback Report) ===
التاريخ: ${new Date().toLocaleString('ar-EG')}
المسار الحالي: ${window.location.href}
نص الملاحظة: ${feedbackText || 'لا يوجد نص'}
العنصر المحدد: ${selectedElement ? `${selectedElement.selector} (${selectedElement.text})` : 'لا يوجد'}
الملفات المرفقة: ${[
      screenshotAttachment ? `صورة: ${screenshotAttachment.filename}` : null,
      videoAttachment ? `فيديو: ${videoAttachment.filename}` : null,
      fileAttachment ? `ملف: ${fileAttachment.name}` : null
    ].filter(Boolean).join(', ') || 'لا يوجد'}

سجلات النظام الأخيرة (Console Logs):
${logs.map((l) => `[${l.type.toUpperCase()}] ${l.args.join(' ')}`).join('\n') || 'لا توجد أخطاء مسجلة'}
`;
    navigator.clipboard.writeText(report);
    setCopiedError(true);
    setTimeout(() => setCopiedError(false), 2000);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <>
      {/* Floating Video Recording HUD */}
      {isRecordingVideo && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100004] bg-slate-900/95 border-2 border-red-500/80 text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-4 backdrop-blur-md animate-bounce">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-red-600 animate-ping" />
            <span className="text-xs font-black text-red-400">جاري تسجيل الشاشة</span>
          </div>
          <div className="font-mono text-sm font-bold tracking-wider text-slate-100 bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">
            {recordingTimer}
          </div>
          <button
            onClick={handleStopVideoRecording}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-full cursor-pointer transition-all shadow-md"
          >
            <StopCircle className="w-4 h-4" />
            إيقاف وحفظ
          </button>
        </div>
      )}

      {/* Floating Feedback Bubble Trigger Button */}
      <div id="llamapress-feedback-bubble" className="fixed bottom-6 right-6 z-40 no-print">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="ملاحظات وتنبيهات الدعم الفني"
          className="relative group bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-900 text-white p-3.5 rounded-full shadow-2xl border-2 border-indigo-400/40 hover:border-indigo-300 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center ring-4 ring-indigo-500/20"
        >
          <MessageSquare className="w-6 h-6 text-indigo-200 group-hover:rotate-12 transition-transform" />

          {/* Unread badge */}
          {totalBadgeCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-md">
              {totalBadgeCount > 99 ? '99+' : totalBadgeCount}
            </span>
          )}

          {/* Pulse beacon */}
          <span className="absolute inset-0 rounded-full bg-indigo-400/20 animate-ping pointer-events-none" />
        </button>
      </div>

      {/* Main Feedback Popup Panel */}
      {isOpen && (
        <div 
          id="llamapress-feedback-panel" 
          className="fixed bottom-24 right-6 z-50 w-[420px] max-w-[calc(100vw-32px)] bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 no-print animate-in fade-in slide-in-from-bottom-6 duration-200"
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/80">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center border border-indigo-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100 leading-tight">مركز الملاحظات والتواصل</h3>
                <p className="text-[10px] text-slate-400 leading-tight">الدعم الفني و LlamaBot / Leonardo</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowVersionModal(true)}
                className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono border border-slate-700 transition-colors"
                title="معلومات الإصدار"
              >
                v2.4
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center border-b border-slate-800 bg-slate-900/60 p-1">
            <button
              onClick={() => setActiveTab('feedback')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'feedback'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              ملاحظة جديدة
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 relative ${
                activeTab === 'messages'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              المحادثات
              {unreadMessagesCount > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 relative ${
                activeTab === 'notifications'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              التنبيهات
              {unreadNotificationsCount > 0 && (
                <span className="bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          </div>

          {/* TAB 1: Feedback Form */}
          {activeTab === 'feedback' && (
            <form onSubmit={handleSubmitFeedback} className="p-4 flex flex-col gap-3">
              {submitSuccess ? (
                <div className="py-10 flex flex-col items-center justify-center text-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 animate-bounce">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-100">تم إرسال ملاحظتك بنجاح!</h4>
                  <p className="text-xs text-slate-400">تم تدوين الملاحظة وإتاحتها لمهندسي الدعم الفني و LlamaBot.</p>
                </div>
              ) : (
                <>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="اكتب ملاحظتك، اقتراحك، أو المشكلة التي تواجهها هنا..."
                    rows={3}
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                  />

                  {/* Attachment Previews */}
                  <div className="flex flex-col gap-2">
                    {selectedElement && (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <Crosshair className="w-4 h-4 shrink-0 text-emerald-400" />
                          <span className="truncate font-mono text-[11px]" title={selectedElement.selector}>
                            {selectedElement.text || selectedElement.selector}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedElement(null)}
                          className="text-emerald-400 hover:text-emerald-200 p-0.5 rounded cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {screenshotAttachment && (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <Camera className="w-4 h-4 shrink-0 text-purple-400" />
                          <span className="truncate font-mono text-[11px]">
                            {screenshotAttachment.filename} ({(screenshotAttachment.size / 1024).toFixed(0)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setScreenshotAttachment(null)}
                          className="text-purple-400 hover:text-purple-200 p-0.5 rounded cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {videoAttachment && (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <Video className="w-4 h-4 shrink-0 text-red-400" />
                          <span className="truncate font-mono text-[11px]">
                            {videoAttachment.filename} ({(videoAttachment.size / 1024 / 1024).toFixed(1)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setVideoAttachment(null)}
                          className="text-red-400 hover:text-red-200 p-0.5 rounded cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {fileAttachment && (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-blue-950/40 border border-blue-500/30 text-blue-300 text-xs">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <Paperclip className="w-4 h-4 shrink-0 text-blue-400" />
                          <span className="truncate font-mono text-[11px]">
                            {fileAttachment.name} ({(fileAttachment.size / 1024).toFixed(0)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFileAttachment(null)}
                          className="text-blue-400 hover:text-blue-200 p-0.5 rounded cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Media Tools Row */}
                  <div className="grid grid-cols-4 gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={handleSelectElement}
                      className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 text-[11px] font-medium flex flex-col items-center gap-1 border border-slate-700/60 transition-colors cursor-pointer"
                      title="حدد أي عنصر على الشاشة"
                    >
                      <Crosshair className="w-4 h-4 text-emerald-400" />
                      تحديد عنصر
                    </button>

                    <button
                      type="button"
                      onClick={handleTakeScreenshot}
                      className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-purple-400 text-[11px] font-medium flex flex-col items-center gap-1 border border-slate-700/60 transition-colors cursor-pointer"
                      title="التقط لقطة شاشة وقم بالرسم عليها"
                    >
                      <Camera className="w-4 h-4 text-purple-400" />
                      لقطة شاشة
                    </button>

                    <button
                      type="button"
                      onClick={handleStartVideoRecording}
                      className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-red-400 text-[11px] font-medium flex flex-col items-center gap-1 border border-slate-700/60 transition-colors cursor-pointer"
                      title="سجل فيديو للشاشة مع الميكروفون"
                    >
                      <Video className="w-4 h-4 text-red-400" />
                      تسجيل فيديو
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-blue-400 text-[11px] font-medium flex flex-col items-center gap-1 border border-slate-700/60 transition-colors cursor-pointer"
                      title="أرفق ملف أو صورة أو مستند"
                    >
                      <Paperclip className="w-4 h-4 text-blue-400" />
                      إرفاق ملف
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*,video/*,.pdf,.doc,.docx"
                    />
                  </div>

                  {/* Action row */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={handleCopyErrorReport}
                      className="text-[11px] text-slate-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                      title="نسخ تقرير تقني مفصل يحتوي السجلات والأخطاء"
                    >
                      {copiedError ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedError ? 'تم النسخ!' : 'نسخ التقرير الفني'}
                    </button>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      إرسال الملاحظة
                    </button>
                  </div>
                </>
              )}
            </form>
          )}

          {/* TAB 2: Direct Messages */}
          {activeTab === 'messages' && (
            <div className="p-3 flex flex-col gap-2 max-h-[340px] overflow-y-auto">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1 pb-1 border-b border-slate-800">
                <span>المحادثات السريعة مع الفريق</span>
                {onOpenDiscussions && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onOpenDiscussions();
                    }}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-bold cursor-pointer"
                  >
                    فتح نافذة المحادثات الكاملة
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

              {teamMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => {
                    setTeamMessages(teamMessages.map((m) => (m.id === msg.id ? { ...m, unread: false } : m)));
                    if (onOpenDiscussions) {
                      setIsOpen(false);
                      onOpenDiscussions();
                    }
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    msg.unread
                      ? 'bg-slate-800/90 border-indigo-500/40 hover:border-indigo-400'
                      : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-lg shrink-0 border border-slate-700">
                    {msg.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-200">{msg.sender}</h4>
                      <span className="text-[10px] text-slate-500 font-mono">{msg.time}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{msg.preview}</p>
                  </div>
                  {msg.unread && <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1.5" />}
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Notifications */}
          {activeTab === 'notifications' && (
            <div className="p-3 flex flex-col gap-2 max-h-[340px] overflow-y-auto">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1 pb-1 border-b border-slate-800">
                <span>تنبيهات المنظومة الإدارية</span>
                <button
                  onClick={handleMarkAllNotificationsRead}
                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-bold cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  تعليم الكل كمقروء
                </button>
              </div>

              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                    n.read
                      ? 'bg-slate-900/50 border-slate-800'
                      : 'bg-slate-800/80 border-amber-500/30'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                    <Bell className={`w-4 h-4 ${n.type === 'urgent' ? 'text-red-400' : 'text-amber-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-200">{n.title}</h4>
                      <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Version Footer Bar */}
          <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              LlamaBot & Leonardo Connected
            </span>
            <button
              onClick={() => setShowVersionModal(true)}
              className="hover:text-indigo-300 underline underline-offset-2 transition-colors cursor-pointer"
            >
              ما الجديد في المنظومة؟
            </button>
          </div>
        </div>
      )}

      {/* Screenshot Annotation Modal */}
      <ScreenshotAnnotationModal
        isOpen={isAnnotatingScreenshot}
        imageData={rawScreenshotUrl}
        onClose={() => {
          setIsAnnotatingScreenshot(false);
          setRawScreenshotUrl(null);
          setIsOpen(true);
        }}
        onAttach={(attachment) => {
          setScreenshotAttachment(attachment);
          setIsAnnotatingScreenshot(false);
          setRawScreenshotUrl(null);
          setIsOpen(true);
        }}
      />

      {/* Video Preview Modal */}
      <VideoPreviewModal
        isOpen={isPreviewingVideo}
        videoBlob={rawVideoBlob}
        onClose={() => {
          setIsPreviewingVideo(false);
          setRawVideoBlob(null);
          setIsOpen(true);
        }}
        onAttach={(attachment) => {
          setVideoAttachment(attachment);
          setIsPreviewingVideo(false);
          setRawVideoBlob(null);
          setIsOpen(true);
        }}
      />

      {/* What's New / Version Info Modal */}
      {showVersionModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100005] flex items-center justify-center p-4" dir="rtl">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-slate-100 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold">ما الجديد في الإصدار v2.4 (LlamaPress Integration)</h3>
              </div>
              <button
                onClick={() => setShowVersionModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <h4 className="font-bold text-indigo-300 mb-1">🎯 محدد العناصر البصري (Visual Element Selector)</h4>
                <p>يمكنك الآن النقر على أي عنصر أو زر أو جدول في الصفحة لنسخ مساره البرمجي وربطه مباشرة بملاحظتك للبوت والمهندسين.</p>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <h4 className="font-bold text-purple-300 mb-1">📸 لقطة شاشة مع محرر رسومي (Screenshot Annotator)</h4>
                <p>التقط لقطة شاشة فورية مع أدوات القلم والمربع والأسهم وكتابة النصوص التوضيحية لتحديد الأخطاء بدقة.</p>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <h4 className="font-bold text-red-300 mb-1">🎥 مسجل شاشة فيديو وصوت (Screen & Audio Recorder)</h4>
                <p>سجل الشاشة بالفيديو مع صوت الميكروفون لشرح المشكلات التفاعلية بضغطة زر مع شريط توقيت مباشر ومعاينة فورية.</p>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <h4 className="font-bold text-emerald-300 mb-1">⚡ تكامل إطار العمل (Leonardo / LlamaBot Protocol)</h4>
                <p>دعم كامل لبروتوكول رسائل الـ iframe (`execute-js` الآمن، استرجاع سجلات الكونسول `get-console-logs`، وتتبع التنقل).</p>
              </div>
            </div>

            <button
              onClick={() => setShowVersionModal(false)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              فهمت، تابع العمل
            </button>
          </div>
        </div>
      )}
    </>
  );
};

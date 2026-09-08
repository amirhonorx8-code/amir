import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Smile, 
  Paperclip, 
  Mic, 
  Phone, 
  Video, 
  MoreVertical, 
  Search, 
  CheckCheck, 
  Check, 
  Trash2, 
  Download, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  FileText, 
  Image as ImageIcon, 
  Play, 
  Award,
  ArrowRight,
  ArrowLeft,
  Users,
  User,
  Bell,
  BellOff
} from 'lucide-react';
import { APP_USERS } from '../types';

interface DiscussionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: string;
  currentUserName?: string;
  currentUserEmail?: string;
}

export interface ChatMessage {
  id: string;
  senderId?: string;
  sender: string;
  role: string;
  time: string;
  text: string;
  isMe?: boolean;
  type?: 'text' | 'audio' | 'document';
  audioDuration?: string;
  reactions?: Record<string, number>;
  myReaction?: string;
}

export interface ChatContact {
  id: string;
  name: string;
  role: string;
  avatarBg: string;
  avatarText: string;
  isGroup?: boolean;
  onlineStatus: string;
  phone?: string;
  unreadCount?: number;
}

// Generate a unique chat room ID for a 1-on-1 chat
const getChatId = (user1: string, user2: string) => {
  return [user1, user2].sort().join('_');
};

const EMOJI_LIST = ['😀', '😂', '❤️', '👍', '👏', '🙏', '🔥', '💼', '💻', '📋', '✅', '⏰', '☕', '🌸', '📌', '🚨', '⚡', '📞'];

export const DiscussionsModal: React.FC<DiscussionsModalProps> = ({ 
  isOpen, 
  onClose, 
  currentUserId = 'amir',
  currentUserName = 'أمير طلعت',
  currentUserEmail
}) => {
  // Mobile responsive view toggle: 'list' (all chats) or 'chat' (active discussion)
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  // Chats category filter
  const [chatFilter, setChatFilter] = useState<'all' | 'direct' | 'groups'>('all');

  // Contacts list based on APP_USERS (excluding guest, kody, and current user)
  const contacts = React.useMemo(() => {
    return APP_USERS
      .filter(u => u.id !== 'guest' && u.id !== 'kody' && u.id !== currentUserId)
      .map(u => ({
        id: u.id,
        name: u.name,
        role: u.description || '',
        avatarBg: u.badgeColor?.split(' ')[0] || 'bg-slate-500',
        avatarText: u.name.charAt(0),
        isGroup: false,
        onlineStatus: 'متصل',
        unreadCount: 0,
      }));
  }, [currentUserId]);

  // Selected Chat ID (Defaults to first contact)
  const [selectedChatId, setSelectedChatId] = useState<string>(contacts[0]?.id || '');
  
  // Update selection if selected is not found
  useEffect(() => {
    if (contacts.length > 0 && (!selectedChatId || !contacts.find(c => c.id === selectedChatId))) {
      setSelectedChatId(contacts[0].id);
    }
  }, [contacts, selectedChatId]);

  // Chats message dictionary (key: getChatId(currentUserId, contactId))
  const [chatsMessages, setChatsMessages] = useState<Record<string, ChatMessage[]>>(() => {
    try {
      const saved = localStorage.getItem('goeic_whatsapp_all_messages_v3');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {};
  });

  // Sound Notification Setting (Default Enabled)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('goeic_whatsapp_sound_enabled');
      if (saved !== null) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return true;
  });

  const [inputText, setInputText] = useState<string>('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showAttachMenu, setShowAttachMenu] = useState<boolean>(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState<boolean>(false);
  const [contactSearchQuery, setContactSearchQuery] = useState<string>('');
  const [inChatSearchQuery, setInChatSearchQuery] = useState<string>('');
  const [showInChatSearch, setShowInChatSearch] = useState<boolean>(false);
  const [callNotice, setCallNotice] = useState<string | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [voiceSeconds, setVoiceSeconds] = useState<number>(0);
  const [typingContactId, setTypingContactId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Active contact object
  const activeContact = contacts.find(c => c.id === selectedChatId) || contacts[0];
  const activeChatRoomId = activeContact ? getChatId(currentUserId, activeContact.id) : '';
  const activeMessages = chatsMessages[activeChatRoomId] || [];

  // Persist messages & sound setting
  useEffect(() => {
    try {
      localStorage.setItem('goeic_whatsapp_all_messages_v2', JSON.stringify(chatsMessages));
    } catch {
      // ignore
    }
  }, [chatsMessages]);

  useEffect(() => {
    try {
      localStorage.setItem('goeic_whatsapp_sound_enabled', JSON.stringify(soundEnabled));
    } catch {
      // ignore
    }
  }, [soundEnabled]);

  // Scroll to bottom on active message changes
  useEffect(() => {
    if (isOpen && mobileView === 'chat') {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isOpen, selectedChatId, activeMessages.length, mobileView]);

  // Voice recording timer
  useEffect(() => {
    let timer: any;
    if (isRecordingVoice) {
      timer = setInterval(() => {
        setVoiceSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setVoiceSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecordingVoice]);

  if (!isOpen) return null;

  // ==========================================
  // Sound Synthesizers (Web Audio API)
  // ==========================================

  // 1. Sent Sound (Soft gentle pop)
  const playSendSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1300, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Audio not supported/allowed
    }
  };

  // 2. Received Sound (Authentic WhatsApp double-tone chime: High-pitch notification bell)
  const playReceiveSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Note 1: 900 Hz
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, ctx.currentTime);
      gain1.gain.setValueAtTime(0.15, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.12);

      // Note 2: 1320 Hz (WhatsApp signature chime)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1320, ctx.currentTime + 0.1);
      gain2.gain.setValueAtTime(0.18, ctx.currentTime + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.1);
      osc2.stop(ctx.currentTime + 0.28);
    } catch {
      // Audio not supported/allowed
    }
  };

  const formatCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const period = now.getHours() >= 12 ? 'م' : 'ص';
    return `${hours}:${minutes} ${period}`;
  };

  const getSenderName = () => {
    if (currentUserName && currentUserName.trim()) return currentUserName.trim();
    if (currentUserEmail) return currentUserEmail.split('@')[0];
    return 'أمير طلعت';
  };

  // Select a chat contact
  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    setMobileView('chat');
    setShowEmojiPicker(false);
    setShowAttachMenu(false);
    setShowInChatSearch(false);
    setInChatSearchQuery('');

    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
  };

  // Send a message in the active chat
  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const myName = getSenderName();
    const targetRoomId = activeChatRoomId;
    const sentText = inputText.trim();

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      sender: myName,
      role: 'أنا',
      time: formatCurrentTime(),
      text: sentText,
      reactions: {},
    };

    // Update active chat messages
    setChatsMessages(prev => ({
      ...prev,
      [targetRoomId]: [...(prev[targetRoomId] || []), newMsg],
    }));

    setInputText('');
    setShowEmojiPicker(false);
    setShowAttachMenu(false);
    playSendSound();

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  // Send Voice note simulation
  const handleToggleVoiceNote = () => {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
    } else {
      setIsRecordingVoice(false);
      const myName = getSenderName();
      const targetRoomId = activeChatRoomId;
      const durationStr = `0:${String(Math.max(2, voiceSeconds)).padStart(2, '0')}`;
      
      const newMsg: ChatMessage = {
        id: `voice-${Date.now()}`,
        senderId: currentUserId,
        sender: myName,
        role: 'أنا',
        time: formatCurrentTime(),
        text: 'رسالة صوتية 🎙️',
        type: 'audio',
        audioDuration: durationStr,
        reactions: {},
      };

      setChatsMessages(prev => ({
        ...prev,
        [targetRoomId]: [...(prev[targetRoomId] || []), newMsg],
      }));

      playSendSound();
    }
  };

  // Attachment Simulation
  const handleAttachItem = (itemType: 'doc' | 'img' | 'task') => {
    setShowAttachMenu(false);
    const myName = getSenderName();
    const targetRoomId = activeChatRoomId;
    let text = '';
    if (itemType === 'doc') text = '📄 تقرير_متابعة_الأعطال_الشهرية_سبتمبر.pdf (2.4 MB)';
    if (itemType === 'img') text = '🖼️ صورة_مخطط_شبكة_السيرفرات_الرئيسية.png';
    if (itemType === 'task') text = '📌 تم إرفاق مهمة صيانة دورية جديدة لقسم الدعم الفني';

    const newMsg: ChatMessage = {
      id: `att-${Date.now()}`,
      senderId: currentUserId,
      sender: myName,
      role: 'أنا',
      time: formatCurrentTime(),
      text,
      type: itemType === 'doc' ? 'document' : 'text',
      reactions: {},
    };

    setChatsMessages(prev => ({
      ...prev,
      [targetRoomId]: [...(prev[targetRoomId] || []), newMsg],
    }));

    playSendSound();
  };

  // Reaction on a message
  const handleReaction = (msgId: string, emoji: string) => {
    setChatsMessages(prev => {
      const currentList = prev[activeChatRoomId] || [];
      const updatedList = currentList.map(m => {
        if (m.id !== msgId) return m;
        const currentReactions = { ...(m.reactions || {}) };
        const hadReaction = m.myReaction;

        if (hadReaction === emoji) {
          currentReactions[emoji] = Math.max(0, (currentReactions[emoji] || 1) - 1);
          if (currentReactions[emoji] === 0) delete currentReactions[emoji];
          return { ...m, reactions: currentReactions, myReaction: undefined };
        } else {
          if (hadReaction && currentReactions[hadReaction]) {
            currentReactions[hadReaction] = Math.max(0, currentReactions[hadReaction] - 1);
            if (currentReactions[hadReaction] === 0) delete currentReactions[hadReaction];
          }
          currentReactions[emoji] = (currentReactions[emoji] || 0) + 1;
          return { ...m, reactions: currentReactions, myReaction: emoji };
        }
      });
      return { ...prev, [activeChatRoomId]: updatedList };
    });
  };

  // Delete message
  const handleDeleteMessage = (msgId: string) => {
    setChatsMessages(prev => ({
      ...prev,
      [activeChatRoomId]: (prev[activeChatRoomId] || []).filter(m => m.id !== msgId),
    }));
  };

  // Clear chat
  const handleClearCurrentChat = () => {
    if (confirm(`هل أنت متأكد من مسح جميع الرسائل في محادثة "${activeContact.name}"؟`)) {
      setChatsMessages(prev => ({ ...prev, [activeChatRoomId]: [] }));
      setShowOptionsMenu(false);
    }
  };

  // Reset to default
  const handleResetAllChats = () => {
    if (confirm('هل تريد مسح جميع المحادثات بشكل نهائي؟ (هذا الإجراء لا يمكن التراجع عنه)')) {
      setChatsMessages({});
      localStorage.removeItem('goeic_whatsapp_all_messages_v3');
      setShowOptionsMenu(false);
    }
  };

  // Export current chat
  const handleExportChat = () => {
    const chatContent = activeMessages.map(m => `[${m.time}] ${m.sender} (${m.role}): ${m.text}`).join('\n');
    const blob = new Blob([chatContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `محادثة_${activeContact.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setShowOptionsMenu(false);
  };

  // Trigger call simulation for active contact
  const triggerCallNotice = (type: 'صوتية' | 'فيديو') => {
    setCallNotice(`جاري الاتصال بـ (${activeContact.name}) مكالمة ${type}... 📲`);
    setTimeout(() => {
      setCallNotice(null);
    }, 3500);
  };

  // Distinct color per sender in groups
  const getSenderColor = (sender: string) => {
    if (sender.includes('أمير')) return 'text-[#128C7E] dark:text-[#25D366]';
    if (sender.includes('شيماء')) return 'text-[#E11D48] dark:text-[#FB7185]';
    if (sender.includes('محمد')) return 'text-[#2563EB] dark:text-[#60A5FA]';
    if (sender.includes('هند')) return 'text-[#7C3AED] dark:text-[#A78BFA]';
    return 'text-[#D97706] dark:text-[#FBBF24]';
  };

  // Filter contacts by tab and search
  const filteredContacts = contacts.filter(c => {
    if (chatFilter === 'direct' && c.isGroup) return false;
    if (chatFilter === 'groups' && !c.isGroup) return false;
    if (contactSearchQuery.trim()) {
      const q = contactSearchQuery.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q);
    }
    return true;
  });

  // Filter messages in active chat if in-chat search is active
  const filteredActiveMessages = inChatSearchQuery.trim()
    ? activeMessages.filter(m => 
        m.text.toLowerCase().includes(inChatSearchQuery.toLowerCase()) ||
        m.sender.toLowerCase().includes(inChatSearchQuery.toLowerCase())
      )
    : activeMessages;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-3 md:p-6 bg-black/75 backdrop-blur-xs animate-fade-in font-['Cairo',sans-serif] select-none"
      onClick={onClose}
    >
      <div 
        onClick={e => e.stopPropagation()}
        className="w-full max-w-5xl bg-[#F0F2F5] dark:bg-[#111B21] rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-300 dark:border-slate-800 flex h-[660px] max-h-[95vh] overflow-hidden relative"
      >
        
        {/* ====================================================
         * LEFT / SIDEBAR: CONTACTS & CHATS LIST
         * ==================================================== */}
        <div className={`w-full md:w-80 lg:w-96 flex flex-col bg-white dark:bg-[#111B21] border-l border-slate-200 dark:border-slate-800 z-10 ${
          mobileView === 'chat' ? 'hidden md:flex' : 'flex'
        }`}>
          
          {/* Top Header of Sidebar */}
          <div className="bg-[#F0F2F5] dark:bg-[#202C33] px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#008069] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {getSenderName().slice(0, 1)}
              </div>
              <div>
                <h2 className="font-bold text-slate-800 dark:text-white text-sm leading-tight">
                  محادثات الزملاء
                </h2>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  واتساب العمل الداخلي
                </span>
              </div>
            </div>

            {/* Quick Sound Toggle & Close */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? 'تنبيهات صوتية: مفعّلة (انقر لكتم الصوت)' : 'تنبيهات صوتية: مكتومة (انقر للتفعيل)'}
                className={`p-2 rounded-full transition-all active:scale-95 ${
                  soundEnabled 
                    ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100' 
                    : 'text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 md:hidden"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Contacts Bar */}
          <div className="p-2.5 bg-white dark:bg-[#111B21] border-b border-slate-100 dark:border-slate-800/80">
            <div className="relative flex items-center bg-[#F0F2F5] dark:bg-[#202C33] rounded-xl px-3 py-1.5">
              <Search className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
              <input 
                type="text"
                value={contactSearchQuery}
                onChange={e => setContactSearchQuery(e.target.value)}
                placeholder="ابحث أو ابدأ محادثة جديدة..."
                className="w-full bg-transparent text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none"
              />
              {contactSearchQuery && (
                <button 
                  onClick={() => setContactSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-600 mr-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Pills (الكل، فردي، المجموعات) */}
            <div className="flex items-center gap-1.5 mt-2 px-1">
              <button
                onClick={() => setChatFilter('all')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                  chatFilter === 'all'
                    ? 'bg-[#008069] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                الكل ({contacts.length})
              </button>

              <button
                onClick={() => setChatFilter('direct')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 ${
                  chatFilter === 'direct'
                    ? 'bg-[#008069] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <User className="w-3 h-3" />
                <span>محادثات فردية</span>
              </button>

              <button
                onClick={() => setChatFilter('groups')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 ${
                  chatFilter === 'groups'
                    ? 'bg-[#008069] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Users className="w-3 h-3" />
                <span>المجموعات</span>
              </button>
            </div>
          </div>

          {/* Contacts List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredContacts.map(contact => {
              const isSelected = contact.id === selectedChatId;
              const chatRoomId = getChatId(currentUserId, contact.id);
              const contactMsgs = chatsMessages[chatRoomId] || [];
              const lastMsg = contactMsgs[contactMsgs.length - 1];
              const isTyping = typingContactId === contact.id;

              return (
                <div
                  key={contact.id}
                  onClick={() => handleSelectChat(contact.id)}
                  className={`px-3.5 py-3 flex items-center gap-3 cursor-pointer transition-colors relative ${
                    isSelected 
                      ? 'bg-[#E9EDEF] dark:bg-[#2A3942]' 
                      : 'hover:bg-[#F5F6F6] dark:hover:bg-[#202C33]/70'
                  }`}
                >
                  {/* Contact Avatar */}
                  <div className="relative shrink-0">
                    <div className={`w-12 h-12 rounded-full ${contact.avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-xs`}>
                      {contact.avatarText}
                    </div>
                    {/* Online status indicator */}
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-[#111B21] rounded-full"></span>
                  </div>

                  {/* Name & Last Message snippet */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white truncate">
                        {contact.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 dark:text-slate-400 shrink-0 mr-1" dir="ltr">
                        {lastMsg ? lastMsg.time : ''}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      {isTyping ? (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">
                          يكتب الآن... ✍️
                        </span>
                      ) : (
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                          {lastMsg?.senderId === currentUserId && <CheckCheck className="w-3.5 h-3.5 text-[#53BDEB] shrink-0 stroke-[2]" />}
                          <span className="truncate">{lastMsg ? lastMsg.text : contact.role}</span>
                        </p>
                      )}

                      {/* Unread badge */}
                      {Boolean(contact.unreadCount && contact.unreadCount > 0) && (
                        <span className="w-5 h-5 rounded-full bg-[#25D366] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mr-1">
                          {contact.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Audio Notifications Status Banner in Footer */}
          <div className="p-2.5 bg-[#F0F2F5] dark:bg-[#202C33] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${soundEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
              <span className="text-[11px] font-bold">
                {soundEnabled ? 'التنبيه الصوتي مفعل 🔔' : 'التنبيه الصوتي مكتوم 🔕'}
              </span>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
            >
              {soundEnabled ? 'تعطيل' : 'تفعيل'}
            </button>
          </div>

        </div>

        {/* ====================================================
         * RIGHT / MAIN: ACTIVE CHAT CONVERSATION
         * ==================================================== */}
        <div className={`flex-1 flex flex-col bg-[#EFEAE2] dark:bg-[#0B141A] relative ${
          mobileView === 'list' ? 'hidden md:flex' : 'flex'
        }`}>

          {/* 1. WhatsApp Top Conversation Bar */}
          <div className="bg-[#008069] dark:bg-[#202C33] text-white px-3 sm:px-4 py-2.5 flex items-center justify-between shadow-md z-20">
            
            {/* Contact Info & Back Button (on mobile) */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <button
                onClick={() => setMobileView('list')}
                title="الرجوع لقائمة الدردشات"
                className="p-1.5 -mr-1 rounded-full hover:bg-white/20 transition-all md:hidden"
              >
                <ArrowRight className="w-5 h-5 text-white" />
              </button>

              <div className="relative cursor-pointer">
                <div className={`w-10 h-10 rounded-full ${activeContact.avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-xs`}>
                  {activeContact.avatarText}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#008069] dark:border-[#202C33] rounded-full"></span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm sm:text-base truncate text-white leading-tight">
                    {activeContact.name}
                  </h3>
                  {activeContact.isGroup ? (
                    <span className="text-[10px] bg-emerald-500/30 text-emerald-100 border border-emerald-400/30 px-1.5 py-0.2 rounded-full font-bold shrink-0">
                      مجموعة
                    </span>
                  ) : (
                    <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.2 rounded-full font-medium shrink-0">
                      خاص
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-white/80 dark:text-slate-300 truncate mt-0.5">
                  {typingContactId === activeContact.id ? (
                    <span className="text-emerald-200 font-bold animate-pulse">يكتب الآن...</span>
                  ) : (
                    activeContact.onlineStatus
                  )}
                </p>
              </div>
            </div>

            {/* Conversation Action Icons */}
            <div className="flex items-center gap-1 sm:gap-2 text-white/90">
              
              {/* Audio Notification Quick Toggle in Header */}
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? 'تنبيهات صوتية مفعلة (انقر لكتم التنبيه)' : 'تنبيهات صوتية صامتة (انقر للتفعيل)'}
                className={`p-2 rounded-full transition-all active:scale-95 ${
                  soundEnabled ? 'bg-white/15 hover:bg-white/25 text-white' : 'hover:bg-white/15 text-white/60'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>

              <button 
                onClick={() => triggerCallNotice('فيديو')}
                title={`مكالمة فيديو مع ${activeContact.name}`}
                className="p-2 rounded-full hover:bg-white/15 transition-all active:scale-95"
              >
                <Video className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button 
                onClick={() => triggerCallNotice('صوتية')}
                title={`اتصال صوتي بـ ${activeContact.name}`}
                className="p-2 rounded-full hover:bg-white/15 transition-all active:scale-95"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button 
                onClick={() => setShowInChatSearch(!showInChatSearch)}
                title="بحث في هذه المحادثة"
                className={`p-2 rounded-full transition-all active:scale-95 ${showInChatSearch ? 'bg-white/20 text-white' : 'hover:bg-white/15'}`}
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Options Menu */}
              <div className="relative">
                <button 
                  onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                  title="خيارات إضافية"
                  className="p-2 rounded-full hover:bg-white/15 transition-all active:scale-95"
                >
                  <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {showOptionsMenu && (
                  <div className="absolute left-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-xs text-slate-700 dark:text-slate-200">
                    
                    <button 
                      onClick={() => { setSoundEnabled(!soundEnabled); setShowOptionsMenu(false); }}
                      className="w-full text-right px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        {soundEnabled ? <Bell className="w-4 h-4 text-emerald-600" /> : <BellOff className="w-4 h-4 text-slate-400" />}
                        <span>نغمات واستلام الرسائل</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        {soundEnabled ? 'مفعّل' : 'معطّل'}
                      </span>
                    </button>

                    <button 
                      onClick={handleExportChat}
                      className="w-full text-right px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <Download className="w-4 h-4 text-blue-500" />
                      <span>تصدير هذه المحادثة (.txt)</span>
                    </button>

                    <button 
                      onClick={handleResetAllChats}
                      className="w-full text-right px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4 text-amber-500" />
                      <span>استعادة المحادثات الافتراضية</span>
                    </button>

                    <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>

                    <button 
                      onClick={handleClearCurrentChat}
                      className="w-full text-right px-3.5 py-2 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>مسح رسائل {activeContact.name}</span>
                    </button>
                  </div>
                )}
              </div>

              <button 
                onClick={onClose}
                title="إغلاق"
                className="p-2 rounded-full hover:bg-white/20 transition-all active:scale-95 ml-1 hidden md:block"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* In-Chat Search Bar */}
          {showInChatSearch && (
            <div className="bg-[#F0F2F5] dark:bg-[#111B21] px-4 py-2 border-b border-slate-300 dark:border-slate-800 flex items-center gap-2 shadow-inner z-10">
              <Search className="w-4 h-4 text-slate-500" />
              <input 
                type="text"
                autoFocus
                value={inChatSearchQuery}
                onChange={e => setInChatSearchQuery(e.target.value)}
                placeholder={`ابحث داخل محادثة ${activeContact.name}...`}
                className="flex-1 bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none"
              />
              {inChatSearchQuery && (
                <button 
                  onClick={() => setInChatSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  مسح
                </button>
              )}
              <span className="text-[11px] text-slate-500 font-bold">
                {filteredActiveMessages.length} نتيجة
              </span>
            </div>
          )}

          {/* Call Simulation Notice */}
          {callNotice && (
            <div className="bg-emerald-600 text-white text-xs py-2 px-4 flex items-center justify-center gap-2 shadow-lg animate-bounce z-20">
              <span>{callNotice}</span>
            </div>
          )}

          {/* 2. Messages List Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 relative z-0">
            
            {/* Subtle WhatsApp Wallpaper Pattern */}
            <div 
              className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#008069 1.5px, transparent 1.5px), radial-gradient(#008069 1.5px, transparent 1.5px)`,
                backgroundSize: '28px 28px',
                backgroundPosition: '0 0, 14px 14px'
              }}
            />

            {/* Encryption notice */}
            <div className="flex justify-center my-1 relative z-10">
              <div className="bg-[#FFEECD] dark:bg-[#182229] text-[#54656F] dark:text-[#8696A0] text-[11px] px-3.5 py-1.5 rounded-lg shadow-2xs max-w-sm text-center border border-amber-200/60 dark:border-amber-900/30 flex items-center justify-center gap-1.5">
                <span>🔒</span>
                <span>
                  {activeContact.isGroup 
                    ? 'المحادثة الجماعية مشفرة ومحفوظة داخلياً في سجل النظام.'
                    : `محادثة فردية خاصة مع (${activeContact.name}) مشفرة ومحمية بالكامل.`}
                </span>
              </div>
            </div>

            {/* Date separator */}
            <div className="flex justify-center my-2 relative z-10">
              <span className="bg-white/85 dark:bg-[#182229]/90 text-[#54656F] dark:text-[#8696A0] text-[11px] font-bold px-3 py-0.5 rounded-md shadow-2xs border border-slate-200/50 dark:border-slate-800">
                اليوم
              </span>
            </div>

            {/* Messages bubbles */}
            {filteredActiveMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400 text-xs gap-2">
                <p>لا توجد رسائل سابقة مع {activeContact.name}</p>
                <p className="text-[11px] text-emerald-600 font-bold">ابدأ المحادثة الآن بكلمة طيبة ✨</p>
              </div>
            ) : (
              filteredActiveMessages.map(msg => {
                const isMe = msg.senderId === currentUserId;

                return (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col relative z-10 group ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div 
                      className={`relative max-w-[85%] sm:max-w-[75%] px-3.5 py-2 shadow-2xs text-sm select-text transition-all ${
                        isMe 
                          ? 'bg-[#D9FDD3] dark:bg-[#005C4B] text-[#111B21] dark:text-[#E9EDEF] rounded-2xl rounded-tr-none border border-emerald-200/40 dark:border-emerald-800/40' 
                          : 'bg-white dark:bg-[#202C33] text-[#111B21] dark:text-[#E9EDEF] rounded-2xl rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                      }`}
                    >
                      {/* Sender Name in group discussions */}
                      {!isMe && activeContact.isGroup && (
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`font-bold text-xs ${getSenderColor(msg.sender)}`}>
                            {msg.sender}
                          </span>
                          <span className="text-[9px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.2 rounded font-medium">
                            {msg.role}
                          </span>
                        </div>
                      )}

                      {/* Content */}
                      {msg.type === 'audio' ? (
                        <div className="flex items-center gap-2.5 py-1 min-w-[200px]">
                          <button 
                            onClick={playSendSound}
                            className="w-8 h-8 rounded-full bg-[#00A884] text-white flex items-center justify-center shadow-xs hover:opacity-90 active:scale-95"
                          >
                            <Play className="w-4 h-4 fill-white mr-0.5" />
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center gap-1 h-5">
                              {[40, 70, 30, 90, 60, 100, 45, 80, 50, 75, 30, 85].map((h, i) => (
                                <span 
                                  key={i} 
                                  className="w-1 bg-[#00A884] rounded-full" 
                                  style={{ height: `${h}%` }}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                              {msg.audioDuration || '0:15'}
                            </span>
                          </div>
                        </div>
                      ) : msg.type === 'document' ? (
                        <div className="flex items-center gap-2.5 p-2 bg-black/5 dark:bg-black/20 rounded-xl my-0.5">
                          <div className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center font-black text-xs">
                            PDF
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate">{msg.text.split(' ')[0]}</p>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">مستند رسمي • 2.4 MB</span>
                          </div>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap leading-relaxed text-[13.5px] sm:text-[14px]">
                          {msg.text}
                        </p>
                      )}

                      {/* Timestamp & Double blue ticks */}
                      <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                        <span dir="ltr">{msg.time}</span>
                        {isMe && (
                          <CheckCheck className="w-3.5 h-3.5 text-[#53BDEB] inline stroke-[2.5]" />
                        )}
                      </div>

                      {/* Reactions badge */}
                      {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                        <div className={`absolute -bottom-2.5 ${isMe ? 'left-2' : 'right-2'} flex items-center gap-1 bg-white dark:bg-[#1F2C34] px-1.5 py-0.5 rounded-full shadow-md border border-slate-200 dark:border-slate-700 text-[11px]`}>
                          {Object.entries(msg.reactions).map(([emoji, count]) => {
                            const numericCount = Number(count);
                            return (
                              <span key={emoji} className="flex items-center gap-0.5">
                                <span>{emoji}</span>
                                {numericCount > 1 && <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300">{numericCount}</span>}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Quick Reactions on hover */}
                    <div className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mt-1 text-xs px-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <button 
                        onClick={() => handleReaction(msg.id, '👍')}
                        title="إعجاب" 
                        className="p-1 hover:bg-white/80 dark:hover:bg-slate-800 rounded-full text-slate-500 hover:text-amber-500 transition-colors"
                      >
                        👍
                      </button>
                      <button 
                        onClick={() => handleReaction(msg.id, '❤️')}
                        title="حب" 
                        className="p-1 hover:bg-white/80 dark:hover:bg-slate-800 rounded-full text-slate-500 hover:text-red-500 transition-colors"
                      >
                        ❤️
                      </button>
                      <button 
                        onClick={() => handleReaction(msg.id, '👏')}
                        title="تصفيق" 
                        className="p-1 hover:bg-white/80 dark:hover:bg-slate-800 rounded-full text-slate-500 hover:text-blue-500 transition-colors"
                      >
                        👏
                      </button>
                      {isMe && (
                        <button 
                          onClick={() => handleDeleteMessage(msg.id)}
                          title="حذف الرسالة" 
                          className="p-1 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-full text-slate-400 hover:text-red-500 transition-colors ml-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                  </div>
                );
              })
            )}

            {/* Live Typing indicator bubble if colleague is typing */}
            {typingContactId === activeContact.id && (
              <div className="flex flex-col items-start relative z-10 animate-fade-in">
                <div className="bg-white dark:bg-[#202C33] text-slate-600 dark:text-slate-300 px-4 py-2 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {activeContact.name} يكتب الآن
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Emoji Picker Popup */}
          {showEmojiPicker && (
            <div className="bg-white dark:bg-[#202C33] border-t border-slate-200 dark:border-slate-700 p-3 shadow-lg z-20 animate-fade-in">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-700/60 mb-2">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">الرموز التعبيرية السريعة</span>
                <button 
                  onClick={() => setShowEmojiPicker(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>
              <div className="flex flex-wrap gap-2 text-xl max-h-24 overflow-y-auto">
                {EMOJI_LIST.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setInputText(prev => prev + emoji);
                      inputRef.current?.focus();
                    }}
                    className="hover:scale-125 transition-transform p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Attachments Menu Popup */}
          {showAttachMenu && (
            <div className="absolute bottom-16 right-4 sm:right-12 bg-white dark:bg-[#233138] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-3 z-30 flex flex-col gap-2.5 animate-fade-in text-xs font-bold text-slate-700 dark:text-slate-200">
              <button 
                onClick={() => handleAttachItem('doc')}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-right transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <span>إرفاق مستند أو تقرير (PDF)</span>
              </button>

              <button 
                onClick={() => handleAttachItem('img')}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-right transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <span>إرفاق صورة أو مخطط شبكة</span>
              </button>

              <button 
                onClick={() => handleAttachItem('task')}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-right transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <span>مشاركة مهمة عمل من السجل</span>
              </button>
            </div>
          )}

          {/* 3. Bottom WhatsApp Input Bar */}
          <form 
            onSubmit={handleSend}
            className="bg-[#F0F2F5] dark:bg-[#202C33] px-2.5 sm:px-3 py-2.5 flex items-center gap-2 border-t border-slate-200 dark:border-slate-800 z-10"
          >
            {/* Emoji Button */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              title="الرموز التعبيرية"
              className={`p-2 rounded-full transition-colors ${showEmojiPicker ? 'text-[#008069] bg-white dark:bg-slate-700' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}
            >
              <Smile className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Attachment Button */}
            <button
              type="button"
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              title="إرفاق ملف"
              className={`p-2 rounded-full transition-colors ${showAttachMenu ? 'text-[#008069] bg-white dark:bg-slate-700' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}
            >
              <Paperclip className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            </button>

            {/* Input / Voice Indicator */}
            {isRecordingVoice ? (
              <div className="flex-1 bg-red-500/15 border border-red-400/40 rounded-full px-4 py-2 flex items-center justify-between text-red-600 dark:text-red-400 text-xs font-bold animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                  <span>جاري تسجيل رسالة صوتية إلى {activeContact.name}...</span>
                </div>
                <span className="font-mono">0:{String(voiceSeconds).padStart(2, '0')}</span>
              </div>
            ) : (
              <input 
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder={`أرسل رسالة إلى ${activeContact.name}...`}
                className="flex-1 bg-white dark:bg-[#2A3942] rounded-full px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none shadow-2xs border border-transparent focus:border-emerald-500/50"
              />
            )}

            {/* Circular Send or Mic Button */}
            {inputText.trim().length > 0 ? (
              <button
                type="submit"
                title="إرسال"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#00A884] hover:bg-[#008f6f] text-white flex items-center justify-center shadow-md active:scale-95 transition-all shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5 rotate-180" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleToggleVoiceNote}
                title={isRecordingVoice ? 'إيقاف وإرسال التسجيل' : 'تسجيل رسالة صوتية'}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-all shrink-0 cursor-pointer ${
                  isRecordingVoice 
                    ? 'bg-red-600 hover:bg-red-700 text-white animate-bounce' 
                    : 'bg-[#00A884] hover:bg-[#008f6f] text-white'
                }`}
              >
                <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}

          </form>

        </div>

      </div>
    </div>
  );
};

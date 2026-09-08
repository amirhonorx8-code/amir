import React from 'react';
import { VideoAttachment } from '../utils/videoRecorder';
import { Video, Check, X } from 'lucide-react';

interface VideoPreviewModalProps {
  isOpen: boolean;
  videoBlob: Blob | null;
  onClose: () => void;
  onAttach: (attachment: VideoAttachment) => void;
}

export const VideoPreviewModal: React.FC<VideoPreviewModalProps> = ({
  isOpen,
  videoBlob,
  onClose,
  onAttach
}) => {
  if (!isOpen || !videoBlob) return null;

  const videoUrl = URL.createObjectURL(videoBlob);

  const handleAttach = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `screen-recording-${timestamp}.webm`;

    onAttach({
      filename,
      mime_type: 'video/webm',
      blob: videoBlob,
      size: videoBlob.size
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[100003] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-purple-400" />
            <span className="text-base font-bold text-slate-200">معاينة تسجيل الشاشة (Screen Recording Preview)</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="bg-black p-4 flex items-center justify-center">
          <video
            src={videoUrl}
            controls
            autoPlay
            className="max-h-[50vh] w-full rounded-lg border border-slate-800 shadow-md"
          />
        </div>

        {/* Info & Actions */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800 bg-slate-950">
          <div className="text-xs text-slate-400">
            حجم الفيديو: <span className="font-mono text-purple-300 font-bold">{(videoBlob.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              onClick={handleAttach}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-lg flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Check className="w-4 h-4" />
              إرفاق بالملاحظة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Video Screen Recorder for Feedback & Audit.
 * Captures screen and optional microphone audio using the MediaRecorder API.
 */

export interface VideoAttachment {
  filename: string;
  mime_type: string;
  blob: Blob;
  size: number;
}

export class VideoRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private displayStream: MediaStream | null = null;
  private micStream: MediaStream | null = null;
  private startTime: number = 0;
  private timerInterval: any = null;
  private onStopCallback: ((blob: Blob | null) => void) | null = null;
  public isRecording: boolean = false;

  async startRecording(
    onTimerUpdate?: (timeStr: string) => void,
    onStop?: (blob: Blob | null) => void
  ): Promise<boolean> {
    try {
      const displayConstraints: DisplayMediaStreamOptions = {
        video: {
          width: { ideal: 1280, max: 1280 },
          height: { ideal: 720, max: 720 },
          frameRate: { ideal: 15 }
        },
        audio: false
      };

      const displayStream = await navigator.mediaDevices.getDisplayMedia(displayConstraints);

      let micStream: MediaStream | null = null;
      try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      } catch (err: any) {
        console.warn('[VideoRecorder] Microphone access denied/unavailable:', err?.message);
      }

      const tracks = [...displayStream.getVideoTracks()];
      if (micStream) {
        tracks.push(...micStream.getAudioTracks());
      }

      this.stream = new MediaStream(tracks);
      this.displayStream = displayStream;
      this.micStream = micStream;
      this.onStopCallback = onStop || null;

      // Select supported mimeType
      let mimeType = 'video/webm; codecs=vp9';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType,
        videoBitsPerSecond: 1000000
      });
      this.recordedChunks = [];

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          this.recordedChunks.push(e.data);
        }
      };

      this.startTime = Date.now();
      this.timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
        const secs = String(elapsed % 60).padStart(2, '0');
        if (onTimerUpdate) {
          onTimerUpdate(`${mins}:${secs}`);
        }
      }, 1000);

      this.mediaRecorder.start();
      this.isRecording = true;

      // Handle user ending screen sharing from browser bar
      this.displayStream.getVideoTracks().forEach((track) => {
        track.onended = () => {
          this.stopRecording();
        };
      });

      return true;
    } catch (err) {
      console.error('[VideoRecorder] Failed to start recording:', err);
      this.isRecording = false;
      return false;
    }
  }

  stopRecording(): Promise<Blob | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        this.isRecording = false;
        resolve(null);
        return;
      }

      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });

        this.stream?.getTracks().forEach((t) => t.stop());
        this.displayStream?.getTracks().forEach((t) => t.stop());
        this.micStream?.getTracks().forEach((t) => t.stop());

        this.isRecording = false;
        this.recordedChunks = [];
        this.displayStream = null;
        this.micStream = null;

        if (this.onStopCallback) {
          this.onStopCallback(blob);
        }

        resolve(blob);
      };

      this.mediaRecorder.stop();
    });
  }
}

export const videoRecorder = new VideoRecorder();

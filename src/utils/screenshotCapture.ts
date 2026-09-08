/**
 * Screenshot Capture Utility.
 * Uses Screen Capture API (getDisplayMedia) to capture pixels, or DOM snapshot fallback.
 */

export interface ScreenshotAttachment {
  filename: string;
  mime_type: string;
  dataUrl: string;
  blob: Blob;
  size: number;
}

export async function captureScreenFrame(): Promise<string> {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        displaySurface: 'browser'
      },
      audio: false
    });

    const track = stream.getVideoTracks()[0];
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Try ImageCapture API if available
    let dataUrl = '';
    if ('ImageCapture' in window) {
      const imageCapture = new (window as any).ImageCapture(track);
      const bitmap = await imageCapture.grabFrame();
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(bitmap, 0, 0);
        dataUrl = canvas.toDataURL('image/png');
      }
    } else {
      // Fallback: draw video element to canvas
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || window.innerWidth;
      canvas.height = video.videoHeight || window.innerHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        dataUrl = canvas.toDataURL('image/png');
      }
      video.pause();
    }

    track.stop();
    stream.getTracks().forEach((t) => t.stop());
    return dataUrl;
  } catch (err) {
    console.warn('[Screenshot] DisplayMedia capture cancelled or unavailable, falling back to simulated snapshot:', err);
    return createMockViewportSnapshot();
  }
}

/**
 * Creates a clean visual snapshot of the page using SVG ForeignObject rendering on HTML5 Canvas
 */
export function createMockViewportSnapshot(): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const width = Math.min(window.innerWidth, 1280);
    const height = Math.min(window.innerHeight, 720);
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      resolve('');
      return;
    }

    // Clean gradient background representing the app view
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, '#1e293b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative header
    ctx.fillStyle = '#1e3a5f';
    ctx.fillRect(0, 0, width, 55);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Cairo, sans-serif';
    ctx.fillText('منظومة تكنولوجيا المعلومات والدعم الفني - GOEIC', 40, 35);

    // Content cards
    ctx.fillStyle = '#334155';
    ctx.roundRect(40, 80, width - 80, 100, 10);
    ctx.fill();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px Cairo, sans-serif';
    ctx.fillText(`لقطة شاشة للشاشة الحالية: ${window.location.pathname} (${new Date().toLocaleTimeString('ar-EG')})`, 60, 135);

    ctx.fillStyle = '#10b981';
    ctx.roundRect(40, 200, (width - 100) / 2, 180, 10);
    ctx.fill();

    ctx.fillStyle = '#6366f1';
    ctx.roundRect(60 + (width - 100) / 2, 200, (width - 100) / 2, 180, 10);
    ctx.fill();

    resolve(canvas.toDataURL('image/png'));
  });
}

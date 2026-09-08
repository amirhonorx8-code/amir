/**
 * Console log capture for debugging and LlamaBot / Leonardo integration.
 * Captures console.log, console.warn, console.error and uncaught exceptions.
 * Persists recent logs to sessionStorage across navigations.
 */

export interface CapturedLog {
  type: 'log' | 'warn' | 'error';
  args: string[];
  timestamp: number;
}

declare global {
  interface Window {
    _consoleLogs?: CapturedLog[];
    page_loaded_at?: string;
    request_path?: string;
    view_path?: string;
    full_html?: string;
    LLAMABOT_ALLOWED_ORIGINS?: string[];
  }
}

// Initialize logs from sessionStorage
try {
  const stored = JSON.parse(sessionStorage.getItem('_consoleLogs') || '[]');
  const hasOldFormat = stored.some((l: any) => l.args && l.args.some((a: any) => a === '[object Object]'));
  window._consoleLogs = hasOldFormat ? [] : stored;
  if (hasOldFormat) sessionStorage.removeItem('_consoleLogs');
} catch {
  window._consoleLogs = [];
}

const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

function saveConsoleLogs() {
  try {
    sessionStorage.setItem('_consoleLogs', JSON.stringify((window._consoleLogs || []).slice(-100)));
  } catch {
    // silent
  }
}

function formatArg(a: unknown): string {
  if (a === null) return 'null';
  if (a === undefined) return 'undefined';
  if (typeof a === 'string') return a;
  try {
    return JSON.stringify(a);
  } catch {
    return String(a);
  }
}

function shouldSkipLog(args: unknown[]): boolean {
  const first = args[0];
  if (typeof first === 'string' && first.startsWith('Page context updated')) return true;
  return false;
}

export function initConsoleCapture() {
  window.page_loaded_at = new Date().toISOString();
  window.request_path = window.location.pathname;
  window.view_path = 'app/views/public/welcome.html.erb';

  console.log = function (...args: unknown[]) {
    if (!shouldSkipLog(args)) {
      if (!window._consoleLogs) window._consoleLogs = [];
      window._consoleLogs.push({ type: 'log', args: args.map(formatArg), timestamp: Date.now() });
      if (window._consoleLogs.length > 100) window._consoleLogs.shift();
      saveConsoleLogs();
    }
    originalConsoleLog.apply(console, args);
  };

  console.error = function (...args: unknown[]) {
    if (!window._consoleLogs) window._consoleLogs = [];
    window._consoleLogs.push({ type: 'error', args: args.map(formatArg), timestamp: Date.now() });
    if (window._consoleLogs.length > 100) window._consoleLogs.shift();
    saveConsoleLogs();
    originalConsoleError.apply(console, args);
  };

  console.warn = function (...args: unknown[]) {
    if (!window._consoleLogs) window._consoleLogs = [];
    window._consoleLogs.push({ type: 'warn', args: args.map(formatArg), timestamp: Date.now() });
    if (window._consoleLogs.length > 100) window._consoleLogs.shift();
    saveConsoleLogs();
    originalConsoleWarn.apply(console, args);
  };

  window.addEventListener('error', (event) => {
    if (!window._consoleLogs) window._consoleLogs = [];
    window._consoleLogs.push({
      type: 'error',
      args: [`Uncaught: ${event.message} at ${event.filename}:${event.lineno}`],
      timestamp: Date.now()
    });
    if (window._consoleLogs.length > 100) window._consoleLogs.shift();
    saveConsoleLogs();
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason?.message || event.reason || 'Unknown rejection';
    if (!window._consoleLogs) window._consoleLogs = [];
    window._consoleLogs.push({
      type: 'error',
      args: [`Unhandled Promise: ${reason}`],
      timestamp: Date.now()
    });
    if (window._consoleLogs.length > 100) window._consoleLogs.shift();
    saveConsoleLogs();
  });
}

export function getConsoleLogs(): CapturedLog[] {
  return window._consoleLogs || [];
}

export function clearConsoleLogs(): void {
  window._consoleLogs = [];
  try {
    sessionStorage.removeItem('_consoleLogs');
  } catch {
    // silent
  }
}

/**
 * Message handler for iframe communication with LlamaBot / Leonardo parent window.
 * Handles postMessage events from the Leonardo IDE.
 */

import { enableElementSelector, disableElementSelector } from './elementSelector';
import { getConsoleLogs, clearConsoleLogs } from './consoleCapture';

export function isExecuteJsOriginAllowed(origin: string, allowedOrigins?: string[]): boolean {
  // If explicitly configured, check list
  if (Array.isArray(allowedOrigins) && allowedOrigins.length > 0) {
    return allowedOrigins.includes(origin);
  }
  // Safe default origins: Google AI Studio domains, Cloud Run dev/pre URLs, and localhost
  if (!origin) return false;

  try {
    const url = new URL(origin);
    const hostname = url.hostname;

    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === 'ai.studio' ||
      hostname.endsWith('.ai.studio') ||
      hostname === 'aistudio.google.com' ||
      hostname.endsWith('.run.app') ||
      hostname === 'google.com' ||
      hostname.endsWith('.google.com')
    ) {
      return true;
    }
  } catch (e) {
    return false;
  }

  return false;
}

export function initIframeMessageHandler() {
  if (typeof window === 'undefined') return;

  // Initialize LlamaBot origins
  window.LLAMABOT_ALLOWED_ORIGINS = window.LLAMABOT_ALLOWED_ORIGINS || [
    window.location.origin,
    'https://ai.studio',
    'https://aistudio.google.com'
  ];

  window.addEventListener('message', (event: MessageEvent) => {
    if (!event.data || typeof event.data !== 'object') return;
    if (event.data.source !== 'leonardo' && event.data.source !== 'llamabot') return;

    const sourceWindow = event.source as WindowProxy | null;

    // 1. Enable Element Selector
    if (event.data.type === 'enable-element-selector') {
      enableElementSelector();
      return;
    }

    // 2. Disable Element Selector
    if (event.data.type === 'disable-element-selector') {
      disableElementSelector();
      return;
    }

    // 3. Clear Console Logs
    if (event.data.type === 'clear-console-logs') {
      clearConsoleLogs();
      return;
    }

    // 4. Execute JavaScript
    if (event.data.type === 'execute-js') {
      const { id, code } = event.data;

      if (!isExecuteJsOriginAllowed(event.origin, window.LLAMABOT_ALLOWED_ORIGINS)) {
        if (sourceWindow) {
          sourceWindow.postMessage(
            {
              source: 'llamapress',
              type: 'js-execution-result',
              id,
              ok: false,
              result: null,
              error: `execute-js rejected: origin ${event.origin} is not in the LlamaBot allowlist`
            },
            event.origin as any
          );
        }
        return;
      }

      (async () => {
        let ok = true;
        let serialized: string | null = null;
        let error: string | null = null;
        try {
          const value = await Promise.resolve(window.eval(code));
          try {
            serialized = value === undefined ? 'undefined' : JSON.stringify(value);
          } catch {
            serialized = String(value);
          }
          if (serialized && serialized.length > 10000) {
            serialized = serialized.slice(0, 10000) + '...[truncated]';
          }
        } catch (e: any) {
          ok = false;
          error = e && (e.stack || e.message) ? String(e.stack || e.message) : String(e);
        }

        if (sourceWindow) {
          sourceWindow.postMessage(
            {
              source: 'llamapress',
              type: 'js-execution-result',
              id,
              ok,
              result: serialized,
              error
            },
            event.origin as any
          );
        }
      })();
      return;
    }

    // 5. Get Console Logs
    if (event.data.type === 'get-console-logs') {
      const logs = getConsoleLogs();
      if (sourceWindow) {
        sourceWindow.postMessage(
          {
            source: 'llamapress',
            type: 'console-logs',
            logs
          },
          event.origin as any
        );
      }
      clearConsoleLogs();
      return;
    }

    // 6. Provide outer HTML and current page status
    window.full_html = document.documentElement.outerHTML;
    const currentPath = window.location.pathname;
    const viewPathToSend = window.view_path || 'app/views/public/welcome.html.erb';

    if (sourceWindow) {
      sourceWindow.postMessage(
        {
          source: 'llamapress',
          full_html: window.full_html,
          request_path: currentPath,
          view_path: viewPathToSend,
          page_loaded_at: window.page_loaded_at || new Date().toISOString()
        },
        event.origin as any
      );
    }
  });

  // Track popstate & hash change navigation
  window.addEventListener('popstate', () => {
    if (window.parent !== window) {
      window.parent.postMessage(
        {
          source: 'llamapress-navigation',
          type: 'page-loaded',
          path: window.location.pathname
        },
        '*'
      );
    }
  });
}

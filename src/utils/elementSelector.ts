/**
 * Element Selector functionality
 * Allows users to visually select elements on the page for feedback and AI reference.
 */

export interface ElementSelectorResult {
  text: string;
  html: string;
  selector: string;
  url?: string;
}

export interface EnableElementSelectorOptions {
  onSelect?: (detail: ElementSelectorResult) => void;
  onCancel?: () => void;
}

let elementSelectorEnabled = false;
let elementSelectorStyles: HTMLStyleElement | null = null;
let currentHighlightedElement: HTMLElement | null = null;
let onSelectCallback: ((detail: ElementSelectorResult) => void) | null = null;
let onCancelCallback: (() => void) | null = null;

export function enableElementSelector(options: EnableElementSelectorOptions = {}) {
  if (elementSelectorEnabled) return;

  onSelectCallback = options.onSelect || null;
  onCancelCallback = options.onCancel || null;

  elementSelectorEnabled = true;

  // Inject styles for hover highlighting
  elementSelectorStyles = document.createElement('style');
  elementSelectorStyles.id = 'element-selector-styles';
  elementSelectorStyles.textContent = `
    .element-selector-highlight {
      outline: 2.5px solid #10b981 !important;
      outline-offset: 2px !important;
      background-color: rgba(16, 185, 129, 0.15) !important;
      cursor: crosshair !important;
      transition: outline 0.1s ease;
    }
    .element-selector-active,
    .element-selector-active * {
      cursor: crosshair !important;
      user-select: none !important;
    }
    #element-selector-banner {
      position: fixed;
      top: 18px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(15, 23, 42, 0.95);
      color: #f8fafc;
      padding: 10px 20px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      z-index: 100005;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.15);
      direction: rtl;
    }
    #element-selector-banner button {
      background: rgba(239, 68, 68, 0.85);
      color: white;
      border: none;
      padding: 4px 12px;
      border-radius: 9999px;
      cursor: pointer;
      font-size: 12px;
      font-weight: bold;
      transition: background 0.2s;
    }
    #element-selector-banner button:hover {
      background: rgba(220, 38, 38, 1);
    }
  `;
  document.head.appendChild(elementSelectorStyles);

  // Add notification banner
  const banner = document.createElement('div');
  banner.id = 'element-selector-banner';
  banner.innerHTML = `
    <span>🎯 حرّك المؤشر وانقر لتحديد أي عنصر في الصفحة</span>
    <button id="cancel-selector-btn">إلغاء (Esc)</button>
  `;
  document.body.appendChild(banner);
  document.getElementById('cancel-selector-btn')?.addEventListener('click', () => {
    const cancel = onCancelCallback;
    disableElementSelector();
    if (cancel) cancel();
  });

  document.body.classList.add('element-selector-active');

  // Add listeners
  document.addEventListener('mousemove', handleMouseMove, true);
  document.addEventListener('click', handleClick, true);
  document.addEventListener('keydown', handleKeydown, true);
}

export function disableElementSelector() {
  if (!elementSelectorEnabled) return;

  elementSelectorEnabled = false;
  onSelectCallback = null;
  onCancelCallback = null;

  if (elementSelectorStyles) {
    elementSelectorStyles.remove();
    elementSelectorStyles = null;
  }

  const banner = document.getElementById('element-selector-banner');
  if (banner) banner.remove();

  document.body.classList.remove('element-selector-active');

  if (currentHighlightedElement) {
    currentHighlightedElement.classList.remove('element-selector-highlight');
    currentHighlightedElement = null;
  }

  document.removeEventListener('mousemove', handleMouseMove, true);
  document.removeEventListener('click', handleClick, true);
  document.removeEventListener('keydown', handleKeydown, true);
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape') return;
  event.preventDefault();
  event.stopPropagation();
  const onCancel = onCancelCallback;
  disableElementSelector();
  if (onCancel) onCancel();
}

function handleMouseMove(event: MouseEvent) {
  const target = event.target as HTMLElement | null;
  if (!target || target.tagName === 'HTML' || target.tagName === 'BODY') return;
  if (target.closest('#llamapress-feedback-bubble') || target.closest('#element-selector-banner')) return;

  if (currentHighlightedElement && currentHighlightedElement !== target) {
    currentHighlightedElement.classList.remove('element-selector-highlight');
  }

  target.classList.add('element-selector-highlight');
  currentHighlightedElement = target;
}

function handleClick(event: MouseEvent) {
  const target = event.target as HTMLElement | null;
  if (!target || target.tagName === 'HTML' || target.tagName === 'BODY') return;
  if (target.closest('#llamapress-feedback-bubble') || target.closest('#element-selector-banner')) return;

  event.preventDefault();
  event.stopPropagation();

  const textContent = extractElementText(target);
  const outerHTML = target.outerHTML;
  const selector = buildCssSelector(target);

  showSelectionFeedback(target);

  const cb = onSelectCallback;
  disableElementSelector();

  const detail: ElementSelectorResult = {
    text: textContent,
    html: outerHTML,
    selector,
    url: window.location.pathname
  };

  if (cb) {
    cb(detail);
  } else if (window.parent && window.parent !== window) {
    window.parent.postMessage({
      source: 'element-selector',
      type: 'element-selected',
      text: textContent,
      html: outerHTML,
      selector
    }, '*');
  }
}

export function buildCssSelector(element: HTMLElement): string {
  if (!element || !element.tagName) return '';
  const parts: string[] = [];
  let el: HTMLElement | null = element;

  while (el && el.nodeType === 1 && el.tagName !== 'BODY' && el.tagName !== 'HTML') {
    let part = el.tagName.toLowerCase();

    if (el.id) {
      parts.unshift(`#${CSS.escape(el.id)}`);
      break;
    }

    const className = el.className && typeof el.className === 'string'
      ? el.className.trim().split(/\s+/).filter(Boolean)[0]
      : null;
    if (className && !className.includes('element-selector')) {
      part += `.${CSS.escape(className)}`;
    }

    const parent = el.parentElement;
    if (parent) {
      const sameTag = Array.from(parent.children).filter(c => c.tagName === el!.tagName);
      if (sameTag.length > 1) {
        part += `:nth-of-type(${sameTag.indexOf(el) + 1})`;
      }
    }

    parts.unshift(part);
    el = el.parentElement;
  }

  return parts.join(' > ');
}

export function extractElementText(element: HTMLElement): string {
  let text = element.textContent || (element as any).innerText || '';
  text = text.trim();
  if (text.length > 200) {
    text = text.substring(0, 200) + '...';
  }
  if (!text) {
    const tagName = element.tagName.toLowerCase();
    const className = element.className ? `.${String(element.className).split(' ')[0]}` : '';
    const id = element.id ? `#${element.id}` : '';
    text = `<${tagName}${id}${className}> عنصر`;
  }
  return text;
}

function showSelectionFeedback(element: HTMLElement) {
  const originalOutline = element.style.outline;
  const originalBackground = element.style.backgroundColor;

  element.style.outline = '3px solid #10b981';
  element.style.backgroundColor = 'rgba(16, 185, 129, 0.35)';

  setTimeout(() => {
    element.style.outline = originalOutline;
    element.style.backgroundColor = originalBackground;
  }, 300);
}

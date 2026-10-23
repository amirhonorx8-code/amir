## 2025-03-09 - Fix origin validation vulnerability in postMessage handler
**Vulnerability:** The `postMessage` origin validation in `src/utils/iframeMessageHandler.ts` used a loose `.includes()` string check (`origin.includes('google')`, `origin.includes('localhost')`).
**Learning:** This loose checking exposes the application to Cross-Site Scripting (XSS) / remote code execution because an attacker domain like `https://attacker-localhost.com` or `https://malicious.com?google=1` could bypass the check.
**Prevention:** Origin validation in this handler must always use strict URL hostname matching, not loose string checks like `.includes()`. Parse the origin with `new URL()` and perform strict matching on `hostname`.

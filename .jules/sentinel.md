## 2026-03-09 - [Origin Validation Bypass in iframeMessageHandler]
**Vulnerability:** Loose string matching (`.includes()` instead of precise `URL` hostname checking) in `isExecuteJsOriginAllowed` allowed an attacker on domains like `malicious-google.com` or `localhost.hacks.com` to pass origin checks and execute arbitrary JavaScript using `window.eval`.
**Learning:** Checking origins with simple `.includes()` checks is inherently unsafe for Cross-Origin communication like `window.postMessage`. Any domain containing the substring can bypass the check.
**Prevention:** Always parse the origin string using `new URL(origin)` and strictly validate the `hostname` using exact match or suffix match with dot separators (e.g. `hostname.endsWith('.google.com')`).

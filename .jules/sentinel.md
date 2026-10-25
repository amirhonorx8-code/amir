## 2024-05-24 - [CRITICAL] Insecure Origin Validation in Message Handler
**Vulnerability:** `isExecuteJsOriginAllowed` used loose `.includes()` string matching for origin validation (e.g. `origin.includes('run.app')`), allowing bypasses like `https://evil-run.app.com` to execute arbitrary JS via the `execute-js` postMessage handler.
**Learning:** `postMessage` handlers that evaluate JavaScript must strictly validate the sender origin. String matching like `.includes()` is dangerous because it doesn't enforce URL boundaries.
**Prevention:** Always use `URL` parsing to extract the `hostname` and perform strict exact matching or proper subdomain matching (e.g., `hostname === 'example.com' || hostname.endsWith('.example.com')`).

## 2023-10-26 - [Insecure Origin Validation in iframeMessageHandler]
**Vulnerability:** The `isExecuteJsOriginAllowed` function used loose string matching (`.includes()`) for origin validation, allowing attackers to bypass checks using domains like `https://attacker-google.com`.
**Learning:** Substring matching is fundamentally insecure for origin validation in postMessage handlers because it doesn't verify the actual domain hierarchy.
**Prevention:** Always use strict `URL` parsing (`new URL(origin)`) and check the `hostname` property against exact matches or safe suffix matches (`.endsWith('.allowed-domain.com')`).

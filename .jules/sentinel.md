## 2024-05-18 - Strict postMessage Origin Validation
**Vulnerability:** Insecure origin validation in iframe message handler using loose `.includes()` string matching. This allowed bypassing the check by using malicious subdomains or parameters (e.g., `https://ai.studio.attacker.com`).
**Learning:** `postMessage` origin validation must always use strict URL hostname matching, not loose string checks, especially when the handler evaluates JavaScript (e.g., `window.eval`).
**Prevention:** Parse the origin using `new URL(origin)` and validate `url.hostname` with exact matching or `.endsWith()` for subdomains to ensure the origin is truly trusted.

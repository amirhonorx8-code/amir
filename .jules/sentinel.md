## 2026-10-15 - Hardcoded Mock API Tokens

**Vulnerability:** Found multiple hardcoded 64-character hexadecimal `apiToken` fields for users in the `src/types.ts` file.

**Learning:** It appears mock user profiles were constructed with hardcoded realistic-looking API tokens, perhaps during initial development, which poses a critical secret-leaking risk if real credentials are accidentally pasted there, and even mock secrets trigger security scans and present bad practices.

**Prevention:** Remove `apiToken` or any explicit secrets from mock user profile arrays completely. Do not define security token schemas on frontend interface definitions when dealing with a pure frontend mock application.

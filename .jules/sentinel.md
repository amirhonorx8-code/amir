## 2025-02-26 - Plaintext Credential Exposure in React Component

**Vulnerability:** A "Credentials Directory" UI tab in `LoginAuthModal.tsx` intentionally displayed hardcoded user passwords and usernames in plaintext for all users (including unauthenticated viewers) to see. Passwords were stored in `AUTHORIZED_CREDENTIALS` within `auth.ts`.
**Learning:** Development aids or mock credentials used during prototyping were left in the production UI flow. The developers attempted to restrict access by requiring login, but ironically provided the credentials to perform that login directly in the UI.
**Prevention:** Never include plaintext passwords or bypass mechanisms in client-side code. Use proper authentication backends or environment variables for test credentials, and ensure UI components that leak credentials are removed before deployment.

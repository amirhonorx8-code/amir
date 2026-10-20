## 2024-10-20 - [Hardcoded Credentials Display]
 **Vulnerability:** Plain-text default passwords were hardcoded in `src/utils/auth.ts` and explicitly exposed to the user in the UI via `src/components/LoginAuthModal.tsx`.
 **Learning:** In client-side mock auth systems, it is tempting to expose demo credentials, but this compromises the actual security of those accounts if they are used legitimately. Hardcoded credential bypassing logic was also present in `validateLogin`.
 **Prevention:** Use environment variables (e.g. `import.meta.env.VITE_PWD_SUFFIX`) to construct dynamic default passwords that are not stored directly in the repository source code. Do not pass sensitive credential strings into UI components for rendering.

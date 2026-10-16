## 2026-08-25 - Authentication Bypass Backdoor
**Vulnerability:** A backdoor existed in the authentication logic (`src/utils/auth.ts`) allowing any user account to be accessed using their ID + "@2026" or ID + "2026" as the password, regardless of the user's custom password.
**Learning:** This hardcoded backdoor bypassed the normal password validation process, meaning even if a user changed their password, an attacker who knew their user ID and this default pattern could still log in as them.
**Prevention:** Never include hardcoded fallback passwords or backdoors in authentication logic. If default passwords are required initially, they must be disabled or overwritten once the user sets a custom password.

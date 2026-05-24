# ADR 002: Authentication Strategy

## Status
Superseded by this revision (2026-05-24)

**Change Summary**: Removed OAuth2 social login. Simplified to password-only authentication with single event password for guest registration and dedicated admin account.

## Context
The Wedding Media Platform is a **single-event application** for one wedding, requiring:
- Simple guest registration via shared event password
- No social login (OAuth blocked in China, adds complexity)
- Admin account with elevated privileges for moderation
- Support for ~150 concurrent users
- Deployment on AliCloud (mainland China)
- Session management for persistent login

## Decision

### Password-Based Authentication Only
**No OAuth/Social Login** — Simplified for single-event use case and China deployment.

### Two-Tier Access Model

#### 1. Guest Registration (Event Password)
**Flow:**
- Single **event password** shared with all wedding guests
- Guests enter event password + choose username + set personal password
- Event password validates eligibility to register
- Personal password used for subsequent logins
- Event password can be changed by admin if leaked

**Rationale:**
- Simple for guests (one shared password to get started)
- No need for invitation system or email verification
- Admin controls who can register via event password

#### 2. Admin Account
**Characteristics:**
- Pre-created admin account with strong credentials
- Elevated permissions: delete media, manage users, configure settings
- Separate login flow (not using event password)
- Only 1-2 admin accounts needed

### Session Management (JWT + Refresh Tokens)
**Implementation:**
- Access tokens: Short-lived (15 minutes), stored in memory
- Refresh tokens: Long-lived (7 days), stored in httpOnly cookies
- Token rotation on refresh
- Blacklist for revoked tokens (stored in Redis)
- Persistent login across devices

## Rationale

### Why No OAuth/Social Login?
1. **China deployment**: Google, Facebook blocked in mainland China
2. **Simplicity**: Single-event app doesn't need complex OAuth flows
3. **Privacy**: Guests may prefer not linking social accounts to wedding photos
4. **Dependencies**: Reduces external service dependencies
5. **Development speed**: Faster to implement and test

### Why Event Password Model?
1. **Ease of sharing**: One password shared via WeChat/WhatsApp
2. **No email required**: Guests don't need email verification
3. **Access control**: Admin can change password if leaked
4. **Low friction**: Guests register once, then use personal password

### Why JWT + Refresh Tokens?
- Stateless authentication scales to 150 concurrent users
- Short-lived access tokens minimize damage if compromised
- Refresh tokens in httpOnly cookies prevent XSS attacks
- Works well with mobile browsers (iOS Safari, Android Chrome)
- Industry standard, well-tested approach

## Alternatives Considered

### OAuth2 Social Login (Google, Facebook)
**Rejected because:**
- Google and Facebook blocked in mainland China
- Adds complexity for single-event use case
- Requires API keys and OAuth setup
- Privacy concerns for wedding guests
- Not needed for 150-user event

### Email-Based Magic Links
**Rejected because:**
- Requires email for every login (poor UX)
- Email delivery delays in China
- Guests may not check email regularly
- Adds SMTP dependency

### Session-Based Authentication (No JWT)
**Rejected because:**
- Requires server-side session storage (more Redis memory)
- Harder to scale horizontally
- JWT is stateless and proven at this scale

### Individual Invitation Codes (One Per Guest)
**Rejected because:**
- Complex to generate and distribute 150 codes
- Guests may lose their unique code
- Single event password is simpler

## Security Considerations

### Token Storage
- Access tokens: Memory only (never localStorage)
- Refresh tokens: httpOnly, secure, sameSite cookies
- CSRF protection for cookie-based tokens

### Password Security
- Bcrypt hashing with cost factor 12
- Minimum password requirements (8 chars, mixed case, numbers)
- Password reset via email with time-limited tokens
- Rate limiting on login attempts

### Event Password Security
- Minimum 8 characters, alphanumeric + special chars
- Shared securely via WeChat/WhatsApp (not public)
- Rate limiting on registration attempts (prevent brute force)
- Admin can change event password if leaked
- Event password only used for registration, not login

## Implementation Details

### Token Payload
```json
{
  "sub": "user_id",
  "username": "guest_username",
  "role": "guest|admin",
  "language": "en|zh|ru",
  "exp": 1234567890,
  "iat": 1234567890
}
```

**Note**: Single event, so no `event_ids` array needed. Email optional (not required for registration).

### API Endpoints
- `POST /auth/register` - Register with event password + username + personal password
- `POST /auth/login` - Login with username + personal password
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Invalidate refresh token
- `POST /auth/admin/login` - Admin login (separate endpoint)
- `PATCH /auth/admin/event-password` - Admin changes event password

### Database Schema
```python
class User:
    id: UUID
    username: str (unique)
    email: str (optional)
    password_hash: str
    role: enum('guest', 'admin')
    language_preference: enum('en', 'zh', 'ru')
    created_at: datetime
    is_active: bool

class RefreshToken:
    id: UUID
    user_id: UUID (FK)
    token_hash: str
    expires_at: datetime
    created_at: datetime

class EventConfig:
    id: int (singleton, only 1 row)
    event_password_hash: str
    uploads_enabled: bool
    created_at: datetime
    updated_at: datetime
```

## Consequences

### Positive
- Secure and scalable authentication
- Good user experience with multiple login options
- Easy event access for wedding guests
- Industry-standard approach

### Negative
- Event password is single point of access (if leaked, anyone can register)
- No email verification (relies on event password secrecy)
- Admin must manually monitor for inappropriate registrations
- Complexity of managing JWT and refresh tokens

### Risks & Mitigations
- **Risk**: Event password leaked publicly
  - **Mitigation**: Admin can change password, disable accounts, share password securely
- **Risk**: Token theft via XSS
  - **Mitigation**: Access tokens in memory, CSP headers, input sanitization
- **Risk**: CSRF attacks
  - **Mitigation**: SameSite cookies, CSRF tokens for state-changing operations
- **Risk**: Brute force on registration
  - **Mitigation**: Rate limiting on event password attempts (10/hour per IP)
- **Risk**: Malicious guest registration
  - **Mitigation**: Admin can disable accounts, delete content, change event password

## Date
2026-05-24

## Participants
- AI Agent (Cascade)
- Project Owner

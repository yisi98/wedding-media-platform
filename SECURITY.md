# Security Guidelines

## 🔒 Sensitive Information

### Never Commit These to Git:
- ❌ Event password (plaintext or hash)
- ❌ Admin passwords
- ❌ API keys and tokens
- ❌ Database credentials
- ❌ JWT secret keys
- ❌ OAuth client secrets
- ❌ AliCloud access keys
- ❌ Any `.env` files (only `.env.example` is committed)

### How to Store Secrets

#### Development (Local)
1. Copy `.env.example` to `.env`:
   ```powershell
   copy backend\.env.example backend\.env
   ```

2. Edit `.env` with your secrets:
   ```env
   # Event Configuration
   EVENT_PASSWORD_HASH=<bcrypt-hash-of-your-password>
   EVENT_DATE=2026-10-10
   
   # Security
   SECRET_KEY=<generate-random-string>
   JWT_ALGORITHM=HS256
   ```

3. **Never commit `.env`** - it's in `.gitignore`

#### Production (AliCloud)
- Use **AliCloud Secrets Manager** or environment variables
- Set secrets via AliCloud ECS console or deployment scripts
- Never hardcode in Docker images

### Generating Event Password Hash

```python
# Run this locally (not in git)
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
event_password = "YourSecretPassword"  # Replace with actual password
hashed = pwd_context.hash(event_password)
print(f"EVENT_PASSWORD_HASH={hashed}")
```

Copy the output to your `.env` file.

### Sharing Event Password with Guests

**Secure channels only:**
- ✅ WeChat private messages
- ✅ WhatsApp private messages
- ✅ Email (if encrypted)
- ✅ In-person
- ❌ Public social media
- ❌ Group chats with unknown members
- ❌ Git repositories
- ❌ Public documentation

### Admin Credentials

**Admin accounts should:**
- Use strong passwords (16+ characters, mixed case, numbers, symbols)
- Be created manually via secure script (not in migrations)
- Have 2FA enabled (if implemented)
- Be limited to 2-3 trusted individuals

### Checking for Leaked Secrets

Before committing:
```powershell
# Pre-commit hook will run gitleaks automatically
git add .
git commit -m "your message"

# Manual check
docker run --rm -v ${PWD}:/path zricethezav/gitleaks:latest detect --source="/path" -v
```

### If You Accidentally Commit a Secret

1. **Immediately rotate the secret** (change password, regenerate key)
2. **Remove from git history:**
   ```powershell
   # Use BFG Repo Cleaner or git filter-branch
   # Contact team lead for assistance
   ```
3. **Force push** (if repository is private and team is small)
4. **Notify team** if repository is shared

### Security Checklist

- [ ] All `.env` files are in `.gitignore`
- [ ] No hardcoded passwords in code
- [ ] No API keys in frontend code
- [ ] All secrets use environment variables
- [ ] Pre-commit hooks configured (gitleaks)
- [ ] Event password shared via secure channel only
- [ ] Admin passwords are strong and unique
- [ ] Production secrets stored in AliCloud Secrets Manager

### Reporting Security Issues

If you discover a security vulnerability:
1. **Do not** open a public issue
2. Contact the project admin directly
3. Provide details privately
4. Wait for fix before disclosure

---

**Remember**: Security is everyone's responsibility. When in doubt, ask!

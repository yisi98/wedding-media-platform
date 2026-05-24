# ADR 004: Internationalization (i18n) Strategy

## Status
Accepted

## Context
The Wedding Media Platform serves guests from multiple countries with different language preferences:
- **Chinese** (Simplified): Primary language (~70% of guests)
- **English**: Secondary language (~20% of guests)
- **Russian**: Tertiary language (~10% of guests)

Requirements:
- Language switcher accessible on every page
- Persistent language preference across sessions
- Support for both frontend UI and backend API messages
- No page reload when switching languages
- RTL support not required (all three languages are LTR)

## Decision

### Frontend: next-i18next
**Library**: `next-i18next` (built on `react-i18next` and `i18next`)

**Why next-i18next:**
- Official i18n solution for Next.js
- Server-side rendering support
- Automatic language detection from browser
- Namespace support for organizing translations
- Interpolation and pluralization built-in
- Active maintenance and large community

**Implementation:**
```typescript
// next-i18next.config.js
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh', 'ru'],
    localeDetection: true,
  },
  fallbackLng: 'en',
  ns: ['common', 'auth', 'gallery', 'upload', 'admin'],
  defaultNS: 'common',
}
```

**Translation Files Structure:**
```
frontend/public/locales/
  en/
    common.json
    auth.json
    gallery.json
    upload.json
    admin.json
  zh/
    common.json
    auth.json
    ...
  ru/
    common.json
    auth.json
    ...
```

### Backend: Python gettext
**Library**: `gettext` (Python standard library) + `Babel` for extraction

**Why gettext:**
- Python standard library (no external dependency)
- Industry standard for i18n
- Works with FastAPI via `starlette.middleware.i18n`
- PO/POT file format (widely supported)
- Tools for extraction and compilation

**Implementation:**
```python
# Backend structure
backend/locales/
  en/LC_MESSAGES/
    messages.po
    messages.mo
  zh/LC_MESSAGES/
    messages.po
    messages.mo
  ru/LC_MESSAGES/
    messages.po
    messages.mo
```

### Language Switcher
**UI Component:**
- Dropdown or flag icons in header/footer
- Available on every page (persistent component)
- Shows current language, allows selection of others
- No page reload (client-side switch for frontend)

**Persistence:**
- Store preference in JWT token (`language` field)
- Also store in localStorage as fallback
- Backend reads from `Accept-Language` header or token

### Language Detection Priority
1. User's saved preference (from JWT token)
2. localStorage (if not logged in)
3. Browser `Accept-Language` header
4. Default to English

## Rationale

### Why These Three Languages?
- **Chinese (Simplified)**: Majority of guests, wedding in China
- **English**: International guests, lingua franca
- **Russian**: Significant guest demographic

### Why next-i18next Over Alternatives?
- **vs. react-intl**: Better Next.js integration, SSR support
- **vs. custom solution**: Reinventing the wheel, no pluralization/interpolation
- **vs. i18next directly**: next-i18next adds Next.js-specific optimizations

### Why gettext Over Alternatives?
- **vs. custom JSON**: No pluralization, no tooling
- **vs. Babel (JS)**: gettext is Python standard, better FastAPI integration
- **vs. Fluent**: Less mature Python support

## Alternatives Considered

### Single Language (English Only)
**Rejected because:**
- Excludes 80% of guests who prefer Chinese/Russian
- Poor user experience for non-English speakers
- Wedding is in China, Chinese should be primary

### Machine Translation (Auto-translate)
**Rejected because:**
- Poor quality for UI text
- Latency and cost
- Privacy concerns (sending text to translation API)
- Not reliable for critical actions (delete, upload)

### Traditional Chinese + Simplified Chinese
**Rejected because:**
- Guests are primarily from mainland China (Simplified)
- Adds complexity with minimal benefit
- Can add later if needed

## Implementation Details

### Frontend Translation Example
```typescript
// Component usage
import { useTranslation } from 'next-i18next'

function UploadButton() {
  const { t } = useTranslation('upload')
  return <button>{t('uploadButton')}</button>
}

// Translation files
// en/upload.json
{
  "uploadButton": "Upload Photos",
  "uploadProgress": "Uploading {{count}} files..."
}

// zh/upload.json
{
  "uploadButton": "上传照片",
  "uploadProgress": "正在上传 {{count}} 个文件..."
}

// ru/upload.json
{
  "uploadButton": "Загрузить фото",
  "uploadProgress": "Загрузка {{count}} файлов..."
}
```

### Backend Translation Example
```python
from fastapi import Request
from babel.support import Translations

def get_translations(request: Request):
    locale = request.state.locale  # from middleware
    return Translations.load('locales', [locale])

@app.post("/upload")
async def upload_media(request: Request):
    _ = get_translations(request).gettext
    if error:
        raise HTTPException(400, detail=_("Invalid file type"))
```

### Language Switcher Component
```typescript
function LanguageSwitcher() {
  const router = useRouter()
  const { i18n } = useTranslation()
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  ]
  
  const switchLanguage = (locale: string) => {
    router.push(router.pathname, router.asPath, { locale })
    // Also update user preference via API
    updateUserLanguage(locale)
  }
  
  return (
    <select value={i18n.language} onChange={(e) => switchLanguage(e.target.value)}>
      {languages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.name}
        </option>
      ))}
    </select>
  )
}
```

## Translation Workflow

### Initial Translation
1. Developer writes English text in code
2. Extract strings: `npm run i18n:extract` (frontend), `pybabel extract` (backend)
3. Send to translator (human or service)
4. Translator provides Chinese and Russian translations
5. Import translations into JSON/PO files
6. Commit to repository

### Ongoing Updates
1. Developer adds new English strings
2. CI fails if untranslated strings detected
3. Translator updates missing translations
4. PR merged after translations complete

### Translation Management (Future)
- Consider using Crowdin or Lokalise for collaborative translation
- For MVP: manual translation by bilingual team member

## Consequences

### Positive
- Inclusive for all guest demographics
- Better user experience (native language)
- Professional appearance
- Easy to add more languages later
- Standard, well-tested libraries

### Negative
- Development overhead (translate all strings)
- Need translator for Chinese and Russian
- Maintenance burden (keep translations in sync)
- Slightly larger bundle size (translation files)

### Risks & Mitigations
- **Risk**: Translations out of sync with code
  - **Mitigation**: CI check for missing translations, automated extraction
- **Risk**: Poor translation quality
  - **Mitigation**: Native speaker review, context comments in translation files
- **Risk**: Language switcher not discoverable
  - **Mitigation**: Prominent placement in header, flag icons for visual clarity

## Testing Strategy
- Test all three languages in every feature
- Automated tests for translation key existence
- Visual regression tests for layout (Chinese characters may affect spacing)
- Manual QA by native speakers

## Date
2026-05-24

## Participants
- AI Agent (Cascade)
- Project Owner

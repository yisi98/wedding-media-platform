# ADR 005: Duplicate Detection Strategy

## Status
Accepted

## Context
Wedding guests often take similar photos or accidentally upload the same file multiple times. The platform needs to:
- Detect duplicate files before storing them
- Prevent wasting storage space
- Inform users when they're uploading a duplicate
- Allow users to override if they believe it's not a duplicate (e.g., similar but different photos)

**Constraints:**
- Must work across all users (not just per-user deduplication)
- Must be fast (< 100ms check during upload)
- Must handle ~15GB of media (150 users × 50 photos × 2MB avg)
- Should detect exact duplicates, not similar images (perceptual hashing is out of scope for MVP)

## Decision

### Hash-Based Duplicate Detection
**Algorithm**: SHA-256 (cryptographic hash)

**Flow:**
1. **Client-side**: Calculate file hash before upload (optional, for early warning)
2. **Server-side**: Calculate hash after upload, before storing
3. **Database check**: Query `media` table for existing hash
4. **If duplicate found**:
   - Return warning to user with existing media details
   - User can choose: Skip upload or Force upload (if they believe it's different)
5. **If not duplicate**: Store hash in database with media metadata

### Database Schema
```python
class Media:
    id: UUID
    user_id: UUID (FK)
    filename: str
    file_hash: str (indexed, unique constraint)
    mime_type: str
    file_size: int
    storage_path: str
    uploaded_at: datetime
    uploaded_by_username: str
```

**Index**: `CREATE UNIQUE INDEX idx_media_hash ON media(file_hash)`

### API Behavior
```python
# Upload endpoint
@app.post("/media/upload")
async def upload_media(file: UploadFile):
    # 1. Calculate hash
    file_hash = hashlib.sha256(file.file.read()).hexdigest()
    file.file.seek(0)  # Reset file pointer
    
    # 2. Check for duplicate
    existing = await db.query(Media).filter(Media.file_hash == file_hash).first()
    
    if existing:
        return {
            "status": "duplicate",
            "message": "This file has already been uploaded",
            "existing_media": {
                "id": existing.id,
                "uploaded_by": existing.uploaded_by_username,
                "uploaded_at": existing.uploaded_at,
                "thumbnail_url": existing.thumbnail_url
            },
            "options": ["skip", "force_upload"]
        }
    
    # 3. If not duplicate, proceed with upload
    # ... upload to OSS, create media record
```

### Frontend Handling
```typescript
// Upload component
async function uploadFile(file: File, forceUpload = false) {
  const formData = new FormData()
  formData.append('file', file)
  if (forceUpload) formData.append('force', 'true')
  
  const response = await fetch('/api/media/upload', {
    method: 'POST',
    body: formData
  })
  
  const data = await response.json()
  
  if (data.status === 'duplicate') {
    // Show modal: "This photo was already uploaded by {user} on {date}"
    // Options: [Skip] [Upload Anyway]
    const userChoice = await showDuplicateModal(data.existing_media)
    
    if (userChoice === 'upload_anyway') {
      return uploadFile(file, true)  // Retry with force flag
    }
  }
}
```

## Rationale

### Why SHA-256?
- **Collision resistance**: Virtually impossible for two different files to have same hash
- **Fast**: ~500 MB/s on modern CPUs
- **Standard**: Widely used, well-tested
- **Deterministic**: Same file always produces same hash

### Why Not MD5?
- **Security**: MD5 is cryptographically broken (collision attacks exist)
- **Perception**: SHA-256 is more trusted
- **Performance**: SHA-256 is fast enough for our use case

### Why Not Perceptual Hashing (pHash, dHash)?
- **Complexity**: Requires image processing, slower
- **False positives**: Similar but different photos would be flagged
- **Scope**: Out of scope for MVP
- **Future**: Can add as Phase 2 feature for "similar photo" detection

### Why Allow Force Upload?
- **User control**: User knows best if it's truly a duplicate
- **Edge cases**: Identical files with different context (e.g., same photo from two cameras)
- **Flexibility**: Better UX than hard blocking

## Alternatives Considered

### Content-Based Deduplication (Perceptual Hashing)
**Rejected because:**
- Too complex for MVP
- Slower (requires image decoding)
- False positives (similar photos flagged as duplicates)
- Can add in Phase 2 if needed

### Client-Side Only Deduplication
**Rejected because:**
- Can't detect duplicates across users
- Easy to bypass
- No server-side validation

### No Deduplication
**Rejected because:**
- Wastes storage space
- Poor user experience (accidental re-uploads)
- Higher costs

### Filename-Based Deduplication
**Rejected because:**
- Users can rename files
- Different files can have same name
- Not reliable

## Implementation Details

### Hash Calculation Performance
- **SHA-256 speed**: ~500 MB/s on modern CPU
- **Average photo size**: 2 MB
- **Hash time per photo**: ~4ms
- **Acceptable overhead**: Yes

### Database Query Performance
- **Index on `file_hash`**: O(log n) lookup
- **Expected media count**: ~7,500 files (150 users × 50 photos)
- **Query time**: < 1ms with index

### Storage Savings Estimate
- **Duplicate rate**: Assume 10-15% duplicates (guests taking same photo)
- **Storage saved**: ~1.5-2GB (10-15% of 15GB)
- **Cost saved**: ~$0.03-0.04/month (minimal but adds up)

### Force Upload Handling
```python
@app.post("/media/upload")
async def upload_media(file: UploadFile, force: bool = False):
    file_hash = calculate_hash(file)
    
    if not force:
        existing = await check_duplicate(file_hash)
        if existing:
            return duplicate_response(existing)
    
    # If force=True, skip duplicate check and upload anyway
    # Store with same hash (remove unique constraint, use index only)
    media = await store_media(file, file_hash)
    return success_response(media)
```

**Note**: If `force=True`, we still store the hash but allow duplicates. This means the unique constraint on `file_hash` should be removed, and we use a regular index instead.

### Revised Schema
```python
class Media:
    id: UUID (PK)
    file_hash: str (indexed, NOT unique)
    # ... other fields
```

**Index**: `CREATE INDEX idx_media_hash ON media(file_hash)` (not unique)

## Consequences

### Positive
- Prevents accidental duplicate uploads
- Saves storage space and costs
- Fast (< 100ms overhead per upload)
- User-friendly (warns but doesn't block)
- Simple implementation

### Negative
- Doesn't detect similar (but not identical) photos
- User can force upload duplicates (but that's by design)
- Small performance overhead for hashing

### Risks & Mitigations
- **Risk**: Hash collision (two different files, same hash)
  - **Mitigation**: SHA-256 collision probability is negligible (2^-256)
- **Risk**: User confused by duplicate warning
  - **Mitigation**: Clear UI message with thumbnail preview
- **Risk**: Performance degradation with large files
  - **Mitigation**: Hash calculation is fast; for videos, can hash first 10MB only

## Testing Strategy
- Unit test: Hash calculation correctness
- Integration test: Duplicate detection in upload flow
- E2E test: User uploads same file twice, sees warning
- Load test: Hash calculation performance with 50MB files
- Edge case: User force-uploads duplicate, both files stored

## Future Enhancements (Post-MVP)
- **Perceptual hashing**: Detect similar (not just identical) photos
- **Client-side hashing**: Calculate hash in browser before upload (save bandwidth)
- **Duplicate clustering**: Show all duplicates in admin panel
- **Auto-merge duplicates**: Keep best quality version, delete others

## Date
2026-05-24

## Participants
- AI Agent (Cascade)
- Project Owner

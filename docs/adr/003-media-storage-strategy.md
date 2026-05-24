# ADR 003: Media Storage and Processing Strategy

## Status
Superseded by this revision (2026-05-24)

**Change Summary**: Changed from AWS S3 to AliCloud OSS for China deployment. Updated CDN to AliCloud CDN.

## Context
The Wedding Media Platform (single-event, ~150 users) needs to handle:
- Photos and videos from wedding attendees (estimate: 150 users × 50 photos × 2MB = ~15GB)
- Multiple image sizes for different use cases (thumbnails, optimized, original)
- Video transcoding for web playback (optional for MVP)
- Fast delivery of media to users in China and internationally
- Cost-effective storage (target: < 50GB total)
- **Deployment on AliCloud** (mainland China) for optimal domestic performance

## Decision

### Object Storage: AliCloud OSS
**Primary Choice:** AliCloud OSS (Object Storage Service) for production  
**Development:** MinIO (S3-compatible, self-hosted)

**Why AliCloud OSS:**
- Hosted in mainland China (fast access domestically)
- Not blocked by Great Firewall
- Integrates with AliCloud CDN
- S3-compatible API (easy migration from MinIO)
- Cost-effective for China deployment

**Storage Structure:**
```
bucket-name/
  events/
    {event_id}/
      media/
        {media_id}/
          original.{ext}
          thumbnail.{ext}
          optimized.{ext}
          transcoded.mp4 (for videos)
```

### Image Processing Pipeline
1. **Upload**: Direct upload to object storage with presigned URLs
2. **Validation**: Check file type, size, and basic integrity
3. **Thumbnail Generation**: Create 200x200 thumbnail (async)
4. **Optimization**: Compress and resize for web display (async)
5. **Metadata Extraction**: Extract EXIF data, location, timestamp

**Tools:**
- Pillow (Python) for image processing
- Sharp (Node.js) as alternative for frontend processing
- WebP format for optimized images (with JPEG fallback)

### Video Processing Pipeline
1. **Upload**: Chunked upload for large files
2. **Validation**: Check format, duration, size
3. **Transcoding**: Convert to web-friendly formats (async)
   - H.264 codec for broad compatibility
   - Multiple resolutions: 720p, 1080p
   - HLS for adaptive streaming (future)
4. **Thumbnail**: Extract frame at 1 second

**Tools:**
- FFmpeg for video processing
- Celery or RQ for async job processing

### CDN Strategy
**Choice:** AliCloud CDN

**Why AliCloud CDN:**
- Optimized for China mainland delivery
- Integrates seamlessly with AliCloud OSS
- Not blocked by Great Firewall
- Cost-effective for China-based traffic
- Global edge nodes for international guests

**Configuration:**
- Cache static assets (images, videos) for 1 year
- Cache-Control headers for different content types
- Signed URLs for private media (optional for single-event)
- Primary distribution in China, secondary international

### Database Metadata
Store in PostgreSQL:
- File paths and URLs
- Processing status
- Metadata (dimensions, duration, EXIF)
- Access permissions
- View/download counts

## Rationale

### AliCloud OSS
- **China performance**: Hosted in mainland China (low latency)
- **Scalability**: Handles 50GB+ easily
- **Durability**: 99.9999999999% durability (12 nines)
- **Cost**: ~$0.02/GB/month (cheaper than AWS in China)
- **S3-compatible**: Can develop locally with MinIO, deploy to OSS
- **No firewall issues**: Not blocked in China

### Presigned URLs for Upload
- **Security**: No direct backend upload, reduces server load
- **Performance**: Direct client-to-storage upload
- **Progress**: Client can show upload progress
- **Scalability**: Backend doesn't handle file data

### Async Processing
- **User Experience**: Don't block upload on processing
- **Scalability**: Process multiple files in parallel
- **Reliability**: Retry failed processing jobs
- **Resource Management**: Dedicated workers for heavy tasks

### Multiple Image Sizes
- **Performance**: Serve appropriate size for context
- **Bandwidth**: Reduce data transfer costs
- **UX**: Faster page loads with thumbnails
- **Flexibility**: Original available for download

## Alternatives Considered

### Local File Storage
**Rejected because:**
- Doesn't scale horizontally
- Requires backup management
- No built-in CDN integration
- Server disk space limitations

### Database BLOB Storage
**Rejected because:**
- Poor performance for large files
- Database bloat
- Expensive backups
- Not designed for this use case

### Third-party Media Services (Cloudinary, Imgix)
**Rejected because:**
- Higher cost at scale
- Vendor lock-in
- Less control over processing
- May be considered for future optimization

## Implementation Details

### Upload Flow
```python
# Backend generates presigned URL (OSS SDK)
import oss2

auth = oss2.Auth(access_key_id, access_key_secret)
bucket = oss2.Bucket(auth, endpoint, bucket_name)

presigned_url = bucket.sign_url(
    'PUT',
    f'events/{event_id}/media/{media_id}/original.{ext}',
    expires=3600,  # 1 hour
    headers={'Content-Type': mime_type}
)

# Frontend uploads directly to OSS
fetch(presigned_url, {
    method: 'PUT',
    body: file,
    headers: {'Content-Type': file.type}
})

# Backend processes after upload confirmation
process_media_task.delay(media_id)
```

**Note**: OSS SDK is S3-compatible, so code is similar to AWS S3.

### Processing Queue
- Use Celery with Redis as broker
- Separate queues for images and videos
- Priority queue for thumbnails
- Retry logic with exponential backoff

### Storage Costs Optimization
- Lifecycle policies to move old media to cheaper storage tiers
- Delete processing artifacts after 30 days
- Compress images with minimal quality loss
- Use WebP format (smaller than JPEG)

### Security
- Presigned URLs expire after 1 hour
- Validate file types on backend (don't trust client)
- Scan for malware (ClamAV or cloud service)
- Rate limit uploads per user
- Maximum file sizes: 50MB images, 500MB videos

## Consequences

### Positive
- Scalable to millions of media files
- Fast global delivery via CDN
- Cost-effective at scale
- Reliable and durable storage
- Good user experience with async processing

### Negative
- Complexity of async processing pipeline
- Need to manage processing workers (Celery)
- Dependency on AliCloud (vendor lock-in, but required for China)
- Processing costs for video transcoding (can defer to post-MVP)
- OSS costs if storage exceeds budget

### Monitoring
- Track processing success/failure rates
- Monitor storage costs
- Alert on processing queue backlog
- Track CDN cache hit rates

## Future Enhancements
- Adaptive bitrate streaming (HLS/DASH) for videos
- AI-powered image enhancement
- Automatic face detection and tagging
- Smart cropping for thumbnails
- Progressive image loading (LQIP)
- AliCloud Media Processing Service integration

## Date
2026-05-24

## Participants
- AI Agent (Cascade)
- Project Owner

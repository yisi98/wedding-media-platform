# Data Models

## Entity Relationship Overview

```
User ──┬── Event (creator)
       └── Media (uploader)
       └── Comment (author)
       └── EventGuest (guest)

Event ──┬── EventGuest (many)
        └── Album (many)
        └── Media (many)

Album ──┬── Media (many)
        └── AlbumShare (many)

Media ──┬── Comment (many)
        └── Reaction (many)
        └── MediaTag (many)
```

## Core Models

### User
```python
class User:
    id: UUID (PK)
    email: str (unique, indexed)
    username: str (unique, indexed)
    password_hash: str
    full_name: str
    avatar_url: str (nullable)
    phone_number: str (nullable)
    is_active: bool (default=True)
    is_verified: bool (default=False)
    role: Enum['guest', 'organizer', 'admin']
    created_at: datetime
    updated_at: datetime
    last_login: datetime (nullable)
```

### Event
```python
class Event:
    id: UUID (PK)
    creator_id: UUID (FK -> User.id)
    title: str
    description: text (nullable)
    event_date: date
    location: str (nullable)
    access_code: str (unique, indexed)
    is_public: bool (default=False)
    max_upload_size_mb: int (default=50)
    settings: JSON (event-specific settings)
    created_at: datetime
    updated_at: datetime
    
    # Relationships
    creator: User
    guests: List[EventGuest]
    albums: List[Album]
    media: List[Media]
```

### EventGuest
```python
class EventGuest:
    id: UUID (PK)
    event_id: UUID (FK -> Event.id)
    user_id: UUID (FK -> User.id)
    role: Enum['viewer', 'contributor', 'moderator']
    can_upload: bool (default=True)
    can_download: bool (default=True)
    can_comment: bool (default=True)
    joined_at: datetime
    
    # Composite unique constraint on (event_id, user_id)
```

### Album
```python
class Album:
    id: UUID (PK)
    event_id: UUID (FK -> Event.id)
    creator_id: UUID (FK -> User.id)
    title: str
    description: text (nullable)
    cover_media_id: UUID (FK -> Media.id, nullable)
    is_collaborative: bool (default=False)
    is_public: bool (default=False)
    created_at: datetime
    updated_at: datetime
    
    # Relationships
    event: Event
    creator: User
    media: List[Media]
    shares: List[AlbumShare]
```

### Media
```python
class Media:
    id: UUID (PK)
    event_id: UUID (FK -> Event.id)
    album_id: UUID (FK -> Album.id, nullable)
    uploader_id: UUID (FK -> User.id)
    type: Enum['image', 'video']
    
    # Storage
    original_url: str
    thumbnail_url: str
    optimized_url: str (nullable)
    storage_key: str (S3 key)
    
    # Metadata
    filename: str
    file_size_bytes: int
    mime_type: str
    width: int (nullable)
    height: int (nullable)
    duration_seconds: float (nullable, for videos)
    
    # EXIF/Metadata
    taken_at: datetime (nullable)
    camera_model: str (nullable)
    location_lat: float (nullable)
    location_lng: float (nullable)
    location_name: str (nullable)
    
    # Processing
    processing_status: Enum['pending', 'processing', 'completed', 'failed']
    processing_error: text (nullable)
    
    # Engagement
    view_count: int (default=0)
    download_count: int (default=0)
    
    created_at: datetime
    updated_at: datetime
    
    # Relationships
    uploader: User
    event: Event
    album: Album
    comments: List[Comment]
    reactions: List[Reaction]
    tags: List[MediaTag]
```

### Comment
```python
class Comment:
    id: UUID (PK)
    media_id: UUID (FK -> Media.id)
    author_id: UUID (FK -> User.id)
    parent_id: UUID (FK -> Comment.id, nullable) # for nested comments
    content: text
    is_edited: bool (default=False)
    created_at: datetime
    updated_at: datetime
    
    # Relationships
    media: Media
    author: User
    replies: List[Comment]
```

### Reaction
```python
class Reaction:
    id: UUID (PK)
    media_id: UUID (FK -> Media.id)
    user_id: UUID (FK -> User.id)
    type: Enum['like', 'love', 'laugh', 'wow', 'sad']
    created_at: datetime
    
    # Composite unique constraint on (media_id, user_id)
```

### MediaTag
```python
class MediaTag:
    id: UUID (PK)
    media_id: UUID (FK -> Media.id)
    user_id: UUID (FK -> User.id, nullable) # tagged person
    tag_name: str (indexed) # for non-person tags
    x_coordinate: float (nullable) # for face tagging
    y_coordinate: float (nullable)
    created_by_id: UUID (FK -> User.id)
    created_at: datetime
```

### AlbumShare
```python
class AlbumShare:
    id: UUID (PK)
    album_id: UUID (FK -> Album.id)
    user_id: UUID (FK -> User.id, nullable) # null means public link
    share_token: str (unique, indexed)
    can_download: bool (default=True)
    expires_at: datetime (nullable)
    created_at: datetime
    
    # Composite unique constraint on (album_id, user_id)
```

### Notification
```python
class Notification:
    id: UUID (PK)
    user_id: UUID (FK -> User.id)
    type: Enum['new_media', 'new_comment', 'tag', 'event_invite', 'album_share']
    title: str
    message: text
    link: str (nullable)
    is_read: bool (default=False)
    created_at: datetime
```

## Indexes

### User
- `idx_user_email` on `email`
- `idx_user_username` on `username`

### Event
- `idx_event_access_code` on `access_code`
- `idx_event_creator` on `creator_id`
- `idx_event_date` on `event_date`

### EventGuest
- `idx_event_guest_event` on `event_id`
- `idx_event_guest_user` on `user_id`

### Media
- `idx_media_event` on `event_id`
- `idx_media_album` on `album_id`
- `idx_media_uploader` on `uploader_id`
- `idx_media_taken_at` on `taken_at`
- `idx_media_type` on `type`
- `idx_media_status` on `processing_status`

### Comment
- `idx_comment_media` on `media_id`
- `idx_comment_author` on `author_id`

### Notification
- `idx_notification_user` on `user_id`
- `idx_notification_read` on `is_read`

## Database Migrations Strategy
- Use Alembic for database migrations
- Never modify existing migrations
- Always create new migration for schema changes
- Test migrations on staging before production
- Keep migrations reversible when possible

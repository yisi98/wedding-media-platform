# Coding Standards

## General Principles
1. **Write code for humans first, machines second**
2. **Prefer explicit over implicit**
3. **Don't repeat yourself (DRY)**
4. **Keep it simple, stupid (KISS)**
5. **You aren't gonna need it (YAGNI)**
6. **Separation of concerns**
7. **Single responsibility principle**

## Python (Backend)

### Style Guide
- Follow PEP 8
- Use Black for formatting (line length: 100)
- Use Ruff for linting
- Use type hints everywhere

### Code Organization
```python
# Import order (enforced by isort)
# 1. Standard library
import os
from datetime import datetime

# 2. Third-party
from fastapi import FastAPI, Depends
from sqlalchemy import Column, String

# 3. Local
from app.models import User
from app.services import AuthService
```

### Naming Conventions
- **Variables/Functions**: `snake_case`
- **Classes**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Private methods**: `_leading_underscore`
- **Files**: `snake_case.py`

### Type Hints
```python
# Always use type hints
def get_user_by_id(user_id: UUID) -> User | None:
    """Get user by ID."""
    return db.query(User).filter(User.id == user_id).first()

# Use Pydantic for validation
class UserCreate(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8)
```

### Docstrings
```python
def process_image(image_path: str, output_size: tuple[int, int]) -> str:
    """
    Process and resize an image.
    
    Args:
        image_path: Path to the source image
        output_size: Tuple of (width, height) for output
        
    Returns:
        Path to the processed image
        
    Raises:
        FileNotFoundError: If image_path doesn't exist
        ValueError: If output_size is invalid
    """
    pass
```

### Error Handling
```python
# Use specific exceptions
try:
    user = get_user_by_id(user_id)
except UserNotFoundError as e:
    logger.error(f"User not found: {user_id}")
    raise HTTPException(status_code=404, detail=str(e))

# Don't catch generic exceptions unless necessary
# Bad
try:
    risky_operation()
except Exception:
    pass

# Good
try:
    risky_operation()
except SpecificError as e:
    handle_error(e)
```

### Async/Await
```python
# Use async for I/O operations
async def get_user_async(user_id: UUID) -> User:
    async with async_session() as session:
        result = await session.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()

# Don't use async for CPU-bound operations
def process_image(image: bytes) -> bytes:
    # CPU-bound, keep synchronous
    return transform_image(image)
```

## TypeScript (Frontend)

### Style Guide
- Follow Airbnb TypeScript Style Guide
- Use ESLint + Prettier
- Strict TypeScript mode enabled

### Naming Conventions
- **Variables/Functions**: `camelCase`
- **Classes/Components**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Interfaces**: `PascalCase` (no `I` prefix)
- **Types**: `PascalCase`
- **Files**: `kebab-case.tsx` or `PascalCase.tsx` for components

### Component Structure
```typescript
// Use functional components with TypeScript
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
}

export function UserCard({ user, onEdit }: UserCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  // Event handlers
  const handleEdit = () => {
    setIsEditing(true);
    onEdit?.(user);
  };
  
  // Render
  return (
    <div className="user-card">
      {/* Component JSX */}
    </div>
  );
}
```

### Type Definitions
```typescript
// Prefer interfaces for objects
interface User {
  id: string;
  email: string;
  username: string;
}

// Use types for unions, intersections
type UserRole = 'guest' | 'organizer' | 'admin';
type UserWithRole = User & { role: UserRole };

// Export types from dedicated files
// types/user.ts
export interface User { ... }
export type UserRole = ...;
```

### Async Operations
```typescript
// Use async/await, not .then()
async function fetchUser(id: string): Promise<User> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// Use React Query for data fetching
function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id),
  });
}
```

### React Best Practices
```typescript
// Use custom hooks for logic
function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Auth logic
  }, []);
  
  return { user, login, logout };
}

// Memoize expensive computations
const sortedUsers = useMemo(
  () => users.sort((a, b) => a.name.localeCompare(b.name)),
  [users]
);

// Use useCallback for event handlers passed to children
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

## Testing

### Python Tests
```python
# Use pytest
# File: test_user_service.py

import pytest
from app.services import UserService

@pytest.fixture
def user_service():
    return UserService()

def test_create_user_success(user_service):
    """Test successful user creation."""
    user = user_service.create_user(
        email="test@example.com",
        username="testuser",
        password="securepass123"
    )
    assert user.email == "test@example.com"
    assert user.username == "testuser"

def test_create_user_duplicate_email(user_service):
    """Test user creation with duplicate email fails."""
    user_service.create_user(email="test@example.com", ...)
    
    with pytest.raises(DuplicateEmailError):
        user_service.create_user(email="test@example.com", ...)
```

### TypeScript Tests
```typescript
// Use Vitest + React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UserCard } from './UserCard';

describe('UserCard', () => {
  it('renders user information', () => {
    const user = { id: '1', name: 'John Doe', email: 'john@example.com' };
    render(<UserCard user={user} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
  
  it('calls onEdit when edit button is clicked', () => {
    const user = { id: '1', name: 'John Doe', email: 'john@example.com' };
    const onEdit = vi.fn();
    
    render(<UserCard user={user} onEdit={onEdit} />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    
    expect(onEdit).toHaveBeenCalledWith(user);
  });
});
```

## Git Commit Messages

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, tooling

### Examples
```
feat(auth): add OAuth2 Google login

Implement Google OAuth2 authentication flow with token refresh.
Users can now sign in using their Google account.

Closes #123

---

fix(media): resolve thumbnail generation for HEIC images

HEIC images were failing during thumbnail generation due to
missing codec support. Added pillow-heif dependency.

Fixes #456

---

docs(api): update authentication endpoint documentation

Added examples for refresh token flow and error responses.
```

## Code Review Checklist

### Functionality
- [ ] Code works as intended
- [ ] Edge cases are handled
- [ ] Error handling is appropriate
- [ ] No obvious bugs

### Code Quality
- [ ] Follows coding standards
- [ ] No code duplication
- [ ] Functions are small and focused
- [ ] Variable names are descriptive
- [ ] No magic numbers or strings

### Testing
- [ ] Tests are included
- [ ] Tests cover edge cases
- [ ] Tests are meaningful
- [ ] All tests pass

### Security
- [ ] No sensitive data in code
- [ ] Input validation is present
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] Authentication/authorization checks

### Performance
- [ ] No obvious performance issues
- [ ] Database queries are optimized
- [ ] No N+1 query problems
- [ ] Appropriate caching

### Documentation
- [ ] Code is self-documenting
- [ ] Complex logic has comments
- [ ] API changes are documented
- [ ] README updated if needed

## File Organization

### Backend Structure
```
backend/
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── endpoints/
│   │   │   │   ├── auth.py
│   │   │   │   ├── users.py
│   │   │   │   └── media.py
│   │   │   └── router.py
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   └── dependencies.py
│   ├── models/
│   │   ├── user.py
│   │   ├── event.py
│   │   └── media.py
│   ├── schemas/
│   │   ├── user.py
│   │   └── media.py
│   ├── services/
│   │   ├── auth_service.py
│   │   └── media_service.py
│   └── main.py
├── tests/
├── alembic/
└── requirements.txt
```

### Frontend Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (dashboard)/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── features/
│   │   └── layout/
│   ├── lib/
│   │   ├── api/
│   │   ├── hooks/
│   │   └── utils/
│   ├── types/
│   └── styles/
├── public/
└── package.json
```

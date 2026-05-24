"""Auth endpoint tests. Requires running PostgreSQL (uses test DB)."""
import bcrypt
import pytest
from httpx import AsyncClient
from unittest.mock import patch

EVENT_PASSWORD = "test-event-password-123"
EVENT_HASH = bcrypt.hashpw(EVENT_PASSWORD.encode(), bcrypt.gensalt()).decode()


@pytest.fixture(autouse=True)
def patch_event_password():
    with patch("app.services.auth.settings") as mock_settings:
        mock_settings.event_password_hash = EVENT_HASH
        mock_settings.secret_key = "test-secret-key-minimum-32-characters-long"
        mock_settings.jwt_algorithm = "HS256"
        mock_settings.access_token_expire_minutes = 15
        mock_settings.refresh_token_expire_days = 7
        yield mock_settings


@pytest.mark.asyncio
async def test_register_success(client: AsyncClient):
    resp = await client.post("/api/v1/auth/register", json={
        "event_password": EVENT_PASSWORD,
        "username": "guest1",
        "password": "securepass123",
        "language": "en",
    })
    assert resp.status_code == 201
    data = resp.json()
    assert "access_token" in data
    assert "refresh_token" in data


@pytest.mark.asyncio
async def test_register_wrong_event_password(client: AsyncClient):
    resp = await client.post("/api/v1/auth/register", json={
        "event_password": "wrong-password",
        "username": "guest2",
        "password": "securepass123",
    })
    assert resp.status_code == 400


@pytest.mark.asyncio
async def test_register_duplicate_username(client: AsyncClient):
    payload = {"event_password": EVENT_PASSWORD, "username": "dupuser", "password": "pass12345"}
    await client.post("/api/v1/auth/register", json=payload)
    resp = await client.post("/api/v1/auth/register", json=payload)
    assert resp.status_code == 409


@pytest.mark.asyncio
async def test_login_success(client: AsyncClient):
    await client.post("/api/v1/auth/register", json={
        "event_password": EVENT_PASSWORD, "username": "loginuser", "password": "mypassword123",
    })
    resp = await client.post("/api/v1/auth/login", json={"username": "loginuser", "password": "mypassword123"})
    assert resp.status_code == 200
    assert "access_token" in resp.json()


@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient):
    await client.post("/api/v1/auth/register", json={
        "event_password": EVENT_PASSWORD, "username": "user3", "password": "correct",
    })
    resp = await client.post("/api/v1/auth/login", json={"username": "user3", "password": "wrong"})
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_me_endpoint(client: AsyncClient):
    reg = await client.post("/api/v1/auth/register", json={
        "event_password": EVENT_PASSWORD, "username": "meuser", "password": "testpass123",
    })
    token = reg.json()["access_token"]
    resp = await client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert resp.json()["username"] == "meuser"

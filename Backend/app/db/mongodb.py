import logging

from pymongo import AsyncMongoClient
from pymongo.asynchronous.database import AsyncDatabase

from app.core.config import settings

logger = logging.getLogger(__name__)

_client: AsyncMongoClient | None = None
_db: AsyncDatabase | None = None


async def connect_db() -> bool:
    """Connect to MongoDB if MONGODB_URI is set. Returns True when connected."""
    global _client, _db
    if not settings.mongodb_uri:
        logger.warning("MONGODB_URI not set - running without database")
        return False
    try:
        _client = AsyncMongoClient(settings.mongodb_uri, serverSelectionTimeoutMS=5000)
        await _client.admin.command("ping")
        _db = _client[settings.mongodb_db_name]
        logger.info("Connected to MongoDB database '%s'", settings.mongodb_db_name)
        return True
    except Exception as exc:
        logger.error("MongoDB connection failed: %s", exc)
        _client, _db = None, None
        return False


async def close_db() -> None:
    global _client, _db
    if _client is not None:
        await _client.close()
    _client, _db = None, None


def get_db() -> AsyncDatabase | None:
    return _db

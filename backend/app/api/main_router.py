from fastapi import APIRouter

from app.api.routes import login, users, utils, friends, photos, push_notification_token

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
api_router.include_router(friends.router, prefix="/friends", tags=["friends"])
api_router.include_router(photos.router, prefix="/photos", tags=["photos"])
api_router.include_router(push_notification_token.router, prefix="/notification-token", tags=["notification-token"])

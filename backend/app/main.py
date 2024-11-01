import logging
from logging.config import dictConfig as loggingDictConfig
from pathlib import Path

import sentry_sdk
from fastapi import FastAPI
from fastapi.routing import APIRoute
from starlette.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles

from app.api.main_router import api_router
from app.core.config import settings, LogConfig

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


loggingDictConfig(LogConfig().dict())


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


if settings.SENTRY_DSN and settings.ENVIRONMENT != "local":
    sentry_sdk.init(dsn=str(settings.SENTRY_DSN), enable_tracing=True)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            str(origin).strip("/") for origin in settings.BACKEND_CORS_ORIGINS
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)


if settings.ENVIRONMENT == 'local':
    Path(settings.FILE_STORAGE_PATH).mkdir(parents=True, exist_ok=True)

app.mount("/static/photos", StaticFiles(directory=settings.FILE_STORAGE_PATH), name="static-photos")

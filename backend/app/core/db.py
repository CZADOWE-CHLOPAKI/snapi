from sqlmodel import Session, create_engine, select

from app import crud
from app.core.config import settings
from app.models import User, UserCreate, Friend

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))

# to start with an empty database:
# docker volume ls
# find the volume name that corresponds to the database, probably snapi_app-db-data
# docker volume rm snapi_app-db-data



# make sure all SQLModel models are imported (app.models) before initializing DB
# otherwise, SQLModel might fail to initialize relationships properly
# for more details: https://github.com/tiangolo/full-stack-fastapi-template/issues/28
USERS = [
    {
        "email": settings.FIRST_SUPERUSER,
        "password": settings.FIRST_SUPERUSER_PASSWORD,
        "is_superuser": True,
        "tag": "admin",
    },
    {
        "email": "user1@example.com",
        "password": settings.FIRST_SUPERUSER_PASSWORD,
        "is_superuser": False,
        "tag": "user1",
    },
    {
        "email": "user2@example.com",
        "password": settings.FIRST_SUPERUSER_PASSWORD,
        "is_superuser": False,
        "tag": "user2",
    }
]


def _create_init_data(session: Session) -> None:
    for user in USERS:
        user_in = UserCreate(**user)
        user = crud.create_user(session=session, user_create=user_in)

    # create friendship between user1 and user2
    user1 = crud.get_user_by_email(session=session, email="user1@example.com")
    user2 = crud.get_user_by_email(session=session, email="user2@example.com")
    friendship = Friend(user_1_id=user1.id, user_2_id=user2.id, invited_by=user1.id, accepted=True)
    session.add(friendship)
    session.commit()


def init_db(session: Session) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next lines
    # from sqlmodel import SQLModel

    # from app.core.engine import engine
    # This works because the models are already imported and registered from app.models
    # SQLModel.metadata.create_all(engine)

    user = session.exec(
        select(User).where(User.email == settings.FIRST_SUPERUSER)
    ).first()

    # if the first user doesn't exist, the database is probably empty
    if not user:
        _create_init_data(session)


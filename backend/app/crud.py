from typing import Any, Sequence

from sqlmodel import Session, select, or_

from app.core.security import get_password_hash, verify_password
from app.models import User, UserCreate, UserUpdate, Friend


def create_user(*, session: Session, user_create: UserCreate) -> User:
    db_obj = User.model_validate(
        user_create, update={"hashed_password": get_password_hash(user_create.password)}
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def update_user(*, session: Session, db_user: User, user_in: UserUpdate) -> Any:
    user_data = user_in.model_dump(exclude_unset=True)
    extra_data = {}
    if "password" in user_data:
        password = user_data["password"]
        hashed_password = get_password_hash(password)
        extra_data["hashed_password"] = hashed_password
    db_user.sqlmodel_update(user_data, update=extra_data)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


def get_user_by_email(*, session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    session_user = session.exec(statement).first()
    return session_user


def authenticate(*, session: Session, email: str, password: str) -> User | None:
    db_user = get_user_by_email(session=session, email=email)
    if not db_user:
        return None
    if not verify_password(password, db_user.hashed_password):
        return None
    return db_user


def get_user_friends(*, session: Session, user: User | int, accepted: bool | None = True) -> Sequence[Friend]:
    user_id = user if isinstance(user, int) else user.id
    statement = select(Friend).where(or_(Friend.user_1_id == user_id, Friend.user_2_id == user_id))
    if accepted is not None:
        statement = statement.where(Friend.accepted == accepted)
    return session.exec(statement).all()


def get_friendship(*, session: Session, user1: User | str, user2: User | str):
    if isinstance(user1, str):
        user1 = session.exec(select(User).where(User.tag == user1)).first()
    if isinstance(user2, str):
        user2 = session.exec(select(User).where(User.tag == user2)).first()

    statement1 = select(Friend).where(Friend.user_1_id == user2.id).where(Friend.user_2_id == user1.id)
    statement2 = select(Friend).where(Friend.user_2_id == user2.id).where(Friend.user_1_id == user1.id)

    friendship = session.exec(statement1).first()
    if not friendship:
        friendship = session.exec(statement2).first()

    return friendship

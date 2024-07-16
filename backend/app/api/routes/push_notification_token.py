from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlmodel import func, select, or_, col

from app.api.deps import CurrentUser, SessionDep
from app.crud import get_user_friends, get_friendship
from app.models import Message, User, Friend, UserPhoto, PushToken

router = APIRouter()


class UpdateNotificationToken(BaseModel):
    token: str


@router.post("/", response_model=Message)
def update_notification_token(*, session: SessionDep, current_user: CurrentUser, data: UpdateNotificationToken) -> Any:
    # mark old tokens as inactive
    # TODO move to a separate crud
    # TODO fix the sql
    existing_token_st = select(PushToken).where(PushToken.token == data.token).where(PushToken.active==True).where(PushToken.user_id == current_user.id)
    existing_token = session.exec(existing_token_st).first()
    if existing_token:
        return Message(message="Token already exists")

    # session.exec(select(PushToken).where(PushToken.user_id == current_user.id).where(PushToken.active==True)).update({PushToken.active: False})
    old_tokens_st = select(PushToken).where(PushToken.user_id == current_user.id).where(PushToken.active==True)
    old_tokens = session.exec(old_tokens_st).all()
    for token in old_tokens:
        token.active = False
    session.commit()

    new_token = PushToken(token=data.token, user_id=current_user.id)
    session.add(new_token)
    session.commit()
    return Message(message="Token updated")

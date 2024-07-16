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
    return Message(message="Token updated")

    # TODO move to a separate crud
    session.exec(select(PushToken).where(PushToken.user_id == current_user.id).where(PushToken.active==True)).update({PushToken.active: False})
    new_token = PushToken(token=data.token, user_id=current_user.id)
    session.add(new_token)
    session.commit()
    return Message(message="Token updated")

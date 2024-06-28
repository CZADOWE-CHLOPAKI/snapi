from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlmodel import func, select, or_, col

from app.api.deps import CurrentUser, SessionDep
from app.crud import get_user_friends, get_friendship
from app.models import Message, User, Friend, UserPhoto

router = APIRouter()


class GetFriendPublic(BaseModel):
    tag: str
    photos: list[str]
    streak: int
    unseen_by_friend: int


class GetFriendsPublic(BaseModel):
    friends: list[GetFriendPublic]


@router.get("/", response_model=GetFriendsPublic)
def get_friends(session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100, q: str = None) -> GetFriendsPublic:
    """
    Retrieve friends.
    """

    friends = get_user_friends(session=session, user=current_user)
    friends_filtered = []

    # TODO zrobic to w jednym zapytaniu

    for friend in friends:
        if friend.user_1_id == current_user.id:
            statement = select(User).where(User.id == friend.user_2_id)
        else:
            statement = select(User).where(User.id == friend.user_1_id)
        friend_user = session.exec(statement).first()
        # get photos
        statement = select(UserPhoto).where(UserPhoto.sender_id == friend_user.id).where(UserPhoto.recipient_id == current_user.id).where(UserPhoto.seen == False)
        photos = session.exec(statement).all()
        photo_sources = []
        for photo in photos:
            photo_sources.append(photo.photo.source)

        unseen_by_friend_statement = select(UserPhoto).where(UserPhoto.sender_id == current_user.id).where(UserPhoto.recipient_id == friend_user.id).where(UserPhoto.seen == False)
        unseen_by_friend = len(session.exec(unseen_by_friend_statement).all())
        friends_filtered.append(GetFriendPublic(tag=friend_user.tag, photos=photo_sources, streak=friend.streak, unseen_by_friend=unseen_by_friend))

    return GetFriendsPublic(friends=friends_filtered)


class DiscoverFriendsPublic(BaseModel):
    friends: list[str]


@router.get("/discover", response_model=DiscoverFriendsPublic)
def discover_friends(session: SessionDep, current_user: CurrentUser, q: str) -> DiscoverFriendsPublic:
    """
    Retrieve friends.
    """
    friends = get_user_friends(session=session, user=current_user, accepted=None)

    friends_ids = [f.user_1_id if f.user_1_id != current_user.id else f.user_2_id for f in friends]
    friends_ids = list(set(friends_ids))

    statement = select(User).where(User.id != current_user.id).where(col(User.id).notin_(friends_ids)).where(col(User.tag).ilike(f"%{q}%"))
    friends = session.exec(statement).all()

    return DiscoverFriendsPublic(friends=[friend.tag for friend in friends])


@router.get("/pending", response_model=DiscoverFriendsPublic)
def get_pending_friends(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100, q: str = None) -> Any:
    """
    Retrieve friends.
    """
    friends = get_user_friends(session=session, user=current_user, accepted=False)
    friends_filtered = []

    for friend in friends:
        if friend.user_1_id == current_user.id:
            statement = select(User).where(User.id == friend.user_2_id)
        else:
            statement = select(User).where(User.id == friend.user_1_id)
        friend = session.exec(statement).first()
        friends_filtered.append(friend.tag)

    return DiscoverFriendsPublic(friends=friends_filtered)


@router.post("/invite/{tag}", response_model=Message)
def invite_friend(*, session: SessionDep, current_user: CurrentUser, tag: str) -> Any:
    statement = select(User).where(User.tag == tag)
    potential_friend = session.exec(statement).first()

    # create a friendship
    friendship = Friend(user_1_id=current_user.id, user_2_id=potential_friend.id, invited_by=current_user.id)
    session.add(friendship)
    session.commit()
    session.refresh(friendship)
    return Message(message="Friend invited")


@router.post("/pending/accept/{tag}", response_model=Message)
def accept_friend(*, session: SessionDep, current_user: CurrentUser, tag: str) -> Any:
    friendship = get_friendship(session=session, user1=current_user, user2=tag)

    if not friendship:
        raise HTTPException(status_code=404, detail="Friendship not found")

    friendship.accepted = True
    session.add(friendship)
    session.commit()

    return Message(message="Friend accepted")


@router.post("/pending/decline/{tag}", response_model=Message)
def decline_friend(*, session: SessionDep, current_user: CurrentUser, tag: str) -> Any:
    friendship = get_friendship(session=session, user1=current_user, user2=tag)

    if not friendship:
        raise HTTPException(status_code=404, detail="Friendship not found")

    session.delete(friendship)
    session.commit()

    return Message(message="Friend declined")

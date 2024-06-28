from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlmodel import func, select, or_

from app.api.deps import CurrentUser, SessionDep
from app.models import Message, User, Friend, UserPhoto

router = APIRouter()


# GET friends (wszysyc znajomi)
# GET friends (with string search by tag) (bez friends, jesli podano pole search)
# GET friends/pending (zaproszenia do znajomych)
# POST friends/invite/{tag} (zaproszenie do znajomych) // delete on reject
# POST friends/accept/{tag} (akceptacja zaproszenia do znajomych)
# POST friends/reject/{tag} (akceptacja zaproszenia do znajomych)


class GetFriendPublic(BaseModel):
    tag: str
    photos: list[str]
    streak: int
    unseen_by_friend: int


class GetFriendsPublic(BaseModel):
    friends: list[GetFriendPublic]


@router.get("/", response_model=GetFriendsPublic)
def get_friends(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100, q: str = None) -> Any:
    """
    Retrieve friends.
    """

    statement = select(Friend).where(or_(Friend.user_1_id == current_user.id, Friend.user_2_id == current_user.id)).where(Friend.accepted == True)

    friends = session.exec(statement).all()

    friends_filtered = []

    # TODO wyjebane jajca z tymi ifami i selectami - zrobic to w jednym zapytaniu

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


@router.get("/discover", response_model=GetFriendsPublic)
def discover_friends(
    session: SessionDep, current_user: CurrentUser, q: str) -> Any:
    """
    Retrieve friends.
    """
    # search users with tag like q if q is not None
    statement = select(User).where(User.id != current_user.id).where(User.tag.like(f"%{q}%"))

    friends = session.exec(statement).all()
    return GetFriendsPublic(friends=[friend.tag for friend in friends])


@router.get("/pending", response_model=GetFriendsPublic)
def get_pending_friends(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100, q: str = None) -> Any:
    """
    Retrieve friends.
    """

    statement = select(Friend).where(or_(Friend.user_1_id == current_user.id, Friend.user_2_id == current_user.id)).where(Friend.accepted == False).where(Friend.invited_by != current_user.id)

    friends = session.exec(statement).all()

    friends_filtered = []

    # TODO wyjebane jajca z tymi ifami i selectami - zrobic to w jednym zapytaniu
    # TODO powtaraza sie

    for friend in friends:
        if friend.user_1_id == current_user.id:
            statement = select(User).where(User.id == friend.user_2_id)
        else:
            statement = select(User).where(User.id == friend.user_1_id)
        friend = session.exec(statement).first()
        friends_filtered.append(friend.tag)

    return GetFriendsPublic(friends=friends_filtered)

@router.post("/invite/{tag}", response_model=None)
def invite_friend(*, session: SessionDep, current_user: CurrentUser, tag: str) -> Any:
    statement = select(User).where(User.tag == tag)
    poetential_friend = session.exec(statement).first()

    # TODO handle errors, handle primary key errors

    # create a friendship
    friendship = Friend(user_1_id=current_user.id, user_2_id=poetential_friend.id, invited_by=current_user.id)
    session.add(friendship)
    session.commit()
    session.refresh(friendship)
    return None


@router.post("/pending/accept/{tag}", response_model=None)
def accept_friend(*, session: SessionDep, current_user: CurrentUser, tag: str) -> Any:
    second_user = session.exec(select(User).where(User.tag == tag)).first()

    statement1 = select(Friend).where(Friend.user_1_id == second_user.id).where(Friend.user_2_id == current_user.id)
    statement2 = select(Friend).where(Friend.user_2_id == second_user.id).where(Friend.user_1_id == current_user.id)

    friendship = session.exec(statement1).first()
    if not friendship:
        friendship = session.exec(statement2).first()

    if not friendship:
        raise HTTPException(status_code=404, detail="Friendship not found")

    friendship.accepted = True
    session.add(friendship)
    session.commit()

    return None

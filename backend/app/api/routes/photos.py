from typing import Any

from fastapi import APIRouter, UploadFile, HTTPException
from pydantic import BaseModel
from sqlmodel import Field, SQLModel, select

from app.api.deps import CurrentUser, SessionDep
from app.core.config import settings
from app.interfaces.files import OnDiskFileStorage
from app.models import Photo, UserPhoto, User

router = APIRouter()

# zdjecia
# POST photos
# GET photos (lista ID zdjec po czasie dodania)
# GET photos/{id}


# server side events?

class CreatePhoto(SQLModel):
    friends: str = Field(min_length=1, max_length=255)


class CreatePhotoResponse(BaseModel):
    id: int


@router.post("/", response_model=None)
def create_photo(*, session: SessionDep, current_user: CurrentUser, photo: UploadFile, friends: str) -> Any:
    """
    Create new item.
    """

    try:
        friends = [f.strip() for f in friends.split(",")]
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid friends")

    # TODO transaction for creating the records

    file_storage = OnDiskFileStorage()
    filename = file_storage.save(photo.file.read())

    photo_db = Photo(source=filename)
    session.add(photo_db)
    session.commit()

    for friend in friends:
        # TODO what to do in case of non existing friend?
        # TODO check if the friend is already a friend, if not then dont create UserPhoto for this user
        user_st = select(User).where(User.tag == friend)
        user = session.exec(user_st).first()
        statement = UserPhoto(user_id=user.id, photo_id=photo_db.id)
        session.add(statement)

    session.commit()

    return CreatePhotoResponse(id=0)


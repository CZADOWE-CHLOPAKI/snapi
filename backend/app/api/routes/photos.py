from typing import Any

from fastapi import APIRouter, UploadFile, HTTPException, Form
from pydantic import BaseModel
from sqlmodel import Field, SQLModel, select

from app.api.deps import CurrentUser, SessionDep
from app.interfaces.files import OnDiskImageStorage
from app.models import Photo, UserPhoto, User

router = APIRouter()

# zdjecia
# POST photos
# GET photos (lista ID zdjec po czasie dodania)
# GET photos/{id}


# server side events?

class CreatePhoto(BaseModel):
    friends: list[str]
    photob64: str


class CreatePhotoResponse(BaseModel):
    id: int
    filename: str


@router.post("/", response_model=None)
def create_photo(*, session: SessionDep, current_user: CurrentUser, data: CreatePhoto) -> Any:
    """
    Create new item.
    """

    friends = data.friends
    photob64 = data.photob64
    # TODO transaction for creating the records

    image_storage = OnDiskImageStorage()
    filename = image_storage.save(photob64)

    photo_db = Photo(source=filename)
    session.add(photo_db)
    session.commit()

    for friend in friends:
        # TODO what to do in case of non existing friend?
        # TODO check if the friend is already a friend, if not then dont create UserPhoto for this user
        user_st = select(User).where(User.tag == friend)
        user = session.exec(user_st).first()
        if user is None:
            raise HTTPException(status_code=400, detail="Invalid friend")
        statement = UserPhoto(sender_id=current_user.id, recipient_id=user.id, photo_id=photo_db.id)
        session.add(statement)

    session.commit()

    return CreatePhotoResponse(id=0, filename=filename)

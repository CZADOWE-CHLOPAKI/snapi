from typing import Any

from app.api.deps import CurrentUser, SessionDep
from app.interfaces.files import OnDiskImageStorage
from app.models import Photo, User, UserPhoto
from fastapi import APIRouter, Form, HTTPException, UploadFile
from pydantic import BaseModel
from sqlmodel import Field, SQLModel, select

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
    filename: str


@router.post("/", response_model=None)
def create_photo(*, session: SessionDep, current_user: CurrentUser, photo: UploadFile) -> Any:
    """
    Create new item.
    """

    # TODO transaction for creating the records

    image_storage = OnDiskImageStorage()
    filename = image_storage.save(photo.file)

    photo_db = Photo(source=filename)
    session.add(photo_db)
    session.commit()

    session.commit()

    return CreatePhotoResponse(id=0, filename=filename)

import logging
from typing import Any

from fastapi import APIRouter, UploadFile, HTTPException, Form
from pydantic import BaseModel
from sqlmodel import Field, SQLModel, select

from app.api.deps import CurrentUser, SessionDep
from app.interfaces.files import OnDiskImageStorage
from app.models import Photo, UserPhoto, User

router = APIRouter()

logger = logging.getLogger(__name__)


class CreatePhoto(BaseModel):
    friends: list[str]
    photob64: str


class CreatePhotoResponse(BaseModel):
    id: int
    filename: str


@router.post("/", response_model=None)
def create_photo(*, session: SessionDep, current_user: CurrentUser, data: CreatePhoto) -> Any:
    """
    Create new photo.
    """

    friends = data.friends
    photob64 = data.photob64
    # TODO transaction for creating the records

    image_storage = OnDiskImageStorage()
    try:
        filename = image_storage.save(photob64)
    except OnDiskImageStorage.FileStorageException:
        raise HTTPException(status_code=400, detail="Invalid image")
    except Exception as e:
        logger.exception('Unexpected error while saving image')
        raise HTTPException(status_code=400, detail="Unexpected error while saving image")

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


class AcknowledgePhoto(BaseModel):
    photo_id: str


@router.post("/acknowledge/{photo_id}", response_model=None)
def acknowledge_photo(*, session: SessionDep, current_user: CurrentUser, photo_id: str) -> Any:
    """
    Acknowledge photo.
    """
    photo_st = select(Photo).where(Photo.source == photo_id)
    photo = session.exec(photo_st).first()
    if photo is None:
        raise HTTPException(status_code=400, detail="Photo not found")

    statement = select(UserPhoto).where(UserPhoto.recipient_id == current_user.id).where(UserPhoto.photo_id == photo.id)
    user_photo = session.exec(statement).first()
    if user_photo is None:
        raise HTTPException(status_code=400, detail="Photo not found")

    user_photo.seen = True
    session.add(user_photo)
    session.commit()

    return AcknowledgePhoto(photo_id=photo_id)

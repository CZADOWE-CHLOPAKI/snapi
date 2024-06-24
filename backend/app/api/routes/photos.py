from typing import Any

from fastapi import APIRouter, HTTPException, UploadFile
from sqlmodel import func, select, SQLModel

from app.api.deps import CurrentUser, SessionDep

router = APIRouter()

# zdjecia
# POST photos
# GET photos (lista ID zdjec po czasie dodania)
# GET photos/{id}


# server side events?

class CreatePhoto(SQLModel):
    friends: list[str] = []
    photo: UploadFile | None = None


class CreatePhotoResponse(SQLModel):
    id: int


@router.post("/", response_model=CreatePhotoResponse)
def create_photo(
    *, session: SessionDep, current_user: CurrentUser, photo: UploadFile | None = None,friends: list[str] = []
) -> Any:
    """
    Create new item.
    """

    # print(data_in.friends)
    return 0


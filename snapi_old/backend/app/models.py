from pydantic import EmailStr, BaseModel
from sqlmodel import Field, Relationship, SQLModel


# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    # TODO REMOVE
    full_name: str | None = Field(default=None, max_length=255)
    tag: str = Field(max_length=255, unique=True)





# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    tag: str = Field(max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str
    items: list["Item"] = Relationship(back_populates="owner")
    user_photos: list["UserPhoto"] = Relationship(back_populates="user")


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: int


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# Shared properties
class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


# Properties to receive on item creation
class ItemCreate(ItemBase):
    title: str = Field(min_length=1, max_length=255)


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(max_length=255)
    owner_id: int | None = Field(default=None, foreign_key="user.id", nullable=False)
    owner: User | None = Relationship(back_populates="items")


# Properties to return via API, id is always required
class ItemPublic(ItemBase):
    id: int
    owner_id: int


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: int | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)


class FriendBase(SQLModel):
    user_1_id: int = Field(foreign_key="user.id", primary_key=True)
    user_2_id: int = Field(foreign_key="user.id", primary_key=True)
    accepted: bool = False
    invited_by: int = Field(foreign_key="user.id")
    streak: int = 0


class FriendCreate(FriendBase):
    user_1_id: int
    user_2_id: int
    invited_by: int


class Friend(FriendBase, table=True):
    pass


class GetFriendsPublic(BaseModel):
    friends: list[str]


## PHOTOS ----------------------------
# TODO divide the file you lazy fuck

class Photo(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    source_type: int = 0
    source: str = Field(max_length=512, unique=True)
    user_photos: list["UserPhoto"] = Relationship(back_populates="photo")



# Shared properties
class UserPhotoBase(SQLModel):
    seen: bool = False


# Properties to receive on item creation
class UserPhotoCreate(UserPhotoBase):
    user_tag: str = Field(max_length=255)


# Properties to receive on item update
class UserPhotoUpdate(UserPhotoBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class UserPhoto(UserPhotoBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    seen: bool = False

    user: User | None = Relationship(back_populates="user_photos")
    user_id: int | None = Field(default=None, foreign_key="user.id", nullable=False)

    photo: Photo | None = Relationship(back_populates="user_photos")
    photo_id: int | None = Field(default=None, foreign_key="photo.id", nullable=False)

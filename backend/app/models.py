from pydantic import EmailStr
from sqlalchemy.orm import relationship
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
    # sender_photos: list["UserPhoto"] = Relationship(back_populates="sender")
    # sender_photos: list["UserPhoto"] = Relationship(back_populates="sender", sa_relationship_kwargs=dict(foreign_keys="[UserPhoto.sender_id]"))
    # recipient_photos: list["UserPhoto"] = Relationship(back_populates="recipient", sa_relationship_kwargs=dict(foreign_keys="[UserPhoto.recipient_id]"))
    # recipient_photos: list["UserPhoto"] = Relationship(back_populates="recipient")
    push_tokens: list["PushToken"] = Relationship(back_populates="user")



# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: int


class UsersPublic(SQLModel):
    data: list[UserPublic]
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


class UserPhotoCreate(UserPhotoBase):
    user_tag: str = Field(max_length=255)


class UserPhotoUpdate(UserPhotoBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class UserPhoto(UserPhotoBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    seen: bool = False

    # recipient: User | None = Relationship(back_populates="recipient_photos")
    # recipient: User | None = Relationship(sa_relationship_kwargs=dict(foreign_keys="[User.recipient_photos]"))
    recipient_id: int | None = Field(default=None, foreign_key="user.id", nullable=False)

    # sender: User | None = Relationship(back_populates="sender_photos")
    # sender: User | None = Relationship(sa_relationship_kwargs=dict(foreign_keys="[User.sender_photos]"))
    sender_id: int | None = Field(default=None, foreign_key="user.id", nullable=False)

    photo: Photo | None = Relationship(back_populates="user_photos")
    photo_id: int | None = Field(default=None, foreign_key="photo.id", nullable=False)


class PushToken(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    token: str = Field(max_length=255)
    active: bool = True
    user_id: int = Field(foreign_key="user.id")
    user: User | None = Relationship(back_populates="push_tokens")

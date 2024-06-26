import abc
import uuid
from pathlib import Path
from typing import BinaryIO

from PIL import Image

from app.core.config import settings


class FileStorage:

    class FileStorageException(Exception):
        pass

    @abc.abstractmethod
    def save(self, file: bytes) -> str:
        raise NotImplementedError()

    @abc.abstractmethod
    def get(self, filename) -> bytes:
        raise NotImplementedError()

    @abc.abstractmethod
    def delete(self, filename):
        raise NotImplementedError()

    @staticmethod
    def _generate_unique_filename():
        return str(uuid.uuid4())


class OnDiskImageStorage(FileStorage):
    def save(self, file: BinaryIO):
        filename = f'{self._generate_unique_filename()}.jpg'
        filepath = Path(settings.FILE_STORAGE_PATH) / filename

        try:
            # TODO might wanna check that the file is actually an image
            im = Image.open(file)
            rgb_im = im.convert('RGB')
            rgb_im.save(filepath)
        except Exception as e:
            raise self.FileStorageException from e

        return filename

    def get(self, filename):
        filepath = Path(settings.FILE_STORAGE_PATH) / filename

        try:
            with open(filepath, "rb") as f:
                return f.read()
        except Exception as e:
            raise self.FileStorageException from e

    def delete(self, filename):
        filepath = Path(settings.FILE_STORAGE_PATH) / filename

        try:
            filepath.unlink()
        except Exception as e:
            raise self.FileStorageException from e

    def __repr__(self):
        return f"<{self.__class__.__name__} path={settings.FILE_STORAGE_PATH}>"
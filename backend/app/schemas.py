from pydantic import BaseModel, typing, Json
from typing import Annotated, List, Dict
from fastapi import UploadFile, File
from typing import Any



class VersionBase(BaseModel):
    name: typing.Optional[str]
    description: typing.Optional[str]

    class Config:
        orm_mode = True


class VersionCreate(VersionBase):
    parentid: typing.Optional[str]


class Version(VersionCreate):
    id: str



class RootBase(BaseModel):
    name: str
    description: typing.Optional[str]
    
    class Config:
        orm_mode = True


class RootMinimal(RootBase):
    id: str


class RootComplete(RootMinimal):
    versions: List[Version]
    folderstructure: str
    files: List[bytes]


class RootCreate(RootBase):        
    folderstructure: str    

    
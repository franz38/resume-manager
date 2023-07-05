from pydantic import BaseModel, typing
from typing import Annotated, List, Dict
from fastapi import UploadFile, File



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
    folderstructure: Dict
    files: List[bytes]


class RootCreate(RootBase):        
    folderstructure: Dict
    

    
from sqlalchemy.orm import Session
from schemas import VersionCreate, RootCreate, RootComplete
from utils.create_id import create_id
import models
from typing import List
import json

def commit(version: VersionCreate, db: Session):
    
    id = create_id(version.name, version.description)
    parentVersion = db.query(models.Version).filter(models.Version.id == version.parentid).first()

    db_version = models.Version(
        id=id, 
        parentid=version.parentid,
        resumeid=parentVersion.resumeid,
        tier=parentVersion.tier + 1, 
        name=version.name, 
        description=version.description
    )

    db.add(db_version)
    db.commit()
    db.refresh(db_version)

    return db_version



def initialize(root: RootCreate, files: List[bytes], db: Session) -> RootComplete:
    
    id = create_id(root.name, root.description)

    file_models = [models.FileData(data=file) for file in files]

    # new resume
    db_resume = models.Root(
        id = id,
        name = root.name,
        description = root.description,
        folderstructure = root.folderstructure,
        files=file_models
    )

    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)

    # initial version
    db_version = models.Version(
        id = id,
        resumeid = id,
        tier = 0, 
        name = root.name, 
        description = root.description,
    )

    db.add(db_version)
    db.commit()
    db.refresh(db_version)

    root_complete = RootComplete(
        id = db_resume.id,
        name = db_resume.name,
        description = db_resume.description,
        versions = db.query(models.FileData).filter(models.FileData.root_id == db_resume.id).all(),
        folderstructure = db_resume.folderstructure,
        files = []
    )

    return root_complete

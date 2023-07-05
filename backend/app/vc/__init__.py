from sqlalchemy.orm import Session
from schemas import VersionCreate, RootCreate
from utils.create_id import create_id
import models
from typing import List


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



def initialize(root: RootCreate, files: List[bytes], db: Session):
    
    id = create_id(root.name, root.description)

    # new resume
    db_resume = models.Root(
        id = id,
        name = root.name,
        description = root.description,
        folderstructure = root.folderstructure,
        data = root.files
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

    return db_resume
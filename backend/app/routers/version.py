from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models
from schemas.version import VersionCreate, Version
from utils.create_id import create_id


router = APIRouter()


@router.get("/versions/{resume_id}")
def get_version(resume_id: str, db: Session = Depends(get_db)) -> List[Version]:
    return db.query(models.Version).filter(models.Version.resumeid == resume_id).all()


@router.delete("/versions/{version_id}")
def delete_version(version_id: str, db: Session = Depends(get_db)):
    db.query(models.Version).filter(models.Version.id == version_id).delete()
    db.commit()


@router.post("/versions/")
def post_version(version: VersionCreate, db: Session = Depends(get_db)) -> Version:

    tier = 0
    if version.parentid:
        tier = 1
    
    id = create_id(version)
    parentVersion = db.query(models.Version).filter(models.Version.id == version.parentid).first()

    db_version = models.Version(
        id=id, 
        parentid=version.parentid,
        resumeid=parentVersion.resumeid,
        tier=tier, 
        name=version.name, 
        description=version.description
        )
    db.add(db_version)
    db.commit()
    db.refresh(db_version)
    return db_version



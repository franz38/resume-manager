from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models
from schemas.version import Resume, VersionInitialize, Version
from utils.create_id import create_id


router = APIRouter()

@router.get("/resumes/")
def get_resumes(db: Session = Depends(get_db)) -> List[Resume]:
    return db.query(models.Resume).all()


@router.delete("/resumes/{resume_id}")
def get_resumes(resume_id: str, db: Session = Depends(get_db)):
    db.query(models.Version).filter(models.Version.resumeid == resume_id).delete()
    db.query(models.Resume).filter(models.Resume.id == resume_id).delete()
    db.commit()


@router.post("/resumes/")
def post_resume(version: VersionInitialize, db: Session = Depends(get_db)) -> Version:

    id = create_id(version)   

    db_resume = models.Resume(
        id = id
    )

    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)

    db_version = models.Version(
        id = id,
        resumeid = id,
        tier = 0, 
        name = version.name, 
        description = version.description,
        folderstructure = version.folderstructure
    )

    db.add(db_version)
    db.commit()
    db.refresh(db_version)

    return db_version

@router.get("/resumes/{resume_id}")
def get_resumes(resume_id: str, db: Session = Depends(get_db)) -> Resume:
    return db.query(models.Resume).filter(models.Resume.id == resume_id).first()


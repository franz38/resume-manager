from typing import List
from fastapi import APIRouter, Depends, File, Form, Depends, UploadFile
from sqlalchemy.orm import Session
from database import get_db
import models
from schemas import VersionCreate, Version, RootCreate, RootBase
from utils.create_id import create_id
import vc
from schemas import RootCreate, Version

router = APIRouter()


@router.get("/versions/{resume_id}", tags=["Versions"])
def get_version(resume_id: str, db: Session = Depends(get_db)) -> List[Version]:
    return db.query(models.Version).filter(models.Version.resumeid == resume_id).all()


@router.delete("/versions/{version_id}", tags=["Versions"])
def delete_version(version_id: str, db: Session = Depends(get_db)):
    db.query(models.Version).filter(models.Version.id == version_id).delete()
    db.commit()


@router.post("/versions/", tags=["Versions"])
def post_version(version: VersionCreate, db: Session = Depends(get_db)) -> Version:

    return vc.commit(version, db)


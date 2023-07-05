from typing import List
from fastapi import APIRouter, Depends, File, Form, Depends, UploadFile
from sqlalchemy.orm import Session
from database import get_db
import models
from schemas import VersionCreate, RootCreate, RootMinimal, RootComplete
from utils.create_id import create_id
import vc
from schemas import RootCreate, Version

router = APIRouter()


@router.get("/roots/", tags=["Root"])
def get_resumes(db: Session = Depends(get_db)) -> List[RootMinimal]:

    return db.query(models.Root).all()


@router.get("/roots/{root_id}", tags=["Root"])
def get_resumes(root_id: str, db: Session = Depends(get_db)) -> RootComplete:
    
    resume_db = db.query(models.Root).filter(models.Root.id == root_id).first()
    print(resume_db)
    # versions = db.query(models.Version).filter(models.Version.resumeid == resume_db.id).all()
    resume = RootComplete(id="resume_db.id", versions=[])
    return resume


@router.delete("/roots/{root_id}", tags=["Root"])
def get_resumes(root_id: str, db: Session = Depends(get_db)):

    db.query(models.Root).filter(models.Root.id == root_id).delete()
    db.commit()


@router.post("/roots/", tags=["Root"])
def post_resume(root_: RootCreate = Form(...), files: List[UploadFile]= File(...), db: Session = Depends(get_db)) -> RootCreate:

    file_list = []
    for file in files:
        file.seek(0)
        file_list.append(file.file.read())
    

    # version_complete = VersionCreate(**root_.dict())
    # version_complete.files = file_list
    # return vc.initialize(root_, file_list, db)

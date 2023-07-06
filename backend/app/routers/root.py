from typing import List, Annotated
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
    
    root_db = db.query(models.Root).filter(models.Root.id == root_id).first()
    print(root_db)
    # versions = db.query(models.Version).filter(models.Version.resumeid == resume_db.id).all()
    # resume = RootComplete(id="resume_db.id", versions=[])
    rc = RootComplete(
        name = root_db.name,
        description = root_db.description,
        id = root_db.id,
        versions = root_db.versions,
        folderstructure = root_db.folderstructure,
        files = []
    )
    return rc


@router.delete("/roots/{root_id}", tags=["Root"])
def get_resumes(root_id: str, db: Session = Depends(get_db)):

    db.query(models.Root).filter(models.Root.id == root_id).delete()
    db.commit()


@router.post("/roots/", tags=["Root"])
def post_resume(
    files: List[UploadFile] = File(...), 
    name: str = Form(...),
    folderstructure: str = Form(...),
    # files: List[UploadFile]= File(...),
    # root_: RootCreate = Form(...), 
    db: Session = Depends(get_db)
) -> RootComplete:

    # file_list = []
    # for file in files:
    #     file.seek(0)
    #     file_list.append(file.file.read())
    file_list = [file.file.read() for file in files]
    aaa = RootCreate(name=name, folderstructure=folderstructure)

    # version_complete = VersionCreate()
    # version_complete.files = file_list
    return vc.initialize(aaa, file_list, db)

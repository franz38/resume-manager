from sqlalchemy import Column, UnicodeText, ForeignKey, DateTime, JSON, String, Integer, LargeBinary, DateTime, func
from database import Base
from sqlalchemy.orm import mapped_column, Mapped, relationship, backref
from typing import Any, Dict


class FileData(Base):
    __tablename__ = "files_data"

    id = Column(Integer, primary_key=True)
    data = Column(LargeBinary)
    root_id = Column(String, ForeignKey('roots.id', ondelete="CASCADE"))


class Root(Base):
    __tablename__ = "roots"

    id = Column(String, primary_key=True)

    name = Column(String)
    description = Column(String, nullable=True)
    creation = Column(DateTime, default=func.now())
    folderstructure = Column(String)
    files = relationship(FileData)



class Version(Base):
    __tablename__ = "versions"
    __allow_unmapped__ = True

    id = Column(String, primary_key=True)
    parentid = Column(String, ForeignKey('versions.id'), nullable=True)
    resumeid = Column(String, ForeignKey('roots.id', ondelete="CASCADE"))

    name = Column(String, nullable=True)
    description = Column(String, nullable=True)
    tier = Column(Integer)

    resume = relationship('Root', backref=backref('versions', passive_deletes=True))
    

# Version.__table__.drop(engine)

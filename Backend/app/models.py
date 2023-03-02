from .database import Base
from sqlalchemy import TIMESTAMP, Column, String, Boolean, Integer, UniqueConstraint
from sqlalchemy.sql import func


class Repositories(Base):
    __tablename__ = 'REPOSITORIES'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    repo_url = Column(String, nullable=False)
    size = Column(Integer, nullable=False)
    language = Column(String, nullable=True)
    user_id = Column(Integer, nullable=False)
    __table_args__ = (UniqueConstraint('repo_url', name='uix_1'),)


class Users(Base):
    __tablename__ = 'USERS'
    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False)
    profile_link = Column(String, nullable=False)
    __table_args__ = (UniqueConstraint('username', name='uix_1'),)

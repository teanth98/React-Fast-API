from . import models
from sqlalchemy.orm import Session
from sqlalchemy import exc
from fastapi import Depends, APIRouter
from .database import get_db
import requests
router = APIRouter()


# Filter Users
@router.get('/', include_in_schema=False)
def get_users(db: Session = Depends(get_db), limit: int = 10, page: int = 1, search: str = ''):
    skip = (page - 1) * limit
    users = db.query(models.Users).filter(
        models.Users.username.contains(search)).limit(limit).offset(skip).all()
    return {'status': 'success', 'results': len(users), 'usernames': users}


# Get Repos
@router.get('/repos')
def get_repos(db: Session = Depends(get_db), limit: int = 10, page: int = 1, search: str = ''):
    skip = (page - 1) * limit
    repos = db.query(models.Repositories).filter(
        models.Repositories.user_id == int(search)).limit(limit).offset(skip).all()
    return {'status': 'success', 'results': len(repos), 'repositories': repos}


# Get User Details
@router.get('/user-details', include_in_schema=False)
def get_users(db: Session = Depends(get_db), search: str = ''):
    user_info = db.query(models.Users).filter(
        models.Users.id.contains(search)).all()
    return {'status': 'success', 'userinfo': user_info}


# Store User Repository
@router.post("/repositories")
def store_github_repositories(usernames: list, db: Session = Depends(get_db)):
    no_user = []
    for username in usernames:
        user_response = requests.get(
            f"https://api.github.com/users/{username}")
        user_data = user_response.json()
        if "message" in user_data:
            # If user does not exist
            if user_data["message"] == "Not Found":
                no_user.append(username)
                continue
            elif user_response.status_code == 403:
                return {"message": user_data["message"]}
        try:
            new_user = models.Users(
                id=user_data["id"], username=user_data["login"], profile_link=user_data["html_url"])
            db.add(new_user)
            db.commit()
        except exc.IntegrityError:
            db.rollback()
        repos_response = requests.get(
            f"https://api.github.com/users/{username}/repos")
        repos_data = repos_response.json()
        for repo_data in repos_data:
            try:
                new_repo = models.Repositories(id=repo_data["id"], name=repo_data["name"], repo_url=repo_data["html_url"],
                                               size=repo_data["size"], language=repo_data["language"], user_id=user_data['id'])
                db.add(new_repo)
                db.commit()
            except exc.IntegrityError:
                db.rollback()

    if no_user:
        return {"message": f"The following users do not exist {no_user}"}
    return {"message": "GitHub repositories stored successfully"}

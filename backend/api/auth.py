from fastapi import APIRouter
from fastapi import Response
from fastapi import Request
from pydantic import BaseModel

from backend.auth.login import verify_admin
from backend.auth.session import (
    create_session,
    is_logged_in,
    logout,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
def login(data: LoginRequest, response: Response):

    if not verify_admin(data.username, data.password):
        return {
            "success": False,
            "message": "Invalid Username or Password"
        }

    session_id = create_session()

    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
    )

    return {
        "success": True,
        "message": "Login Successful"
    }


@router.post("/logout")
def user_logout(request: Request):

    session_id = request.cookies.get("session_id")

    if session_id:
        logout(session_id)

    return {
        "success": True,
        "message": "Logged Out"
    }


@router.get("/status")
def status(request: Request):

    session_id = request.cookies.get("session_id")

    return {
        "logged_in": is_logged_in(session_id)
    }
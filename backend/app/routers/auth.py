from datetime import timedelta
from fastapi import APIRouter, HTTPException, Request, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from app import auth_utils


router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
async def login(login_data: LoginRequest, response: Response):
    """
    Endpoint to handle user login.
    This is a placeholder and should be replaced with actual authentication logic.
    """
    from app.main import db

    if not db.authenticate_user(login_data.username, login_data.password):
        return JSONResponse(status_code=401, content={"message": "Invalid username or password"})

    access_token_expires = timedelta(minutes=auth_utils.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_utils.create_access_token(
        data={"sub": login_data.username},
        expires_delta=access_token_expires
    )

    response = JSONResponse(content={"message": "Login successful"})
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=auth_utils.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        secure=False,  # Set to True in production with HTTPS
        samesite="lax"
    )

    return response

@router.post("/logout")
async def admin_logout():
    """Admin logout endpoint."""
    response = JSONResponse(content={"message": "Logout successful"})
    response.delete_cookie(key="access_token")
    return response

@router.get("/verify")
async def verify_token(request: Request):
    """Verify admin token."""
    access_token = request.cookies.get("access_token")

    if not access_token or not auth_utils.verify_token(access_token):
        return JSONResponse(status_code=401, content={"message": "Invalid or expired token"})

    return {"message": "Token is valid"}
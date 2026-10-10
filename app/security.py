from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer


SECRET_KEY = "shopsense-secret-key-2026"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({
        "exp": expire
    })

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt


def verify_token(token: str):

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={
            "WWW-Authenticate": "Bearer"
        }
    )

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        email = payload.get("sub")
        user_id = payload.get("user_id")
        role = payload.get("role")

        if email is None or user_id is None or role is None:

            raise credentials_exception

        return {
            "email": email,
            "user_id": user_id,
            "role": role
        }

    except JWTError:

        raise credentials_exception


def get_current_user(
    token: str = Depends(oauth2_scheme)
):

    return verify_token(token)


def get_current_vendor(
    current_user: dict = Depends(get_current_user)
):

    if current_user["role"].lower() != "vendor":

        raise HTTPException(
            status_code=403,
            detail="Vendor access required"
        )

    return current_user


def get_current_admin(
    current_user: dict = Depends(get_current_user)
):

    if current_user["role"].lower() != "admin":

        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return current_user
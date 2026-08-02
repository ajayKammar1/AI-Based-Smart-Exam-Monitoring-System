from backend.config import ADMIN_USERNAME, ADMIN_PASSWORD


def verify_admin(username: str, password: str) -> bool:
    return (
        username == ADMIN_USERNAME
        and password == ADMIN_PASSWORD
    )
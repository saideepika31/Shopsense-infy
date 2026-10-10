from .database import SessionLocal
from .models import User
from .utils import hash_password


# =========================
# ADMIN CREDENTIALS
# =========================

ADMIN_EMAIL = "admin@shopsense.com"
ADMIN_PASSWORD = "Admin@123"


# =========================
# DATABASE
# =========================

db = SessionLocal()


try:

    # Check whether admin already exists
    admin = db.query(User).filter(
        User.email == ADMIN_EMAIL
    ).first()


    # =========================
    # CREATE ADMIN
    # =========================

    if admin is None:

        admin = User(
            email=ADMIN_EMAIL,
            password=hash_password(ADMIN_PASSWORD),
            role="Admin"
        )

        db.add(admin)
        db.commit()
        db.refresh(admin)

        print("\n================================")
        print("ADMIN ACCOUNT CREATED")
        print("================================")
        print("Email    :", ADMIN_EMAIL)
        print("Password :", ADMIN_PASSWORD)
        print("Role     :", "Admin")
        print("================================\n")


    # =========================
    # RESET EXISTING ADMIN
    # =========================

    else:

        admin.password = hash_password(ADMIN_PASSWORD)
        admin.role = "Admin"

        db.commit()

        print("\n================================")
        print("ADMIN ACCOUNT RESET")
        print("================================")
        print("Email    :", ADMIN_EMAIL)
        print("Password :", ADMIN_PASSWORD)
        print("Role     :", "Admin")
        print("================================\n")


finally:

    db.close()
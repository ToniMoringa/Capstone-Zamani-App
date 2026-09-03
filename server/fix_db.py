from app import create_app
from config import db
from sqlalchemy import text

app = create_app()

with app.app_context():
    # Drop ALL Phase 1/2 auth-related tables (clean slate for Phase 3)
    print("Dropping old tables...")
    db.session.execute(text("DROP TABLE IF EXISTS token_blocklist CASCADE;"))
    db.session.execute(text("DROP TABLE IF EXISTS users CASCADE;"))
    db.session.commit()
    print("✓ Old tables dropped")

    # Recreate with NEW Phase 3 schema
    print("Recreating tables with Phase 3 schema...")
    db.create_all()
    db.session.commit()
    print("✓ New tables created")

    # Verify
    from models import User, TokenBlocklist
    print(f"✓ User table has columns: {[c.name for c in User.__table__.columns]}")
    print(f"✓ TokenBlocklist table has columns: {[c.name for c in TokenBlocklist.__table__.columns]}")
    print("\n✅ DB FIX COMPLETE. You can now register/login.")
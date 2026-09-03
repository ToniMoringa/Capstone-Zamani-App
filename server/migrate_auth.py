from app import create_app
from config import db
from sqlalchemy import inspect, text

app = create_app()

with app.app_context():
    db.create_all()
    inspector = inspect(db.engine)

    if inspector.has_table("capsules"):
        columns = [column["name"] for column in inspector.get_columns("capsules")]
        if "user_id" not in columns:
            db.session.execute(
                text("ALTER TABLE capsules ADD COLUMN user_id INTEGER REFERENCES users(id);")
            )
            db.session.commit()
            print("Added user_id column to capsules table.")

    print("Auth migration complete.")
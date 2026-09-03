from datetime import datetime
from config import db


capsule_tags = db.Table(
    "capsule_tags",
    db.Column("capsule_id", db.Integer, db.ForeignKey("capsules.id"), primary_key=True),
    db.Column("tag_id", db.Integer, db.ForeignKey("tags.id"), primary_key=True),
)


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    capsules = db.relationship(
        "Capsule",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "created_at": self.created_at.isoformat(),
        }


class TokenBlocklist(db.Model):
    __tablename__ = "token_blocklist"

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Tag(db.Model):
    __tablename__ = "tags"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)


class Capsule(db.Model):
    __tablename__ = "capsules"

    id = db.Column(db.Integer, primary_key=True)

    date = db.Column(db.Date, nullable=False, index=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(20), nullable=False)
    image_url = db.Column(db.String(500), nullable=True)

    historical_content = db.Column(db.Boolean, default=False)
    personal_note = db.Column(db.Text, nullable=True)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)

    user = db.relationship("User", back_populates="capsules")

    tags = db.relationship(
        "Tag",
        secondary=capsule_tags,
        backref=db.backref("capsules", lazy="dynamic"),
    )

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "date": self.date.isoformat(),
            "title": self.title,
            "description": self.description,
            "category": self.category,
            "image_url": self.image_url,
            "historical_content": self.historical_content,
            "personal_note": self.personal_note,
            "user_id": self.user_id,
            "username": self.user.username if self.user else None,
            "tags": [tag.name for tag in self.tags],
            "created_at": self.created_at.isoformat(),
        }
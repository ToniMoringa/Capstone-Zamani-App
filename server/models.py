from datetime import datetime
from config import db

# Association table for Capsule 
capsule_tags = db.Table('capsule_tags',
    db.Column('capsule_id', db.Integer, db.ForeignKey('capsules.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id'), primary_key=True)
)

class Tag(db.Model):
    __tablename__ = 'tags'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)  # e.g., "politics", "sports", "music"

class Capsule(db.Model):
    __tablename__ = 'capsules'
    id = db.Column(db.Integer, primary_key=True)
    
    # Core Data Fields
    date = db.Column(db.Date, nullable=False, index=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(20), nullable=False)  # 'event', 'birth', 'death', 'personal_memory'
    image_url = db.Column(db.String(500), nullable=True)
    
    # Security & Ownership Separation
    historical_content = db.Column(db.Boolean, default=False)  # True = Admin curated (immutable)
    personal_note = db.Column(db.Text, nullable=True)          # User-owned (mutable)
    user_id = db.Column(db.Integer, nullable=True)             # NULL for history, INT for personal
    
    # Relationships
    tags = db.relationship('Tag', secondary=capsule_tags, backref=db.backref('capsules', lazy='dynamic'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date.isoformat(),
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'image_url': self.image_url,
            'historical_content': self.historical_content,
            'personal_note': self.personal_note,
            'user_id': self.user_id,
            'tags': [tag.name for tag in self.tags],
            'created_at': self.created_at.isoformat()
        }
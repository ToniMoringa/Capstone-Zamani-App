from flask import Flask, jsonify, request
from flask_cors import CORS
from config import init_db, db
from routes.capsules import capsules_bp
from routes.tags import tags_bp

def create_app():
    app = Flask(__name__)
    
    app.config['PREFERRED_URL_SCHEME'] = 'http'
    app.config['SERVER_NAME'] = None
    
    init_db(app)
    
    CORS(app, 
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
        
    app.register_blueprint(capsules_bp, url_prefix='/api/v1/capsules')
    app.register_blueprint(tags_bp, url_prefix='/api/v1/tags')
    
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'error': 'Resource not found'}), 404
        
    @app.errorhandler(500)
    def server_error(e):
        return jsonify({'error': 'Internal server error'}), 500
        
    @app.route('/api/health')
    def health_check():
        return jsonify({'status': 'ok', 'service': 'ZAMANI Phase 2 Backend'})
        
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='127.0.0.1')
```[cite: 9]

```python
import os
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'fallback-dev-key')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    FRONTEND_URL = os.getenv('FRONTEND_URL', '*')

db = SQLAlchemy()

def init_db(app):
    app.config.from_object(Config)
    db.init_app(app)
    
    with app.app_context():
        db.create_all()
```[cite: 10]

```python
from datetime import datetime
from config import db

capsule_tags = db.Table('capsule_tags',
    db.Column('capsule_id', db.Integer, db.ForeignKey('capsules.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id'), primary_key=True)
)

class Tag(db.Model):
    __tablename__ = 'tags'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

class Capsule(db.Model):
    __tablename__ = 'capsules'
    id = db.Column(db.Integer, primary_key=True)
    
    date = db.Column(db.Date, nullable=False, index=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(20), nullable=False)
    image_url = db.Column(db.String(500), nullable=True)
    
    historical_content = db.Column(db.Boolean, default=False)
    personal_note = db.Column(db.Text, nullable=True)
    user_id = db.Column(db.Integer, nullable=True)
    
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
```[cite: 11]

```python
from datetime import date
from config import db
from models import Capsule, Tag

KENYAN_BIRTHS = [
    {
        "date": date(1987, 6, 15),
        "title": "Bien-Aimé Baraza (Bien)",
        "description": "Lead vocalist of Sauti Sol; Grammy-nominated Afro-pop artist.",
        "category": "birth",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Bien_Aime_Baraza.jpg/440px-Bien_Aime_Baraza.jpg",
        "tags": ["music", "sauti sol"]
    },
    {
        "date": date(1984, 11, 5),
        "title": "Eliud Kipchoge",
        "description": "Marathon world record holder; first human to run sub-2-hour marathon.",
        "category": "birth",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Eliud_Kipchoge_2019.jpg/440px-Eliud_Kipchoge_2019.jpg",
        "tags": ["sports", "athletics"]
    },
    {
        "date": date(1994, 1, 10),
        "title": "Faith Kipyegon",
        "description": "Olympic gold medalist; 1500m world record holder.",
        "category": "birth",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Faith_Kipyegon_2022.jpg/440px-Faith_Kipyegon_2022.jpg",
        "tags": ["sports", "athletics"]
    }
]

HISTORICAL_EVENTS = [
    {
        "date": date(1963, 12, 12),
        "title": "Kenya Independence Day",
        "description": "Kenya gains full independence from British colonial rule.",
        "category": "event",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Kenya_Flag_Raising_1963.jpg/440px-Kenya_Flag_Raising_1963.jpg",
        "tags": ["politics", "independence"]
    },
    {
        "date": date(2024, 6, 25),
        "title": "Gen Z Protests Peak",
        "description": "Nationwide youth-led demonstrations against Finance Bill reach historic scale.",
        "category": "event",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Gen_Z_Protest_Nairobi_2024.jpg/440px-Gen_Z_Protest_Nairobi_2024.jpg",
        "tags": ["politics", "youth"]
    },
    {
        "date": date(1963, 6, 1),
        "title": "Madaraka Day",
        "description": "Kenya achieved internal self-government, transitioning from colonial rule.",
        "category": "event",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Kenya_Flag_Raising_1963.jpg/440px-Kenya_Flag_Raising_1963.jpg",
        "tags": ["politics", "independence"]
    },
    {
        "date": date(2010, 8, 27),
        "title": "New Constitution Promulgated",
        "description": "Kenya's new constitution was promulgated, introducing devolution and bill of rights.",
        "category": "event",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Kenya_Flag_Raising_1963.jpg/440px-Kenya_Flag_Raising_1963.jpg",
        "tags": ["politics", "constitution"]
    },
    {
        "date": date(1988, 9, 25),
        "title": "Douglas Wakiihuri Olympic Gold",
        "description": "Won Kenya's first Olympic marathon gold medal in Seoul.",
        "category": "birth",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Eliud_Kipchoge_2019.jpg/440px-Eliud_Kipchoge_2019.jpg",
        "tags": ["sports", "athletics"]
    },
    {
        "date": date(1998, 8, 7),
        "title": "US Embassy Bombing",
        "description": "Al-Qaeda bombed the US Embassy in Nairobi, killing 213 people.",
        "category": "event",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Gen_Z_Protest_Nairobi_2024.jpg/440px-Gen_Z_Protest_Nairobi_2024.jpg",
        "tags": ["security", "history"]
    },
    {
        "date": date(2017, 10, 16),
        "title": "SGR Launch",
        "description": "The Standard Gauge Railway between Mombasa and Nairobi officially launched.",
        "category": "event",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Gen_Z_Protest_Nairobi_2024.jpg/440px-Gen_Z_Protest_Nairobi_2024.jpg",
        "tags": ["infrastructure", "development"]
    }
]

def seed_database():
    tag_names = set()
    for entry in KENYAN_BIRTHS + HISTORICAL_EVENTS:
        tag_names.update(entry.get('tags', []))
    
    tags_map = {}
    for name in tag_names:
        tag = Tag.query.filter_by(name=name).first()
        if not tag:
            tag = Tag(name=name)
            db.session.add(tag)
        tags_map[name] = tag
    
    db.session.commit()
    
    for birth in KENYAN_BIRTHS:
        existing = Capsule.query.filter_by(date=birth['date'], title=birth['title']).first()
        if not existing:
            capsule = Capsule(
                date=birth['date'],
                title=birth['title'],
                description=birth['description'],
                category=birth['category'],
                image_url=birth['image_url'],
                historical_content=True
            )
            for tag_name in birth.get('tags', []):
                capsule.tags.append(tags_map[tag_name])
            db.session.add(capsule)
    
    for event in HISTORICAL_EVENTS:
        existing = Capsule.query.filter_by(date=event['date'], title=event['title']).first()
        if not existing:
            capsule = Capsule(
                date=event['date'],
                title=event['title'],
                description=event['description'],
                category=event['category'],
                image_url=event['image_url'],
                historical_content=True
            )
            for tag_name in event.get('tags', []):
                capsule.tags.append(tags_map[tag_name])
            db.session.add(capsule)
    
    db.session.commit()

if __name__ == '__main__':
    from app import create_app
    app = create_app()
    with app.app_context():
        seed_database()
```[cite: 12]

```python
from flask import Blueprint, request, jsonify
from datetime import date as dt_date
from config import db
from models import Capsule, Tag

capsules_bp = Blueprint('capsules', __name__)

@capsules_bp.route('/', methods=['GET'])
def get_capsules():
    date_filter = request.args.get('date')
    category_filter = request.args.get('category')
    query = Capsule.query
    if date_filter:
        try:
            target_date = dt_date.fromisoformat(date_filter)
            query = query.filter_by(date=target_date)
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
    if category_filter:
        query = query.filter_by(category=category_filter)
    capsules = query.all()
    return jsonify([c.to_dict() for c in capsules]), 200

@capsules_bp.route('/<int:id>', methods=['GET'])
def get_capsule(id):
    capsule = Capsule.query.get_or_404(id)
    return jsonify(capsule.to_dict()), 200

@capsules_bp.route('/', methods=['POST'])
def create_capsule():
    data = request.get_json()
    if not all(k in data for k in ['date', 'title', 'description']):
        return jsonify({'error': 'Missing required fields: date, title, description'}), 400
    try:
        target_date = dt_date.fromisoformat(data['date'])
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

    capsule = Capsule(
        date=target_date,
        title=data['title'],
        description=data['description'],
        category=data.get('category', 'personal_memory'),
        image_url=data.get('image_url'),
        personal_note=data.get('personal_note'),
        historical_content=False,
        user_id=data.get('user_id')
    )
    
    db.session.add(capsule)
    db.session.flush()
    
    if 'tags' in data and isinstance(data['tags'], list):
        for tag_name in data['tags']:
            tag = Tag.query.filter_by(name=tag_name).first()
            if not tag:
                tag = Tag(name=tag_name)
                db.session.add(tag)
            capsule.tags.append(tag)
    
    db.session.commit()
    return jsonify(capsule.to_dict()), 201

@capsules_bp.route('/<int:id>', methods=['PUT'])
def update_capsule(id):
    capsule = Capsule.query.get_or_404(id)
    data = request.get_json()
    if 'personal_note' in data:
        capsule.personal_note = data['personal_note']
    if 'title' in data:
        capsule.title = data['title']
    if 'description' in data:
        capsule.description = data['description']
    db.session.commit()
    return jsonify(capsule.to_dict()), 200

@capsules_bp.route('/<int:id>', methods=['DELETE'])
def delete_capsule(id):
    capsule = Capsule.query.get_or_404(id)
    db.session.delete(capsule)
    db.session.commit()
    return '', 204
```[cite: 13]

```python
from flask import Blueprint, request, jsonify
from config import db
from models import Tag

tags_bp = Blueprint('tags', __name__)

@tags_bp.route('/', methods=['GET', 'POST'])
def handle_tags():
    if request.method == 'POST':
        data = request.get_json()
        if not data or 'name' not in data:
            return jsonify({'error': 'Missing required field: name'}), 400
        
        existing = Tag.query.filter_by(name=data['name']).first()
        if existing:
            return jsonify({'id': existing.id, 'name': existing.name}), 200
        
        tag = Tag(name=data['name'])
        db.session.add(tag)
        db.session.commit()
        return jsonify({'id': tag.id, 'name': tag.name}), 201
    
    tags = Tag.query.all()
    return jsonify([{'id': t.id, 'name': t.name} for t in tags]), 200
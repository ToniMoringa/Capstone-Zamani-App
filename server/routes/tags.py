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
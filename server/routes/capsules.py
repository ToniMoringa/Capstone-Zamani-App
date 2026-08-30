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
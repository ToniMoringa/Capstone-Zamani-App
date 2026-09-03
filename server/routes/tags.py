from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from config import db
from models import Tag, capsule_tags


tags_bp = Blueprint("tags", __name__)


@tags_bp.route("/", methods=["GET"])
def get_tags():
    tags = Tag.query.order_by(Tag.name).all()
    return jsonify([{"id": tag.id, "name": tag.name} for tag in tags]), 200


@tags_bp.route("/", methods=["POST"])
@jwt_required()
def create_tag():
    data = request.get_json() or {}

    if not data or "name" not in data:
        return jsonify({"error": "Missing required field: name"}), 400

    name = data["name"].strip().lower()

    if not name:
        return jsonify({"error": "Tag name cannot be empty"}), 400

    existing = Tag.query.filter_by(name=name).first()

    if existing:
        return jsonify({"id": existing.id, "name": existing.name}), 200

    tag = Tag(name=name)
    db.session.add(tag)
    db.session.commit()

    return jsonify({"id": tag.id, "name": tag.name}), 201


@tags_bp.route("/<int:id>", methods=["GET"])
def get_tag(id):
    tag = Tag.query.get_or_404(id)
    return jsonify({"id": tag.id, "name": tag.name}), 200


@tags_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_tag(id):
    tag = Tag.query.get_or_404(id)
    data = request.get_json() or {}

    if "name" not in data:
        return jsonify({"error": "Missing required field: name"}), 400

    name = data["name"].strip().lower()

    if not name:
        return jsonify({"error": "Tag name cannot be empty"}), 400

    existing = Tag.query.filter(Tag.name == name, Tag.id != tag.id).first()

    if existing:
        return jsonify({"error": "Tag name already exists"}), 409

    tag.name = name
    db.session.commit()

    return jsonify({"id": tag.id, "name": tag.name}), 200


@tags_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_tag(id):
    tag = Tag.query.get_or_404(id)

    # Remove many-to-many relationships first
    db.session.execute(
        capsule_tags.delete().where(capsule_tags.c.tag_id == tag.id)
    )

    db.session.delete(tag)
    db.session.commit()

    return "", 204
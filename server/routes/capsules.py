from flask import Blueprint, request, jsonify
from datetime import date as dt_date
from flask_jwt_extended import jwt_required, get_jwt_identity

from config import db
from models import Capsule, Tag


capsules_bp = Blueprint("capsules", __name__)


def get_current_user_id():
    return int(get_jwt_identity())


@capsules_bp.route("/", methods=["GET"])
def get_capsules():
    date_filter = request.args.get("date")
    category_filter = request.args.get("category")

    query = Capsule.query

    # Public route should mainly expose historical/global curated capsules.
    # Personal capsules are protected and fetched from /mine.
    query = query.filter(
        db.or_(
            Capsule.historical_content.is_(True),
            Capsule.user_id.is_(None),
        )
    )

    if date_filter:
        try:
            target_date = dt_date.fromisoformat(date_filter)
            query = query.filter_by(date=target_date)
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    if category_filter:
        query = query.filter_by(category=category_filter)

    capsules = query.order_by(Capsule.date.desc()).all()

    return jsonify([capsule.to_dict() for capsule in capsules]), 200


@capsules_bp.route("/mine", methods=["GET"])
@jwt_required()
def get_my_capsules():
    user_id = get_current_user_id()

    capsules = (
        Capsule.query.filter_by(user_id=user_id)
        .order_by(Capsule.created_at.desc())
        .all()
    )

    return jsonify([capsule.to_dict() for capsule in capsules]), 200


@capsules_bp.route("/<int:id>", methods=["GET"])
def get_capsule(id):
    capsule = Capsule.query.get_or_404(id)
    return jsonify(capsule.to_dict()), 200


@capsules_bp.route("/", methods=["POST"])
@jwt_required()
def create_capsule():
    user_id = get_current_user_id()
    data = request.get_json() or {}

    if not all(key in data for key in ["date", "title", "description"]):
        return (
            jsonify({"error": "Missing required fields: date, title, description"}),
            400,
        )

    try:
        target_date = dt_date.fromisoformat(data["date"])
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    capsule = Capsule(
        date=target_date,
        title=data["title"],
        description=data["description"],
        category=data.get("category", "personal_memory"),
        image_url=data.get("image_url"),
        personal_note=data.get("personal_note"),
        historical_content=False,
        user_id=user_id,
    )

    db.session.add(capsule)
    db.session.flush()

    if "tags" in data and isinstance(data["tags"], list):
        for tag_name in data["tags"]:
            clean_name = tag_name.strip().lower()

            if not clean_name:
                continue

            tag = Tag.query.filter_by(name=clean_name).first()

            if not tag:
                tag = Tag(name=clean_name)
                db.session.add(tag)

            capsule.tags.append(tag)

    db.session.commit()

    return jsonify(capsule.to_dict()), 201


@capsules_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_capsule(id):
    user_id = get_current_user_id()
    capsule = Capsule.query.get_or_404(id)

    if capsule.historical_content:
        return jsonify({"error": "Historical capsules cannot be edited"}), 403

    if capsule.user_id != user_id:
        return jsonify({"error": "You can only edit your own capsules"}), 403

    data = request.get_json() or {}

    if "date" in data:
        try:
            capsule.date = dt_date.fromisoformat(data["date"])
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    if "title" in data:
        capsule.title = data["title"]

    if "description" in data:
        capsule.description = data["description"]

    if "personal_note" in data:
        capsule.personal_note = data["personal_note"]

    if "category" in data:
        capsule.category = data["category"]

    if "image_url" in data:
        capsule.image_url = data["image_url"]

    db.session.commit()

    return jsonify(capsule.to_dict()), 200


@capsules_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_capsule(id):
    user_id = get_current_user_id()
    capsule = Capsule.query.get_or_404(id)

    if capsule.historical_content:
        return jsonify({"error": "Historical capsules cannot be deleted"}), 403

    if capsule.user_id != user_id:
        return jsonify({"error": "You can only delete your own capsules"}), 403

    db.session.delete(capsule)
    db.session.commit()

    return "", 204
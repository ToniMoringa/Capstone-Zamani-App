from flask import Flask, jsonify
from flask_cors import CORS

from config import init_db, db
from extensions import bcrypt, jwt

# Import models FIRST so SQLAlchemy registers all tables
import models

from routes.auth import auth_bp
from routes.capsules import capsules_bp
from routes.tags import tags_bp

from seed import seed_database

def create_app():
    app = Flask(__name__)

    app.config["PREFERRED_URL_SCHEME"] = "http"
    app.config["SERVER_NAME"] = None

    init_db(app)

    bcrypt.init_app(app)
    jwt.init_app(app)

    # Create tables & seed within app context
    with app.app_context():
        try:
            db.create_all()
            seed_database()
        except Exception as e:
            db.session.rollback()
            print(f"Database initialization or seeding skipped/failed: {e}")

    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    )

    app.register_blueprint(auth_bp, url_prefix="/api/v1/auth")
    app.register_blueprint(capsules_bp, url_prefix="/api/v1/capsules")
    app.register_blueprint(tags_bp, url_prefix="/api/v1/tags")

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": "Internal server error"}), 500

    @app.route("/api/health")
    def health_check():
        return jsonify({"status": "ok", "service": "ZAMANI Phase 3 Backend"})

    # --- TEMPORARY REMOTE SEEDER (DELETE AFTER GRADING) ---
    @app.route('/api/seed-remote')
    def seed_remote():
        try:
            db.create_all()  # Creates User, TokenBlocklist, Capsules tables
            # Add user_id column if missing (Phase 3 migration)
            from sqlalchemy import text
            try:
                db.session.execute(text('ALTER TABLE capsules ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id)'))
                db.session.commit()
            except:
                db.session.rollback()

            seed_database()  # Seeds Kenyan history
            return jsonify({"status": "success", "message": "DB created and seeded!"})
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
    # -----------------------------------------------------

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000, host="127.0.0.1")
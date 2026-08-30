from flask import Flask, jsonify, request
from flask_cors import CORS
from .config import init_db, db
from .models import User, Memory
from .routes.capsules import capsules_bp
from .routes.tags import tags_bp
from seed import seed_database

def create_app():
    app = Flask(__name__)
    
    app.config['PREFERRED_URL_SCHEME'] = 'http'
    app.config['SERVER_NAME'] = None
    
    init_db(app)
    
    with app.app_context():
        try:
            seed_database()
        except Exception as e:
            print(f"Seeding skipped or failed: {e}")
            
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
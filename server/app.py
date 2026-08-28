# server/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from .config import init_db, db
from .routes.capsules import capsules_bp
from .routes.tags import tags_bp

def create_app():
    app = Flask(__name__)
    
    # CRITICAL FIX: Force HTTP scheme to prevent 308 redirects
    app.config['PREFERRED_URL_SCHEME'] = 'http'
    app.config['SERVER_NAME'] = None
    
    init_db(app)
    
    # HARDCODED CORS 
    # Using a list ensures both variants work during development
    CORS(app, 
        resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
        
    # Register Blueprints
    app.register_blueprint(capsules_bp, url_prefix='/api/v1/capsules')
    app.register_blueprint(tags_bp, url_prefix='/api/v1/tags')
    
    # Error Handlers
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'error': 'Resource not found'}), 404
        
    @app.errorhandler(500)
    def server_error(e):
        return jsonify({'error': 'Internal server error'}), 500
        
    # Health Check Endpoint
    @app.route('/api/health')
    def health_check():
        return jsonify({'status': 'ok', 'service': 'ZAMANI Phase 2 Backend'})
        
    return app

if __name__ == '__main__':
    app = create_app()
    #  Explicitly bind to HTTP only on 127.0.0.1
    app.run(debug=True, port=5000, host='127.0.0.1')
"""
Contact Manager API
Simple REST API for managing contacts with SQLite backend
"""

import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Import route blueprints
from routes.contacts import contacts_bp

app = Flask(__name__)

# Enable CORS for all API routes
CORS(app, resources={
    r"/api/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Register blueprints
app.register_blueprint(contacts_bp)


if __name__ == '__main__':
    from routes.contacts import init_db
    init_db()

    port = int(os.getenv('FLASK_PORT', 5000))
    debug = os.getenv('FLASK_ENV', 'development') == 'development'

    print(f'\n  ✅  Contact Manager API running at  http://localhost:{port}\n')
    app.run(debug=debug, port=port)

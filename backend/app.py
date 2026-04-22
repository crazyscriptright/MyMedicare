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

    port_env  = os.getenv('FLASK_PORT')
    env_env   = os.getenv('FLASK_ENV')

    if not port_env:
        print('[config] FLASK_PORT is not set in .env — falling back to 5000')
    if not env_env:
        print('[config] FLASK_ENV is not set in .env — falling back to development')

    port  = int(port_env or 5000)
    debug = (env_env or 'development') == 'development'

    print(f'\n  ✅  Contact Manager API running at  http://localhost:{port}\n')
    app.run(debug=debug, port=port)

"""
Contact management routes
Handles CRUD operations for contacts, with search and pagination
"""

import os
import re
import sqlite3
from flask import request, jsonify, Blueprint

contacts_bp = Blueprint('contacts', __name__, url_prefix='/api/contacts')

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'contacts.db')


# ─────────────────────────────────────────
# Database helpers
# ─────────────────────────────────────────

def get_db():
    """Return a SQLite connection with row factory enabled."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Create the contacts table if it doesn't already exist."""
    with get_db() as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS contacts (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name  TEXT NOT NULL,
                address    TEXT NOT NULL,
                email      TEXT NOT NULL UNIQUE,
                phone      TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()


# ─────────────────────────────────────────
# Validation helpers
# ─────────────────────────────────────────

def validate_email(email):
    """Return True if email matches a basic RFC-style pattern."""
    pattern = r'^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_phone(phone):
    """Return True if phone contains between 7 and 15 digits."""
    digits = re.sub(r'\D', '', phone)
    return 7 <= len(digits) <= 15


def validate_contact_data(data):
    """Validate all required contact fields. Returns a list of error strings."""
    errors = []

    for field in ('first_name', 'last_name', 'address', 'email', 'phone'):
        if not data.get(field, '').strip():
            errors.append(f'{field.replace("_", " ").title()} is required.')

    if data.get('email') and not validate_email(data['email']):
        errors.append('Invalid email format.')

    if data.get('phone') and not validate_phone(data['phone']):
        errors.append('Phone must contain 7–15 digits.')

    return errors


# ─────────────────────────────────────────
# Routes
# ─────────────────────────────────────────

@contacts_bp.route('', methods=['GET'])
def get_contacts():
    """
    Return a paginated list of contacts.

    Query params:
      search (str)  – optional search term (name / email / phone / address)
      page   (int)  – 1-based page number (default: 1)
      limit  (int)  – records per page (default: 10, max: 100)
    """
    search = request.args.get('search', '').strip()
    page   = max(1, int(request.args.get('page',  1)))
    limit  = min(100, max(1, int(request.args.get('limit', 10))))
    offset = (page - 1) * limit

    with get_db() as conn:
        if search:
            like = f'%{search}%'
            base_query = '''
                FROM contacts
                WHERE first_name LIKE ? OR last_name LIKE ?
                   OR email LIKE ? OR phone LIKE ? OR address LIKE ?
            '''
            params = (like, like, like, like, like)
        else:
            base_query = 'FROM contacts'
            params = ()

        total = conn.execute(f'SELECT COUNT(*) {base_query}', params).fetchone()[0]

        rows = conn.execute(
            f'SELECT * {base_query} ORDER BY first_name, last_name LIMIT ? OFFSET ?',
            params + (limit, offset)
        ).fetchall()

    return jsonify({
        'contacts': [dict(r) for r in rows],
        'total':    total,
        'page':     page,
        'limit':    limit,
        'pages':    max(1, -(-total // limit)),  # ceiling division
    })


@contacts_bp.route('<int:contact_id>', methods=['GET'])
def get_contact(contact_id):
    """Return a single contact by id."""
    with get_db() as conn:
        row = conn.execute(
            'SELECT * FROM contacts WHERE id = ?', (contact_id,)
        ).fetchone()

    if row is None:
        return jsonify({'success': False, 'errors': ['Contact not found.']}), 404

    return jsonify(dict(row))


@contacts_bp.route('', methods=['POST'])
def create_contact():
    """Create a new contact."""
    data   = request.get_json() or {}
    errors = validate_contact_data(data)

    if errors:
        return jsonify({'success': False, 'errors': errors}), 400

    try:
        with get_db() as conn:
            cursor = conn.execute(
                '''INSERT INTO contacts (first_name, last_name, address, email, phone)
                   VALUES (?, ?, ?, ?, ?)''',
                (
                    data['first_name'].strip(),
                    data['last_name'].strip(),
                    data['address'].strip(),
                    data['email'].strip().lower(),
                    data['phone'].strip(),
                )
            )
            conn.commit()
            new_id = cursor.lastrowid

        return jsonify({'success': True, 'id': new_id, 'message': 'Contact created successfully!'}), 201

    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'errors': ['Email already exists.']}), 409


@contacts_bp.route('<int:contact_id>', methods=['PUT'])
def update_contact(contact_id):
    """Update an existing contact."""
    data   = request.get_json() or {}
    errors = validate_contact_data(data)

    if errors:
        return jsonify({'success': False, 'errors': errors}), 400

    try:
        with get_db() as conn:
            result = conn.execute(
                '''UPDATE contacts
                   SET first_name=?, last_name=?, address=?, email=?, phone=?
                   WHERE id=?''',
                (
                    data['first_name'].strip(),
                    data['last_name'].strip(),
                    data['address'].strip(),
                    data['email'].strip().lower(),
                    data['phone'].strip(),
                    contact_id,
                )
            )
            conn.commit()

            if result.rowcount == 0:
                return jsonify({'success': False, 'errors': ['Contact not found.']}), 404

        return jsonify({'success': True, 'message': 'Contact updated successfully!'})

    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'errors': ['Email already exists.']}), 409


@contacts_bp.route('<int:contact_id>', methods=['DELETE'])
def delete_contact(contact_id):
    """Delete a contact by id."""
    with get_db() as conn:
        result = conn.execute(
            'DELETE FROM contacts WHERE id = ?', (contact_id,)
        )
        conn.commit()

        if result.rowcount == 0:
            return jsonify({'success': False, 'errors': ['Contact not found.']}), 404

    return jsonify({'success': True, 'message': 'Contact deleted successfully!'})

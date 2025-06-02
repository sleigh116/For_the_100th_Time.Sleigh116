from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import psycopg2
from psycopg2 import sql, OperationalError
from datetime import timedelta, datetime
import secrets
import os
from dotenv import load_dotenv

# Load environment variables (same as support.py)
load_dotenv()

app = Flask(__name__)

# Configuration (use environment variables for secrets in production)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', secrets.token_hex(32))
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', secrets.token_hex(32))
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['JWT_ERROR_MESSAGE_KEY'] = 'message'

# Initialize extensions
CORS(app, resources={r"/api/*": {
    "origins": "*",  # Allow all origins for testing
    "supports_credentials": True
}})
jwt = JWTManager(app)

# Database connection helper (PostgreSQL)
def get_db():
    try:
        conn = psycopg2.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            database=os.getenv('DB_NAME', 'Fintech_Solar'),
            user=os.getenv('DB_USER', 'postgres'),
            password=os.getenv('DB_PASSWORD', ''),
            port=os.getenv('DB_PORT', '5432')
        )
        return conn
    except OperationalError as e:
        print(f"🚨 Database connection failed: {e}")
        return None

# Auth routes (updated for PostgreSQL)
@app.route('/api/auth/register', methods=['POST'])
def register():
    conn = None
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(key in data for key in ['name', 'email', 'password']):
            return jsonify({'success': False, 'message': 'Missing required fields'}), 400

        # Get optional phone or set None
        phone = data.get('phone', None)

        conn = get_db()
        if not conn:
            return jsonify({'success': False, 'message': 'Database error'}), 500

        with conn.cursor() as cur:
            # Check existing user
            cur.execute("SELECT id FROM users WHERE email = %s", (data['email'],))
            if cur.fetchone():
                return jsonify({'success': False, 'message': 'Email already exists'}), 400

            # Create user without phone
            hashed_pw = generate_password_hash(data['password'])
            cur.execute(
                """INSERT INTO users (email, password_hash, full_name, phone)
                VALUES (%s, %s, %s, %s) RETURNING id, email, full_name""",
                (data['email'], hashed_pw, data['name'], phone)
            )
            user_data = cur.fetchone()
            conn.commit()

        return jsonify({
            'success': True,
            'user': {
                'id': user_data[0],
                'email': user_data[1],
                'name': user_data[2]
            }
        }), 201

    except Exception as e:
        print(f"Registration Error: {str(e)}")
        return jsonify({'success': False, 'message': 'Registration failed'}), 500
    finally:
        if conn: conn.close()

@app.route('/api/auth/login', methods=['POST'])
def login():
    conn = None
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400

        email = data.get('email')
        password = data.get('password')

        if not all([email, password]):
            return jsonify({'success': False, 'message': 'Email and password required'}), 400

        conn = get_db()
        if not conn:
            return jsonify({'success': False, 'message': 'Database error'}), 500

        cur = conn.cursor()

        # Check credentials (PostgreSQL users table)
        cur.execute('SELECT id, email, password_hash, full_name FROM users WHERE email = %s', (email,))
        user = cur.fetchone()

        if user and check_password_hash(user[2], password):  # user[2] = password_hash
            access_token = create_access_token(identity=user[0])  # user[0] = id
            return jsonify({
                'success': True,
                'token': access_token,
                'user': {
                    'id': user[0],
                    'name': user[3],  # full_name
                    'email': user[1]
                }
            })

        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

    except Exception as e:
        app.logger.error(f"Login error: {str(e)}")
        return jsonify({'success': False, 'message': 'Login failed'}), 500
    finally:
        if conn:
            conn.close()

@app.route('/api/solar/systems', methods=['POST'])
@jwt_required()
def create_solar_system():
    """Handle solar system installations"""
    current_user = get_jwt_identity()
    data = request.get_json()
    # Add validation and call support.py's add_solar_system()
    # ... implementation ...

@app.route('/api/contracts', methods=['POST'])
@jwt_required()
def create_solar_contract():
    """Handle contract creation"""
    current_user = get_jwt_identity()
    data = request.get_json()
    # Add validation and call support.py's create_contract()
    # ... implementation ...

@app.route('/api/payments', methods=['POST'])
@jwt_required()
def record_payment():
    """Handle payment processing"""
    current_user = get_jwt_identity()
    data = request.get_json()
    # Add validation and call support.py's record_payment()
    # ... implementation ...

@app.route('/api/contracts', methods=['GET'])
@jwt_required()
def get_contracts():
    """Get user's solar contracts"""
    current_user = get_jwt_identity()
    # Add authorization and call support.py's get_user_contracts()
    # ... implementation ...

if __name__ == '__main__':
    app.run(debug=True)
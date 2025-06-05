import psycopg2
from psycopg2 import OperationalError
import os
from dotenv import load_dotenv
import pandas as pd
import plotly.express as px
import json
import datetime

# Load environment variables
load_dotenv()

# ================== DATABASE CONNECTION ==================
def connect_db():
    """Connect to PostgreSQL database"""
    try:
        conn = psycopg2.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            database=os.getenv('DB_NAME', 'Fintech_Solar'),
            user=os.getenv('DB_USER', 'postgres'),
            password=os.getenv('DB_PASSWORD', ''),
            port=os.getenv('DB_PORT', '5432')
        )
        return conn, conn.cursor()
    except OperationalError as e:
        print(f"🚨 Database connection failed: {e}")
        return None, None

# ================== CORE FUNCTIONS ==================
def execute_query(operation=None, query=None, params=None):
    """Execute a database query"""
    conn, cur = connect_db()
    if not conn or not cur:
        raise Exception("Database connection failed")

    try:
        if params:
            cur.execute(query, params)
        else:
            cur.execute(query)

        if operation == 'search':
            return cur.fetchall()
        elif operation == 'insert':
            conn.commit()
            return cur.fetchone()[0] if cur.description else None
    except Exception as e:
        conn.rollback()
        print(f"🚨 Query failed: {e}\nQuery: {query}")
        raise
    finally:
        if cur: cur.close()
        if conn: conn.close()

# ================== USER OPERATIONS ==================
def create_user(email, password_hash, full_name=None, is_installer=False):
    """Create a new user account"""
    query = """
    INSERT INTO users (email, password_hash, full_name, is_installer)
    VALUES (%s, %s, %s, %s) RETURNING id
    """
    return execute_query('insert', query, (email, password_hash, full_name, phone, is_installer))

def get_user_by_email(email):
    """Get user by email address"""
    query = "SELECT * FROM users WHERE email = %s"
    result = execute_query('search', query, (email,))
    return result[0] if result else None

# ================== SOLAR SYSTEM OPERATIONS ==================
def add_solar_system(installer_id, capacity_kw, components=None, installation_date=None):
    """Add a new solar system installation"""
    query = """
    INSERT INTO solar_systems (installer_id, capacity_kw, components, installation_date)
    VALUES (%s, %s, %s, %s) RETURNING id
    """
    return execute_query('insert', query, (installer_id, capacity_kw, components, installation_date))

# ================== CONTRACT OPERATIONS ==================
def create_contract(user_id, system_id, monthly_payment, total_cost, start_date, end_date=None):
    """Create a new solar contract"""
    query = """
    INSERT INTO solar_contracts 
    (user_id, system_id, monthly_payment, total_cost, start_date, end_date)
    VALUES (%s, %s, %s, %s, %s, %s) RETURNING id
    """
    return execute_query('insert', query, 
                       (user_id, system_id, monthly_payment, total_cost, start_date, end_date))

def get_user_contracts(user_id):
    """Get all contracts for a user"""
    query = """
    SELECT sc.*, ss.capacity_kw, ss.components 
    FROM solar_contracts sc
    JOIN solar_systems ss ON sc.system_id = ss.id
    WHERE sc.user_id = %s
    """
    return execute_query('search', query, (user_id,))

# ================== PAYMENT OPERATIONS ==================
def record_payment(contract_id, amount, payment_method):
    """Record a payment and update contract balance"""
    conn, cur = connect_db()
    try:
        cur.execute("BEGIN")
        
        # Record payment
        cur.execute("""
        INSERT INTO payments (contract_id, amount, payment_method)
        VALUES (%s, %s, %s)
        """, (contract_id, amount, payment_method))
        
        # Update contract balance
        cur.execute("""
        UPDATE solar_contracts 
        SET payments_made = payments_made + %s
        WHERE id = %s
        """, (amount, contract_id))
        
        conn.commit()
        return True
    except Exception as e:
        conn.rollback()
        print(f"🚨 Payment failed: {e}")
        return False
    finally:
        if cur: cur.close()
        if conn: conn.close()

def get_payment_history(contract_id):
    """Get payment history for a contract"""
    query = """
    SELECT id, amount, payment_date, payment_method 
    FROM payments 
    WHERE contract_id = %s
    ORDER BY payment_date DESC
    """
    return execute_query('search', query, (contract_id,))

# ================== FORUM OPERATIONS ==================
def create_topic(user_id, title, content):
    """Create a new forum topic"""
    query = """
    INSERT INTO forum_topics (user_id, title, content)
    VALUES (%s, %s, %s) RETURNING id
    """
    return execute_query('insert', query, (user_id, title, content))

def get_topics():
    """Get all forum topics"""
    query = """
    SELECT ft.*, u.full_name as author_name 
    FROM forum_topics ft
    JOIN users u ON ft.user_id = u.id
    ORDER BY ft.created_at DESC
    """
    return execute_query('search', query)

# ================== SUPPORT OPERATIONS ==================
def submit_support_request(name, email, subject, message):
    """Submit a new support request"""
    query = """
    INSERT INTO contact_support (your_name, email_address, subject, message)
    VALUES (%s, %s, %s, %s) RETURNING id
    """
    return execute_query('insert', query, (name, email, subject, message))

def get_support_requests():
    """Get all support requests"""
    query = "SELECT * FROM contact_support ORDER BY created_at DESC"
    return execute_query('search', query)

# ================== PROFILE OPERATIONS ==================
def update_account_info(user_id, full_name, email, phone, address):
    """Update or create account information"""
    query = """
    INSERT INTO account_information (user_id, full_name, email_address, phone_number, address)
    VALUES (%s, %s, %s, %s, %s)
    ON CONFLICT (user_id) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        email_address = EXCLUDED.email_address,
        phone_number = EXCLUDED.phone_number,
        address = EXCLUDED.address
    RETURNING id
    """
    return execute_query('insert', query, (user_id, full_name, email, phone, address))

def update_linked_accounts(user_id, facebook_url=None, twitter_url=None, instagram_url=None):
    """Update or create linked social media accounts"""
    query = """
    INSERT INTO linked_accounts (user_id, facebook_profile_url, twitter_profile_url, instagram_profile_url)
    VALUES (%s, %s, %s, %s)
    ON CONFLICT (user_id) DO UPDATE
    SET facebook_profile_url = EXCLUDED.facebook_profile_url,
        twitter_profile_url = EXCLUDED.twitter_profile_url,
        instagram_profile_url = EXCLUDED.instagram_profile_url
    RETURNING id
    """
    return execute_query('insert', query, (user_id, facebook_url, twitter_url, instagram_url))

def save_payment_method(user_id, payment_type, card_number, expiry_date, card_holder_name, is_default=False):
    """Save a new payment method"""
    query = """
    INSERT INTO saved_payment_methods 
    (user_id, payment_type, card_number, expiry_date, card_holder_name, is_default)
    VALUES (%s, %s, %s, %s, %s, %s) RETURNING id
    """
    return execute_query('insert', query, (user_id, payment_type, card_number, expiry_date, card_holder_name, is_default))

def get_saved_payment_methods(user_id):
    """Get all saved payment methods for a user"""
    query = """
    SELECT * FROM saved_payment_methods 
    WHERE user_id = %s 
    ORDER BY is_default DESC, created_at DESC
    """
    return execute_query('search', query, (user_id,))

def update_profile_bio(user_id, energy_motto):
    """Update or create user's energy motto/goal"""
    query = """
    INSERT INTO profile_bio (user_id, energy_motto)
    VALUES (%s, %s)
    ON CONFLICT (user_id) DO UPDATE
    SET energy_motto = EXCLUDED.energy_motto,
        updated_at = CURRENT_TIMESTAMP
    RETURNING id
    """
    return execute_query('insert', query, (user_id, energy_motto))

def get_profile_bio(user_id):
    """Get user's energy motto/goal"""
    query = "SELECT energy_motto FROM profile_bio WHERE user_id = %s"
    result = execute_query('search', query, (user_id,))
    return result[0][0] if result else None

# Initialize database tables when module loads
def initialize_db():
    conn, cur = connect_db()
    try:
        # Existing tables
        cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(100),
            phone VARCHAR(20),
            is_installer BOOLEAN DEFAULT FALSE
        )""")
        
        cur.execute("""
        CREATE TABLE IF NOT EXISTS solar_systems (
            id SERIAL PRIMARY KEY,
            installer_id INTEGER REFERENCES users(id),
            capacity_kw DECIMAL(5,2) NOT NULL,
            components TEXT,
            installation_date DATE
        )""")
        
        cur.execute("""
        CREATE TABLE IF NOT EXISTS solar_contracts (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            system_id INTEGER REFERENCES solar_systems(id),
            monthly_payment DECIMAL(10,2) NOT NULL,
            total_cost DECIMAL(10,2) NOT NULL,
            payments_made DECIMAL(10,2) DEFAULT 0.0,
            start_date DATE NOT NULL,
            end_date DATE,
            is_active BOOLEAN DEFAULT TRUE,
            CONSTRAINT valid_payment CHECK (monthly_payment > 0 AND total_cost > monthly_payment)
        )""")
        
        cur.execute("""
        CREATE TABLE IF NOT EXISTS payments (
            id SERIAL PRIMARY KEY,
            contract_id INTEGER REFERENCES solar_contracts(id) ON DELETE CASCADE,
            amount DECIMAL(10,2) NOT NULL,
            payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            payment_method VARCHAR(50)
        )""")

        # Forum topics table
        cur.execute("""
        CREATE TABLE IF NOT EXISTS forum_topics (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )""")
        
        # Contact support table
        cur.execute("""
        CREATE TABLE IF NOT EXISTS contact_support (
            id SERIAL PRIMARY KEY,
            your_name VARCHAR(100) NOT NULL,
            email_address VARCHAR(255) NOT NULL,
            subject VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )""")
        
        # Account information table
        cur.execute("""
        CREATE TABLE IF NOT EXISTS account_information (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            full_name VARCHAR(100) NOT NULL,
            email_address VARCHAR(255) NOT NULL,
            phone_number VARCHAR(20),
            address TEXT,
            UNIQUE(user_id)
        )""")
        
        # Linked accounts table
        cur.execute("""
        CREATE TABLE IF NOT EXISTS linked_accounts (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            facebook_profile_url VARCHAR(255),
            twitter_profile_url VARCHAR(255),
            instagram_profile_url VARCHAR(255),
            UNIQUE(user_id)
        )""")
        
        # Saved payment methods table
        cur.execute("""
        CREATE TABLE IF NOT EXISTS saved_payment_methods (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            payment_type VARCHAR(50) NOT NULL,
            card_number VARCHAR(20),
            expiry_date DATE,
            card_holder_name VARCHAR(100),
            is_default BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )""")

        # Profile bio table
        cur.execute("""
        CREATE TABLE IF NOT EXISTS profile_bio (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            energy_motto TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id)
        )""")
        
        conn.commit()
        print("✅ Database tables initialized")
    except Exception as e:
        conn.rollback()
        print(f"🚨 Database initialization failed: {e}")
        raise
    finally:
        if cur: cur.close()
        if conn: conn.close()

# Initialize when imported
initialize_db()
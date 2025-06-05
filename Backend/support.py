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
def create_user(email, password_hash, full_name=None, phone=None, is_installer=False):
    """Create a new user account"""
    query = """
    INSERT INTO users (email, password_hash, full_name, phone, is_installer)
    VALUES (%s, %s, %s, %s, %s) RETURNING id
    """
    return execute_query('insert', query, (email, password_hash, full_name, phone, is_installer))

def get_user_by_email(email):
    """Get user by email address"""
    query = "SELECT * FROM users WHERE email = %s"
    result = execute_query('search', query, (email,))
    return result[0] if result else None

# ================== PROFILE OPERATIONS ==================
def update_user_profile(user_id, full_name, email, phone, address, energy_motto):
    """Update or create user profile information"""
    query = """
    INSERT INTO user_profiles (user_id, full_name, email_address, phone_number, address, energy_motto)
    VALUES (%s, %s, %s, %s, %s, %s)
    ON CONFLICT (user_id) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        email_address = EXCLUDED.email_address,
        phone_number = EXCLUDED.phone_number,
        address = EXCLUDED.address,
        energy_motto = EXCLUDED.energy_motto,
        updated_at = CURRENT_TIMESTAMP
    RETURNING id
    """
    return execute_query('insert', query, (user_id, full_name, email, phone, address, energy_motto))

def update_social_links(user_id, facebook_url=None, twitter_url=None, instagram_url=None):
    """Update or create social media links"""
    query = """
    INSERT INTO social_links (user_id, facebook_profile_url, twitter_profile_url, instagram_profile_url)
    VALUES (%s, %s, %s, %s)
    ON CONFLICT (user_id) DO UPDATE
    SET facebook_profile_url = EXCLUDED.facebook_profile_url,
        twitter_profile_url = EXCLUDED.twitter_profile_url,
        instagram_profile_url = EXCLUDED.instagram_profile_url
    RETURNING id
    """
    return execute_query('insert', query, (user_id, facebook_url, twitter_url, instagram_url))

# ================== SOLAR SYSTEM OPERATIONS ==================
def add_solar_system(user_id, installer_id, capacity_kw, components=None, installation_date=None):
    """Add a new solar system installation"""
    query = """
    INSERT INTO solar_systems (user_id, installer_id, capacity_kw, components, installation_date)
    VALUES (%s, %s, %s, %s, %s) RETURNING id
    """
    return execute_query('insert', query, (user_id, installer_id, capacity_kw, components, installation_date))

def record_energy_usage(user_id, system_id, reading_date, kwh_used):
    """Record energy usage"""
    query = """
    INSERT INTO energy_usage (user_id, system_id, reading_date, kwh_used)
    VALUES (%s, %s, %s, %s) RETURNING id
    """
    return execute_query('insert', query, (user_id, system_id, reading_date, kwh_used))

def record_environmental_impact(user_id, system_id, co2_saved, trees_equivalent, calculation_date):
    """Record environmental impact"""
    query = """
    INSERT INTO environmental_impact (user_id, system_id, co2_saved, trees_equivalent, calculation_date)
    VALUES (%s, %s, %s, %s, %s) RETURNING id
    """
    return execute_query('insert', query, (user_id, system_id, co2_saved, trees_equivalent, calculation_date))

# ================== FINANCIAL OPERATIONS ==================
def save_payment_method(user_id, payment_type, card_number, expiry_date, card_holder_name, is_default=False):
    """Save a new payment method"""
    query = """
    INSERT INTO payment_methods (user_id, payment_type, card_number, expiry_date, card_holder_name, is_default)
    VALUES (%s, %s, %s, %s, %s, %s) RETURNING id
    """
    return execute_query('insert', query, (user_id, payment_type, card_number, expiry_date, card_holder_name, is_default))

def record_transaction(user_id, amount, transaction_type, status, payment_method_id):
    """Record a new transaction"""
    query = """
    INSERT INTO transactions (user_id, amount, transaction_type, status, payment_method_id)
    VALUES (%s, %s, %s, %s, %s) RETURNING id
    """
    return execute_query('insert', query, (user_id, amount, transaction_type, status, payment_method_id))

def record_expense(user_id, amount, category, description, expense_date):
    """Record a new expense"""
    query = """
    INSERT INTO expenses (user_id, amount, category, description, expense_date)
    VALUES (%s, %s, %s, %s, %s) RETURNING id
    """
    return execute_query('insert', query, (user_id, amount, category, description, expense_date))

# ================== COMMUNITY OPERATIONS ==================
def create_forum_topic(user_id, title, content):
    """Create a new forum topic"""
    query = """
    INSERT INTO forum_topics (user_id, title, content)
    VALUES (%s, %s, %s) RETURNING id
    """
    return execute_query('insert', query, (user_id, title, content))

def add_forum_reply(topic_id, user_id, content):
    """Add a reply to a forum topic"""
    query = """
    INSERT INTO forum_replies (topic_id, user_id, content)
    VALUES (%s, %s, %s) RETURNING id
    """
    return execute_query('insert', query, (topic_id, user_id, content))

def create_support_ticket(user_id, subject, message):
    """Create a new support ticket"""
    query = """
    INSERT INTO support_tickets (user_id, subject, message)
    VALUES (%s, %s, %s) RETURNING id
    """
    return execute_query('insert', query, (user_id, subject, message))

# ================== NOTIFICATION OPERATIONS ==================
def create_notification(user_id, title, message, type):
    """Create a new notification"""
    query = """
    INSERT INTO notifications (user_id, title, message, type)
    VALUES (%s, %s, %s, %s) RETURNING id
    """
    return execute_query('insert', query, (user_id, title, message, type))

def create_load_shedding_alert(user_id, stage, start_time, end_time, area):
    """Create a load shedding alert"""
    query = """
    INSERT INTO load_shedding_alerts (user_id, stage, start_time, end_time, area)
    VALUES (%s, %s, %s, %s, %s) RETURNING id
    """
    return execute_query('insert', query, (user_id, stage, start_time, end_time, area))

# ================== REFERRAL & GROUP OPERATIONS ==================
def create_referral(referrer_id, referred_email):
    """Create a new referral"""
    query = """
    INSERT INTO referrals (referrer_id, referred_email)
    VALUES (%s, %s) RETURNING id
    """
    return execute_query('insert', query, (referrer_id, referred_email))

def create_group_campaign(creator_id, title, description, goal_participants, discount_percentage):
    """Create a new group buying campaign"""
    query = """
    INSERT INTO group_campaigns (creator_id, title, description, goal_participants, discount_percentage)
    VALUES (%s, %s, %s, %s, %s) RETURNING id
    """
    return execute_query('insert', query, (creator_id, title, description, goal_participants, discount_percentage))

# Initialize database tables when module loads
def initialize_db():
    conn, cur = connect_db()
    try:
        # 1. User Management & Authentication
        cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(100),
            phone VARCHAR(20),
            is_installer BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )""")

        cur.execute("""
        CREATE TABLE IF NOT EXISTS user_profiles (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            full_name VARCHAR(100) NOT NULL,
            email_address VARCHAR(255) NOT NULL,
            phone_number VARCHAR(20),
            address TEXT,
            energy_motto TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id)
        )""")

        cur.execute("""
        CREATE TABLE IF NOT EXISTS social_links (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            facebook_profile_url VARCHAR(255),
            twitter_profile_url VARCHAR(255),
            instagram_profile_url VARCHAR(255),
            UNIQUE(user_id)
        )""")

        # 2. Solar System & Energy Management
        cur.execute("""
        CREATE TABLE IF NOT EXISTS solar_systems (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            installer_id INTEGER REFERENCES users(id),
            capacity_kw DECIMAL(5,2) NOT NULL,
            components TEXT,
            installation_date DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )""")

        cur.execute("""
        CREATE TABLE IF NOT EXISTS energy_usage (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            system_id INTEGER REFERENCES solar_systems(id),
            reading_date DATE NOT NULL,
            kwh_used DECIMAL(10,2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )""")

        cur.execute("""
        CREATE TABLE IF NOT EXISTS environmental_impact (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            system_id INTEGER REFERENCES solar_systems(id),
            co2_saved DECIMAL(10,2),
            trees_equivalent INTEGER,
            calculation_date DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )""")

        # 3. Financial Management
        cur.execute("""
        CREATE TABLE IF NOT EXISTS payment_methods (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            payment_type VARCHAR(50) NOT NULL,
            card_number VARCHAR(20),
            expiry_date DATE,
            card_holder_name VARCHAR(100),
            is_default BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )""")

        cur.execute("""
        CREATE TABLE IF NOT EXISTS transactions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            amount DECIMAL(10,2) NOT NULL,
            transaction_type VARCHAR(50) NOT NULL,
            status VARCHAR(20) NOT NULL,
            payment_method_id INTEGER REFERENCES payment_methods(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )""")

        cur.execute("""
        CREATE TABLE IF NOT EXISTS expenses (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(50) NOT NULL,
            description TEXT,
            expense_date DATE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )""")

        # 4. Community & Support
        cur.execute("""
        CREATE TABLE IF NOT EXISTS forum_topics (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )""")

        cur.execute("""
        CREATE TABLE IF NOT EXISTS forum_replies (
            id SERIAL PRIMARY KEY,
            topic_id INTEGER REFERENCES forum_topics(id) ON DELETE CASCADE,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )""")

        cur.execute("""
        CREATE TABLE IF NOT EXISTS support_tickets (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            subject VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            status VARCHAR(20) DEFAULT 'open',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )""")

        # 5. Notifications & Alerts
        cur.execute("""
        CREATE TABLE IF NOT EXISTS notifications (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            type VARCHAR(50) NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )""")

        cur.execute("""
        CREATE TABLE IF NOT EXISTS load_shedding_alerts (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            stage INTEGER NOT NULL,
            start_time TIMESTAMP NOT NULL,
            end_time TIMESTAMP NOT NULL,
            area VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )""")

        # 6. Referral & Group Buying
        cur.execute("""
        CREATE TABLE IF NOT EXISTS referrals (
            id SERIAL PRIMARY KEY,
            referrer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            referred_email VARCHAR(255) NOT NULL,
            status VARCHAR(20) DEFAULT 'pending',
            reward_amount DECIMAL(10,2),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )""")

        cur.execute("""
        CREATE TABLE IF NOT EXISTS group_campaigns (
            id SERIAL PRIMARY KEY,
            creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            goal_participants INTEGER NOT NULL,
            current_participants INTEGER DEFAULT 0,
            discount_percentage DECIMAL(5,2),
            status VARCHAR(20) DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
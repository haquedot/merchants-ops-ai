"""Utility script to create the paytm_ops PostgreSQL database."""
import os
import sys
from pathlib import Path

# Ensure backend directory is in sys.path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import urllib.parse
from app.config import settings

def main():
    db_url = settings.DATABASE_URL
    print(f"Configured DATABASE_URL: {db_url}")
    
    clean_url = db_url.replace("postgresql+psycopg2://", "postgresql://")
    parsed = urllib.parse.urlparse(clean_url)
    
    target_db = parsed.path.lstrip("/")
    user = parsed.username or "postgres"
    password = parsed.password or "postgres"
    host = parsed.hostname or "localhost"
    port = parsed.port or 5432
    
    print(f"Connecting to PostgreSQL at {host}:{port} as user '{user}'...")
    try:
        conn = psycopg2.connect(
            dbname="postgres",
            user=user,
            password=password,
            host=host,
            port=port
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()
        
        # Check if target_db exists
        cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (target_db,))
        if cur.fetchone():
            print(f"Database '{target_db}' already exists.")
            return

        # Check if old database exists to clone data easily
        cur.execute("SELECT 1 FROM pg_database WHERE datname = 'razorpay_recovery'")
        old_exists = cur.fetchone()
        
        if old_exists:
            print(f"Found existing 'razorpay_recovery' database! Cloning schema & data to '{target_db}'...")
            # Disconnect active connections to razorpay_recovery before templating
            cur.execute("""
                SELECT pg_terminate_backend(pid) 
                FROM pg_stat_activity 
                WHERE datname = 'razorpay_recovery' AND pid <> pg_backend_pid();
            """)
            try:
                cur.execute(f'CREATE DATABASE "{target_db}" WITH TEMPLATE "razorpay_recovery"')
                print(f"Successfully cloned 'razorpay_recovery' to '{target_db}' with all tables and data!")
                return
            except Exception as e:
                print(f"Could not clone template ({e}). Creating blank database...")

        print(f"Creating empty database '{target_db}'...")
        cur.execute(f'CREATE DATABASE "{target_db}"')
        print(f"Database '{target_db}' created successfully!")
        print("\nNext step: run 'alembic upgrade head' and 'python -m app.scripts.generate_data'")
            
        cur.close()
        conn.close()
    except Exception as exc:
        print(f"\n[!] Error connecting to PostgreSQL: {exc}")

if __name__ == "__main__":
    main()

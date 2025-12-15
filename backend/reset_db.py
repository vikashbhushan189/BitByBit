import os
import django
from django.db import connection

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

def reset_database():
    print("⚠ WARNING: This will delete ALL data and tables in your local database.")
    confirm = input("Type 'yes' to confirm: ")
    
    if confirm != 'yes':
        print("Operation cancelled.")
        return

    try:
        with connection.cursor() as cursor:
            print("Dropping public schema...")
            # This command deletes every single table in the public schema
            cursor.execute("DROP SCHEMA public CASCADE;")
            print("Recreating public schema...")
            # This recreates the empty container for new tables
            cursor.execute("CREATE SCHEMA public;")
            
        print("✅ SUCCESS: Database has been completely wiped.")
        print("Now run: 'python manage.py migrate' to rebuild.")
        
    except Exception as e:
        print(f"❌ ERROR: {e}")

if __name__ == '__main__':
    reset_database()
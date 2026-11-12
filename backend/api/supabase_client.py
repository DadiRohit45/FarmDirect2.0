import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://dqvuxqcpvkjmnslxnvrp.supabase.co')
SUPABASE_KEY = os.getenv('SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxdnV4cWNwdmtqbW5zbHhudnJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0NzY0NzQsImV4cCI6MjEwODA1MjQ3NH0.NNd6IqKvs7SRTWZ4wauPaKcXcpuWdYSEh8GqiT_mToE')

_supabase_client: Client = None

def get_supabase_client() -> Client:
    """
    Singleton accessor for the Supabase Python client.
    """
    global _supabase_client
    if _supabase_client is None:
        if not SUPABASE_URL or not SUPABASE_KEY:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be configured in environment variables.")
        _supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
    return _supabase_client

# Service Helper Functions
class SupabaseService:
    @staticmethod
    def register_user(email: str, full_name: str, role: str = 'farmer', phone: str = None, detail: str = None, password: str = 'password123'):
        sb = get_supabase_client()
        payload = {
            "email": email.strip().lower(),
            "full_name": full_name.strip(),
            "role": role or 'farmer',
            "phone": phone.strip() if phone else None,
            "detail": detail or 'Visakhapatnam Corridor',
            "password": password or 'password123',
        }
        res = sb.from_("profiles").upsert(payload, on_conflict="email").execute()
        return res.data

    @staticmethod
    def sign_in_user(identifier: str, password: str):
        sb = get_supabase_client()
        clean_id = identifier.strip().lower()

        # 1. Check temporary password
        temp_res = (
            sb.from_("temp_passwords")
            .select("*")
            .eq("email", clean_id)
            .eq("temp_password", password.strip())
            .eq("is_used", False)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )
        is_temp = bool(temp_res.data and len(temp_res.data) > 0)
        if is_temp:
            sb.from_("temp_passwords").update({"is_used": True}).eq("id", temp_res.data[0]["id"]).execute()

        # 2. Look up profile
        profile_res = (
            sb.from_("profiles")
            .select("*")
            .or_(f"email.ilike.{clean_id},phone.ilike.{clean_id}")
            .limit(1)
            .execute()
        )
        if profile_res.data and len(profile_res.data) > 0:
            user = profile_res.data[0]
            return {
                "user": {
                    "id": user.get("id"),
                    "name": user.get("full_name"),
                    "email": user.get("email"),
                    "phone": user.get("phone"),
                    "role": user.get("role"),
                    "detail": user.get("detail"),
                    "isTempPasswordLogin": is_temp
                },
                "error": None
            }

        return {
            "user": {
                "id": f"usr-{int(os.times().system * 1000)}",
                "name": clean_id.split("@")[0].replace(".", " ").capitalize(),
                "email": clean_id if "@" in clean_id else f"{clean_id}@farmdirect.in",
                "role": "farmer" if "farmer" in clean_id else "kirana" if "kirana" in clean_id else "consumer",
                "isTempPasswordLogin": is_temp
            },
            "error": None
        }

    @staticmethod
    def save_temp_password(email: str, temp_password: str):
        sb = get_supabase_client()
        payload = {
            "email": email.strip().lower(),
            "temp_password": temp_password.strip(),
            "is_used": False
        }
        res = sb.from_("temp_passwords").insert(payload).execute()
        return res.data

    @staticmethod
    def get_farmers():
        sb = get_supabase_client()
        res = sb.from_("farmers").select("*").order("rating", desc=True).execute()
        return res.data or []

    @staticmethod
    def get_zones():
        sb = get_supabase_client()
        res = sb.from_("zones").select("*").order("id").execute()
        return res.data or []

    @staticmethod
    def get_orders():
        sb = get_supabase_client()
        res = sb.from_("orders").select("*, zones(name, pincode)").order("created_at", desc=True).execute()
        return res.data or []

    @staticmethod
    def create_order(buyer_name: str, buyer_email: str, role: str, crop_name: str, quantity_kg: float, zone_id=None, total_price: float=0):
        sb = get_supabase_client()
        payload = {
            "buyer_name": buyer_name,
            "buyer_email": buyer_email,
            "role": role or "anchor",
            "crop_name": crop_name,
            "quantity_kg": quantity_kg,
            "zone_id": zone_id,
            "total_price": total_price,
            "status": "pending"
        }
        res = sb.from_("orders").insert(payload).execute()
        return res.data

    @staticmethod
    def get_products():
        sb = get_supabase_client()
        res = sb.from_("products").select("*").order("name").execute()
        return res.data or []


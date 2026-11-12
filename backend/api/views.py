import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .supabase_client import SupabaseService, get_supabase_client

@csrf_exempt
@require_http_methods(["GET"])
def health_check(request):
    """
    Verifies Django backend health and tests live Supabase database connectivity.
    """
    supabase_status = "connected"
    details = {}
    try:
        sb = get_supabase_client()
        # Ping Supabase table
        res = sb.from_("zones").select("id").limit(1).execute()
        details["supabase_project"] = "mrudulapechetti03 [dqvuxqcpvkjmnslxnvrp]"
        details["sample_record_found"] = bool(res.data)
    except Exception as e:
        supabase_status = f"notice: {str(e)}"

    return JsonResponse({
        "status": "online",
        "framework": "Django 5.2 (Latest LTS)",
        "database": "Supabase (PostgreSQL)",
        "supabase_status": supabase_status,
        "details": details
    })


@csrf_exempt
@require_http_methods(["POST"])
def register_user(request):
    """
    Registers or updates user profile in Supabase 'profiles' table.
    """
    try:
        body = json.loads(request.body.decode('utf-8'))
        email = body.get('email')
        full_name = body.get('fullName') or body.get('full_name')
        role = body.get('role', 'farmer')
        phone = body.get('phone')
        detail = body.get('detail')
        password = body.get('password', 'password123')

        if not email or not full_name:
            return JsonResponse({"error": "email and fullName are required"}, status=400)

        data = SupabaseService.register_user(
            email=email,
            full_name=full_name,
            role=role,
            phone=phone,
            detail=detail,
            password=password
        )
        return JsonResponse({"success": True, "profile": data}, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def sign_in_user(request):
    """
    Authenticates user against Supabase 'temp_passwords' and 'profiles'.
    """
    try:
        body = json.loads(request.body.decode('utf-8'))
        identifier = body.get('identifier')
        password = body.get('password')

        if not identifier or not password:
            return JsonResponse({"error": "identifier and password are required"}, status=400)

        result = SupabaseService.sign_in_user(identifier=identifier, password=password)
        return JsonResponse(result, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def save_temp_password(request):
    """
    Saves a temporary password into Supabase 'temp_passwords' table.
    """
    try:
        body = json.loads(request.body.decode('utf-8'))
        email = body.get('email')
        temp_password = body.get('tempPassword') or body.get('temp_password')

        if not email or not temp_password:
            return JsonResponse({"error": "email and temp_password are required"}, status=400)

        data = SupabaseService.save_temp_password(email=email, temp_password=temp_password)
        return JsonResponse({"success": True, "data": data}, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def get_farmers(request):
    """
    Retrieves certified regional smallholders and farmers from Supabase 'farmers'.
    """
    try:
        farmers = SupabaseService.get_farmers()
        return JsonResponse({"count": len(farmers), "data": farmers}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def get_zones(request):
    """
    Retrieves operational clusters and delivery zones from Supabase 'zones'.
    """
    try:
        zones = SupabaseService.get_zones()
        return JsonResponse({"count": len(zones), "data": zones}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET", "POST"])
def orders_view(request):
    """
    GET: Retrieves orders list from Supabase 'orders'.
    POST: Creates a new crop order into Supabase 'orders'.
    """
    if request.method == "GET":
        try:
            orders = SupabaseService.get_orders()
            return JsonResponse({"count": len(orders), "data": orders}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    elif request.method == "POST":
        try:
            body = json.loads(request.body.decode('utf-8'))
            buyer_name = body.get('buyerName') or body.get('buyer_name')
            buyer_email = body.get('buyerEmail') or body.get('buyer_email')
            role = body.get('role', 'anchor')
            crop_name = body.get('cropName') or body.get('crop_name')
            quantity_kg = float(body.get('quantityKg') or body.get('quantity_kg', 1))
            zone_id = body.get('zoneId') or body.get('zone_id')
            total_price = float(body.get('totalPrice') or body.get('total_price', 0))

            if not buyer_name or not crop_name:
                return JsonResponse({"error": "buyerName and cropName are required"}, status=400)

            data = SupabaseService.create_order(
                buyer_name=buyer_name,
                buyer_email=buyer_email,
                role=role,
                crop_name=crop_name,
                quantity_kg=quantity_kg,
                zone_id=zone_id,
                total_price=total_price
            )
            return JsonResponse({"success": True, "order": data}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def get_products(request):
    """
    Retrieves produce and harvest items from Supabase 'products'.
    """
    try:
        products = SupabaseService.get_products()
        return JsonResponse({"count": len(products), "data": products}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

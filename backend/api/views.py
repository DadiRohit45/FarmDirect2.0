import os
import json
import logging
import ipaddress
import requests
from django.core.cache import cache
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .supabase_client import SupabaseService, get_supabase_client

logger = logging.getLogger(__name__)



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


MAX_BODY_BYTES = 65536  # 64 KB maximum request payload
MAX_PROMPT_LENGTH = 8000  # 8,000 character maximum prompt length
MAX_MESSAGES_LENGTH = 16000  # 16,000 character cumulative history limit
RATE_LIMIT_REQUESTS = 10  # 10 requests
RATE_LIMIT_WINDOW_SECS = 60  # per 60 seconds (1 minute)

def _is_valid_ip(ip_str):
    """Validates whether a string is a valid IPv4 or IPv6 address."""
    if not ip_str or not isinstance(ip_str, str):
        return False
    try:
        ipaddress.ip_address(ip_str.strip())
        return True
    except (ValueError, AttributeError):
        return False

def _get_client_ip(request):
    """
    Extracts the client IP address behind reverse proxies (Render / Cloudflare).

    Trust Model:
    1. HTTP_CF_CONNECTING_IP:
       Render is fronted by Cloudflare at its outer edge. Cloudflare strips any
       incoming client-supplied CF-Connecting-IP header and overwrites it with
       the verified TCP client socket IP. This is our sole trusted proxy header.

    2. Untrusted Headers (X-Forwarded-For, True-Client-IP):
       We explicitly DO NOT trust client-supplied X-Forwarded-For or True-Client-IP.
       Cloudflare and upstream proxies preserve client-injected X-Forwarded-For values,
       so treating the first value as trusted allows spoofing.

    3. REMOTE_ADDR:
       If CF-Connecting-IP is absent or invalid, we safely fall back to the direct
       socket address REMOTE_ADDR (standard in local development and direct TCP).
    """
    # 1. Primary: Cloudflare edge-verified connecting IP
    cf_ip = request.META.get('HTTP_CF_CONNECTING_IP', '').strip()
    if cf_ip and _is_valid_ip(cf_ip):
        return cf_ip

    # 2. Fallback: Direct socket connection address
    remote_addr = request.META.get('REMOTE_ADDR', '127.0.0.1').strip()
    if remote_addr and _is_valid_ip(remote_addr):
        return remote_addr

    return '127.0.0.1'



@csrf_exempt
@require_http_methods(["POST"])
def gemini_chat(request):
    """
    Secure, rate-limited backend proxy for Google Gemini AI generation.
    - Accessible to anonymous visitors (no forced login barrier).
    - Rate limited to 10 requests/minute per client IP (HTTP 429).
    - Max prompt length: 8,000 characters (HTTP 400).
    - Max request body size: 64 KB (HTTP 400).
    - Reads GEMINI_API_KEY exclusively from backend environment (HTTP 503 if missing).
    - Safe handling for timeouts (HTTP 504).
    """
    # 1. Payload size check
    if len(request.body) > MAX_BODY_BYTES:
        return JsonResponse({
            "error": "Request body exceeds maximum allowed size (64 KB).",
            "text": None
        }, status=400)

    # 2. JSON structure validation
    try:
        body = json.loads(request.body.decode('utf-8'))
        if not isinstance(body, dict):
            return JsonResponse({
                "error": "Invalid request format. JSON object expected.",
                "text": None
            }, status=400)
    except Exception:
        return JsonResponse({
            "error": "Invalid JSON request body.",
            "text": None
        }, status=400)

    prompt = body.get('prompt', '')
    messages = body.get('messages', [])
    system_prompt = body.get('systemPrompt', '')
    model = body.get('model', 'gemini-1.5-flash')

    # 3. Input validation: Prompt or messages cannot be completely empty
    if not prompt and not messages:
        return JsonResponse({
            "error": "Prompt or conversation messages cannot be empty.",
            "text": None
        }, status=400)

    # 4. Prompt length validation
    if len(str(prompt)) > MAX_PROMPT_LENGTH:
        return JsonResponse({
            "error": f"Prompt exceeds maximum allowed length of {MAX_PROMPT_LENGTH:,} characters.",
            "text": None
        }, status=400)

    # 5. Conversation history validation
    if isinstance(messages, list):
        cumulative_len = sum(len(str(m.get('content') or m.get('text', ''))) for m in messages if isinstance(m, dict))
        if cumulative_len > MAX_MESSAGES_LENGTH:
            return JsonResponse({
                "error": f"Conversation history exceeds maximum allowed length of {MAX_MESSAGES_LENGTH:,} characters.",
                "text": None
            }, status=400)
    else:
        messages = []

    # 6. Client IP rate limiting (10 req/60s) with strict fail-closed protection
    client_ip = _get_client_ip(request)
    cache_key = f"rl:gemini:{client_ip}"

    try:
        # cache.add atomically sets value only if key does not already exist
        added = cache.add(cache_key, 1, timeout=RATE_LIMIT_WINDOW_SECS)
        if added:
            current_count = 1
        else:
            try:
                current_count = cache.incr(cache_key)
            except ValueError:
                # Key expired in the microsecond between add and incr; atomically re-add
                if cache.add(cache_key, 1, timeout=RATE_LIMIT_WINDOW_SECS):
                    current_count = 1
                else:
                    current_count = cache.incr(cache_key)
    except Exception as cache_err:
        logger.error(f"Rate limiting backend unavailable for {client_ip}: {cache_err}")
        # Fail-closed policy: Do not make a Gemini API request when rate limiting cannot be enforced.
        return JsonResponse({
            "error": "Rate limiting service temporarily unavailable. Please try again shortly.",
            "text": None
        }, status=503)

    if current_count > RATE_LIMIT_REQUESTS:
        return JsonResponse({
            "error": "Rate limit exceeded. Please wait a moment before sending more queries.",
            "text": None
        }, status=429)

    # 7. Server-side API key check
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        return JsonResponse({
            "error": "GEMINI_API_KEY is not configured on the backend server.",
            "text": None
        }, status=503)

    # 8. Dispatch to Google Gemini REST API
    try:
        endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"

        contents = []
        if messages:
            for msg in messages:
                if msg.get('role') == 'system':
                    continue
                role = 'model' if msg.get('role') in ('assistant', 'model') else 'user'
                text = msg.get('content') or msg.get('text', '')
                if text and str(text).strip():
                    contents.append({
                        'role': role,
                        'parts': [{'text': str(text)}]
                    })

        if not contents or contents[-1].get('role') != 'user':
            contents.append({
                'role': 'user',
                'parts': [{'text': prompt}]
            })

        payload = {
            'contents': contents,
            'generationConfig': {
                'temperature': 0.35,
                'maxOutputTokens': 1000,
                'topP': 0.95
            }
        }

        if system_prompt:
            payload['system_instruction'] = {
                'parts': [{'text': system_prompt}]
            }

        resp = requests.post(
            endpoint,
            json=payload,
            headers={'Content-Type': 'application/json'},
            timeout=18
        )

        if resp.status_code != 200:
            return JsonResponse({
                "error": f"Gemini API returned status {resp.status_code}",
                "text": None
            }, status=resp.status_code)

        data = resp.json()
        candidates = data.get('candidates', [])
        candidate = candidates[0] if candidates else {}
        parts = candidate.get('content', {}).get('parts', [])
        response_text = "".join(part.get('text', '') for part in parts)

        if not response_text:
            return JsonResponse({
                "error": "Empty response from Gemini",
                "text": None
            }, status=500)

        return JsonResponse({
            "text": response_text.strip(),
            "model": model
        }, status=200)

    except requests.exceptions.Timeout:
        return JsonResponse({
            "error": "Gemini request timed out. Please try again.",
            "text": None
        }, status=504)
    except Exception as e:
        return JsonResponse({
            "error": str(e),
            "text": None
        }, status=500)

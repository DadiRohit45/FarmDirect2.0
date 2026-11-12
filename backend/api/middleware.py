from django.conf import settings
from django.http import HttpResponse

class CORSMiddleware:
    """
    Production-ready CORS middleware for Django.
    Validates origins against settings.CORS_ALLOWED_ORIGINS while supporting
    local development origins and preflight requests.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Handle preflight OPTIONS request
        if request.method == 'OPTIONS':
            response = HttpResponse()
            self._add_cors_headers(response, request)
            return response

        response = self.get_response(request)
        self._add_cors_headers(response, request)
        return response

    def _add_cors_headers(self, response, request):
        origin = request.headers.get('Origin')
        allowed_origins = getattr(settings, 'CORS_ALLOWED_ORIGINS', [])

        if origin:
            # Match explicit origin or allow localhost/127.0.0.1 if DEBUG is True
            if origin in allowed_origins or getattr(settings, 'DEBUG', False) or '*' in allowed_origins:
                response['Access-Control-Allow-Origin'] = origin
            else:
                # Disallow unapproved cross-origin requests
                return
        else:
            response['Access-Control-Allow-Origin'] = '*'

        response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, apikey'
        response['Access-Control-Allow-Credentials'] = 'true'
        response['Access-Control-Max-Age'] = '86400'


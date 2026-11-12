import os
import json
from unittest.mock import patch, MagicMock
import requests
from django.test import TestCase, Client
from django.core.cache import cache
from django.urls import reverse


class GeminiApiSecurityTests(TestCase):
    """
    Automated security and abuse protection test suite for the FarmDirect 2.0
    Gemini API proxy endpoint (/api/ai/gemini/).
    """
    def setUp(self):
        self.client = Client()
        self.url = reverse('gemini_chat')
        cache.clear()

    def tearDown(self):
        cache.clear()

    @patch('requests.post')
    @patch.dict(os.environ, {'GEMINI_API_KEY': 'test-secret-key'})
    def test_01_valid_anonymous_gemini_request(self, mock_post):
        """Test 1: Valid anonymous request succeeds without mandatory login."""
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {
            'candidates': [{'content': {'parts': [{'text': 'Fresh tomatoes cost ₹28/kg in Anakapalli.'}]}}]
        }
        mock_post.return_value = mock_resp

        payload = {'prompt': 'What is the price of tomatoes in Anakapalli?'}
        response = self.client.post(self.url, data=json.dumps(payload), content_type='application/json')

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data.get('text'), 'Fresh tomatoes cost ₹28/kg in Anakapalli.')
        self.assertEqual(data.get('model'), 'gemini-1.5-flash')

    @patch.dict(os.environ, {}, clear=True)
    def test_02_missing_gemini_api_key(self):
        """Test 2: Missing GEMINI_API_KEY safely returns HTTP 503."""
        payload = {'prompt': 'Hello'}
        response = self.client.post(self.url, data=json.dumps(payload), content_type='application/json')

        self.assertEqual(response.status_code, 503)
        data = response.json()
        self.assertIn('GEMINI_API_KEY is not configured', data.get('error', ''))
        self.assertIsNone(data.get('text'))

    @patch.dict(os.environ, {'GEMINI_API_KEY': 'test-secret-key'})
    def test_03_invalid_request_body(self):
        """Test 3: Malformed JSON or invalid body returns HTTP 400."""
        response = self.client.post(self.url, data="not-a-valid-json", content_type='application/json')

        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertIn('Invalid JSON', data.get('error', ''))
        self.assertIsNone(data.get('text'))

    @patch.dict(os.environ, {'GEMINI_API_KEY': 'test-secret-key'})
    def test_04_empty_prompt_and_messages(self):
        """Test 4: Empty prompt with no messages returns HTTP 400."""
        payload = {'prompt': '', 'messages': []}
        response = self.client.post(self.url, data=json.dumps(payload), content_type='application/json')

        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertIn('cannot be empty', data.get('error', ''))
        self.assertIsNone(data.get('text'))

    @patch.dict(os.environ, {'GEMINI_API_KEY': 'test-secret-key'})
    def test_05_prompt_exceeding_8000_characters(self):
        """Test 5: Prompt exceeding 8,000 characters is rejected with HTTP 400."""
        oversized_prompt = 'A' * 8001
        payload = {'prompt': oversized_prompt}
        response = self.client.post(self.url, data=json.dumps(payload), content_type='application/json')

        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertIn('exceeds maximum allowed length of 8,000 characters', data.get('error', ''))
        self.assertIsNone(data.get('text'))

    @patch('requests.post')
    @patch.dict(os.environ, {'GEMINI_API_KEY': 'test-secret-key'})
    def test_06_rate_limit_exceeded(self, mock_post):
        """Test 6: Exceeding 10 requests per minute triggers HTTP 429."""
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {
            'candidates': [{'content': {'parts': [{'text': 'OK'}]}}]
        }
        mock_post.return_value = mock_resp

        payload = {'prompt': 'Ping query'}
        # Perform 10 permitted requests from same client IP
        for i in range(10):
            res = self.client.post(self.url, data=json.dumps(payload), content_type='application/json', REMOTE_ADDR='198.51.100.42')
            self.assertEqual(res.status_code, 200)

        # 11th request must be rate-limited
        res_11 = self.client.post(self.url, data=json.dumps(payload), content_type='application/json', REMOTE_ADDR='198.51.100.42')
        self.assertEqual(res_11.status_code, 429)
        data = res_11.json()
        self.assertIn('Rate limit exceeded', data.get('error', ''))
        self.assertIsNone(data.get('text'))

    @patch('requests.post')
    @patch.dict(os.environ, {'GEMINI_API_KEY': 'test-secret-key'})
    def test_07_gemini_timeout(self, mock_post):
        """Test 7: Outbound request timeout returns HTTP 504."""
        mock_post.side_effect = requests.exceptions.Timeout("Connection timed out")

        payload = {'prompt': 'Slow query'}
        response = self.client.post(self.url, data=json.dumps(payload), content_type='application/json')

        self.assertEqual(response.status_code, 504)
        data = response.json()
        self.assertIn('timed out', data.get('error', ''))
        self.assertIsNone(data.get('text'))

    def test_08_unsupported_http_method(self):
        """Test 8: GET request to gemini endpoint is rejected with HTTP 405."""
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 405)

    @patch('requests.post')
    @patch.dict(os.environ, {'GEMINI_API_KEY': 'test-secret-key'})
    def test_09_existing_response_format_compatibility(self, mock_post):
        """Test 9: Response structure strictly matches { text: str, model: str } expected by ragEngine.js."""
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {
            'candidates': [{'content': {'parts': [{'text': 'Certified organic spinach harvested today.'}]}}]
        }
        mock_post.return_value = mock_resp

        payload = {
            'prompt': 'Tell me about spinach',
            'messages': [{'role': 'user', 'content': 'Tell me about spinach'}],
            'systemPrompt': 'You are FarmDirect AI',
            'model': 'gemini-1.5-flash'
        }
        response = self.client.post(self.url, data=json.dumps(payload), content_type='application/json')

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('text', data)
        self.assertIn('model', data)
        self.assertIsInstance(data['text'], str)
        self.assertEqual(data['model'], 'gemini-1.5-flash')

    @patch('requests.post')
    @patch.dict(os.environ, {'GEMINI_API_KEY': 'test-secret-key'})
    def test_10_trusted_cf_header_overrides_spoofed_forwarded_for(self, mock_post):
        """Test 10: Verified CF-Connecting-IP takes precedence over spoofed X-Forwarded-For."""
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {
            'candidates': [{'content': {'parts': [{'text': 'OK'}]}}]
        }
        mock_post.return_value = mock_resp

        payload = {'prompt': 'Anti-spoofing test'}
        # Client attempts to spoof X-Forwarded-For, but Render sets authentic HTTP_CF_CONNECTING_IP
        for i in range(10):
            res = self.client.post(
                self.url,
                data=json.dumps(payload),
                content_type='application/json',
                HTTP_CF_CONNECTING_IP='203.0.113.88',
                HTTP_X_FORWARDED_FOR=f'10.0.0.{i}, 192.168.1.{i}'  # changing spoofed IPs
            )
            self.assertEqual(res.status_code, 200)

        # 11th request with a new spoofed X-Forwarded-For must still be blocked by CF-Connecting-IP
        res_blocked = self.client.post(
            self.url,
            data=json.dumps(payload),
            content_type='application/json',
            HTTP_CF_CONNECTING_IP='203.0.113.88',
            HTTP_X_FORWARDED_FOR='172.16.0.99'
        )
        self.assertEqual(res_blocked.status_code, 429)

    @patch('requests.post')
    @patch.dict(os.environ, {'GEMINI_API_KEY': 'test-secret-key'})
    def test_11_spoofed_x_forwarded_for_without_cf_header_falls_back_to_remote_addr(self, mock_post):
        """Test 11: When CF-Connecting-IP is absent, spoofed X-Forwarded-For is ignored and REMOTE_ADDR is used."""
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {
            'candidates': [{'content': {'parts': [{'text': 'OK'}]}}]
        }
        mock_post.return_value = mock_resp

        payload = {'prompt': 'X-Forwarded-For spoofing test'}
        # Client attempts to spoof X-Forwarded-For to bypass rate limits
        for i in range(10):
            res = self.client.post(
                self.url,
                data=json.dumps(payload),
                content_type='application/json',
                HTTP_X_FORWARDED_FOR=f'10.99.{i}.1',
                REMOTE_ADDR='198.51.100.99'
            )
            self.assertEqual(res.status_code, 200)

        # 11th request with a new spoofed X-Forwarded-For must still be blocked by REMOTE_ADDR
        res_blocked = self.client.post(
            self.url,
            data=json.dumps(payload),
            content_type='application/json',
            HTTP_X_FORWARDED_FOR='10.99.99.99',
            REMOTE_ADDR='198.51.100.99'
        )
        self.assertEqual(res_blocked.status_code, 429)

    @patch('requests.post')
    @patch.dict(os.environ, {'GEMINI_API_KEY': 'test-secret-key'})
    def test_12_missing_forwarding_headers_fallback(self, mock_post):
        """Test 12: Missing forwarding headers falls back safely to REMOTE_ADDR."""
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {
            'candidates': [{'content': {'parts': [{'text': 'OK'}]}}]
        }
        mock_post.return_value = mock_resp

        payload = {'prompt': 'Direct socket test'}
        res = self.client.post(self.url, data=json.dumps(payload), content_type='application/json', REMOTE_ADDR='192.0.2.77')
        self.assertEqual(res.status_code, 200)

    @patch('requests.post')
    @patch.dict(os.environ, {'GEMINI_API_KEY': 'test-secret-key'})
    def test_13_rate_limit_expiration_behavior(self, mock_post):
        """Test 13: Verifies that after rate-limit cache window clears, requests succeed again."""
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {
            'candidates': [{'content': {'parts': [{'text': 'OK'}]}}]
        }
        mock_post.return_value = mock_resp

        payload = {'prompt': 'Window reset test'}
        # Exhaust 10 requests
        for i in range(10):
            res = self.client.post(self.url, data=json.dumps(payload), content_type='application/json', REMOTE_ADDR='198.51.100.55')
            self.assertEqual(res.status_code, 200)

        # 11th request is blocked
        res_blocked = self.client.post(self.url, data=json.dumps(payload), content_type='application/json', REMOTE_ADDR='198.51.100.55')
        self.assertEqual(res_blocked.status_code, 429)

        # Simulate expiration of 60s cache window
        cache.clear()

        # Request succeeds again
        res_resumed = self.client.post(self.url, data=json.dumps(payload), content_type='application/json', REMOTE_ADDR='198.51.100.55')
        self.assertEqual(res_resumed.status_code, 200)

    @patch('requests.post')
    @patch.dict(os.environ, {'GEMINI_API_KEY': 'test-secret-key'})
    def test_14_spoofed_true_client_ip_ignored(self, mock_post):
        """Test 14: Client-supplied True-Client-IP header is ignored and cannot bypass rate limiting."""
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {
            'candidates': [{'content': {'parts': [{'text': 'OK'}]}}]
        }
        mock_post.return_value = mock_resp

        payload = {'prompt': 'True-Client-IP test'}
        # Client sends varying True-Client-IP headers from the same remote socket address
        for i in range(10):
            res = self.client.post(
                self.url,
                data=json.dumps(payload),
                content_type='application/json',
                HTTP_TRUE_CLIENT_IP=f'10.200.0.{i}',
                REMOTE_ADDR='198.51.100.70'
            )
            self.assertEqual(res.status_code, 200)

        # 11th request with a new True-Client-IP must still be throttled based on REMOTE_ADDR
        res_blocked = self.client.post(
            self.url,
            data=json.dumps(payload),
            content_type='application/json',
            HTTP_TRUE_CLIENT_IP='10.200.0.99',
            REMOTE_ADDR='198.51.100.70'
        )
        self.assertEqual(res_blocked.status_code, 429)

    @patch('requests.post')
    @patch('django.core.cache.cache.add')
    @patch.dict(os.environ, {'GEMINI_API_KEY': 'test-secret-key'})
    def test_15_cache_backend_failure_fails_closed(self, mock_add, mock_post):
        """Test 15: Strict fail-closed policy returns HTTP 503 and avoids calling Gemini if cache fails."""
        mock_add.side_effect = RuntimeError("Cache backend connection lost")

        payload = {'prompt': 'Cache failure policy test'}
        res = self.client.post(
            self.url,
            data=json.dumps(payload),
            content_type='application/json',
            REMOTE_ADDR='198.51.100.80'
        )
        # Must fail-closed with HTTP 503 rather than allowing unthrottled upstream calls
        self.assertEqual(res.status_code, 503)
        data = res.json()
        self.assertIn('Rate limiting service temporarily unavailable', data.get('error', ''))
        self.assertIsNone(data.get('text'))
        # Confirm no upstream Gemini API request was dispatched
        mock_post.assert_not_called()

    @patch('requests.post')
    @patch.dict(os.environ, {'GEMINI_API_KEY': 'test-secret-key'})
    def test_16_concurrent_burst_requests(self, mock_post):
        """Test 16: Burst requests are strictly throttled at the 10-request boundary."""
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {
            'candidates': [{'content': {'parts': [{'text': 'OK'}]}}]
        }
        mock_post.return_value = mock_resp

        payload = {'prompt': 'Burst concurrency test'}
        statuses = []
        for _ in range(15):
            res = self.client.post(
                self.url,
                data=json.dumps(payload),
                content_type='application/json',
                REMOTE_ADDR='198.51.100.90'
            )
            statuses.append(res.status_code)

        # First 10 succeed, subsequent 5 are throttled
        self.assertEqual(statuses.count(200), 10)
        self.assertEqual(statuses.count(429), 5)

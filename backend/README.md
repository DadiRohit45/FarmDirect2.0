# 🌾 FarmDirect 2.0 — Django Backend Architecture

> **Framework:** Django 5.2.18 (Latest LTS)  
> **Database:** Supabase (Cloud PostgreSQL)  
> **Architecture:** Decoupled REST API with direct Supabase Database integration and built-in CORS middleware.

---

## 🚀 Quick Start

### 1. Requirements
Ensure Python 3.11+ is installed. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

### 2. Run Database Migrations
```bash
python manage.py migrate
```

### 3. Start the Backend Server
```bash
# Windows Batch:
run_server.bat

# Or directly with Python:
python manage.py runserver 127.0.0.1:8000
```
The Django backend will be live at: **`http://127.0.0.1:8000/`**

---

## 📡 REST API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health/` | `GET` | Verifies Django status & live Supabase database connectivity |
| `/api/auth/register/` | `POST` | Upserts user profile in Supabase `profiles` table |
| `/api/auth/login/` | `POST` | Validates credentials against Supabase `temp_passwords` & `profiles` |
| `/api/auth/temp-password/` | `POST` | Stores temporary password into Supabase `temp_passwords` |
| `/api/farmers/` | `GET` | Fetches regional verified smallholders from Supabase `farmers` |
| `/api/zones/` | `GET` | Fetches operational delivery clusters from Supabase `zones` |
| `/api/orders/` | `GET` / `POST` | Lists all orders or inserts new crop orders into Supabase `orders` |
| `/api/products/` | `GET` | Fetches produce catalog from Supabase `products` |
| `/admin/` | `GET` | Django Admin console for managing models & records |

---

## 🔒 Supabase Database Integration
Credentials are read automatically from `.env`:
- **`SUPABASE_URL`**: `https://dqvuxqcpvkjmnslxnvrp.supabase.co`
- **`SUPABASE_KEY`**: Cloud API key
- All table operations (`profiles`, `temp_passwords`, `farmers`, `zones`, `orders`, `products`) interact directly with your Supabase cloud project.

---

## 💻 Frontend Compatibility
The frontend remains completely unchanged (`src/`), running on Vite at `http://localhost:5173/`. Built-in CORS middleware permits cross-origin requests from `localhost:5173`.


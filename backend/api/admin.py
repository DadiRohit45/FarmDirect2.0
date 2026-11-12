from django.contrib import admin
from .models import UserProfile, TempPassword, Farmer, Zone, Order, Product

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'role', 'phone', 'detail', 'created_at')
    search_fields = ('full_name', 'email', 'phone')
    list_filter = ('role',)

@admin.register(TempPassword)
class TempPasswordAdmin(admin.ModelAdmin):
    list_display = ('email', 'temp_password', 'is_used', 'created_at', 'expires_at')
    search_fields = ('email', 'temp_password')
    list_filter = ('is_used',)

@admin.register(Farmer)
class FarmerAdmin(admin.ModelAdmin):
    list_display = ('name', 'village', 'crop', 'rating', 'trust_score', 'daily_capacity_kg', 'e_crop_verified')
    search_fields = ('name', 'village', 'crop')
    list_filter = ('e_crop_verified', 'trust_tier')

@admin.register(Zone)
class ZoneAdmin(admin.ModelAdmin):
    list_display = ('name', 'pincode', 'depot_count', 'status')
    search_fields = ('name', 'pincode')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'crop_name', 'buyer_name', 'quantity_kg', 'total_price', 'status', 'created_at')
    search_fields = ('buyer_name', 'buyer_email', 'crop_name')
    list_filter = ('status', 'role')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price_per_kg', 'market_price_per_kg', 'in_stock')
    search_fields = ('name', 'category', 'farmer_name')
    list_filter = ('category', 'in_stock')

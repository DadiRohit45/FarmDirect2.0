from django.db import models

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('farmer', 'Farmer'),
        ('kirana', 'Kirana Depot'),
        ('consumer', 'Consumer'),
        ('bulk', 'Bulk Anchor'),
        ('admin', 'Administrator'),
    ]

    id = models.CharField(max_length=64, primary_key=True)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    role = models.CharField(max_length=32, choices=ROLE_CHOICES, default='farmer')
    phone = models.CharField(max_length=32, blank=True, null=True)
    detail = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'profiles'
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'

    def __str__(self):
        return f"{self.full_name} ({self.role})"


class TempPassword(models.Model):
    email = models.EmailField()
    temp_password = models.CharField(max_length=32)
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'temp_passwords'
        verbose_name = 'Temporary Password'
        verbose_name_plural = 'Temporary Passwords'

    def __str__(self):
        return f"{self.email} - {self.temp_password} ({'Used' if self.is_used else 'Active'})"


class Farmer(models.Model):
    name = models.CharField(max_length=255)
    village = models.CharField(max_length=255)
    crop = models.CharField(max_length=255)
    distance_km = models.DecimalField(max_digits=5, decimal_places=1, default=0.0)
    trust_tier = models.CharField(max_length=32, default='Tier 1')
    trust_score = models.IntegerField(default=95)
    daily_capacity_kg = models.IntegerField(default=500)
    fulfillment_rate = models.CharField(max_length=16, default='98%')
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=4.8)
    e_crop_verified = models.BooleanField(default=True)

    class Meta:
        db_table = 'farmers'
        verbose_name = 'Farmer'
        verbose_name_plural = 'Farmers'

    def __str__(self):
        return f"{self.name} - {self.village} ({self.crop})"


class Zone(models.Model):
    name = models.CharField(max_length=255)
    pincode = models.CharField(max_length=16)
    depot_count = models.IntegerField(default=1)
    status = models.CharField(max_length=32, default='active')

    class Meta:
        db_table = 'zones'
        verbose_name = 'Operational Zone'
        verbose_name_plural = 'Operational Zones'

    def __str__(self):
        return f"{self.name} ({self.pincode})"


class Order(models.Model):
    buyer_name = models.CharField(max_length=255)
    buyer_email = models.EmailField()
    role = models.CharField(max_length=32, default='consumer')
    crop_name = models.CharField(max_length=255)
    quantity_kg = models.IntegerField(default=1)
    zone_id = models.CharField(max_length=64, blank=True, null=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    status = models.CharField(max_length=32, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'orders'
        verbose_name = 'Order'
        verbose_name_plural = 'Orders'

    def __str__(self):
        return f"Order #{self.id} - {self.crop_name} ({self.buyer_name})"


class Product(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=128)
    unit = models.CharField(max_length=32, default='kg')
    price_per_kg = models.DecimalField(max_digits=6, decimal_places=2)
    market_price_per_kg = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    farmer_name = models.CharField(max_length=255, blank=True, null=True)
    village = models.CharField(max_length=255, blank=True, null=True)
    in_stock = models.BooleanField(default=True)

    class Meta:
        db_table = 'products'
        verbose_name = 'Product'
        verbose_name_plural = 'Products'

    def __str__(self):
        return f"{self.name} - ₹{self.price_per_kg}/{self.unit}"

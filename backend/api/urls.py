from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health_check, name='health_check'),
    path('auth/register/', views.register_user, name='register_user'),
    path('auth/login/', views.sign_in_user, name='sign_in_user'),
    path('auth/temp-password/', views.save_temp_password, name='save_temp_password'),
    path('farmers/', views.get_farmers, name='get_farmers'),
    path('zones/', views.get_zones, name='get_zones'),
    path('orders/', views.orders_view, name='orders_view'),
    path('products/', views.get_products, name='get_products'),
]


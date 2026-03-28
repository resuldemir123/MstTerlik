from django.urls import path
from . import views

urlpatterns = [
    path('products/', views.ProductListView.as_view(), name='product-list'),
    path('products/<str:pk>/', views.ProductRetrieveView.as_view(), name='product-detail'),
    path('products/<str:pk>/variants/', views.ProductVariantsView.as_view(), name='product-variants'),
    path('orders/', views.OrderCreateView.as_view(), name='order-create'),
    path('orders/history/', views.OrderHistoryView.as_view(), name='order-history'),
    path('orders/<str:pk>/', views.OrderDetailView.as_view(), name='order-detail'),
]

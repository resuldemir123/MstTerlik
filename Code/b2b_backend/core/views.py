from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .firebase_auth import FirebaseAuthentication
from firebase_admin import firestore
import datetime

def format_doc_data(doc):
    data = doc.to_dict()
    data['id'] = doc.id
    # Ensure datetimes are serialized to strings safely
    for key, value in data.items():
        if isinstance(value, datetime.datetime):
            data[key] = value.isoformat()
    return data

class ProductListView(APIView):
    authentication_classes = [FirebaseAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        db = firestore.client()
        products_ref = db.collection('products')
        
        gender = request.query_params.get('gender')
        if gender:
            products_ref = products_ref.where('gender', '==', gender)
            
        docs = products_ref.stream()
        products = [format_doc_data(doc) for doc in docs]
            
        return Response(products, status=status.HTTP_200_OK)

class ProductRetrieveView(APIView):
    authentication_classes = [FirebaseAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        db = firestore.client()
        doc_ref = db.collection('products').document(pk)
        doc = doc_ref.get()
        if not doc.exists:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
            
        data = format_doc_data(doc)
        return Response(data, status=status.HTTP_200_OK)

class ProductVariantsView(APIView):
    authentication_classes = [FirebaseAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        db = firestore.client()
        variants_ref = db.collection('variants').where('product_id', '==', pk)
        docs = variants_ref.stream()
        
        variants = [format_doc_data(doc) for doc in docs]
            
        return Response(variants, status=status.HTTP_200_OK)

class OrderCreateView(APIView):
    authentication_classes = [FirebaseAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        db = firestore.client()
        data = request.data
        items = data.get('items', [])
        total_amount = data.get('total_amount', 0)
        
        if not items:
            return Response({"error": "No items provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        transaction = db.transaction()
        
        @firestore.transactional
        def process_order(transaction):
            variant_refs = {}
            for item in items:
                # We need variant_id to safely update stock inside a transaction
                variant_id = item.get('variant_id')
                if not variant_id:
                    # Fallback if the frontend only sends color and product_id based on the TR1001_SIYAH pattern
                    color = item.get('color', '').upper()
                    product_id = item.get('product_id', '')
                    variant_id = f"{product_id}_{color}"
                
                ref = db.collection('variants').document(variant_id)
                snapshot = ref.get(transaction=transaction)
                if not snapshot.exists:
                    raise Exception(f"Variant {variant_id} does not exist")
                
                variant_data = snapshot.to_dict()
                stock_matrix = variant_data.get('stock_matrix', {})
                requested_sizes = item.get('sizes', {})
                
                for size, qty in requested_sizes.items():
                    current_stock = stock_matrix.get(str(size), 0)
                    if current_stock < qty:
                        raise Exception(f"Insufficient stock for variant {variant_id}, size {size}")
                    stock_matrix[str(size)] = current_stock - qty
                
                variant_refs[ref] = {'stock_matrix': stock_matrix}
                
            # Update all variants
            for ref, updates in variant_refs.items():
                transaction.update(ref, updates)
                
            # Create order
            order_ref = db.collection('orders').document()
            order_data = {
                'buyer_id': request.firebase_uid,
                'items': items,
                'status': 'pending',
                'total_amount': total_amount,
                'created_at': firestore.SERVER_TIMESTAMP
            }
            transaction.set(order_ref, order_data)
            return order_ref.id

        try:
            order_id = process_order(transaction)
            return Response({"message": "Order created successfully", "order_id": order_id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class OrderHistoryView(APIView):
    authentication_classes = [FirebaseAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        db = firestore.client()
        orders_ref = db.collection('orders').where('buyer_id', '==', request.firebase_uid)
        docs = orders_ref.stream()
        
        orders = [format_doc_data(doc) for doc in docs]
        return Response(orders, status=status.HTTP_200_OK)

class OrderDetailView(APIView):
    authentication_classes = [FirebaseAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        db = firestore.client()
        doc_ref = db.collection('orders').document(pk)
        doc = doc_ref.get()
        
        if not doc.exists:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
            
        data = format_doc_data(doc)
        if data.get('buyer_id') != request.firebase_uid:
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
            
        return Response(data, status=status.HTTP_200_OK)

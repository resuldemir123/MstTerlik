from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from firebase_admin import auth

class FirebaseUser:
    def __init__(self, uid):
        self.uid = uid
        self.is_authenticated = True

class FirebaseAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            return None

        # Verify token format
        if auth_header.startswith('Bearer '):
            id_token = auth_header.split(' ').pop()
        else:
            return None
        
        try:
            # Validate ID token with Firebase Admin
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token.get('uid')
        except Exception as e:
            raise AuthenticationFailed('Geçersiz veya süresi dolmuş token')

        # İstenen özellik: request.user yerine request.firebase_uid eklenecek
        request.firebase_uid = uid
        
        # Return FirebaseUser and token tuple for DRF requirements
        user = FirebaseUser(uid)
        return (user, id_token)

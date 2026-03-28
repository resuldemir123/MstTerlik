from django.contrib import admin
from firebase_admin import firestore
from firebase_admin import auth as firebase_auth
from .models import FirebaseProduct, FirebaseOrder, FirebaseUser

# Django Admin'in FakeQuerySet üzerinden çalışabilmesi için sahte paginator ve gelişmiş MockQuery nesnesi:
class DummyPaginator:
    def __init__(self, object_list, per_page, orphans=0, allow_empty_first_page=True):
        self.object_list = object_list
        self.count = len(object_list)   
        self.num_pages = 1
        
    def page(self, number):
        class Page:
            object_list = self.object_list
            has_other_pages = lambda self: False
            has_previous = lambda self: False
            has_next = lambda self: False
            number = 1
        return Page()

class MockQuery:
    def __init__(self):
        self.select_related = False
        self.order_by = []
        self.default_ordering = []
        self.where = None
        self.select = []
        self.annotations = {}   
        self.extra = {}
        self.is_sliced = False
        self.standard_ordering = True
        
    def get_compiler(self, *args, **kwargs):
        class MockCompiler:
            def get_default_columns(self, *args, **kwargs): return []
        return MockCompiler()

class FakeQuerySet(list):
    ordered = True
    def __init__(self, data=None):
        super().__init__(data or [])
        self.query = MockQuery()
        self.model = None

    def clone(self):
        qs = FakeQuerySet(self)
        qs.model = self.model
        return qs
        
    def _clone(self): return self.clone()
    def iterator(self): return iter(self)
    def all(self): return self

    def filter(self, *args, **kwargs):
        if not kwargs: return self
        results = []
        for obj in self:
            match = True
            for k, v in kwargs.items():
                if "__icontains" in k:
                    field = k.replace("__icontains", "")
                    val = getattr(obj, field, None)
                    if val is None or str(v).lower() not in str(val).lower():
                        match = False
                        break
                elif "__exact" in k:
                    field = k.replace("__exact", "")
                    val = getattr(obj, field, None)
                    if str(v) != str(val):
                        match = False
                        break
                else:
                    attr = 'id' if k == 'pk' else k
                    # If v is a model object, check its id
                    check_val = getattr(v, 'id', v)
                    if getattr(obj, attr, None) != check_val:
                        match = False
                        break
            if match:
                results.append(obj)
        qs = FakeQuerySet(results)
        qs.model = self.model
        return qs

    def get(self, *args, **kwargs):
        res = self.filter(*args, **kwargs)
        if len(res) == 0:
            raise getattr(self.model, 'DoesNotExist', Exception("DoesNotExist"))
        return res[0]

    def first(self):
        return self[0] if len(self) > 0 else None

    def exclude(self, *args, **kwargs): return self
    def order_by(self, *args):
        if not args: return self
        results = list(self)
        for arg in reversed(args):
            reverse = False
            field = arg
            if arg.startswith('-'):
                reverse = True
                field = arg[1:]
            # Sort by the field, handle None values
            results.sort(key=lambda x: str(getattr(x, field, '') or ''), reverse=reverse)
        qs = FakeQuerySet(results)
        qs.model = self.model
        return qs
    def select_related(self, *args): return self
    def prefetch_related(self, *args): return self
    def count(self): return len(self)
    def exists(self): return len(self) > 0
    
    def __getitem__(self, k):
        res = super().__getitem__(k)
        if isinstance(res, list):
            qs = FakeQuerySet(res)
            qs.model = self.model
            return qs
        return res

def make_fake_queryset(results, model_class):
    qs = FakeQuerySet(results)
    qs.model = model_class
    return qs

@admin.register(FirebaseProduct)
class FirebaseProductAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'gender', 'base_price')
    search_fields = ('code', 'name')
    list_filter = ('gender',)
    paginator = DummyPaginator

    def get_queryset(self, request):
        try:
            db = firestore.client()
            products = db.collection('products').stream()
            results = []
            for p in products:
                data = p.to_dict()
                results.append(FirebaseProduct(
                    id=p.id, 
                    code=data.get('code', 'Bilinmiyor'), 
                    name=data.get('name', 'Bilinmiyor'),
                    gender=data.get('gender', ''),
                    base_price=data.get('base_price', 0)
                ))
            return make_fake_queryset(results, FirebaseProduct)
        except Exception as e:
            print(f"FirebaseProduct Admin Error: {e}")
            return make_fake_queryset([], FirebaseProduct)

    def save_model(self, request, obj, form, change):
        db = firestore.client()
        data = {
            "code": obj.code,
            "name": obj.name,
            "gender": obj.gender,
            "base_price": obj.base_price
        }
        if change:
            db.collection('products').document(obj.id).update(data)
        else:
            db.collection('products').add(data)

@admin.register(FirebaseOrder)
class FirebaseOrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'buyer_id', 'total_amount', 'status')
    list_filter = ('status',)
    search_fields = ('id', 'buyer_id')
    paginator = DummyPaginator

    def get_queryset(self, request):
        try:
            db = firestore.client()
            # Try to order by created_at, fall back if index missing
            try:
                orders = db.collection('orders').order_by('created_at', direction=firestore.Query.DESCENDING).stream()
            except Exception:
                orders = db.collection('orders').stream()
            
            results = []
            for o in orders:
                data = o.to_dict()
                results.append(FirebaseOrder(
                    id=o.id,
                    buyer_id=data.get('buyer_id', ''),
                    total_amount=data.get('total_amount', 0),
                    status=data.get('status', 'beklemede')
                ))
            return make_fake_queryset(results, FirebaseOrder)
        except Exception as e:
            print(f"FirebaseOrder Admin Error: {e}")
            return make_fake_queryset([], FirebaseOrder)

    def save_model(self, request, obj, form, change):
        db = firestore.client()
        if change:
            db.collection('orders').document(obj.id).update({"status": obj.status})

@admin.register(FirebaseUser)
class FirebaseUserAdmin(admin.ModelAdmin):
    list_display = ('uid', 'email', 'display_name', 'creation_time')
    search_fields = ('email', 'display_name', 'uid')
    paginator = DummyPaginator

    def get_queryset(self, request):
        try:
            users_page = firebase_auth.list_users()
            results = []
            for u in users_page.users:
                results.append(FirebaseUser(
                    uid=u.uid,
                    email=u.email,
                    display_name=u.display_name or 'İsimsiz',
                    creation_time=str(u.user_metadata.creation_timestamp) if u.user_metadata else ''
                ))
            return make_fake_queryset(results, FirebaseUser)
        except Exception as e:
            print(f"FirebaseUser Admin Error: {e}")
            return make_fake_queryset([], FirebaseUser)

    def save_model(self, request, obj, form, change):
        if change:
            firebase_auth.update_user(obj.uid, email=obj.email, display_name=obj.display_name)
        else:
            # Create dummy password because Firebase requires it, users can reset it
            firebase_auth.create_user(
                uid=obj.uid.strip() if obj.uid else None, 
                email=obj.email, 
                display_name=obj.display_name,
                password="ChangeMe123!"
            )

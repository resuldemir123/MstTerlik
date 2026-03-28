from django.db import models

class FirebaseProduct(models.Model):
    # Firebase ID
    id = models.CharField(primary_key=True, max_length=255)
    
    # Bu alanlar Django Admin panelinde başlık olarak görünecek
    code = models.CharField(max_length=50, verbose_name="Ürün Kodu")
    name = models.CharField(max_length=255, verbose_name="Ürün Adı")
    gender = models.CharField(max_length=50, verbose_name="Cinsiyet", null=True, blank=True)
    base_price = models.FloatField(verbose_name="Fiyat", null=True, blank=True)
    
    class Meta:
        managed = False  # Django'ya "Bu tabloyu veritabanında oluşturma" diyoruz
        verbose_name = "Firebase Ürün"
        verbose_name_plural = "Firebase Ürünler"

class FirebaseOrder(models.Model):
    STATUS_CHOICES = (
        ('beklemede', 'Beklemede'),
        ('onaylandi', 'Onaylandı'),
        ('kargoya_verildi', 'Kargoya Verildi'),
        ('iptal_edildi', 'İptal Edildi'),
    )
    id = models.CharField(primary_key=True, max_length=255)
    buyer_id = models.CharField(max_length=255, verbose_name="Bayi UID")
    total_amount = models.FloatField(verbose_name="Kayıtlı Tutar")
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='beklemede', verbose_name="Durum")
    
    class Meta:
        managed = False
        verbose_name = "Firebase Sipariş"
        verbose_name_plural = "Firebase Siparişler"

class FirebaseUser(models.Model):
    uid = models.CharField(primary_key=True, max_length=255, verbose_name="Kullanıcı UID")
    email = models.EmailField(verbose_name="E-posta")
    display_name = models.CharField(max_length=255, verbose_name="İsim", null=True, blank=True)
    creation_time = models.CharField(max_length=255, verbose_name="Kayıt Tarihi", null=True, blank=True)
    
    class Meta:
        managed = False
        verbose_name = "Kayıtlı Bayi (Kullanıcı)"
        verbose_name_plural = "Kayıtlı Bayiler (Kullanıcılar)"

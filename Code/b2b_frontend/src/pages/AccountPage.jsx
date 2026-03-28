import React, { useState, useEffect } from 'react';
import { useUserStore } from '../store/useUserStore';
import { db } from '../firebase/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function AccountPage() {
    const user = useUserStore((state) => state.user);
    const [activeSection, setActiveSection] = useState('profile');
    
    const [loadingData, setLoadingData] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form state corresponding to Firestore structure + new fields
    const [formData, setFormData] = useState({
        company: '',
        city: '',
        fullName: '',
        role: '',
        phone: '',
        taxId: '',
        email: user?.email || '',
        whatsapp: '',
        altPhone: ''
    });

    useEffect(() => {
        if (!user?.uid) return;
        
        const fetchUserData = async () => {
            try {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData({
                        company: data.company || '',
                        city: data.city || '',
                        fullName: data.fullName || '',
                        role: data.role || 'customer',
                        phone: data.phone || '',
                        taxId: data.taxId || '',
                        email: user.email || data.email || '',
                        whatsapp: data.whatsapp || '',
                        altPhone: data.altPhone || ''
                    });
                }
            } catch (error) {
                console.error("Kullanıcı verisi çekilemedi:", error);
                toast.error("Bilgileriniz yüklenirken bir sorun oluştu.");
            } finally {
                setLoadingData(false);
            }
        };

        fetchUserData();
    }, [user?.uid]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!user?.uid) return;
        setSaving(true);
        try {
            const docRef = doc(db, 'users', user.uid);
            await updateDoc(docRef, {
                company: formData.company,
                city: formData.city,
                fullName: formData.fullName,
                phone: formData.phone,
                whatsapp: formData.whatsapp,
                altPhone: formData.altPhone
            });
            toast.success("Değişiklikler başarıyla kaydedildi.");
        } catch (error) {
            console.error("Kaydetme hatası:", error);
            toast.error("Bilgiler güncellenirken bir hata oluştu.");
        } finally {
            setSaving(false);
        }
    };

    if (loadingData) {
        return (
            <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center bg-surface">
                <span className="text-secondary font-bold tracking-widest uppercase">Yükleniyor...</span>
            </div>
        );
    }

    return (
        <div className="bg-surface text-on-surface min-h-[calc(100vh-80px)] w-full flex flex-col font-body selection:bg-primary-fixed selection:text-on-primary-fixed">
            <main className="max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-24 w-full">
                {/* Editorial Header Section */}
                <div className="mb-12 md:mb-16">
                    <h1 className="font-headline font-extrabold tracking-tight text-4xl md:text-[3.5rem] leading-none text-primary mb-4">
                        Partner Hesabı
                    </h1>
                    <p className="text-secondary max-w-2xl font-body text-base md:text-lg">
                        Wholesale platformu üzerinden ticari bilgilerinizi, kişisel erişimlerinizi ve ayarlarınızı buradan yönetebilirsiniz.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                    {/* Sidebar / Navigation Tonal Layer */}
                    <aside className="lg:col-span-3 space-y-2">
                        <div className="bg-surface-container-low p-4 md:p-6 rounded-xl space-y-1">
                            <button 
                                onClick={() => setActiveSection('profile')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === 'profile' ? 'bg-primary text-on-primary font-semibold shadow-sm' : 'text-secondary hover:bg-surface-container-highest'}`}
                            >
                                <span className="material-symbols-outlined text-sm" data-icon="person">person</span>
                                <span>Profil Ayarları</span>
                            </button>
                            <button 
                                onClick={() => setActiveSection('company')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === 'company' ? 'bg-primary text-on-primary font-semibold shadow-sm' : 'text-secondary hover:bg-surface-container-highest'}`}
                            >
                                <span className="material-symbols-outlined text-sm" data-icon="business">business</span>
                                <span>{formData.role === 'retailer' ? 'Firma Bilgileri' : 'Kişisel Bilgiler'}</span>
                            </button>
                            <button 
                                onClick={() => setActiveSection('address')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === 'address' ? 'bg-primary text-on-primary font-semibold shadow-sm' : 'text-secondary hover:bg-surface-container-highest'}`}
                            >
                                <span className="material-symbols-outlined text-sm" data-icon="location_on">location_on</span>
                                <span>Adreslerim</span>
                            </button>
                            <button 
                                onClick={() => setActiveSection('security')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === 'security' ? 'bg-primary text-on-primary font-semibold shadow-sm' : 'text-secondary hover:bg-surface-container-highest'}`}
                            >
                                <span className="material-symbols-outlined text-sm" data-icon="lock">lock</span>
                                <span>Güvenlik</span>
                            </button>
                            <button 
                                onClick={() => setActiveSection('notifications')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === 'notifications' ? 'bg-primary text-on-primary font-semibold shadow-sm' : 'text-secondary hover:bg-surface-container-highest'}`}
                            >
                                <span className="material-symbols-outlined text-sm" data-icon="notifications">notifications</span>
                                <span>Bildirimler</span>
                            </button>
                        </div>
                    </aside>

                    {/* Main Form Content */}
                    <div className="lg:col-span-9 space-y-8 md:space-y-12">
                        
                        {(activeSection === 'profile' || activeSection === 'company') && (
                            <>
                                {/* Section 1 & 2: Company & Authorized Person */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    
                                    {formData.role === 'retailer' && (
                                        <div className="bg-surface-container-lowest p-6 md:p-8 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-outline-variant/10">
                                            <h3 className="font-headline font-bold text-lg md:text-xl mb-6 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary" data-icon="corporate_fare">corporate_fare</span>
                                                Firma Bilgileri
                                            </h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Firma Adı</label>
                                                    <input name="company" value={formData.company} onChange={handleChange} className="w-full bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary py-3 px-4 font-body text-on-surface text-sm" type="text" placeholder="Firma adınız"/>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Vergi No / T.C. Kimlik</label>
                                                    <input name="taxId" value={formData.taxId} onChange={handleChange} className="w-full bg-surface-container-high/50 border-none rounded-lg py-3 px-4 font-body text-secondary text-sm cursor-not-allowed" disabled type="text" placeholder="Zorunlu"/>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Yetkili Kişi */}
                                    <div className="bg-surface-container-lowest p-6 md:p-8 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-outline-variant/10">
                                        <h3 className="font-headline font-bold text-lg md:text-xl mb-6 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary" data-icon="badge">badge</span>
                                            {formData.role === 'retailer' ? 'Yetkili Kişi' : 'Kişisel Bilgiler'}
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Ad Soyad</label>
                                                <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary py-3 px-4 font-body text-on-surface text-sm" type="text" placeholder="Adınız Soyadınız"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Şehir / İlçe</label>
                                                <input name="city" value={formData.city} onChange={handleChange} className="w-full bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary py-3 px-4 font-body text-on-surface text-sm" type="text" placeholder="Örn: İstanbul / Başakşehir"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: İletişim (Full Width Layout) */}
                                <div className="bg-surface-container-lowest p-6 md:p-8 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-outline-variant/10">
                                    <h3 className="font-headline font-bold text-lg md:text-xl mb-6 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary" data-icon="contact_mail">contact_mail</span>
                                        İletişim
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Giriş E-postası</label>
                                            <input name="email" value={formData.email} className="w-full bg-surface-container-high/50 border-none rounded-lg py-3 px-4 font-body text-secondary cursor-not-allowed text-sm" disabled type="email" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Direkt Telefon</label>
                                            <input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary py-3 px-4 font-body text-on-surface text-sm" type="tel" placeholder="+90 5XX XXX XX XX"/>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">WhatsApp Numarası</label>
                                            <input name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary py-3 px-4 font-body text-on-surface text-sm" type="tel" placeholder="+90 5XX XXX XX XX"/>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Alternatif Telefon</label>
                                            <input name="altPhone" value={formData.altPhone} onChange={handleChange} className="w-full bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary py-3 px-4 font-body text-on-surface text-sm" placeholder="Opsiyonel" type="tel" />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {(activeSection === 'profile' || activeSection === 'address') && (
                            <div className="space-y-6">
                                {/* Section 4: Teslimat Adresi */}
                                <div className="flex justify-between items-end pb-2">
                                    <h3 className="font-headline font-bold text-2xl">Teslimat Adresleri</h3>
                                    <button className="bg-primary text-on-primary px-4 md:px-6 py-2.5 rounded-lg flex items-center gap-2 font-semibold hover:opacity-90 transition-all active:scale-95 shadow-md text-sm md:text-base">
                                        <span className="material-symbols-outlined text-[20px]" data-icon="add">add</span>
                                        <span className="hidden sm:block">Yeni Adres Ekle</span>
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-surface-container-lowest p-6 rounded-xl border-2 border-primary-container relative group transition-all duration-300">
                                        <div className="absolute top-4 right-4 bg-primary-container text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">Varsayılan</div>
                                        <div className="flex flex-col h-full">
                                            <h4 className="font-headline font-bold text-lg mb-2">Merkez Depo</h4>
                                            <p className="text-secondary text-sm font-body leading-relaxed mb-6 flex-grow">
                                                İkitelli OSB Mahallesi, Aykosan Sanayi Sitesi 2. Kısım, 4. Blok No: 12, Başakşehir, İstanbul
                                            </p>
                                            <div className="flex items-center gap-4 pt-4 border-t border-outline-variant/10">
                                                <button className="text-primary font-bold text-xs uppercase flex items-center gap-1 hover:underline">
                                                    <span className="material-symbols-outlined text-sm" data-icon="edit">edit</span> Düzenle
                                                </button>
                                                <button className="text-error font-bold text-xs uppercase flex items-center gap-1 hover:underline">
                                                    <span className="material-symbols-outlined text-sm" data-icon="delete">delete</span> Sil
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {(activeSection === 'profile' || activeSection === 'security' || activeSection === 'notifications') && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                                {/* Section 5 & 6: Password & Notifications (Grid Layout) */}
                                
                                {/* Password */}
                                {(activeSection === 'profile' || activeSection === 'security') && (
                                    <div className="lg:col-span-5 bg-surface-container-lowest p-6 md:p-8 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-outline-variant/10">
                                        <h3 className="font-headline font-bold text-lg md:text-xl mb-6 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary" data-icon="security">security</span>
                                            Şifre ve Güvenlik
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Mevcut Şifre</label>
                                                <input className="w-full bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary py-3 px-4 text-sm" placeholder="••••••••" type="password"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Yeni Şifre</label>
                                                <input className="w-full bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary py-3 px-4 text-sm" placeholder="Yeni şifrenizi girin" type="password"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Yeni Şifre Tekrar</label>
                                                <input className="w-full bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary py-3 px-4 text-sm" placeholder="Tekrar girin" type="password"/>
                                            </div>
                                            <button className="w-full bg-secondary text-on-secondary font-bold py-3 px-4 rounded-lg hover:bg-primary transition-all active:scale-95 text-sm">
                                                Şifreyi Güncelle
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Notifications */}
                                {(activeSection === 'profile' || activeSection === 'notifications') && (
                                    <div className="lg:col-span-7 bg-surface-container-lowest p-6 md:p-8 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-outline-variant/10">
                                        <h3 className="font-headline font-bold text-lg md:text-xl mb-6 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary" data-icon="notifications_active">notifications_active</span>
                                            Bildirim Tercihleri
                                        </h3>
                                        
                                        <div className="space-y-4 md:space-y-6">
                                            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-tertiary" data-icon="new_releases">new_releases</span>
                                                    <div>
                                                        <p className="font-bold text-sm">Yeni Koleksiyon Duyuruları</p>
                                                        <p className="text-[11px] md:text-xs text-secondary mt-0.5">Sezonluk lansmanlardan ilk siz haberdar olun.</p>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-2">
                                                    <input defaultChecked className="sr-only peer" type="checkbox"/>
                                                    <div className="w-10 h-5 md:w-11 md:h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 md:after:h-5 md:after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                </label>
                                            </div>
                                            
                                            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-primary" data-icon="campaign">campaign</span>
                                                    <div>
                                                        <p className="font-bold text-sm">Stok Alarm Bildirimleri</p>
                                                        <p className="text-[11px] md:text-xs text-secondary mt-0.5">Tükenen ürünler stoğa girdiğinde anlık bildirim alın.</p>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-2">
                                                    <input className="sr-only peer" type="checkbox"/>
                                                    <div className="w-10 h-5 md:w-11 md:h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 md:after:h-5 md:after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Save Changes CTA */}
                        <div className="pt-8 flex flex-col sm:flex-row justify-end gap-4">
                            <button 
                                onClick={() => window.location.reload()}
                                className="px-8 py-3 text-secondary font-bold hover:bg-surface-container-high rounded-lg transition-all w-full sm:w-auto text-sm"
                            >
                                İptal
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={saving}
                                className={`px-10 py-3 ${saving ? 'bg-primary/70' : 'bg-primary'} text-on-primary font-bold rounded-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95 w-full sm:w-auto text-sm`}
                            >
                                {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

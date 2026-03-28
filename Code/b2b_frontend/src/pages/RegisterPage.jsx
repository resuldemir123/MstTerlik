import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useUserStore } from '../store/useUserStore';

export default function RegisterPage() {
    const navigate = useNavigate();
    const setUser = useUserStore((state) => state.setUser);

    const [loading, setLoading] = useState(false);

    // Form fields
    const [company, setCompany] = useState('');
    const [taxId, setTaxId] = useState('');
    const [city, setCity] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== passwordConfirm) {
            alert("Şifreler uyuşmuyor!");
            return;
        }

        setLoading(true);

        try {
            // Create Firebase Auth user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create Firestore profile document
            const userData = {
                uid: user.uid,
                email: email,
                fullName: fullName,
                phone: phone,
                role: 'retailer', // Explicitly B2B
                company: company,
                taxId: taxId,
                city: city,
                status: 'pending', // Requires admin approval
                createdAt: serverTimestamp(),
            };

            await setDoc(doc(db, 'users', user.uid), userData);

            // Optimistically set Zustand state and Navigate
            const token = await user.getIdToken();
            setUser({ email: user.email, uid: user.uid }, token);

            alert('Kaydınız başarıyla oluşturuldu! Yönlendiriliyorsunuz...');
            navigate('/account');
            
        } catch (error) {
            console.error('Registration failed:', error);
            if (error.code === 'auth/email-already-in-use') {
                alert("Bu e-posta adresi ile zaten bir kayıt mevcut.");
            } else if (error.code === 'auth/weak-password') {
                alert("Şifreniz çok zayıf. Lütfen daha güçlü bir şifre seçin.");
            } else {
                alert("Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface-container-lowest flex font-body">
            {/* Left side: Premium Image */}
            <div className="hidden lg:block lg:w-5/12 relative">
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply z-10"></div>
                <img 
                    src="https://images.unsplash.com/photo-1603483080228-04f2313d9f10?q=80&w=2070&auto=format&fit=crop" 
                    alt="MstTerlik Leather Quality" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-16 left-16 z-20 text-white max-w-sm">
                    <h2 className="font-headline font-extrabold text-4xl mb-4 text-shadow-sm leading-tight">İş Ortaklığımıza<br/>Adım Atın</h2>
                    <p className="font-body text-lg text-white/90 text-shadow-sm">
                        MstTerlik kalitesini müşterilerinize sunmak için hemen başvurun.
                    </p>
                </div>
            </div>

            {/* Right side: Registration Form */}
            <div className="w-full lg:w-7/12 flex items-center justify-center p-8 sm:p-12 lg:p-16 overflow-y-auto">
                <div className="w-full max-w-2xl space-y-10">
                    
                    <div>
                        <Link to="/login" className="inline-flex items-center text-secondary hover:text-primary font-bold text-sm tracking-wide uppercase mb-6 transition-colors">
                            <span className="material-symbols-outlined text-[18px] mr-1">arrow_back</span>
                            Girişe Dön
                        </Link>
                        <h1 className="font-headline font-extrabold text-[2.5rem] tracking-tight text-primary mb-3">
                            Bayilik Başvurusu
                        </h1>
                        <p className="text-secondary font-body">
                            Lütfen aşağıdaki işletme bilgilerinizi eksiksiz doldurun.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        
                        {/* 1. Temel Bilgiler Grid */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-primary border-b border-outline-variant/30 pb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">store</span>
                                İşletme Bilgileri
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1 text-left">
                                    <label className="block text-xs font-bold text-secondary uppercase tracking-wider ml-1">Firma Adı</label>
                                    <input
                                        type="text" required value={company} onChange={(e) => setCompany(e.target.value)}
                                        className="w-full px-4 py-3.5 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary text-on-surface font-medium transition-all text-sm"
                                        placeholder="Ticari Ünvan"
                                    />
                                </div>
                                <div className="space-y-1 text-left">
                                    <label className="block text-xs font-bold text-secondary uppercase tracking-wider ml-1">Vergi Numarası / T.C. Kimlik</label>
                                    <input
                                        type="text" required value={taxId} onChange={(e) => setTaxId(e.target.value)}
                                        className="w-full px-4 py-3.5 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary text-on-surface font-medium transition-all text-sm"
                                        placeholder="VKN veya TCKN"
                                    />
                                </div>
                                <div className="space-y-1 text-left md:col-span-2">
                                    <label className="block text-xs font-bold text-secondary uppercase tracking-wider ml-1">Şehir / İlçe</label>
                                    <input
                                        type="text" required value={city} onChange={(e) => setCity(e.target.value)}
                                        className="w-full px-4 py-3.5 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary text-on-surface font-medium transition-all text-sm"
                                        placeholder="Örn: İstanbul / Başakşehir Merkez Sanayi"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. İletişim Bilgileri Grid */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-primary border-b border-outline-variant/30 pb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">person</span>
                                Yetkili İletişim Bilgileri
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1 text-left">
                                    <label className="block text-xs font-bold text-secondary uppercase tracking-wider ml-1">Yetkili Adı Soyadı</label>
                                    <input
                                        type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                                        className="w-full px-4 py-3.5 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary text-on-surface font-medium transition-all text-sm"
                                        placeholder="Ad Soyad"
                                    />
                                </div>
                                <div className="space-y-1 text-left">
                                    <label className="block text-xs font-bold text-secondary uppercase tracking-wider ml-1">E-Posta Adresi (Giriş İçin)</label>
                                    <input
                                        type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3.5 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary text-on-surface font-medium transition-all text-sm"
                                        placeholder="ornek@firma.com"
                                    />
                                </div>
                                <div className="space-y-1 text-left md:col-span-2">
                                    <label className="block text-xs font-bold text-secondary uppercase tracking-wider ml-1">Telefon / WhatsApp</label>
                                    <input
                                        type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-4 py-3.5 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary text-on-surface font-medium transition-all text-sm"
                                        placeholder="+90 5XX XXX XX XX"
                                    />
                                </div>
                            </div>
                        </div>

                         {/* 3. Şifre Bilgileri Grid */}
                         <div className="space-y-4">
                            <h3 className="font-bold text-primary border-b border-outline-variant/30 pb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">lock</span>
                                Şifre Belirleme
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1 text-left">
                                    <label className="block text-xs font-bold text-secondary uppercase tracking-wider ml-1">Şifre</label>
                                    <input
                                        type="password" required value={password} onChange={(e) => setPassword(e.target.value)} minLength={6}
                                        className="w-full px-4 py-3.5 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary text-on-surface font-medium transition-all text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="space-y-1 text-left">
                                    <label className="block text-xs font-bold text-secondary uppercase tracking-wider ml-1">Şifre Tekrar</label>
                                    <input
                                        type="password" required value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} minLength={6}
                                        className="w-full px-4 py-3.5 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary text-on-surface font-medium transition-all text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4.5 px-6 rounded-xl font-bold font-body text-white transition-all duration-300 shadow-xl shadow-primary/20 text-lg uppercase tracking-wide ${
                                    loading 
                                        ? 'bg-primary/70 cursor-not-allowed' 
                                        : 'bg-primary hover:bg-primary-container hover:scale-[1.01] active:scale-[0.98]'
                                }`}
                                style={{ paddingTop: '1.125rem', paddingBottom: '1.125rem' }}
                            >
                                {loading ? 'BAŞVURU GÖNDERİLİYOR...' : 'BAŞVURUYU TAMAMLA'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

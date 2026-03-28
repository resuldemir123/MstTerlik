import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useUserStore } from '../store/useUserStore';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const setUser = useUserStore((state) => state.setUser);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();
            setUser({ email: userCredential.user.email, uid: userCredential.user.uid }, token);
            navigate('/account');
        } catch (error) {
            console.error('Login failed:', error);
            alert("Giriş bilgileri hatalı. Lütfen e-posta ve şifrenizi kontrol edin.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface-container-lowest flex font-body">
            {/* Left side: Premium Image */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply z-10"></div>
                <img 
                    src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2080&auto=format&fit=crop" 
                    alt="MstTerlik B2B Platform" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-16 left-16 z-20 text-white max-w-lg">
                    <h2 className="font-headline font-extrabold text-5xl mb-4 text-shadow-sm">MstTerlik Toptan</h2>
                    <p className="font-body text-xl text-white/90 text-shadow-sm leading-relaxed">
                        Sadece onaylı bayilerimize özel perakende fiyatları ve yeni sezon ürünleri.
                    </p>
                </div>
            </div>

            {/* Right side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16">
                <div className="w-full max-w-md space-y-12">
                    
                    <div className="text-center lg:text-left">
                        <h1 className="font-headline font-extrabold text-[2.5rem] tracking-tight text-primary mb-3">
                            Hoş Geldiniz
                        </h1>
                        <p className="text-secondary font-body">
                            Sisteme giriş yaparak siparişlerinizi ve fiyatları görüntüleyin.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-1 text-left">
                            <label className="block text-sm font-bold text-secondary uppercase tracking-wider ml-1">
                                E-posta Adresi
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary text-on-surface font-medium transition-all"
                                placeholder="ornek@firma.com"
                            />
                        </div>

                        <div className="space-y-1 text-left relative">
                            <div className="flex justify-between items-center ml-1 mb-1">
                                <label className="block text-sm font-bold text-secondary uppercase tracking-wider">
                                    Şifre
                                </label>
                                <a href="#" className="text-xs font-bold text-primary hover:text-primary-container transition-colors uppercase tracking-wider">
                                    Şifremi Unuttum
                                </a>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-4 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary text-on-surface font-medium transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 px-6 rounded-xl font-bold font-body text-white transition-all duration-300 shadow-xl shadow-primary/20 ${
                                loading ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-primary-container hover:scale-[1.02] active:scale-[0.98]'
                            }`}
                        >
                            {loading ? 'Giriş Yapılıyor...' : 'GİRİŞ YAP'}
                        </button>
                    </form>

                    <div className="text-center pt-8 border-t border-outline-variant/20">
                        <p className="text-secondary font-medium mb-4">Bayi değil misiniz?</p>
                        <Link 
                            to="/register" 
                            className="inline-block border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold px-8 py-3 rounded-xl transition-colors w-full sm:w-auto uppercase tracking-wide text-sm"
                        >
                            Başvurun
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}

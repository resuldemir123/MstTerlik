import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';

export default function Navbar() {
    const isAuthenticated = useUserStore((state) => state.isAuthenticated);
    const user = useUserStore((state) => state.user);
    const logout = useUserStore((state) => state.logout);
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    const navLinkClass = (path) => 
        `font-['Inter'] text-sm tracking-wide transition-colors duration-200 px-1 py-1 ${isActive(path) ? 'text-primary border-b-2 border-primary font-bold' : 'text-slate-500 hover:text-primary font-medium'}`;

    return (
        <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/40 sticky top-0 z-50">
            <div className="flex justify-between items-center w-full px-6 py-4 max-w-[1440px] mx-auto">
                <div className="flex items-center gap-8 md:gap-12">
                    <Link to="/" className="text-2xl font-black text-primary tracking-tighter">
                        MstTerlik
                    </Link>
                    
                    {isAuthenticated && (
                        <nav className="hidden md:flex gap-6 lg:gap-8 items-center pt-1">
                            <Link to="/orders" className={navLinkClass('/orders')}>
                                Siparişler
                            </Link>
                            <Link to="/products" className={navLinkClass('/products')}>
                                Ürün Kataloğu
                            </Link>
                            <Link to="/account" className={navLinkClass('/account')}>
                                Ayarlar
                            </Link>
                        </nav>
                    )}
                </div>

                <div className="flex items-center gap-3 lg:gap-5">
                    {isAuthenticated ? (
                        <>
                            <div className="hidden lg:flex items-center gap-2 mr-2">
                                <button onClick={() => navigate('/account')} className="p-2 text-primary hover:bg-surface-container-high rounded-full transition-all duration-200 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
                                </button>
                                <button onClick={() => { logout(); navigate('/'); }} className="p-2 text-secondary hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 flex items-center justify-center" title="Çıkış Yap">
                                    <span className="material-symbols-outlined text-[22px]">logout</span>
                                </button>
                            </div>
                            
                            <button 
                                onClick={() => navigate('/cart')} 
                                className="bg-primary text-white hover:bg-primary-container transition-all duration-200 px-4 lg:px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold text-sm shadow-sm"
                            >
                                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
                                <span className="hidden sm:inline">Sepetim</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-slate-500 hover:text-primary transition-colors font-['Inter'] text-sm font-medium tracking-wide hidden sm:block">
                                Giriş Yap
                            </Link>
                            <Link to="/register" className="bg-primary hover:bg-primary-container text-white transition-all duration-200 px-5 py-2.5 rounded-lg font-semibold text-sm tracking-wide shadow-sm">
                                Kayıt Ol
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

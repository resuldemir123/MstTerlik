import React, { useEffect, useState } from 'react';
import loadingBg from './assets/loading_bg_terlik.png';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebase';
import { useUserStore } from './store/useUserStore';

import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import AccountPage from './pages/AccountPage';
import ProtectedRoute from './components/ProtectedRoute';
import ExamplePage from './pages/ExamplePage';

function App() {
  const setUser = useUserStore((state) => state.setUser);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Oturum açan kullanıcının güncel token'ını alıyoruz.
          const token = await currentUser.getIdToken();
          setUser({ email: currentUser.email, uid: currentUser.uid }, token);
        } catch (error) {
          console.error("Firebase token hatası:", error);
          setUser({ email: currentUser.email, uid: currentUser.uid }, "fallback-token");
        }
      } else {
        setUser(null, null);
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, [setUser]);

  if (!isAuthReady) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden font-headline">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform"
          style={{ 
            backgroundImage: `url(${loadingBg})`,
            animation: 'zoom-slow 20s infinite alternate ease-in-out'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-12 opacity-90 text-center">
             <h1 className="text-5xl md:text-7xl font-extrabold tracking-[0.25em] text-white uppercase drop-shadow-2xl">
               MST<span className="text-primary-fixed-dim">TERLİK</span>
             </h1>
             <p className="text-[10px] font-bold tracking-[0.6em] text-white/50 uppercase mt-4">
               The Art of Quality Footwear
             </p>
          </div>
          
          <div className="flex flex-col items-center gap-6">
            <div className="w-64 h-[2px] bg-white/10 relative overflow-hidden backdrop-blur-sm">
              <div 
                className="absolute inset-y-0 w-1/3 bg-white/60 blur-[1px]" 
                style={{ animation: 'loading-progress 2s infinite ease-in-out' }}
              />
            </div>
            <p className="text-[11px] font-black tracking-[0.5em] text-white uppercase animate-pulse">
              Yükleniyor...
            </p>
          </div>
        </div>
        
        {/* Footer Branding */}
        <div className="absolute bottom-12 text-[10px] font-bold tracking-[0.4em] text-white/20 uppercase flex items-center gap-4">
           <span>Digital Showroom</span>
           <span className="w-1 h-1 rounded-full bg-white/20" />
           <span>Wholesale Portal</span>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Navbar />
      <div className="pt-0"> {/* Wrapper if needed */}
        <Routes>
          {/* Public Core Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/example" element={<ExamplePage />} />
          
          {/* Publicly Browsable Shop Routes */}
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          
          {/* Protected Routes (Require Login) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/account" element={<AccountPage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

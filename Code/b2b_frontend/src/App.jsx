import React, { useEffect, useState } from 'react';
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
    return <div className="min-h-screen bg-surface-container flex items-center justify-center text-[#000666] font-bold tracking-widest uppercase">Yukleniyor...</div>;
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

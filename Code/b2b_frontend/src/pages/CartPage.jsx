import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '../store/useOrderStore';
import { ordersApi } from '../api/ordersApi';

export default function CartPage() {
    const navigate = useNavigate();
    const { cartItems, totalPairs, totalAmount, removeFromCart, clearCart } = useOrderStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const taxAmount = totalAmount * 0.20;
    const finalTotal = totalAmount + taxAmount;

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;
        setIsSubmitting(true);
        try {
            const orderPayload = {
                items: cartItems.map(item => ({
                    variant_id: item.variant_id,
                    product_id: item.product_id,
                    color: item.color,
                    sizes: item.sizes
                })),
                total_amount: finalTotal
            };
            await ordersApi.createOrder(orderPayload);
            alert("Sipariş başarıyla oluşturuldu!");
            clearCart();
            navigate('/');
        } catch (error) {
            console.error(error);
            alert("Sipariş oluşturulurken hata oluştu. Stok yetersiz olabilir, lütfen tekrar deneyin.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-body">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-headline font-bold text-[#000666] mb-8">Sipariş Sepeti</h1>
                
                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">shopping_bag</span>
                        <h2 className="text-xl font-bold text-slate-700 mb-2">Sepetiniz Boş</h2>
                        <p className="text-slate-500 mb-6">Toptan ürün serilerimizi incelemek için alışverişe başlayın.</p>
                        <button onClick={() => navigate('/products')} className="bg-[#000666] text-white px-8 py-3 rounded-[4px] font-bold tracking-widest uppercase text-xs hover:bg-[#1a237e] transition-colors">
                            Koleksiyonu İncele
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                            {cartItems.map((item) => (
                                <div key={item.variant_id} className="p-6 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <div className="w-20 h-20 bg-slate-100 rounded-[4px] overflow-hidden flex-shrink-0">
                                            {item.image ? (
                                                <img src={item.image.replace(/^"|"$/g, '')} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-slate-300">image</span></div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-[#000666]">{item.name}</h3>
                                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">Varyant: <span className="text-[#000666]">{item.color}</span></p>
                                            <p className="text-slate-400 text-[10px] font-bold mt-1">
                                                Bedenler: {Object.entries(item.sizes).map(([s, q]) => `${s} (${q})`).join(', ')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 mt-6 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                                        <div className="text-center w-24">
                                            <span className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1">Miktar</span>
                                            <span className="font-bold text-slate-800">{item.totalPairs} Çift</span>
                                        </div>
                                        <div className="text-center w-24">
                                            <span className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1">Birim Fiyat</span>
                                            <span className="font-bold text-slate-800">${item.unitPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="text-center w-28">
                                            <span className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1">Ara Toplam</span>
                                            <span className="font-bold text-[#000666] text-lg">${item.totalAmount.toFixed(2)}</span>
                                        </div>
                                        <button onClick={() => removeFromCart(item.variant_id)} className="text-slate-300 hover:text-red-500 font-bold p-2 transition-colors">
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row justify-between items-center">
                            <div>
                                <button onClick={() => navigate('/products')} className="text-[#000666] font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[14px]">arrow_back</span> Alışverişe Devam Et
                                </button>
                            </div>
                            <div className="text-right mt-6 md:mt-0 w-full md:w-auto">
                                <div className="space-y-2 mb-4 text-sm">
                                    <p className="flex justify-between md:justify-end gap-12 font-medium text-slate-600">
                                        <span>Ara Toplam ({totalPairs} Çift):</span>
                                        <span className="font-bold text-slate-800">${totalAmount.toFixed(2)}</span>
                                    </p>
                                    <p className="flex justify-between md:justify-end gap-12 font-medium text-slate-600">
                                        <span>KDV (%20):</span>
                                        <span className="font-bold text-slate-800">${taxAmount.toFixed(2)}</span>
                                    </p>
                                </div>
                                <div className="border-t border-slate-200 pt-4 mb-6">
                                    <div className="flex justify-between md:justify-end gap-12 items-end">
                                        <span className="uppercase text-[10px] font-bold tracking-widest text-slate-400 mb-1">Genel Toplam</span>
                                        <h2 className="text-3xl font-headline font-extrabold text-[#000666]">${finalTotal.toFixed(2)}</h2>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleCheckout} 
                                    disabled={isSubmitting}
                                    className="w-full md:w-auto bg-[#000666] text-white px-10 py-4 rounded-[4px] font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#1a237e] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        "İŞLENİYOR..."
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-lg">check_circle</span>
                                            Siparişi Tamamla
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

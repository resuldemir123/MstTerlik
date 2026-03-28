import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '../api/ordersApi';
import { useUserStore } from '../store/useUserStore';

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const data = await ordersApi.getOrderHistory();
                // Sort by descending created_at
                const sorted = data.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
                setOrders(sorted);
                if (sorted.length > 0) {
                    setSelectedOrder(sorted[0]);
                }
            } catch (error) {
                console.error("Siparişler çekilemedi:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(o => {
        if (filter === 'all') return true;
        if (filter === 'pending') return o.status === 'beklemede' || o.status === 'onaylandi';
        if (filter === 'completed') return o.status === 'kargoya_verildi' || o.status === 'iptal_edildi';
        return true;
    });

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('tr-TR', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    if (loading) {
        return <div className="min-h-screen flex justify-center items-center text-primary font-bold tracking-widest uppercase">Yükleniyor...</div>;
    }

    return (
        <div className="bg-surface text-on-surface min-h-[calc(100vh-80px)] flex flex-col font-body">
            <main className="flex-grow max-w-[1440px] mx-auto w-full px-4 lg:px-8 py-8 lg:py-12">
                
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-extrabold tracking-tight text-primary font-headline">Siparişlerim</h1>
                        <p className="text-secondary font-medium uppercase tracking-widest text-xs">Toplam {orders.length} Sipariş Bulundu</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex bg-surface-container-low p-1 rounded-lg">
                            <button 
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${filter === 'all' ? 'bg-white shadow-sm text-primary' : 'text-secondary hover:text-primary'}`}>
                                Tümü
                            </button>
                            <button 
                                onClick={() => setFilter('pending')}
                                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${filter === 'pending' ? 'bg-white shadow-sm text-primary' : 'text-secondary hover:text-primary'}`}>
                                Devam Eden
                            </button>
                            <button 
                                onClick={() => setFilter('completed')}
                                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${filter === 'completed' ? 'bg-white shadow-sm text-primary' : 'text-secondary hover:text-primary'}`}>
                                Tamamlanan
                            </button>
                        </div>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-100">
                        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">inbox</span>
                        <h3 className="text-xl font-bold text-primary mb-2 font-headline">Henüz Bir Siparişiniz Yok</h3>
                        <p className="text-secondary">Toptan sipariş vermek için ürünler kataloğumuzu inceleyebilirsiniz.</p>
                        <button 
                            onClick={() => navigate('/products')}
                            className="mt-6 bg-[#000666] text-white px-6 py-3 rounded-md font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity"
                        >
                            Kataloğa Git
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Order List Sidebar */}
                        <section className="lg:col-span-4 xl:col-span-5 space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                            {filteredOrders.map(order => {
                                const isSelected = selectedOrder?.id === order.id;
                                return (
                                    <div 
                                        key={order.id}
                                        onClick={() => setSelectedOrder(order)}
                                        className={`p-6 rounded-xl transition-all cursor-pointer group ${isSelected ? 'bg-surface-container-lowest shadow-[0_4px_20px_-4px_rgba(0,6,102,0.08)] border-l-4 border-primary' : 'bg-surface-container-lowest hover:bg-surface-container-low border border-transparent'}`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                {isSelected && <span className="text-xs font-bold text-primary-container bg-primary-fixed px-2 py-0.5 rounded mb-2 inline-block">SEÇİLİ</span>}
                                                <h3 className={`font-headline font-bold text-lg transition-colors ${isSelected ? 'text-primary' : 'text-on-surface group-hover:text-primary'}`}>
                                                    #{order.id.substring(0, 8).toUpperCase()}
                                                </h3>
                                                <p className="text-xs text-secondary">{formatDate(order.created_at)}</p>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                                                    {order.total_amount ? order.total_amount.toLocaleString('tr-TR') : '0'} TL
                                                </span>
                                                {(() => {
                                                    const statusMap = {
                                                        'beklemede': { bg: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500', label: 'Beklemede' },
                                                        'onaylandi': { bg: 'bg-blue-100 text-blue-800', dot: 'bg-blue-500', label: 'Onaylandı' },
                                                        'kargoya_verildi': { bg: 'bg-green-100 text-green-800', dot: 'bg-green-500', label: 'Kargoya Verildi' },
                                                        'iptal_edildi': { bg: 'bg-red-100 text-red-800', dot: 'bg-red-500', label: 'İptal Edildi' }
                                                    };
                                                    const s = statusMap[order.status] || { bg: 'bg-slate-100 text-slate-800', dot: 'bg-slate-400', label: order.status || 'Bilinmiyor' };
                                                    return (
                                                        <span className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${s.bg}`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
                                                            {s.label}
                                                        </span>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </section>

                        {/* Expanded Details Canvas */}
                        {selectedOrder && (
                            <section className="lg:col-span-8 xl:col-span-7 bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100/50">
                                <div className="flex flex-col sm:flex-row justify-between items-start border-b border-outline-variant/20 pb-8 mb-8 gap-4">
                                    <div>
                                        <h2 className="text-2xl font-extrabold text-primary mb-1 font-headline">Sipariş Detayı</h2>
                                        <p className="text-secondary text-sm">Sipariş ID: <span className="font-mono font-bold text-on-surface">#{selectedOrder.id}</span></p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-4 py-2 text-xs font-bold border border-outline-variant rounded-lg hover:bg-surface-container transition-colors flex items-center gap-2 text-secondary">
                                            <span className="material-symbols-outlined text-sm">receipt_long</span>
                                            Fatura İndir
                                        </button>
                                    </div>
                                </div>

                                {/* Items List */}
                                <div className="space-y-8">
                                    {selectedOrder.items && selectedOrder.items.map((item, idx) => {
                                        const cleanImg = typeof item.image === 'string' ? item.image.replace(/^"|"$/g, '') : "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80";
                                        const totalPairs = item.totalPairs || Object.values(item.sizes || {}).reduce((a,b)=>a+b, 0);

                                        return (
                                            <div key={idx} className="flex flex-col md:flex-row gap-6">
                                                <div className="w-full md:w-32 aspect-square rounded-xl bg-surface-container overflow-hidden shrink-0">
                                                    <img src={cleanImg} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="text-lg font-bold text-primary font-headline">{item.name || item.product_id}</h4>
                                                        <span className="text-lg font-bold">{(item.unitPrice * totalPairs).toLocaleString('tr-TR')} TL</span>
                                                    </div>
                                                    <div className="flex gap-4 text-xs font-semibold text-secondary mb-4">
                                                        <span className="flex items-center gap-1">
                                                            <span className="w-2 h-2 rounded-full bg-slate-400"></span> {item.color || 'Standart'}
                                                        </span>
                                                        <span>Birim Fiyat: {item.unitPrice} TL</span>
                                                    </div>

                                                    {/* Size Matrix */}
                                                    <div className="bg-surface-container-low rounded-xl p-4 overflow-x-auto">
                                                        <table className="w-full text-left border-collapse min-w-max">
                                                            <thead>
                                                                <tr>
                                                                    <th className="pb-3 text-[10px] font-bold text-outline uppercase tracking-widest px-2">Numara</th>
                                                                    {Object.keys(item.sizes || {}).sort((a,b)=>a-b).map(size => (
                                                                        <th key={size} className="pb-3 text-[10px] font-bold text-outline uppercase tracking-widest px-2 text-center">{size}</th>
                                                                    ))}
                                                                    <th className="pb-3 text-[10px] font-bold text-primary uppercase tracking-widest px-2 text-right">Toplam</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="font-medium text-sm">
                                                                <tr>
                                                                    <td className="py-2 px-2 text-secondary">Miktar</td>
                                                                    {Object.entries(item.sizes || {}).sort((a,b)=>a[0]-b[0]).map(([size, qty]) => (
                                                                        <td key={size} className={`py-2 px-2 text-center ${qty > 0 ? 'text-primary font-bold' : 'text-outline'}`}>
                                                                            {qty}
                                                                        </td>
                                                                    ))}
                                                                    <td className="py-2 px-2 text-primary font-extrabold bg-white/50 rounded text-right">{totalPairs}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Summary */}
                                <div className="bg-surface p-6 rounded-2xl flex flex-col gap-3 mt-8">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-secondary">Ara Toplam</span>
                                        <span className="font-semibold text-on-surface">{selectedOrder.total_amount ? selectedOrder.total_amount.toLocaleString('tr-TR') : '0'} TL</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-secondary">Kargo</span>
                                        <span className="font-semibold text-on-surface">Ücretsiz (B2B)</span>
                                    </div>
                                    <div className="h-px bg-outline-variant/10 my-2"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-primary">Toplam</span>
                                        <span className="text-2xl font-black text-primary">{selectedOrder.total_amount ? selectedOrder.total_amount.toLocaleString('tr-TR') : '0'} TL</span>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { useOrderStore } from '../store/useOrderStore';
import { productsApi } from '../api/productsApi';

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isAuthenticated = useUserStore((state) => state.isAuthenticated);
    const addToCart = useOrderStore((state) => state.addToCart);

    const [product, setProduct] = useState(null);
    const [variants, setVariants] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [loading, setLoading] = useState(true);

    const [selectedImage, setSelectedImage] = useState("");
    const [quantities, setQuantities] = useState({});
    const [selectedPack, setSelectedPack] = useState(null);
    const [debouncedTotals, setDebouncedTotals] = useState({ pairs: 0, amount: 0 });

    const FALLBACK_IMAGES = [
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1535043934128-d788934dfde2?auto=format&fit=crop&w=800&q=80"
    ];

    const getCleanImages = (rawImages) => {
        if (!rawImages || !Array.isArray(rawImages) || rawImages.length === 0) {
            return FALLBACK_IMAGES;
        }
        const cleaned = rawImages.map(img => {
            if (typeof img === 'string') return img.replace(/^"|"$/g, '');
            if (img && typeof img.url === 'string') return img.url.replace(/^"|"$/g, '');
            return null;
        }).filter(Boolean);
        return cleaned.length > 0 ? cleaned : FALLBACK_IMAGES;
    };

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const [prodData, variantsData] = await Promise.all([
                    productsApi.getProduct(id),
                    productsApi.getProductVariants(id)
                ]);
                
                setProduct(prodData);
                setVariants(variantsData);
                
                if (variantsData && variantsData.length > 0) {
                    const initialVariant = variantsData[0];
                    setSelectedVariant(initialVariant);
                    const safeImages = getCleanImages(initialVariant.images);
                    setSelectedImage(safeImages[0]);
                } else if (prodData && prodData.image) {
                    setSelectedImage(typeof prodData.image === 'string' ? prodData.image.replace(/^"|"$/g, '') : FALLBACK_IMAGES[0]);
                } else {
                    setSelectedImage(FALLBACK_IMAGES[0]);
                }
            } catch (error) {
                console.error("Failed to load product details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    useEffect(() => {
        if (selectedVariant && selectedVariant.stock_matrix) {
            setQuantities(
                Object.keys(selectedVariant.stock_matrix).reduce((acc, size) => ({ ...acc, [size]: 0 }), {})
            );
            setSelectedPack(null);
            
            const safeImages = getCleanImages(selectedVariant.images);
            setSelectedImage(safeImages[0]);
        }
    }, [selectedVariant]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const totalPairs = Object.values(quantities).reduce((a, b) => a + b, 0);
            const price = product ? product.base_price : 0;
            setDebouncedTotals({
                pairs: totalPairs,
                amount: totalPairs * price
            });
        }, 300);
        return () => clearTimeout(timer);
    }, [quantities, product]);

    const handleQuantityChange = (size, value) => {
        let val = parseInt(value, 10);
        if (isNaN(val) || val < 0) val = 0;
        
        const maxStock = selectedVariant.stock_matrix[size] || 0;
        if (val > maxStock) val = maxStock;
        
        setQuantities(prev => ({ ...prev, [size]: val }));
        setSelectedPack(null);
    };

    const applyPack = (packType) => {
        if (!selectedVariant) return;
        setSelectedPack(packType);
        
        // Only apply pack logic if stock allows, for mock demonstration we will just apply it blindly, 
        // but it's better to cap at maxStock. Here we cap strictly.
        if (packType === 'A') {
            const requested = { "36": 3, "37": 4, "38": 3 };
            const capped = { ...quantities };
            Object.keys(requested).forEach(size => {
                capped[size] = Math.min(requested[size], selectedVariant.stock_matrix[size] || 0);
            });
            setQuantities(capped);
        } else if (packType === 'B') {
            const requested = { "38": 2, "39": 5, "40": 3 };
            const capped = { ...quantities };
            Object.keys(requested).forEach(size => {
                capped[size] = Math.min(requested[size], selectedVariant.stock_matrix[size] || 0);
            });
            setQuantities(capped);
        }
    };

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (debouncedTotals.pairs === 0) {
            alert('Lütfen en az bir adet ürün seçin.');
            return;
        }
        
        // Build sizes payload omitting zeros
        const activeSizes = {};
        Object.entries(quantities).forEach(([s, q]) => {
            if (q > 0) activeSizes[s] = q;
        });

        addToCart({
            variant_id: selectedVariant.id,
            product_id: product.id,
            name: product.name || 'B2B Product',
            color: selectedVariant.color || 'Standart',
            image: selectedImage,
            sizes: activeSizes,
            totalPairs: debouncedTotals.pairs,
            totalAmount: debouncedTotals.amount,
            unitPrice: product.base_price || 0
        });

        navigate('/cart');
    };

    if (loading) {
        return <div className="min-h-screen bg-white flex items-center justify-center font-headline text-3xl font-bold text-slate-300 animate-pulse">LOADING DETAILS...</div>;
    }

    if (!product || !selectedVariant) {
        return <div className="min-h-screen flex items-center justify-center p-8 text-xl">Product or variants not found.</div>;
    }

    return (
        <div className="min-h-screen bg-white font-body selection:bg-primary selection:text-white pb-32">
            <div className="max-w-[1440px] mx-auto px-6 pt-10">
                {/* Main Split Layout */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                    
                    {/* Left: Media Gallery */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-4">
                        <div className="w-full aspect-[4/5] bg-surface-container-low rounded-[4px] overflow-hidden relative group">
                            {selectedImage ? (
                                <img 
                                    src={selectedImage} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <span className="material-symbols-outlined text-6xl text-slate-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">image</span>
                            )}
                            <button className="absolute bottom-6 right-6 w-12 h-12 bg-white/90 backdrop-blur rounded flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                                <span className="material-symbols-outlined text-primary">zoom_in</span>
                            </button>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {getCleanImages(selectedVariant.images).slice(0, 4).map((cleanImg, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={() => setSelectedImage(cleanImg)}
                                    className={`aspect-square bg-surface-container-low rounded-[4px] overflow-hidden cursor-pointer border-2 transition-all ${selectedImage === cleanImg ? 'border-primary' : 'border-transparent hover:border-slate-300'}`}
                                >
                                    <img src={cleanImg} alt={`Thumb ${idx}`} className="w-full h-full object-cover opacity-90 hover:opacity-100 mix-blend-multiply" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Details & Matrix */}
                    <div className="w-full lg:w-1/2 flex flex-col pt-2 lg:pt-8 pr-0 lg:pr-12">
                        
                        {/* Header Info */}
                        <div className="mb-6">
                            <div className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mb-4">
                                {product.gender === 'male' ? 'MEN' : 'WOMEN'} / COLLECTION
                            </div>
                            <h1 className="font-headline text-4xl lg:text-5xl font-extrabold text-[#000666] tracking-tight mb-4 leading-[1.1]">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4 text-sm font-semibold text-slate-600">
                                <span>SKU: {product.code}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                <span>Wholesale MSRP: ${product.base_price ? product.base_price.toFixed(2) : '0.00'}</span>
                            </div>
                        </div>

                        {/* Variants Picker */}
                        {variants.length > 1 && (
                            <div className="mb-8 p-4 bg-slate-50 border border-slate-100 rounded-md">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Available Colors</h4>
                                <div className="flex gap-3">
                                    {variants.map(v => (
                                        <button 
                                            key={v.id} 
                                            onClick={() => setSelectedVariant(v)}
                                            style={{ backgroundColor: v.color_hex || '#ccc' }}
                                            className={`w-8 h-8 rounded-full border-2 transition-transform ${selectedVariant.id === v.id ? 'border-[#000666] scale-110 shadow-md' : 'border-transparent hover:scale-105'}`}
                                            title={v.color}
                                        />
                                    ))}
                                </div>
                                <div className="mt-2 text-sm font-semibold text-[#000666]">{selectedVariant.color}</div>
                            </div>
                        )}

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-y-8 gap-x-4 py-8 border-y border-slate-100 mb-10">
                            <div>
                                <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Material</h4>
                                <p className="text-[13px] font-bold text-[#000666]">Primeknit & EVA Foam</p>
                            </div>
                            <div>
                                <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Sole Type</h4>
                                <p className="text-[13px] font-bold text-[#000666]">Anti-Slip Orthopedic</p>
                            </div>
                            <div>
                                <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Origin</h4>
                                <p className="text-[13px] font-bold text-[#000666]">Istanbul, TR</p>
                            </div>
                            <div>
                                <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Certification</h4>
                                <p className="text-[13px] font-bold text-[#000666]">ISO 9001 Compliant</p>
                            </div>
                        </div>

                        {/* Inventory Matrix FRS Section */}
                        <div className="mb-10">
                            <div className="flex justify-between items-end mb-4 px-2">
                                <h3 className="font-headline text-lg font-bold text-[#000666]">Inventory Matrix ({selectedVariant.color})</h3>
                                <div className="flex gap-4 text-[9px] font-bold uppercase tracking-widest">
                                    <span className="flex items-center gap-1.5 text-slate-600"><span className="w-1.5 h-1.5 rounded-full bg-[#000666]"></span> IN STOCK</span>
                                    <span className="flex items-center gap-1.5 text-slate-400"><span className="w-1.5 h-1.5 rounded-full bg-red-600"></span> SOLD OUT</span>
                                </div>
                            </div>
                            
                            <div className="bg-slate-50/50 rounded-lg p-2 md:p-6 border border-slate-100">
                                <div className="grid grid-cols-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-4 px-4 border-b border-slate-200/60 pb-3">
                                    <div>SIZE (EU)</div>
                                    <div className="text-center">STATUS</div>
                                    <div className="text-right">QTY</div>
                                </div>
                                
                                <div className="space-y-1">
                                    {Object.entries(selectedVariant.stock_matrix || {}).sort((a,b) => parseInt(a[0])-parseInt(b[0])).map(([size, stock]) => {
                                        const isOut = stock === 0;
                                        let statusText = isOut ? "Out of Stock" : (stock >= 50 ? `${stock}+ available` : `${stock} units`);
                                        let statusColor = isOut ? 'text-red-500' : 'text-slate-500';
                                        
                                        return (
                                            <div key={size} className="grid grid-cols-3 items-center py-2 px-4 hover:bg-white transition-colors rounded">
                                                <div className={`font-bold text-sm ${isOut ? 'text-[#000666]/50' : 'text-[#000666]'}`}>{size}</div>
                                                <div className={`text-[11px] font-semibold text-center ${statusColor}`}>{statusText}</div>
                                                <div className="flex justify-end">
                                                    {isOut ? (
                                                        <div className="w-16 h-8 bg-slate-100 flex items-center justify-center text-slate-400 font-bold rounded text-sm">-</div>
                                                    ) : (
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max={stock}
                                                            value={quantities[size] || 0}
                                                            onChange={(e) => handleQuantityChange(size, e.target.value)}
                                                            className="w-16 h-8 border border-slate-200 rounded-[3px] text-center text-sm font-bold text-[#000666] focus:border-[#000666] focus:ring-1 focus:ring-[#000666] outline-none"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Assorted Box Selection */}
                        <div className="bg-slate-50 rounded-lg p-6 border border-[#1e3a8a]/20 mb-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#1e3a8a]"></div>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="font-headline text-[15px] font-bold text-[#000666] mb-1">Assorted Box Selection</h3>
                                    <p className="text-[11px] text-slate-500 font-medium">Optimized retail distribution packs</p>
                                </div>
                                <span className="material-symbols-outlined text-slate-400 text-2xl">inventory_2</span>
                            </div>

                            <div className="space-y-3">
                                <label className={`flex items-center justify-between p-4 bg-white border rounded cursor-pointer transition-colors ${selectedPack === 'A' ? 'border-[#000666] shadow-sm' : 'border-slate-200'}`}>
                                    <div className="flex gap-4">
                                        <input type="radio" name="boxPack" checked={selectedPack === 'A'} onChange={() => applyPack('A')} className="w-4 h-4 mt-0.5 text-[#000666] focus:ring-[#000666] border-slate-300" />
                                        <div>
                                            <div className="font-bold text-[13px] text-[#000666] mb-1">Pack A: Standard Distribution</div>
                                            <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">3X36, 4X37, 3X38</div>
                                        </div>
                                    </div>
                                    <div className="font-headline font-bold text-[#000666] text-[15px]">${((product.base_price || 0) * 10).toFixed(2)}</div>
                                </label>

                                <label className={`flex items-center justify-between p-4 bg-white border rounded cursor-pointer transition-colors ${selectedPack === 'B' ? 'border-[#000666] shadow-sm' : 'border-slate-200'}`}>
                                    <div className="flex gap-4">
                                        <input type="radio" name="boxPack" checked={selectedPack === 'B'} onChange={() => applyPack('B')} className="w-4 h-4 mt-0.5 text-[#000666] focus:ring-[#000666] border-slate-300" />
                                        <div>
                                            <div className="font-bold text-[13px] text-[#000666] mb-1">Pack B: Large Size Bias</div>
                                            <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">2X38, 5X39, 3X40</div>
                                        </div>
                                    </div>
                                    <div className="font-headline font-bold text-[#000666] text-[15px]">${((product.base_price || 0) * 10).toFixed(2)}</div>
                                </label>
                            </div>
                        </div>

                        {/* Sticky Bottom Bar for Ordering */}
                        <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 lg:p-6 z-40 transform transition-transform duration-300 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex gap-8 lg:gap-16 w-full md:w-auto px-4 lg:ml-20">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Total Pairs</p>
                                    <p className="font-headline font-extrabold text-2xl text-[#000666]">{debouncedTotals.pairs}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Total Amount</p>
                                    <p className="font-headline font-extrabold text-2xl text-[#000666]">${debouncedTotals.amount.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="w-full md:w-auto px-4 lg:mr-20">
                                <button 
                                    onClick={handleAddToCart}
                                    className="w-full md:w-64 bg-[#000666] text-white py-4 rounded-[4px] font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-primary-container transition-all flex items-center justify-center gap-3 shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={debouncedTotals.pairs === 0}
                                >
                                    <span className="material-symbols-outlined text-lg">shopping_bag</span>
                                    ADD ORDER TO CART
                                </button>
                                <p className="text-[9px] font-bold tracking-[0.2em] text-slate-400 uppercase text-center mt-2">
                                    CURRENT LEAD TIME: 4-6 BUSINESS DAYS
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Bottom Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-24 mt-20 border-t border-slate-100">
                    <div>
                        <div className="text-slate-200 font-headline font-extrabold text-5xl mb-4">01.</div>
                        <h4 className="font-headline font-bold text-[#000666] text-lg mb-3">Upper Architecture</h4>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                            Engineered mesh paired with sustainable Italian suede overlays provides maximum durability and breathability for long-duration wear.
                        </p>
                    </div>
                    <div>
                        <div className="text-slate-200 font-headline font-extrabold text-5xl mb-4">02.</div>
                        <h4 className="font-headline font-bold text-[#000666] text-lg mb-3">Traction System</h4>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                            Our proprietary multi-directional lug pattern ensures stability on both industrial surfaces and street terrain.
                        </p>
                    </div>
                    <div>
                        <div className="text-slate-200 font-headline font-extrabold text-5xl mb-4">03.</div>
                        <h4 className="font-headline font-bold text-[#000666] text-lg mb-3">B2B Compliance</h4>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                            Full traceability documentation provided with each order. Retail-ready packaging with UPC barcodes pre-labeled.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

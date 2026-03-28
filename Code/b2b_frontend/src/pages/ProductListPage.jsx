import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { productsApi } from '../api/productsApi';

export default function ProductListPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialCategoryParam = queryParams.get('category');
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [selectedCategories, setSelectedCategories] = useState(
        initialCategoryParam ? [initialCategoryParam === 'men' ? 'Men' : 'Women'] : []
    );
    const [selectedMaterials, setSelectedMaterials] = useState([]);
    const [selectedStyle, setSelectedStyle] = useState('');
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [priceLimit, setPriceLimit] = useState(2000);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Fetch all products
                const data = await productsApi.getProducts();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Filter Logic
    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            // Category checking
            const pCat = p.gender === 'male' ? 'Men' : p.gender === 'female' ? 'Women' : 'Unisex';
            if (selectedCategories.length > 0 && !selectedCategories.includes(pCat)) {
                return false;
            }

            // Material checking (mocked via name as fallback)
            const lowerName = (p.name || '').toLowerCase();
            const pMat = lowerName.includes('leather') ? 'Leather' : lowerName.includes('suede') ? 'Suede' : 'Textile';
            if (selectedMaterials.length > 0 && !selectedMaterials.includes(pMat)) {
                return false;
            }

            // Style checking
            const pStyle = lowerName.includes('beach') || lowerName.includes('slide') || lowerName.includes('hydro') ? 'Beach' : 
                           lowerName.includes('comfy') || lowerName.includes('home') || lowerName.includes('slipper') ? 'Home' : 'Casual';
            if (selectedStyle && pStyle !== selectedStyle) {
                return false;
            }

            // Price checking
            const price = p.base_price || 0;
            if (price > priceLimit) {
                return false;
            }

            return true;
        });
    }, [products, selectedCategories, selectedMaterials, selectedStyle, priceLimit]);

    const handleCategoryToggle = (cat) => {
        setSelectedCategories(prev => 
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const handleMaterialToggle = (mat) => {
        setSelectedMaterials(prev => 
            prev.includes(mat) ? prev.filter(m => m !== mat) : [...prev, mat]
        );
    };

    const handleSizeToggle = (size) => {
        setSelectedSizes(prev => 
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        );
    };

    return (
        <main className="pt-12 pb-20 px-8 max-w-[1440px] mx-auto font-body bg-surface text-on-surface">
            {/* Page Header */}
            <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6 mt-8">
                <div>
                    <h1 className="text-4xl font-headline font-extrabold tracking-tight text-primary mb-2">Full Collection Catalog</h1>
                    <p className="text-secondary font-medium uppercase tracking-widest text-xs">Curated Digital Showroom / Autumn 2024</p>
                </div>
                <div className="flex items-center gap-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-outline">Sort By</label>
                    <select className="bg-white border-none text-sm font-semibold text-primary focus:ring-0 cursor-pointer rounded-lg px-4 py-2 shadow-sm">
                        <option>Newest Arrivals</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Best Sellers</option>
                    </select>
                </div>
            </header>

            <div className="flex flex-col md:flex-row gap-12">
                {/* Sidebar Filtering */}
                <aside className="w-full md:w-72 flex-shrink-0">
                    <div className="sticky top-28 space-y-10">
                        {/* Filter Group */}
                        <section>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-6">Category</h3>
                            <div className="space-y-3">
                                {['Women', 'Men', 'Unisex'].map(cat => (
                                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                        <input 
                                            type="checkbox" 
                                            className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20"
                                            checked={selectedCategories.includes(cat)}
                                            onChange={() => handleCategoryToggle(cat)}
                                        />
                                        <span className={`text-sm font-medium transition-colors ${selectedCategories.includes(cat) ? 'text-primary' : 'text-secondary group-hover:text-primary'}`}>
                                            {cat}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-6">Material</h3>
                            <div className="flex flex-wrap gap-2">
                                {['Leather', 'Suede', 'Textile'].map(mat => (
                                    <button 
                                        key={mat}
                                        onClick={() => handleMaterialToggle(mat)}
                                        className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${selectedMaterials.includes(mat) ? 'bg-primary text-white' : 'bg-slate-200 text-secondary hover:bg-slate-300'}`}
                                    >
                                        {mat}
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-6">Style</h3>
                            <div className="space-y-3">
                                {['Home', 'Beach', 'Casual'].map(style => (
                                    <label key={style} className="flex items-center gap-3 cursor-pointer group">
                                        <input 
                                            type="radio" 
                                            name="style" 
                                            className="w-4 h-4 border-outline-variant text-primary focus:ring-primary/20"
                                            checked={selectedStyle === style}
                                            onChange={() => setSelectedStyle(style === selectedStyle ? '' : style)}
                                            onClick={() => { if(selectedStyle === style) setSelectedStyle('') }}
                                        />
                                        <span className={`text-sm font-medium ${selectedStyle === style ? 'text-primary' : 'text-secondary group-hover:text-primary'}`}>
                                            {style}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-6">Size Range</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {['36-40', '41-45'].map(size => (
                                    <button 
                                        key={size}
                                        onClick={() => handleSizeToggle(size)}
                                        className={`p-2 border rounded text-xs font-semibold transition-all ${selectedSizes.includes(size) ? 'border-primary text-primary bg-primary/5' : 'border-outline-variant/30 text-secondary hover:border-primary hover:text-primary'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-6">Price Range: Up to {priceLimit} TL</h3>
                            <input 
                                type="range" 
                                min="100" 
                                max="2000" 
                                step="50"
                                value={priceLimit}
                                onChange={(e) => setPriceLimit(Number(e.target.value))}
                                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" 
                            />
                            <div className="flex justify-between mt-2 text-[10px] font-bold text-outline uppercase tracking-tighter">
                                <span>100 TL</span>
                                <span>2000 TL</span>
                            </div>
                        </section>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-grow">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 animate-pulse">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="aspect-[4/5] bg-surface-container-low rounded-lg"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                            {filteredProducts.map((p, index) => {
                                const isFeatured = false; // We can make the first item featured if we want: `index === 0 && filteredProducts.length > 3;`
                                // Wait, the HTML has a specific card for featured. Let's make index 4 featured based on the layout if we had enough products. But to keep it uniform and dynamic, we render regular cards. The user's HTML index 4 was a large executive leather mule wrapper.
                                
                                const pCat = p.gender === 'male' ? 'Men' : p.gender === 'female' ? 'Women' : 'Unisex';
                                const catColorMap = {
                                    'Women': 'bg-[#380b00] text-white',
                                    'Men': 'bg-slate-700 text-white',
                                    'Unisex': 'bg-slate-500 text-white'
                                };

                                return (
                                    <article 
                                        key={p.id} 
                                        className={`group relative flex flex-col cursor-pointer ${isFeatured ? 'md:col-span-2 md:row-span-2' : ''}`}
                                        onClick={() => navigate(`/product/${p.id}`)}
                                    >
                                        <div className={`bg-surface-container-low overflow-hidden rounded-lg mb-4 relative flex items-center justify-center p-4 bg-slate-100 ${isFeatured ? 'aspect-[16/9]' : 'aspect-[4/5]'}`}>
                                            {p.image ? (
                                                <img 
                                                    src={p.image.replace(/^"|"$/g, '')} 
                                                    alt={p.name} 
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 mix-blend-multiply" 
                                                />
                                            ) : (
                                                <span className="material-symbols-outlined text-4xl text-slate-400">image</span>
                                            )}
                                            
                                            <div className={`absolute top-3 left-3 px-2 py-1 text-[10px] font-extrabold uppercase tracking-widest rounded-sm ${catColorMap[pCat] || 'bg-primary text-white'}`}>
                                                {pCat}
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col flex-grow">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="text-sm font-bold text-primary group-hover:underline underline-offset-4 decoration-1 font-headline">
                                                    {p.name || 'Product'}
                                                </h3>
                                                <span className="text-[10px] font-mono text-outline">{p.code || 'SKU'}</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className={`w-2 h-2 rounded-full ${pCat === 'Women' ? 'bg-[#5c1800]' : 'bg-[#1a237e]'}`}></div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">
                                                    Inner Box: {p.batch_size || '12'} Pairs
                                                </span>
                                            </div>
                                            
                                            <div className="mt-auto pt-4 border-t border-slate-200 flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-outline uppercase tracking-tighter">Wholesale Pair Price</span>
                                                    <span className="text-lg font-extrabold text-primary font-headline">
                                                        {p.base_price ? `${Number(p.base_price).toFixed(2)} TL` : '0.00 TL'}
                                                    </span>
                                                </div>
                                                <button 
                                                    className="p-2 bg-primary text-white rounded-md hover:bg-[#1a237e] transition-all active:scale-95 flex items-center justify-center"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/product/${p.id}`);
                                                    }}
                                                >
                                                    <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                    
                    {!loading && filteredProducts.length === 0 && (
                        <div className="text-center py-20">
                            <h2 className="text-xl font-bold text-slate-400">No products match your filters</h2>
                            <button 
                                onClick={() => {
                                    setSelectedCategories([]);
                                    setSelectedMaterials([]);
                                    setSelectedStyle('');
                                    setSelectedSizes([]);
                                    setPriceLimit(2000);
                                }}
                                className="mt-4 px-6 py-2 bg-slate-100 text-primary font-bold rounded-lg hover:bg-slate-200"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="bg-surface text-on-surface min-h-screen">
            <main className="max-w-[1440px] mx-auto px-6 py-12 space-y-20">
                
                {/* Hero Categories Section */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[420px]">
                    {/* Women's Category */}
                    <div onClick={() => navigate('/products?category=women')} className="bg-[#f6f4f2] flex flex-col items-center justify-center p-12 text-center group cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1">
                        <span className="material-symbols-outlined text-5xl text-[#3b2d26] mb-8 group-hover:scale-110 transition-transform">kitchen</span>
                        <h2 className="text-3xl font-extrabold text-[#1a1614] mb-3 tracking-tight">WOMEN'S SLIPPERS</h2>
                        <p className="text-[11px] font-bold tracking-[0.25em] text-slate-500 uppercase mb-10">Premium B2B Collection</p>
                        <button className="border border-slate-300 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-white transition-colors bg-white/40">
                            Explore Category
                        </button>
                    </div>
                    
                    {/* Men's Category */}
                    <div onClick={() => navigate('/products?category=men')} className="bg-[#f2f4f7] flex flex-col items-center justify-center p-12 text-center group cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1">
                        <div className="flex items-center gap-2 mb-8 text-primary group-hover:translate-x-2 transition-transform">
                            <span className="material-symbols-outlined text-5xl">east</span>
                            <div className="w-3.5 h-3.5 bg-primary rounded-full"></div>
                        </div>
                        <h2 className="text-3xl font-extrabold text-[#0f172a] mb-3 tracking-tight">MEN'S SLIPPERS</h2>
                        <p className="text-[11px] font-bold tracking-[0.25em] text-slate-500 uppercase mb-10">Luxury Wholesale Range</p>
                        <button className="border border-slate-300 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-white transition-colors bg-white/40">
                            Explore Category
                        </button>
                    </div>
                </section>

                {/* New Arrivals Section */}
                <section>
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <span className="font-['Inter'] text-xs font-extrabold uppercase tracking-[0.2em] text-primary mb-3 block">Curated Selection</span>
                            <h2 className="text-4xl font-extrabold text-on-surface">New Arrivals</h2>
                        </div>
                        <span onClick={() => navigate('/products')} className="cursor-pointer text-primary font-bold text-sm flex items-center gap-1 hover:underline pb-1">
                            View Full Catalog <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </span>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                        {/* Product 1 */}
                        <div className="group cursor-pointer">
                            <div className="aspect-[4/5] bg-[#223d30] mb-5 relative overflow-hidden flex items-center justify-center p-4">
                                <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=400&h=500" className="w-full h-full object-cover mix-blend-screen group-hover:scale-105 transition-transform duration-500 saturate-0" alt="Slipper" />
                            </div>
                            <div className="space-y-1.5">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">In Stock: 450 Units</p>
                                <h3 className="text-[15px] font-semibold text-on-surface">Heritage Wool Loafer</h3>
                                <p className="text-primary font-bold text-[15px] pt-1">24.50 TL <span className="text-[11px] font-medium text-slate-500">/ Wholesale Unit</span></p>
                            </div>
                        </div>

                        {/* Product 2 */}
                        <div className="group cursor-pointer">
                            <div className="aspect-[4/5] bg-[#f4ebd9] mb-5 relative overflow-hidden flex items-center justify-center p-4">
                                <img src="https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&q=80&w=400&h=500" className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500 saturate-50 contrast-125" alt="Slipper" />
                            </div>
                            <div className="space-y-1.5">
                                <p className="text-[10px] font-bold text-tertiary-container uppercase tracking-widest">Best Seller</p>
                                <h3 className="text-[15px] font-semibold text-on-surface">Suede Comfort Slide</h3>
                                <p className="text-primary font-bold text-[15px] pt-1">18.90 TL <span className="text-[11px] font-medium text-slate-500">/ Wholesale Unit</span></p>
                            </div>
                        </div>

                        {/* Product 3 */}
                        <div className="group cursor-pointer">
                            <div className="aspect-[4/5] bg-[#e4e4e3] mb-5 relative overflow-hidden flex items-center justify-center p-4">
                                <img src="https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?auto=format&fit=crop&q=80&w=400&h=500" className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500 saturate-0" alt="Slipper" />
                            </div>
                            <div className="space-y-1.5">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">In Stock: 120 Units</p>
                                <h3 className="text-[15px] font-semibold text-on-surface">Nordic Felt Mule</h3>
                                <p className="text-primary font-bold text-[15px] pt-1">32.00 TL <span className="text-[11px] font-medium text-slate-500">/ Wholesale Unit</span></p>
                            </div>
                        </div>

                        {/* Product 4 */}
                        <div className="group cursor-pointer">
                            <div className="aspect-[4/5] bg-[#fafafa] mb-5 relative overflow-hidden flex items-center justify-center p-4">
                                <img src="https://images.unsplash.com/photo-1582046162294-81dcf300407a?auto=format&fit=crop&q=80&w=400&h=500" className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500 opacity-90" alt="Slipper" />
                            </div>
                            <div className="space-y-1.5">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Volume Pricing</p>
                                <h3 className="text-[15px] font-semibold text-on-surface">Cloud Cotton Terry</h3>
                                <p className="text-primary font-bold text-[15px] pt-1">12.50 TL <span className="text-[11px] font-medium text-slate-500">/ Wholesale Unit</span></p>
                            </div>
                        </div>

                        {/* Product 5 */}
                        <div className="group cursor-pointer">
                            <div className="aspect-[4/5] bg-[#ececec] mb-5 relative overflow-hidden flex items-center justify-center p-4">
                                <img src="https://images.unsplash.com/photo-1614252339460-e1b180dcc114?auto=format&fit=crop&q=80&w=400&h=500" className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" alt="Slipper" />
                            </div>
                            <div className="space-y-1.5">
                                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Premium Range</p>
                                <h3 className="text-[15px] font-semibold text-on-surface">Artisan Leather Slipper</h3>
                                <p className="text-primary font-bold text-[15px] pt-1">58.00 TL <span className="text-[11px] font-medium text-slate-500">/ Wholesale Unit</span></p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features / Trust Section */}
                <section className="bg-surface-container-low p-8 md:p-12 border-y border-slate-200/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-300/50">
                        {/* Feature 1 */}
                        <div className="flex items-start gap-4 md:px-6 pt-6 md:pt-0 first:pt-0 first:px-0">
                            <span className="material-symbols-outlined text-primary text-[32px] mt-1">local_shipping</span>
                            <div>
                                <h4 className="font-bold text-on-surface mb-1.5 text-[15px]">Next-Day Dispatch</h4>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium">On all wholesale orders over 5,000 TL</p>
                            </div>
                        </div>
                        {/* Feature 2 */}
                        <div className="flex items-start gap-4 md:px-6 pt-6 md:pt-0">
                            <span className="material-symbols-outlined text-primary text-[32px] mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                            <div>
                                <h4 className="font-bold text-on-surface mb-1.5 text-[15px]">Quality Guaranteed</h4>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium">Strict QC for bulk batch processing</p>
                            </div>
                        </div>
                        {/* Feature 3 */}
                        <div className="flex items-start gap-4 md:px-6 pt-6 md:pt-0">
                            <span className="material-symbols-outlined text-primary text-[32px] mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
                            <div>
                                <h4 className="font-bold text-on-surface mb-1.5 text-[15px]">B2B Account Manager</h4>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium">24/7 dedicated support for retailers</p>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}

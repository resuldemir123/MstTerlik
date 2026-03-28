import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function GenderSelectPage() {
    const navigate = useNavigate();
    const categories = [
        { id: 'men', name: 'Erkek', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', description: 'Erkek koleksiyonunu keşfedin' },
        { id: 'women', name: 'Kadın', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', description: 'Kadın koleksiyonunu keşfedin' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Kategori Seçimi</h1>
                <p className="text-gray-500 mb-12">Lütfen incelemek istediğiniz koleksiyonu seçin.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {categories.map((cat) => (
                        <div 
                            key={cat.id} 
                            onClick={() => navigate(`/products?category=${cat.id}`)}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden border border-gray-100 group transform hover:-translate-y-1"
                        >
                            <div className="h-64 overflow-hidden relative">
                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all"></div>
                            </div>
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">{cat.name}</h2>
                                <p className="text-gray-600">{cat.description}</p>
                                <button className="mt-4 text-blue-600 font-semibold group-hover:text-blue-800 flex items-center justify-center w-full">
                                    Modelleri Gör <span className="ml-2">→</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

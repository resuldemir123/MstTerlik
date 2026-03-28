import { create } from 'zustand';

export const useOrderStore = create((set) => ({
    cartItems: [],
    gender: null,
    totalPairs: 0,
    totalAmount: 0,
    setGender: (gender) => set({ gender }),
    addToCart: (item) => set((state) => {
        const existingIndex = state.cartItems.findIndex(i => i.variant_id === item.variant_id);
        let updatedItems = [...state.cartItems];
        
        if (existingIndex >= 0) {
            const existing = updatedItems[existingIndex];
            const newSizes = { ...existing.sizes };
            
            for (const [size, qty] of Object.entries(item.sizes)) {
                newSizes[size] = (newSizes[size] || 0) + qty;
            }
            
            const newTotalPairs = existing.totalPairs + item.totalPairs;
            const newTotalAmount = existing.totalAmount + item.totalAmount;
            
            updatedItems[existingIndex] = {
                ...existing,
                sizes: newSizes,
                totalPairs: newTotalPairs,
                totalAmount: newTotalAmount
            };
        } else {
            updatedItems.push(item);
        }
        
        const totalPairs = updatedItems.reduce((acc, curr) => acc + curr.totalPairs, 0);
        const totalAmount = updatedItems.reduce((acc, curr) => acc + curr.totalAmount, 0);
        
        return { cartItems: updatedItems, totalPairs, totalAmount };
    }),
    removeFromCart: (variant_id) => set((state) => {
        const updatedItems = state.cartItems.filter(i => i.variant_id !== variant_id);
        const totalPairs = updatedItems.reduce((acc, curr) => acc + curr.totalPairs, 0);
        const totalAmount = updatedItems.reduce((acc, curr) => acc + curr.totalAmount, 0);
        return { cartItems: updatedItems, totalPairs, totalAmount };
    }),
    clearCart: () => set({ cartItems: [], totalPairs: 0, totalAmount: 0 })
}));

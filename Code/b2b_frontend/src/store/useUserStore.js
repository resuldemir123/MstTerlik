import { create } from 'zustand';

export const useUserStore = create((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    setUser: (user, token) => set({ user, token, isAuthenticated: !!token }),
    logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));

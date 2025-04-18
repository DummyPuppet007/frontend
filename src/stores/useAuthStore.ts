import { create } from "zustand";

export type User = {
    userId: number;
    firstname: string;
    lastname: string;
    username: string;
    roleId: number;
}

interface AuthStore{
    user: User | null;
    setUser: (user: User | null) => void;
    clearUser: () => void;
}


const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => {
        set({ user: null });    
    }
}))


export default useAuthStore;
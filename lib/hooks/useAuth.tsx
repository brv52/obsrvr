'use client'
import { useRouter } from "next/navigation";
import { getUserIdFromToken } from "@/lib/common/tokenLogic";
import { getUser } from "../api/userApi";

export function useAuth() {
    const router = useRouter();

    const login = async (email: string, password: string) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        localStorage.setItem('token', data.token);
        const userId = getUserIdFromToken();
        if (!userId)
            throw new Error('Wrong or expired token');
        const user = await getUser(userId);
        if (!user || user === null)
            throw new Error('Failed user parsing');
        router.push(`/user/me`);
    }
    
    const register = async (email: string, password: string) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        localStorage.setItem('token', data.token);
        const userId = getUserIdFromToken();
        if (!userId)
            throw new Error('Wrong or expired token');
        const user = await getUser(userId);
        if (!user || user === null)
            throw new Error('Failed user parsing');
        router.push(`/user/me`);
    }

    const logout = () => {
        localStorage.removeItem('token');
        router.push('/');
    }

    return { login, register, logout };
}
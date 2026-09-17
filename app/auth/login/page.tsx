'use client'
import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";

export default function LogIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <form
                onSubmit={handleSubmit} 
                className="p-8 w-full max-w-sm"
            >
                <h1 className="text-center">Login</h1>

                {error && (
                    <div className="text-red-700">{error}</div>
                )}

                <div className="mb-4">
                    <label htmlFor="email" className="block">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />    
                </div>
                
                <div className="mb-6">
                    <label htmlFor="password" className="block">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </div>

                <button type="submit" disabled={loading}>
                    { loading ? 'Signing in...' : 'Sign in' }
                </button>
            </form>
        </div>
    );
}   
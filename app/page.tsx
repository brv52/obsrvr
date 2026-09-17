'use client'
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
            <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800 p-8 text-center shadow-xl shadow-black/20">
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">Obsrvr</p>
                <h1 className="mb-3 text-3xl font-bold text-slate-100">Resource management</h1>
                <p className="mb-8 text-slate-300">Sign in to manage and share your resources.</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button onClick={() => {router.push('/auth/login')}}>Login</button>
                    <button className="!bg-slate-700 !text-slate-100 hover:!bg-slate-600" onClick={() => {router.push('/auth/register')}}>Register</button>
                </div>
            </div>
        </div>
    );
}
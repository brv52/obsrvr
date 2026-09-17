import { useAuth } from "@/lib/hooks/useAuth";

export default function Header() {
    const { logout } = useAuth();
    return (
        <div className="flex justify-end items-center h-10 w-full px-4">
            <button className="flex justify-self-end" onClick={ logout }>Logout</button>
        </div>
    );
}
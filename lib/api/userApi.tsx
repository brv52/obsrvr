'use client'
import { User } from "@/lib/types/userType";
import { retrieveData, safeGetToken } from "./shared";

export async function updateUser(userId: string, patch: Partial<User>) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${safeGetToken()}`,
        },
        body: JSON.stringify(patch)
    });

    return await retrieveData(res);
}

export async function getUser(userId: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${safeGetToken()}`,
        }
    });

    return await retrieveData(res);
}

export async function getUserByEmail(email: string) {
    const cleaned = email.trim();
    const encoded = encodeURIComponent(cleaned);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/email/${encoded}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${safeGetToken()}`,
        }
    });

    const data = await retrieveData(res);
    if (!data) throw new Error(`User not found for email: ${cleaned}`);
    return data;
}
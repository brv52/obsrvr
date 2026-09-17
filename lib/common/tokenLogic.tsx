'use client'
import * as jose from "jose";
import { isRole, Role } from "../types/userType";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem('token');
}

export function getUserIdFromToken(): string {
  const token = getToken();
  if (!token) throw new Error("No token found");
  try {
    const decoded = jose.decodeJwt(token);
    if (!decoded.sub) throw new Error("No user id in token");
    return decoded.sub;
  } catch {
    throw new Error("Invalid token");
  }
}

export function getRoleFromToken(): Role {
  const token = getToken();
  if (!token) throw new Error('Cannot retrieve token');
  try {
    const decoded = jose.decodeJwt(token);
    if (isRole(decoded.role)) return decoded.role;
    throw new Error('Cannot retrieve role from token');
  } catch(err: any) {
    throw new Error(err);
  }
}
'use client';
import { getToken, getUserIdFromToken } from '@/lib/common/tokenLogic';
import { retrieveData, safeGetToken } from './shared';

export async function createResource(resourcePayload: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resource/createResource`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${safeGetToken()}`,
      },
      body: JSON.stringify({ data: JSON.parse(resourcePayload) })
    });
    return await retrieveData(res);
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function readResource(resourceId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resource/getResource/${resourceId}`, {
      headers: { 
        Authorization: `Bearer ${safeGetToken()}` 
      },
    });
    return await retrieveData(res);
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function readAll(userId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resource/getResource/all/${userId}`, {
      headers: { 
        Authorization: `Bearer ${safeGetToken()}`
      },
    });
    return await retrieveData(res);
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function updateResource(resourceId: string, updatePayload: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resource/updateResource/${resourceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${safeGetToken()}`,
      },
      body: JSON.stringify({ data: JSON.parse(updatePayload)  }),
    });
    return await retrieveData(res);
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function deleteResource(resourceId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resource/deleteResource/${resourceId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${safeGetToken()}`,
      },
    });
    return await retrieveData(res);
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function grantAccess(resourceId: string, targetUserId: string, role: 'VIEWER' | 'EDITOR' | 'OWNER') {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resource/grantAccess/${resourceId}/${targetUserId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${safeGetToken()}`,
      },
      body: JSON.stringify({ role }),
    });
    return await retrieveData(res);
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function removeAccess(resourceId: string, email: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resource/removeAccessByEmail/${resourceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${safeGetToken()}`,
      },
      body: JSON.stringify({ email }),
    });
    return await retrieveData(res);
  } catch (err: any) {
    throw new Error(err.message || err);
  }
}

export async function getAllUsersWithRoles(resourceId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resource/getAllUsersWithRoles/${resourceId}`, {
      headers: {
        Authorization: `Bearer ${safeGetToken()}`,
      },
    });
    return await retrieveData(res);
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function grantAccessByEmail(resourceId: string, email: string, role: 'VIEWER' | 'EDITOR' | 'OWNER') {
  const cleaned = email.trim();
  if (!cleaned) return;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resource/grantAccessByEmail/${resourceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${safeGetToken()}`,
      },
      body: JSON.stringify({ email: cleaned, role }),
    });
    return await retrieveData(res);
  } catch (err: any) {
    throw new Error(err.message || err);
  }
}

export async function grantAccessForEmails(resourceId: string, contributors: { email: string; role: 'VIEWER' | 'EDITOR' | 'OWNER' }[]) {
  const valid = contributors.filter(c => c.email.trim());
  if (valid.length === 0) return [];
  return Promise.all(valid.map(c => grantAccessByEmail(resourceId, c.email, c.role)));
}
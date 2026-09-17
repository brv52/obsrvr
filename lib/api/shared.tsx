import { getToken } from "../common/tokenLogic";

export function safeGetToken() {
    const token = getToken();
    if (!token) throw new Error("Not authenticated");
    return (token);
}

export async function retrieveData(res: Response) {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
}
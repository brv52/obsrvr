'use client'
import { getUserIdFromToken } from "@/lib/common/tokenLogic";
import Header from "@/lib/common/header";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import UserInfo from "@/lib/components/userInfo";
import { getUser } from "@/lib/api/userApi";
import { User, Role } from "@/lib/types/userType";
import UserEdit from "@/lib/components/userEdit";
import UserResources from "@/lib/components/userResources";

export default function UserPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const userId = getUserIdFromToken();
    if (!userId){
        router.push('/');
        throw new Error('Failed to recover userId from token');
    }
    (async () => {
        try {
            const parsedUser = await getUser(userId);
            setUser(parsedUser);
        } catch (err) {
            console.error('Failed to fetch user: ', err);
            router.push('/');
        }
    })();
  }, [router]);

  const switchEditMode = () => {
    setEditMode(!editMode);
  };

  const onEditAction = (patch: User, mode: boolean) => {
    if (patch !== user)
        setUser(patch);
    setEditMode(mode);
  }

    if (!user)
        return null;


  return (
    <div className="flex flex-col">
        <Header/>
        <div className="flex flex-row justify-between">
            {editMode ? <UserEdit user={user} onAction={onEditAction}/> : <UserInfo user={user} switchEditMode={switchEditMode}/>}
        </div>
        <UserResources user={user}/>
    </div>
  );
}

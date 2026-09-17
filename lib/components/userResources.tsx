import { useEffect, useState } from "react";
import { createResource, readAll } from "../api/resourceApi";
import { getRoleFromToken, getUserIdFromToken } from "../common/tokenLogic";
import { User } from "../types/userType";
import CreateResourcePopup from "./createResourcePopup";
import { Resource } from "../types/resourceType";
import ResourceList from "./resourceList";

export default function UserResources({user} : {user : User}) {
    const [resources, setResources] = useState<Resource[]>([]);
    const [addMode, setAddMode] = useState<boolean>(false);
    
    useEffect(() => {
        readAll(getUserIdFromToken())
        .then(data => setResources(data));
    }, [user.id]);

    const flipMode = () => {
        setAddMode(!addMode);
    }

    const handlePost = async (payload: string) => {
        try {
            await createResource(payload);
            const data = await readAll(getUserIdFromToken());
            setResources(data);
            flipMode();
        } catch(err: any) {
            throw new Error(err);
        }
    }

    return (
        <div className="flex flex-col p-5">
            {addMode && (
                <CreateResourcePopup onDiscard={flipMode} onPost={handlePost}/>
            )}
            <div className="flex flex-col gap-4">
                <ResourceList resources={resources}/>
                <button className="justify-center" onClick={() => {setAddMode(true)}}>➕</button>
            </div>
        </div>
    );
}
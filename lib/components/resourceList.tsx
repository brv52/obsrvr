import { useEffect, useState } from "react";
import { getRoleFromToken } from "../common/tokenLogic";
import { Resource } from "../types/resourceType";
import SharePopup from "./sharePopup";
import { Contributor } from "../types/userType";
import { getAllUsersWithRoles, grantAccessForEmails, readAll, updateResource, deleteResource } from "../api/resourceApi";
import EditResourcePopup from "./editResourcePopup";
import { getUserIdFromToken } from "../common/tokenLogic";

export default function ResourceList({ resources }: { resources: Resource[] }) {
    const [list, setList] = useState<Resource[]>(resources);
    useEffect(() => setList(resources), [resources]);

    const [editAccessMode, setEditAccessMode] = useState<boolean>(false);
    const [updResource, setUpdResource] = useState<Resource>();

    const [editResourceItem, setEditResourceItem] = useState<Resource | undefined>(undefined);

    const [shareSubmitting, setShareSubmitting] = useState(false);
    const [shareError, setShareError] = useState<string | null>(null);

    const handleShareApply = async (payload: Contributor[]) => {
        setShareSubmitting(true);
        setShareError(null);
        try {
            if (!updResource) return;
            const toGrant = payload
                .filter(c => c.email && c.email.trim())
                .map(c => ({ email: c.email.trim(), role: c.role }));
            if (toGrant.length) {
                await grantAccessForEmails(updResource.id, toGrant);
            }
            await getAllUsersWithRoles(updResource.id);
            setEditAccessMode(false);
        } catch (e: any) {
            setShareError(e.message || "Failed to grant access");
        } finally {
            setShareSubmitting(false);
        }
    }

    const flipAccessMode = () => {
        setEditAccessMode(!editAccessMode);
    }

    const handleEdit = async (payload: any) => {
        if (!editResourceItem) return;
        try {
            await updateResource(editResourceItem.id, payload);
            const userId = getUserIdFromToken();
            const refreshed = await readAll(userId);
            setList(refreshed);
            setEditResourceItem(undefined);
        } catch (e) {
            console.error('Failed to update resource:', e);
        }
    }

    const handleDelete = async (resourceId: string) => {
        console.log(resourceId);
        try {
            await deleteResource(resourceId);
            const userId = getUserIdFromToken();
            const refreshed = await readAll(userId);
            setList(refreshed);
        } catch (e) {
            console.error('Failed to delete resource:', e);
        }
    }

    return (
        <div className="flex flex-wrap gap-2 justify-center mb-10">
            {list.map(resource => (
                <div key={resource.id} className="flex flex-row items-center gap-4 justify-center">
                    <div key={resource.id} className="border rounded shadow p-4 bg-gray text-white min-w-1/2">
                        <div className="flex flex-row justify-between gap-6">
                            <div className="flex-1">
                                {getRoleFromToken() === 'admin' && (
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-lg">Resource ID:</span>
                                        <span className="text-m">{resource.id}</span>
                                    </div>
                                )}
                                <div className="mb-1"><span className="font-semibold">Type:</span> {resource.type}</div>
                                <div className="mb-1"><span className="font-semibold">Owner Email:</span> {resource.ownerEmail || (resource.owner && resource.owner.email)}</div>
                                <div className="mb-1"><span className="font-semibold">Created:</span> {new Date(resource.createdAt).toLocaleString()}</div>
                                <div className="mb-1"><span className="font-semibold">Updated:</span> {new Date(resource.updatedAt).toLocaleString()}</div>
                                <div className="mb-1">
                                    <span className="font-semibold">Content:</span> {resource.data && resource.data.Content}
                                </div>
                                {resource.data && Object.entries(resource.data).filter(([k]) => k !== 'Content').map(([k, v]) => (
                                    <div key={k}><span className="font-semibold">{k}:</span> {String(v)}</div>
                                ))}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <button onClick={() => {
                                    setEditAccessMode(true);
                                    setUpdResource(resource);
                                }}>👥</button>
                                <button onClick={() => setEditResourceItem(resource)}>✏️</button>
                                <button onClick={() => handleDelete(resource.id)}>❌</button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            {editAccessMode && updResource && (
                <SharePopup resourceId={updResource.id} onDiscard={flipAccessMode} onPost={handleShareApply}/>
            )}
            {editResourceItem && (
                <EditResourcePopup
                    resource={editResourceItem}
                    onDiscard={() => setEditResourceItem(undefined)}
                    onPost={handleEdit}
                />
            )}
        </div>
    );
}
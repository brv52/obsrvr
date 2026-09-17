import { useEffect, useState } from "react";
import PopupBase from "./popupBase";
import { getAllUsersWithRoles, grantAccessForEmails, removeAccess } from "../api/resourceApi";
import ContributorsList from "./contributorsList";
import { Contributor } from "../types/userType";

export default function SharePopup(
    {
        resourceId,
        onDiscard,
        onPost
        
    } : {
        resourceId: string,
        onDiscard: () => void,
        onPost: (payload: Contributor[]) => void | Promise<void>
    }
) {
    const [contributors, setContributors] = useState<any[]>([]);
    const [newContributors, setNewContributors] = useState<any[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getAllUsersWithRoles(resourceId)
        .then(data => setContributors(data));
    }, [resourceId]);

    const addContributor = () => {
        setNewContributors(prev => [...prev, {email: "", role: "VIEWER"}]);
    }

    const createPayload = () => {
        const payload = contributors.concat(newContributors);
        return payload;
    }

    const handleRemove = async (contributor: Contributor, idx: number) => {
        try {
            await removeAccess(resourceId, contributor.email);
            setContributors(prev => prev.filter((_, i) => i !== idx));
        } catch (e: any) {
            setError(e.message || 'Failed to remove access');
        }
    }

    return (
        <PopupBase>
            <div className="flex flex-col bg-black">
                <div className="flex flex-col">
                    <ContributorsList
                        contributors={contributors}
                        setContributors={setContributors}
                        listType="existing"
                        onRemove={handleRemove}
                    />
                    { newContributors.length > 0 
                    && <ContributorsList 
                        contributors={newContributors} 
                        setContributors={setNewContributors} 
                        showEmailInput 
                        listType="new"
                        onRemove={(_, idx) => setNewContributors(prev => prev.filter((_, i) => i !== idx))}
                    />
                    }
                </div>
                <button disabled={submitting} onClick={addContributor}>+</button>
                {error && <span className="text-red-600 text-sm mt-1">{error}</span>}
                <div className="flex flex-row gap-2 mt-2">
                    <button disabled={submitting} onClick={() => onPost(createPayload())}>{submitting ? 'Applying...' : 'Apply'}</button>
                    <button disabled={submitting} onClick={onDiscard}>Close</button>
                </div>
            </div>
        </PopupBase>
    );
}
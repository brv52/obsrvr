import { useState } from "react";
import { isRole, User } from "../types/userType";
import { userFieldConfig } from "../types/fieldConfig";
import UserFieldEditor from "./userFieldEditor";
import { updateUser } from "../api/userApi";
import { getRoleFromToken, getUserIdFromToken } from "../common/tokenLogic";

export default function UserEdit(
{
    user,
    onAction
}: {
    user: User,
    onAction: (patch: User, mode: boolean) => void
}) {
    const [draftUser, setDraftUser] = useState<User>(user);

    const handleFieldChange = (key: string, value: any) => {
        setDraftUser(perv => ({ ...perv, [key]: value }));
    }

    const handleSave = async () => {
        const diff: Partial<User> = {};
        for (const key of Object.keys(draftUser) as (keyof User)[]) {
            if (draftUser[key] !== user[key]) {
                if (key === "role") {
                    if (isRole(draftUser[key]))
                        diff[key] = draftUser[key];
                } else {
                    diff[key] = draftUser[key] as User[keyof User];
                }
            }
        }
        try {
            const updated = await updateUser(getUserIdFromToken(), diff);
            onAction(updated, false);
        } catch (err: any) {
            throw new Error(err);
        }
    }

    const handleDiscard =() => {
        onAction(user, false);
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-6 my-6 text-base flex flex-col gap-6">
            <div className="flex flex-col gap-4">
                {Object.entries(draftUser).map(([key, value]) => {
                    const config = userFieldConfig[key as keyof User];
                    const userRole = getRoleFromToken();
                    if (!config || !config.visibleFor.includes(userRole)) return null;
                    const editable = config.editableFor.includes(userRole);

                    return (
                        <UserFieldEditor 
                            key={key}
                            fieldKey={key}
                            fieldValue={value}
                            config={config}
                            editable={editable}
                            onChange={handleFieldChange}
                        />
                    );
                })}
            </div>
            <div className="flex justify-end gap-3">
                <button className="px-4 py-2" onClick={handleSave}>Save</button>
                <button className="px-4 py-2" onClick={handleDiscard}>Discard</button>
            </div>
        </div>
    );
}
import { userFieldConfig } from "@/lib/types/fieldConfig";
import { User } from "@/lib/types/userType";
import { getRoleFromToken } from "../common/tokenLogic";

export default function UserInfo(
{ 
    user, 
    switchEditMode
} : { 
    user: User, 
    switchEditMode: () => void 
}) {
    return (
        <div className="flex flex-row w-full justify-between max-w-2xl mx-auto p-6 my-6 text-base">
            <div className="flex flex-col gap-4">
                {Object.entries(user).map(([key, value]) => {
                    const config = userFieldConfig[key as keyof User];
                    if (!config || !config.visibleFor.includes(getRoleFromToken())) return (null);

                    return (
                        <div key={key} className="flex flex-col">
                            <label className="text-base font-semibold">{config.label}</label>
                            <span className="text-lg break-words">{String(value)}</span>
                        </div>
                    )
                })}

            </div>
            <div>
                <button className="px-3 py-1" onClick={switchEditMode}>⚙️</button>
            </div>
        </div>
    );
}
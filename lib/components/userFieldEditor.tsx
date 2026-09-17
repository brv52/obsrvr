import { Role } from "../types/userType";

export default function UserFieldEditor({
    fieldKey,
    fieldValue,
    config,
    editable,
    onChange
} : {
    fieldKey: string,
    fieldValue: any,
    config: any,
    editable: boolean,
    onChange: (key: string, value: any) => void;
}) {
    if (!config) return null;

    return (
        <div className="flex flex-col mb-5">
            <label>{config.label}</label>
            {editable ? (
                fieldKey === "role" ? (
                    <select
                        className="border border-gray-300 rounded p-2 bg-black"
                        value={fieldValue as string}
                        onChange={e => onChange(fieldKey, e.target.value)}
                    >
                        {Object.values(Role).map(role => (
                        <option key={role} value={role}>
                            {role}
                        </option>
                        ))}
                    </select>
            ) : (
                <input
                    className="border border-gray-300 rounded p-2"
                    type={config.type}
                    value={fieldValue ?? ""}
                    onChange={e => onChange(fieldKey, e.target.value)}
                />
            )
            ) : (
                <span>{fieldValue}</span>
            )}
        </div>
    );
}
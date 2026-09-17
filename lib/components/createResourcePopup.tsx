import { useState } from "react";
import PopupBase from "./popupBase";

export default function CreateResourcePopup(
    {
        onDiscard,
        onPost
    } : {
        onDiscard: () => void,
        onPost: (payload: string) => void
    }
) {
    const [fields, setFields] = useState([{name: "Content", value: ""}]);

    const handleFieldChange = (fieldIndex: number, key: string, value: string) => {
        setFields(fields => (
            fields.map((field, idx) => (
                (idx === fieldIndex ? { ...field, [key]: value } : field)
            ))
        ));
    }

    const addField = () => {
        setFields([...fields, { name: "", value: "" }]);
    }

    const removeField = (index: number) => {
        if (index === 0) return;
        setFields(fields => fields.filter((_, idx) => idx !== index));
    }

    const createPayload = () => {
        const payload = fields.reduce((acc, field) => {
            if (field.name.trim())
                acc[field.name] = field.value;
            return acc;
        }, {} as Record<string, string>);
        return JSON.stringify(payload);
    }

    return (
        <PopupBase>
            <div className="flex flex-col bg-black min-w-m">
                {fields.map((field, index) => (
                    <div key={index} className="flex gap-2 text-white m-2">
                        {index === 0 ? (
                            <label>{field.name}</label>
                        ) : (
                            <input
                                value={field.name}
                                placeholder="Field name"
                                onChange={e => handleFieldChange(index, "name", e.target.value)}
                            />
                        )}
                        <input
                            value={field.value}
                            placeholder="Field value"
                            onChange={e => handleFieldChange(index, "value", e.target.value)}
                        />
                        {index !== 0 && <button onClick={() => removeField(index)}>-</button>}
                    </div>
                ))}
                <button className="text-white" onClick={addField}>+</button>
                <div className="flex flex-row justify-between">
                    <button className="text-white" onClick={onDiscard}>Close</button>
                    <button className="text-white" onClick={() => onPost(createPayload())}>Apply</button>
                </div>
            </div>
        </PopupBase>
    );
}
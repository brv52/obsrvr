import { useMemo, useState } from "react";
import PopupBase from "./popupBase";
import { Resource } from "../types/resourceType";

type Field = { name: string; value: string };

export default function EditResourcePopup({
  resource,
  onDiscard,
  onPost,
}: {
  resource: Resource;
  onDiscard: () => void;
  onPost: (payload: string) => void | Promise<void>;
}) {
  const initialFields = useMemo(() => {
    const data: Record<string, any> = (resource?.data as any) || {};
    const result: Field[] = [];
    result.push({ name: "Content", value: data?.Content ?? "" });
    Object.entries(data)
      .filter(([k]) => k !== "Content")
      .forEach(([k, v]) => {
        result.push({ name: k, value: v != null ? String(v) : "" });
      });
    return result;
  }, [resource]);

  const [fields, setFields] = useState<Field[]>(initialFields);

  const handleFieldChange = (fieldIndex: number, key: "name" | "value", value: string) => {
    setFields((prev) =>
      prev.map((field, idx) => (idx === fieldIndex ? { ...field, [key]: value } : field))
    );
  };

  const addField = () => {
    setFields((prev) => [...prev, { name: "", value: "" }]);
  };

  const removeField = (index: number) => {
    if (index === 0) return;
    setFields((prev) => prev.filter((_, idx) => idx !== index));
  };

  const createPayload = () => {
    const payload = fields.reduce((acc, field, idx) => {
      const name = idx === 0 ? "Content" : field.name;
      if (name.trim()) acc[name] = field.value;
      return acc;
    }, {} as Record<string, string>);
    return JSON.stringify(payload);
  };

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
                onChange={(e) => handleFieldChange(index, "name", e.target.value)}
              />
            )}
            <input
              value={field.value}
              placeholder="Field value"
              onChange={(e) => handleFieldChange(index, "value", e.target.value)}
            />
            {index !== 0 && <button onClick={() => removeField(index)}>-</button>}
          </div>
        ))}
        <button className="text-white" onClick={addField}>
          +
        </button>
        <div className="flex flex-row justify-between">
          <button className="text-white" onClick={onDiscard}>
            Close
          </button>
          <button className="text-white" onClick={() => onPost(createPayload())}>
            Apply
          </button>
        </div>
      </div>
    </PopupBase>
  );
}

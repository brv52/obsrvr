import { User } from "./userType.js"

type FieldConfig = {
    label: string,
    type: string,
    visibleFor: ('user' | 'admin')[]
    editableFor: ('user' | 'admin')[]
}

export const userFieldConfig: Record<keyof User, FieldConfig> = {
    id: {
        label: "User ID",
        type: "text",
        visibleFor: ['admin'],
        editableFor: [],
    },
    email: {
        label: "Email",
        type: "email",
        visibleFor: ['user', 'admin'],
        editableFor: ['user', 'admin'],
    },
    name: {
        label: "Name",
        type: "text",
        visibleFor: ['user', 'admin'],
        editableFor: ['user', 'admin'],
    },
    role: {
        label: "Role",
        type: "text",
        visibleFor: ['user', 'admin'],
        editableFor: ['admin']
    }
}
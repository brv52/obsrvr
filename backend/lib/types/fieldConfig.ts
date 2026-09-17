import { User } from "./userType.js"

type FieldConfig = {
    label: string,
    visibleFor: ('user' | 'admin')[]
    editableFor: ('user' | 'admin')[]
}

export const userFieldConfig: Record<keyof User, FieldConfig> = {
    id: {
        label: "User ID",
        visibleFor: ['admin'],
        editableFor: [],
    },
    email: {
        label: "Email",
        visibleFor: ['user', 'admin'],
        editableFor: ['user', 'admin'],
    },
    name: {
        label: "Name",
        visibleFor: ['user', 'admin'],
        editableFor: ['user', 'admin'],
    },
    role: {
        label: "Role",
        visibleFor: ['user', 'admin'],
        editableFor: ['admin']
    },
}
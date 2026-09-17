import { ReactNode } from 'react';

export default function PopupBase({ children }: { children: ReactNode }) {
    return (
        <div className="fixed inset-0 flex items-center z-50 justify-center">
            {children}
        </div>
    );
}
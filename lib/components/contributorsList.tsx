import { Contributor } from "../types/userType";
import type { Dispatch, SetStateAction } from 'react';

export default function ContributorsList({ contributors, setContributors, showEmailInput = false, listType = 'existing', onRemove }: {
    contributors: Contributor[];
    setContributors: Dispatch<SetStateAction<Contributor[]>>;
    showEmailInput?: boolean;
    listType?: 'existing' | 'new';
    onRemove?: (contributor: Contributor, index: number) => void | Promise<void>;
}) {
	const keyPrefix = listType === 'existing' ? 'ex-' : 'new-';
    return (
        <div className="flex flex-col">
            {contributors.map((contributor, idx) => (
                <div key={`${keyPrefix}${idx}`} className="flex flex-row space-x-2 mb-2">
                        {showEmailInput ? (
                            <input
                                value={contributor.email}
                                onChange={e => {
                                    setContributors(prev =>
                                        prev.map((c, i) =>
                                            i === idx ? { ...c, email: e.target.value } : c
                                        )
                                    );
                                }}
                                placeholder="Email"
                                className="mb-1"
                            />
                        ) : (
                            <span>{contributor.email}</span>
                        )}
                        <select
                            value={contributor.role}
                            className="bg-black"
                            onChange={e => {
                                setContributors(prev =>
                                    prev.map((c, i) =>
                                        i === idx ? { ...c, role: e.target.value as Contributor['role'] } : c
                                    )
                                );
                            }}
                        >
                            <option value="VIEWER">Viewer</option>
                            <option value="EDITOR">Editor</option>
                            <option value="OWNER">Owner</option>
                        </select>
                        <button
                            onClick={async () => {
                                if (onRemove) {
                                    await onRemove(contributor, idx);
                                } else {
                                    setContributors(prev => prev.filter((_, i) => i !== idx));
                                }
                            }}
                        >-</button>
                    </div>
            ))}
        </div>
    );
}
import React from 'react';
import Sidebar from '../components/Sidebar';

interface Props {
    children: React.ReactNode;
}

const RestrictedLayout: React.FC<Props> = ({ children }) => {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 px-0 py-0 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default RestrictedLayout;

import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LogOut,
    Users,
    BookOpen,
    Settings,
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
    CircleDollarSign,
    Bot,
} from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import mindrqLogo from '../assets/logo-mindrq.png';

const Sidebar: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useContext(AuthContext) || {};

    const handleLogout = () => {
        // @ts-ignore
        logout?.(navigate);
    };

    const menuItems = [
        { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
        { label: 'Students', icon: <Users size={20} />, path: '/students' },
        { label: 'Lessons', icon: <BookOpen size={20} />, path: '/lessons' },
        { label: 'Tasks', icon: <Bot size={20} />, path: '/tasks' },
        { label: 'Payments', icon: <CircleDollarSign size={20} />, path: '/payments' },
        { label: 'Settings', icon: <Settings size={20} />, path: '/profile' },
    ];

    return (
        <div className={`flex flex-col h-screen bg-white shadow-sm ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
            {/* Header */}
            <div className={`flex items-center p-4 border-b border-gray-200 ${collapsed ? 'justify-center' : 'justify-between'}`}>
                {!collapsed && <img src={mindrqLogo} alt="mindrq logo" className="h-10 w-auto" />}
                <button onClick={() => setCollapsed(!collapsed)} className="text-gray-500 hover:text-primary transition-colors">
                    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 px-4 pt-4 space-y-2">
                {menuItems.map(({ label, icon, path }) => (
                    <Link
                        key={label}
                        to={path}
                        className={`flex items-center gap-3 p-2 rounded-md transition-colors text-gray-600 hover:bg-indigo-50 hover:text-primary ${location.pathname.startsWith(path) ? 'bg-indigo-50 text-primary font-semibold' : ''
                            }`}
                    >
                        {icon}
                        {!collapsed && <span>{label}</span>}
                    </Link>
                ))}
            </nav>

            {/* Logout no rodapé */}
            <div className="p-4 border-t border-gray-200 mt-auto">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-2 rounded-md text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                    <LogOut size={20} />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;

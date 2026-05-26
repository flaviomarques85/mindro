import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import mindrqLogo from '../assets/logo-mindrq.png';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, logout, user } = useContext(AuthContext) || {};

    const isRestrictedRoute = location.pathname.startsWith('/dashboard') ||
        location.pathname.startsWith('/alunos') ||
        location.pathname.startsWith('/licoes') ||
        location.pathname.startsWith('/perfil') ||
        location.pathname.startsWith('/tarefas');

    if (isAuthenticated && user?.role === 'teacher' && isRestrictedRoute) {
        return null; // não renderiza o menu superior
    }

    return (
        <nav className="w-full sticky top-0 z-30 bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                {/* Logo */}
                <div className="flex items-cen  ter">
                    <img src={mindrqLogo} alt="mindrq logo" className="h-10 w-auto" />
                </div>
                {/* Menu */}
                <div className="hidden md:flex space-x-8">
                    <a href="#home" className="text-base text-gray-700 hover:text-primary transition">Home</a>
                    <a href="#about" className="text-base text-gray-700 hover:text-primary transition">About</a>
                    <a href="#features" className="text-base text-gray-700 hover:text-primary transition">Features</a>
                    <a href="#pricing" className="text-base text-gray-700 hover:text-primary transition">Pricing</a>
                    <a href="#support" className="text-base text-gray-700 hover:text-primary transition">Support</a>
                </div>
                {/* Sign In/Logout Button */}
                <div className="flex items-center ml-4">
                    {isAuthenticated ? (
                        <button onClick={() => logout(navigate)} className="px-6 py-2 rounded-md border border-primary text-primary bg-white hover:bg-primary-dark hover:text-white font-medium transition shadow focus:outline-none focus:ring-2 focus:ring-primary">Logout</button>
                    ) : (
                        <a href="/login" className="px-6 py-2 rounded-md border border-primary text-primary bg-white hover:bg-primary-dark hover:text-white font-medium transition shadow focus:outline-none focus:ring-2 focus:ring-primary">Sign In</a>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface PrivateRouteProps {
    children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // Se ainda estiver verificando a autenticação, pode-se mostrar um loader
    if (loading) {
        return <div>Verificando autenticação...</div>; // Ou um componente de spinner
    }

    // Se não estiver autenticado, redireciona para o login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Se estiver autenticado, renderiza a página solicitada
    return children;
};

export default PrivateRoute;

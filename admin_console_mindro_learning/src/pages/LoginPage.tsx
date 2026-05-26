import React, { useRef } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const {
        step,
        email,
        loading,
        error,
        submitEmail,
        submitCode,
        reset,
    } = useAuth();

    const navigate = useNavigate();

    // Handler para buscar teacher pelo e-mail
    function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const emailInput = (form.elements.namedItem('email') as HTMLInputElement).value;
        submitEmail(emailInput);
    }

    // Handler para envio do código
    function handleCodeSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const codeInput = (form.elements.namedItem('code') as HTMLInputElement).value;
        submitCode(codeInput, navigate); // Passa o navigate
        navigate('/dashboard', { replace: true }); // Redirecionamento imediato
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex flex-1 items-center justify-center">
                <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Login do Professor</h2>
                    {
                        step === 'authenticated' && (
                            <>
                                <div className="text-center text-gray-700">
                                    <p>Login realizado com sucesso!</p>
                                    <p>Redirecionando para o dashboard...</p>
                                </div>
                                <button
                                    onClick={() => navigate('/dashboard', { replace: true })}
                                    className="w-full px-4 py-2 border border-primary text-primary bg-white hover:bg-primary-dark hover:text-white font-medium rounded-md transition focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                                >
                                    Ir para o dashboard
                                </button>
                            </>
                        )
                    }

                    {step === 'email' && (
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                                <input
                                    name="email"
                                    type="email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    placeholder="Digite seu e-mail"
                                    required
                                    autoFocus
                                />
                            </div>
                            {error && <div className="text-red-500 text-sm">{error}</div>}
                            <button
                                type="submit"
                                className="w-full px-4 py-2 border border-primary text-primary bg-white hover:bg-primary-dark hover:text-white font-medium rounded-md transition focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                                disabled={loading}
                            >
                                {loading ? 'Enviando código...' : 'Enviar código'}
                            </button>
                        </form>
                    )}
                    {step === 'code' && (
                        <form onSubmit={handleCodeSubmit} className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-700">Enviamos um código para <span className="font-medium text-primary">{email}</span></span>
                                <button type="button" className="text-xs text-primary underline" onClick={reset}>Trocar e-mail</button>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Código de 4 dígitos</label>
                                <input
                                    name="code"
                                    type="text"
                                    maxLength={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary tracking-widest text-center text-lg font-mono"
                                    placeholder="0000"
                                    required
                                />
                            </div>
                            {error && <div className="text-red-500 text-sm">{error}</div>}
                            <button
                                type="submit"
                                className="w-full px-4 py-2 border border-primary text-primary bg-white hover:bg-primary-dark hover:text-white font-medium rounded-md transition focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                                disabled={loading}
                            >
                                {loading ? 'Verificando...' : 'Verificar código'}
                            </button>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
};

export default LoginPage;

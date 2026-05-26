import { useState, useEffect } from 'react';
import { fetchTeacherByEmail, sendVerificationCode, verifyCode } from '../services/authService';
import { NavigateFunction } from 'react-router-dom';

export function useAuth() {
    const [step, setStep] = useState<'email' | 'code' | 'authenticated'>(
        localStorage.getItem('isAuthenticated') === 'true' ? 'authenticated' : 'email'
    );
    const [email, setEmail] = useState(localStorage.getItem('authEmail') || '');
    const [userId, setUserId] = useState<string | null>(localStorage.getItem('authUserId') || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (step === 'authenticated') {
            localStorage.setItem('isAuthenticated', 'true');
            if (email) localStorage.setItem('authEmail', email);
            if (userId) localStorage.setItem('authUserId', userId);
        } else {
            // Mantém os dados no localStorage até o logout explícito
        }
    }, [step, email, userId]);

    // 1. Submete o e-mail e busca o teacher
    async function submitEmail(emailInput: string) {
        setLoading(true);
        setError('');
        try {
            const teacher = await fetchTeacherByEmail(emailInput);
            setUserId(teacher.id);
            setEmail(emailInput);
            //await sendVerificationCode(teacher.id); // Envia o código
            setStep('code');
        } catch (err: any) {
            setError('E-mail não encontrado ou erro ao enviar código.');
        } finally {
            setLoading(false);
        }
    }

    // 2. Submete o código de verificação e navega
    async function submitCode(code: string, navigate: NavigateFunction) {
        setLoading(true);
        setError('');
        try {
            if (!userId) throw new Error('Usuário não encontrado');
            const result = { success: true };//await verifyCode(userId, code);
            if (result.success) {
                setStep('authenticated');

            } else {
                setError('Código inválido ou expirado.');
            }
        } catch (err: any) {
            setError('Código inválido ou expirado.');
        } finally {
            setLoading(false);
        }
    }

    function reset() {
        setStep('email');
        setEmail('');
        setUserId(null);
        setError('');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('authEmail');
        localStorage.removeItem('authUserId');
    }

    // Logout e redirecionamento
    function logout(navigate: NavigateFunction) {
        reset();
        navigate('/#home', { replace: true });
    }

    return {
        step,
        email,
        userId,
        loading,
        error,
        submitEmail,
        submitCode,
        reset,
        logout,
        isAuthenticated: step === 'authenticated',
    };
}

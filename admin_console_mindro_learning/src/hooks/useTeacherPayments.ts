// src/hooks/useTeacherPayments.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { getPaymentsByTeacherId, Payment } from '../services/paymentsService';

export function useTeacherPayments() {
    const { userId } = useAuth();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPayments = useCallback(async () => {
        if (!userId) {
            setPayments([]);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const data = await getPaymentsByTeacherId(userId);
            setPayments(data);
        } catch (err: any) {
            setError(err.message || 'Error fetching payments');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    return { payments, loading, error, refetchPayments: fetchPayments };
}

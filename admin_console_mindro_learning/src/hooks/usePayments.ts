// src/hooks/usePayments.ts
import { useState, useEffect, useCallback } from 'react';
import { getPaymentsByStudentId, Payment } from '../services/paymentsService';

export function usePayments(studentId: string | undefined) {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPayments = useCallback(async () => {
        if (!studentId) {
            setPayments([]);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const data = await getPaymentsByStudentId(studentId);
            setPayments(data);
        } catch (err: any) {
            setError(err.message || 'Error fetching payments');
        } finally {
            setLoading(false);
        }
    }, [studentId]);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    return { payments, loading, error, refetchPayments: fetchPayments };
}

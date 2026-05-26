// src/services/paymentService.ts
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL;
const API_BEARER_TOKEN = Constants.expoConfig?.extra?.API_BEARER_TOKEN;

export type Payment = {
    id: string;
    date: string;
    amount: string;
    status: string;
};

export async function getUserPayments(userId: string): Promise<Payment[]> {
    try {
        const response = await fetch(`${API_URL}/payments/${userId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${API_BEARER_TOKEN}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });

        const text = await response.text();
        const data = JSON.parse(text);

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch payment history');
        }

        const sortedPayments = [...data].sort(
            (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        return sortedPayments.map((p: any) => ({
            id: p.id,
            date: new Date(p.date).toLocaleDateString('pt-BR'),
            amount: Number(p.finalAmount).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }),
            status: p.status,
        }));
    } catch (error) {
        console.error('[getUserPayments] Error:', error);
        throw error;
    }
}

export async function createStripeSession(userId: string): Promise<{ clientSecret: string }> {
    try {
        const response = await fetch(`${API_URL}/payments/checkout`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${API_BEARER_TOKEN}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });

        const text = await response.text();
        const data = JSON.parse(text);

        if (!response.ok) {
            throw new Error(data.message || 'Failed to create Stripe session');
        }
        return { clientSecret: data.clientSecret };
    } catch (error) {
        console.error('[createStripeSession] Error:', error);
        throw error;
    }
}

export async function saveStripePayment(userId: string, stripePaymentId: string): Promise<void> {
    try {
        const response = await fetch(`${API_URL}/payments/confirm`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${API_BEARER_TOKEN}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, stripePaymentId }),
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`[saveStripePayment] Backend rejected the save: ${text}`);
        }
    } catch (error) {
        console.error('[saveStripePayment] Error saving payment confirmation:', error);
        throw error;
    }
}

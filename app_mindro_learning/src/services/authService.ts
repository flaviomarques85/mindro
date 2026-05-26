// src/services/authService.ts
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL;
const API_BEARER_TOKEN = Constants.expoConfig?.extra?.API_BEARER_TOKEN;

export async function requestVerificationCode(userId: string): Promise<void> {
    const response = await fetch(`${API_URL}/auth/create-code`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${API_BEARER_TOKEN}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to request verification code.');
    }
}

export async function verifyCode(userId: string, code: string): Promise<void> {
    const response = await fetch(`${API_URL}/auth/verify-code`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${API_BEARER_TOKEN}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, code }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Invalid or expired code.');
    }
}

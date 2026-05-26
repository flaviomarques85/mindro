// src/services/userService.ts
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL;
const API_BEARER_TOKEN = Constants.expoConfig?.extra?.API_BEARER_TOKEN;

export type User = {
    id: string;
    name: string;
    email: string;
    profilePicture: string;
    joinedDate: string;
    monthlyFee: number;
    status: string;
    teacherId: string;
};

export async function getUser(id: string): Promise<User> {
    try {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_BEARER_TOKEN}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('[getUser] Error:', error);
        throw error;
    }
}

export async function getUserByEmail(email: string): Promise<User> {
    try {
        const response = await fetch(`${API_URL}/users/email/${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_BEARER_TOKEN}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch user by email ${email}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('[getUserByEmail] Error:', error);
        throw error;
    }
}


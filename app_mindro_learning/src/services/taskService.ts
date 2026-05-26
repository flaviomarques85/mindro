// src/services/taskService.ts
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL;
const API_BEARER_TOKEN = Constants.expoConfig?.extra?.API_BEARER_TOKEN;

export type Task = {
    id: string;
    title: string;
    status: 'Pending' | 'In Progress' | 'Completed';
    progress: number; // 0 a 100
    weight: number;
    description: string;
};

export async function getUserTasks(userId: string): Promise<Task[]> {
    try {
        const response = await fetch(`${API_URL}/tasks/user/${userId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${API_BEARER_TOKEN}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
            },
        });

        const text = await response.text();
        const data = JSON.parse(text);

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch tasks');
        }

        return data.map((item: any) => ({
            id: item.id,
            title: item.title,
            status: item.status || 'Pending',
            progress: Number(item.progress) || 0,
            weight: Number(item.weight) || 100,
            description: item.description || '',
        }));
    } catch (error) {
        console.error('[getUserTasks] Error:', error);
        throw error;
    }
}

export async function updateUserTaskProgress(taskId: string, progress: number): Promise<void> {
    try {
        const response = await fetch(`${API_URL}/tasks/update-progress/${taskId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${API_BEARER_TOKEN}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ progress }),
        });

        if (!response.ok) {
            const text = await response.text();
            const data = JSON.parse(text);
            throw new Error(data.message || 'Failed to update task progress');
        }
    } catch (error) {
        console.error('[updateUserTaskProgress] Error:', error);
        throw error;
    }
}

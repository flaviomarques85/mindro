import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL;
const API_BEARER_TOKEN = Constants.expoConfig?.extra?.API_BEARER_TOKEN;

export type Teacher = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    languages: string[];
};

export async function getTeacherById(teacherId: string): Promise<Teacher> {
    try {
        const response = await fetch(`${API_URL}/teachers/${teacherId}`, {
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
            throw new Error(data.message || 'Failed to fetch teacher data');
        }

        const teacher: Teacher = {
            id: data.id,
            name: data.name,
            email: data.email,
            phone: data.phone || '',
            languages: data.languages || [],
        };

        return teacher;
    } catch (error) {
        console.error('[getTeacherById] Error:', error);
        throw error;
    }
}

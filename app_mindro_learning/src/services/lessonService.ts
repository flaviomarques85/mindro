// src/services/lessonService.ts
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL;
const API_BEARER_TOKEN = Constants.expoConfig?.extra?.API_BEARER_TOKEN;

export type Lesson = {
    id: string;
    language: string;
    time: string;
    date: string;
    weekday: string;
    status: string;
    flag: any;
};

const LANGUAGE_FLAGS: Record<string, any> = {
    de: require('../assets/flags/de.png'),
    en: require('../assets/flags/en.png'),
    br: require('../assets/flags/br.png'),
    es: require('../assets/flags/es.png'),
    fr: require('../assets/flags/fr.png'),
    it: require('../assets/flags/it.png'),
    pt: require('../assets/flags/pt.png'),
    ru: require('../assets/flags/ru.png'),
    // adicione mais se necessário
};

export async function getUserLessons(userId: string): Promise<Lesson[]> {
    try {
        const response = await fetch(`${API_URL}/lessons/user/${userId}`, {
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
            throw new Error(data.message || 'Failed to fetch lessons');
        }

        const lessons: Lesson[] = data.map((lesson: any) => {
            const dateObj = new Date(lesson.date);
            const timeObj = new Date(lesson.time);

            return {
                id: lesson.id,
                language: `${lesson.language.name} Language`,
                date: dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
                weekday: dateObj.toLocaleDateString('en-US', { weekday: 'long' }),
                time: timeObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                status: lesson.status,
                flag: LANGUAGE_FLAGS[lesson.language.id] || null,
            };
        });

        return lessons;
    } catch (error) {
        console.error('[getUserLessons] Error:', error);
        throw error;
    }
}

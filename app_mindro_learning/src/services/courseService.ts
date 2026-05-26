// src/services/courseService.ts
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL;
const API_BEARER_TOKEN = Constants.expoConfig?.extra?.API_BEARER_TOKEN;

const LANGUAGE_FLAGS: Record<string, any> = {
    de: require('../assets/flags/de-re.png'),
    en: require('../assets/flags/en-re.png'),
    // adicione mais se necessário
};

const LANGUAGE_FLAGS_PLAIN: Record<string, any> = {
    de: require('../assets/flags/de.png'),
    en: require('../assets/flags/en.png'),
    es: require('../assets/flags/es.png'),
    // adicione outros idiomas se necessário
};

export type Milestone = {
    id: string;
    language: string;
    level: string;
    flag: any;
};

export type Course = {
    id: string;
    title: string;
    level: string;
    image: any;
};

export async function getUserCourses(userId: string): Promise<Course[]> {
    try {
        const response = await fetch(`${API_URL}/courses/user/${userId}/status/ACTIVE`, {
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
            throw new Error(data.message || 'Failed to fetch courses');
        }

        const courses: Course[] = data.map((course: any) => {
            return {
                id: course.id,
                title: course.title,
                level: course.level,
                image: LANGUAGE_FLAGS[course.language.id] || null,
            };
        });

        return courses;
    } catch (error) {
        console.error('[getUserCourses] Error:', error);
        throw error;
    }
}


export async function getUserFinishedCourses(userId: string): Promise<Milestone[]> {
    try {
        const response = await fetch(`${API_URL}/courses/user/${userId}/status/FINISHED`, {
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
            throw new Error(data.message || 'Failed to fetch finished courses');
        }

        const milestones: Milestone[] = data.map((course: any) => {
            return {
                id: course.id,
                language: `${course.language.name} Language`,
                level: `Level ${course.level.replace(/[^\d]/g, '') || '?'}`,
                flag: LANGUAGE_FLAGS_PLAIN[course.language.id] || null,
            };
        });

        return milestones;
    } catch (error) {
        console.error('[getUserFinishedCourses] Error:', error);
        throw error;
    }
}
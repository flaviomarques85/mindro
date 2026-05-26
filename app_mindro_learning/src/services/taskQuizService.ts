// src/services/taskQuizService.ts
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL;
const API_BEARER_TOKEN = Constants.expoConfig?.extra?.API_BEARER_TOKEN;

export type QuizQuestion = {
    id: string;
    question: string;
    options: string[];
    answer: string;
};

const fallbackQuestions: QuizQuestion[] = [
    {
        id: '1',
        question: 'What is the plural of "mouse"?',
        options: ['mouses', 'mices', 'miceses', 'mice'],
        answer: 'mice',
    },
    {
        id: '2',
        question: 'Choose the correct past tense: "eat".',
        options: ['ate', 'eated', 'eat', 'eaten'],
        answer: 'ate',
    },
    {
        id: '3',
        question: 'Translate "livro" to English.',
        options: ['Library', 'Paper', 'Book', 'Notebook'],
        answer: 'Book',
    },
    {
        id: '4',
        question: 'Which of these is a fruit?',
        options: ['Carrot', 'Banana', 'Broccoli', 'Potato'],
        answer: 'Banana',
    },
    {
        id: '5',
        question: 'What color is the sky on a clear day?',
        options: ['Red', 'Blue', 'Green', 'Yellow'],
        answer: 'Blue',
    },
];

export async function getQuizQuestions(level: string, language: string): Promise<QuizQuestion[]> {
    try {
        const url = `${API_URL}/llm/quiz?level=${encodeURIComponent(level)}&language=${encodeURIComponent(language)}`;

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${API_BEARER_TOKEN}`,
                Accept: 'application/json',
            },
        });

        const text = await response.text();
        const data = JSON.parse(text);
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch quiz');
        }

        return data as QuizQuestion[];
    } catch (error) {
        console.warn('[getQuizQuestions] API failed. Using fallback questions.');
        return fallbackQuestions;
    }
}

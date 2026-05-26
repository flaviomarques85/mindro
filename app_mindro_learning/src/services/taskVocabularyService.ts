import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL;
const API_BEARER_TOKEN = Constants.expoConfig?.extra?.API_BEARER_TOKEN;

export type VocabularyPhrase = {
    id: string;
    text: string;
    answer: string;
};

const fallbackPhrases: VocabularyPhrase[] = [
    { id: '1', text: 'I am happy', answer: 'eu estou feliz' },
    { id: '2', text: 'She is tall', answer: 'ela é alta' },
    { id: '3', text: 'This is easy', answer: 'isso é fácil' },
    { id: '4', text: 'He has a car', answer: 'ele tem um carro' },
    { id: '5', text: 'They are students', answer: 'eles são estudantes' },
];

export async function getVocabularyPhrases(level: string, language: string): Promise<VocabularyPhrase[]> {
    try {
        const url = `${API_URL}/llm/vocabulary-translator?level=${encodeURIComponent(level)}&language=${encodeURIComponent(language)}`;

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${API_BEARER_TOKEN}`,
                Accept: 'application/json',
            },
        });

        const text = await response.text();
        const data = JSON.parse(text);

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch vocabulary');
        }

        return data as VocabularyPhrase[];
    } catch (error) {
        console.warn('[getVocabularyPhrases] API failed. Using fallback phrases.');
        return fallbackPhrases;
    }
}

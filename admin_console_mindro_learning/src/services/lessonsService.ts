import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3003';
const API_BEARER_TOKEN = process.env.REACT_APP_API_BEARER_TOKEN;

const axiosInstance = axios.create({
    baseURL: API_BASE,
    headers: API_BEARER_TOKEN
        ? { Authorization: `Bearer ${API_BEARER_TOKEN}` }
        : {},
});

export interface Lesson {
    id: string;
    language: {
        id: string;
        name: string;
    };
    user: {
        id: string;
        name: string;
    };
    teacher: {
        id: string;
        name: string;
    };
    date: string;
    time: string;
    status: string;
    topic?: string;
}

export interface CreateLessonPayload {
    userId: string;
    languageId: string;
    teacherId: string;
    date: string;
    time: string;
    status: string;
    topic?: string;
}

export interface UpdateLessonPayload {
    userId?: string;
    languageId?: string;
    date?: string;
    time?: string;
    status?: string;
    topic?: string;
}

// Busca todas as lições de um professor
export async function fetchLessonsByTeacherId(teacherId: string): Promise<Lesson[]> {
    const url = `/lessons/teacher/${teacherId}`;
    const response = await axiosInstance.get(url);
    return response.data;
}

// Criar uma nova lição
export async function createLesson(payload: CreateLessonPayload): Promise<Lesson> {
    const response = await axiosInstance.post('/lessons', payload);
    return response.data;
}

// Atualizar uma lição existente
export async function updateLesson(lessonId: string, payload: UpdateLessonPayload): Promise<Lesson> {
    console.log('payload', payload);
    const response = await axiosInstance.put(`/lessons/${lessonId}`, payload);
    return response.data;
}

// Deletar uma lição
export async function deleteLesson(lessonId: string): Promise<void> {
    await axiosInstance.delete(`/lessons/${lessonId}`);
}

// Buscar idiomas disponíveis
export async function fetchLanguages(): Promise<{ id: string; name: string; }[]> {
    const response = await axiosInstance.get('/languages');
    return response.data;
}

// Buscar cursos/idiomas de um estudante específico
export async function fetchStudentLanguages(userId: string): Promise<{ id: string; name: string; }[]> {
    const response = await axiosInstance.get(`/courses/user/${userId}`);
    return response.data
        .filter((course: any) => course.status !== 'FINISHED')
        .map((course: any) => ({
            id: course.languageId,
            name: course.title
        }));
}

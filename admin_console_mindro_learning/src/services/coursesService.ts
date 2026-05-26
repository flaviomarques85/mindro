// src/services/coursesService.ts
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3003';
const API_BEARER_TOKEN = process.env.REACT_APP_API_BEARER_TOKEN;

const axiosInstance = axios.create({
    baseURL: API_BASE,
    headers: API_BEARER_TOKEN
        ? { Authorization: `Bearer ${API_BEARER_TOKEN}` }
        : {},
});

export interface Course {
    id: string;
    title: string;
    level: string;
    status: string;
    languageId: string;
    userId: string;
}

export const getCoursesByStudentId = async (studentId: string): Promise<Course[]> => {
    const response = await axiosInstance.get(`/courses/user/${studentId}`);
    return response.data;
};

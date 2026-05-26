// src/services/tasksService.ts
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3003';
const API_BEARER_TOKEN = process.env.REACT_APP_API_BEARER_TOKEN;

const axiosInstance = axios.create({
    baseURL: API_BASE,
    headers: API_BEARER_TOKEN
        ? { Authorization: `Bearer ${API_BEARER_TOKEN}` }
        : {},
});

export interface Task {
    id: string;
    title: string;
    description: string | null;
    status: string;
    progress: number;
    weight: number;
    dueDate: string | null;
    completedAt: string | null;
    teacherId: string;
    userId: string;
}

export const getTasksByStudentId = async (studentId: string): Promise<Task[]> => {
    const response = await axiosInstance.get(`/tasks/user/${studentId}`);
    return response.data.map((task: any) => ({
        ...task,
        progress: Number(task.progress),
        weight: Number(task.weight),
    }));
};

export const getTasksByTeacherId = async (teacherId: string): Promise<Task[]> => {
    const response = await axiosInstance.get(`/tasks/teacher/${teacherId}`);
    return response.data.map((task: any) => ({
        ...task,
        progress: Number(task.progress),
        weight: Number(task.weight),
    }));
};
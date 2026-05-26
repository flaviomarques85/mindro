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
    teacherId: string;
    userId: string;
    title: string;
    description: 'class' | 'quiz' | 'vocabulary';
    status: 'Pending' | 'In Progress' | 'Completed';
    progress: number;
    weight: 25 | 50 | 100;
    dueDate: string;
    completedAt?: string;
    user?: { name: string }; // Optional: for displaying student name
}

// Fetch all tasks for a teacher
export async function fetchTasksByTeacherId(teacherId: string): Promise<Task[]> {
    const url = `/tasks/teacher/${teacherId}`;
    const response = await axiosInstance.get(url);
    return response.data;
}

// Create a new task
export async function createTask(task: Omit<Task, 'id'>): Promise<Task> {
    const response = await axiosInstance.post('/tasks', task);
    return response.data;
}

// Update an existing task
export async function updateTask(taskId: string, task: Partial<Task>): Promise<Task> {
    const response = await axiosInstance.put(`/tasks/${taskId}`, task);
    return response.data;
}

// Delete a task
export async function deleteTask(taskId: string): Promise<void> {
    await axiosInstance.delete(`/tasks/${taskId}`);
}

// src/services/studentsService.ts
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3003';
const API_BEARER_TOKEN = process.env.REACT_APP_API_BEARER_TOKEN;

const axiosInstance = axios.create({
    baseURL: API_BASE,
    headers: API_BEARER_TOKEN
        ? { Authorization: `Bearer ${API_BEARER_TOKEN}` }
        : {},
});
export interface Student {
    id: string;
    name: string;
    email: string;
    joinedDate: string;
    monthlyFee: string;
    status: string;
}

export interface CreateStudentData {
    name: string;
    email: string;
    mobilePhone: string;
    cpf: string;
    birthDate: string;
    monthlyFee?: number;
    status: 'pending' | 'active' | 'inactive';
    teacherId: string;
    joinedDate: string;
    nextDueDate?: string;
    profilePicture?: string;
}

export const getStudentsByTeacher = async (teacherId: string): Promise<Student[]> => {
    const url = `/teachers/${teacherId}/students`;
    const response = await axiosInstance.get(url);
    return response.data;
};

export const getStudentById = async (id: string): Promise<Student> => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
};

export const createStudent = async (studentData: CreateStudentData): Promise<Student> => {
    const { teacherId, ...body } = studentData;

    const dataForApi = {
        name: body.name,
        email: body.email,
        mobilePhone: body.mobilePhone,
        cpf: body.cpf,
        birthDate: new Date(body.birthDate),
        profilePicture: body.profilePicture ?? null,
        joinedDate: new Date(body.joinedDate),
        monthlyFee: body.monthlyFee,
        nextDueDate: body.nextDueDate ? new Date(body.nextDueDate) : null,
        status: body.status ?? 'pending',
        teacher: {
            connect: { id: teacherId }
        }
    };

    const response = await axiosInstance.post(`/users/`, dataForApi);
    return response.data;
};

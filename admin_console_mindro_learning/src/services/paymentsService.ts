// src/services/paymentsService.ts
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3003';
const API_BEARER_TOKEN = process.env.REACT_APP_API_BEARER_TOKEN;

const axiosInstance = axios.create({
    baseURL: API_BASE,
    headers: API_BEARER_TOKEN
        ? { Authorization: `Bearer ${API_BEARER_TOKEN}` }
        : {},
});

export interface Payment {
    id: string;
    userId: string;
    date: string;
    fee: number;
    finalAmount: number;
    status: string;
    method: string;
    transactionId?: string;
}

export const getPaymentsByStudentId = async (studentId: string): Promise<Payment[]> => {
    const response = await axiosInstance.get(`/payments/${studentId}`);
    // Ensure fee and finalAmount are numbers
    return response.data.map((payment: any) => ({
        ...payment,
        fee: parseFloat(payment.fee),
        finalAmount: parseFloat(payment.finalAmount),
    }));
};

export const getPaymentsByTeacherId = async (teacherId: string): Promise<Payment[]> => {
    const response = await axiosInstance.get(`/payments/teacher/${teacherId}`);
    return response.data.map((payment: any) => ({
        ...payment,
        fee: parseFloat(payment.fee),
        finalAmount: parseFloat(payment.finalAmount),
    }));
};
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3003';
const API_BEARER_TOKEN = process.env.REACT_APP_API_BEARER_TOKEN;

const axiosInstance = axios.create({
    baseURL: API_BASE,
    headers: API_BEARER_TOKEN
        ? { Authorization: `Bearer ${API_BEARER_TOKEN}` }
        : {},
});

// Busca teacher pelo e-mail
export async function fetchTeacherByEmail(email: string) {
    const url = `/teachers/email/${encodeURIComponent(email)}`;
    const response = await axiosInstance.get(url);
    return response.data;
}

// Envia código de verificação para o e-mail do Teacher
export async function sendVerificationCode(userId: string) {
    const url = `/auth/create-code`;
    console.log('userId', userId);
    const response = await axiosInstance.post(url, { userId});
    return response.data;
}

// Verifica o código de 4 dígitos
export async function verifyCode(userId: string, code: string) {
    const url = `/auth/verify-code`;
    const response = await axiosInstance.post(url, { userId, code });
    return response.data;
}

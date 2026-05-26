// src/hooks/useDashboardData.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { getStudentsByTeacher, Student } from '../services/studentsService';
import { getTasksByTeacherId, Task } from '../services/tasksService';
import { getPaymentsByTeacherId, Payment } from '../services/paymentsService';
import { fetchLessonsByTeacherId, Lesson } from '../services/lessonsService';

export function useDashboardData() {
    const { userId } = useAuth();
    const [students, setStudents] = useState<Student[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!userId) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const [studentsData, tasksData, paymentsData, lessonsData] = await Promise.all([
                getStudentsByTeacher(userId),
                getTasksByTeacherId(userId),
                getPaymentsByTeacherId(userId),
                fetchLessonsByTeacherId(userId),
            ]);
            setStudents(studentsData);
            setTasks(tasksData);
            setPayments(paymentsData);
            setLessons(lessonsData);
        } catch (err: any) {
            setError(err.message || 'Error fetching dashboard data');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const totalPayments = payments.reduce((acc, p) => acc + p.finalAmount, 0);

    return { 
        students, 
        tasks, 
        payments, 
        lessons, 
        loading, 
        error, 
        totalPayments,
        refetchData: fetchData 
    };
}

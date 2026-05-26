// src/hooks/useStudents.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { getStudentsByTeacher, Student } from '../services/studentsService';

export function useStudents() {
    const { userId } = useAuth();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStudents = useCallback(async () => {
        try {
            setLoading(true);
            if (!userId) throw new Error('User not identified');
            const data = await getStudentsByTeacher(userId);
            setStudents(data);
        } catch (err: any) {
            setError(err.message || 'Error fetching students');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    return { students, loading, error, refetchStudents: fetchStudents };
}

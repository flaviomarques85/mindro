import { useState, useEffect } from 'react';
import { getStudentById, Student } from '../services/studentsService';

export function useStudentDetail(id: string | undefined) {
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        async function fetchStudent() {
            try {
                if (!id) {
                    setError('Invalid student ID');
                    setLoading(false);
                    return;
                }
                const data = await getStudentById(id);
                setStudent(data);
            } catch (err: any) {
                setError(err.message || 'Error fetching student');
            } finally {
                setLoading(false);
            }
        }
        fetchStudent();
    }, [id]);

    return { student, loading, error };
}

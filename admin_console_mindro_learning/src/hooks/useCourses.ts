// src/hooks/useCourses.ts
import { useState, useEffect, useCallback } from 'react';
import { getCoursesByStudentId, Course } from '../services/coursesService';

export function useCourses(studentId: string | undefined) {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCourses = useCallback(async () => {
        if (!studentId) {
            setCourses([]);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const data = await getCoursesByStudentId(studentId);
            setCourses(data);
        } catch (err: any) {
            setError(err.message || 'Error fetching courses');
        } finally {
            setLoading(false);
        }
    }, [studentId]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    return { courses, loading, error, refetchCourses: fetchCourses };
}

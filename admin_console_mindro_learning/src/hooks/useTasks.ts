// src/hooks/useTasks.ts
import { useState, useEffect, useCallback } from 'react';
import { getTasksByStudentId, Task } from '../services/tasksService';

export function useTasks(studentId: string | undefined) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = useCallback(async () => {
        if (!studentId) {
            setTasks([]);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const data = await getTasksByStudentId(studentId);
            setTasks(data);
        } catch (err: any) {
            setError(err.message || 'Error fetching tasks');
        } finally {
            setLoading(false);
        }
    }, [studentId]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return { tasks, loading, error, refetchTasks: fetchTasks };
}

import React, { useState, useEffect, useCallback } from 'react';
import { fetchTasksByTeacherId, createTask, updateTask, deleteTask, Task } from '../services/taskService';
import { useAuth } from '../hooks/useAuth';
import { useStudents } from '../hooks/useStudents';
import { Plus, Search, RefreshCw, Trash2, AlertTriangle, Pencil, Info } from 'lucide-react';
import Modal from '../components/Modal';
import dayjs from 'dayjs';

const TasksPage: React.FC = () => {
    const { userId } = useAuth();
    const { students } = useStudents();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

    const getTasks = useCallback(async () => {
        if (userId) {
            setLoading(true);
            try {
                const data = await fetchTasksByTeacherId(userId);
                setTasks(data);
                setFilteredTasks(data);
            } catch (err) {
                setError('Failed to fetch tasks.');
            } finally {
                setLoading(false);
            }
        }
    }, [userId]);

    useEffect(() => {
        getTasks();
    }, [getTasks]);

    useEffect(() => {
        const results = tasks.filter(task =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredTasks(results);
    }, [searchTerm, tasks]);

    const handleCreate = () => {
        setSelectedTask(null);
        setIsFormModalOpen(true);
    };

    const handleEdit = (task: Task) => {
        setSelectedTask(task);
        setIsFormModalOpen(true);
    };

    const handleDeleteRequest = (taskId: string) => {
        setTaskToDelete(taskId);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (taskToDelete) {
            try {
                await deleteTask(taskToDelete);
                await getTasks(); // Refresh list
            } catch (err) {
                setError('Failed to delete task.');
            } finally {
                setIsDeleteModalOpen(false);
                setTaskToDelete(null);
            }
        }
    };

    const handleSave = async (task: Omit<Task, 'id'> | Task) => {
        try {
            if ('id' in task && task.id) {
                const updatePayload = {
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    progress: task.progress,
                    weight: task.weight,
                    completedAt: task.completedAt,
                    userId: task.userId,
                };
                await updateTask(task.id, updatePayload);
            } else {
                await createTask(task as Omit<Task, 'id'>);
            }
            setIsFormModalOpen(false);
            await getTasks(); // Refresh list
        } catch (err) {
            setError('Failed to save task.');
        }
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-gray-800">Tasks</h1>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by title or student..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-72 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow shadow-sm"
                        />
                    </div>
                    <button onClick={handleCreate} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors shadow-sm">
                        <Plus size={18} />
                        <span>Create Task</span>
                    </button>
                    <button onClick={getTasks} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Refresh tasks">
                        <RefreshCw size={20} className="text-gray-600" />
                    </button>
                </div>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredTasks.map((task) => (
                                <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{task.user?.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{task.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            task.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                            task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{task.progress}%</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{dayjs(task.dueDate).format('DD/MM/YYYY')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{task.weight}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(task)}
                                            className="text-primary hover:text-primary-dark mr-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={task.status !== 'Pending'}
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button onClick={() => handleDeleteRequest(task.id)} className="text-red-600 hover:text-red-800">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isFormModalOpen && (
                <Modal onClose={() => setIsFormModalOpen(false)}>
                    <TaskForm
                        task={selectedTask}
                        students={students}
                        onSave={handleSave}
                        onClose={() => setIsFormModalOpen(false)}
                    />
                </Modal>
            )}

            {isDeleteModalOpen && (
                <Modal onClose={() => setIsDeleteModalOpen(false)}>
                    <div className="p-6 text-center">
                        <AlertTriangle className="mx-auto h-16 w-16 text-red-500" />
                        <h3 className="mt-4 text-xl font-bold text-gray-800">Confirm Deletion</h3>
                        <p className="mt-2 text-gray-600">
                            Are you sure you want to delete this task? This action is irreversible and the task will be permanently removed.
                        </p>
                        <div className="mt-6 flex justify-center gap-4">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

interface TaskFormProps {
    task: Task | null;
    students: any[];
    onSave: (task: Omit<Task, 'id'> | Task) => void;
    onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, students, onSave, onClose }) => {
    const { userId } = useAuth();
    const [title, setTitle] = useState(task?.title || '');
    const [studentId, setStudentId] = useState(task?.userId || '');
    const [description, setDescription] = useState<'class' | 'quiz' | 'vocabulary'>(
        task?.description || 'class'
    );
    const [weight, setWeight] = useState<25 | 50 | 100>(task?.weight || 25);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const taskData = {
            ...(task || {}),
            title,
            userId: studentId,
            teacherId: userId || '',
            description,
            weight,
            ...(!task && {
                progress: 0,
                dueDate: dayjs().add(7, 'day').toISOString(),
                status: 'Pending' as 'Pending' | 'In Progress' | 'Completed',
            })
        };

        onSave(taskData as Task);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center">
                <h2 className="text-2xl font-bold text-gray-800">{task ? 'Edit Task' : 'Create Task'}</h2>
                <div className="relative group ml-2">
                    <Info size={16} className="text-gray-400 cursor-pointer" />
                    <div className="absolute bottom-full mb-2 w-64 bg-gray-800 text-white text-xs rounded py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        The due date is calculated based on the week of registration. The student will see the activity during the current week. After that date, if no new weekly activity is created, the student will not see any active activities.
                    </div>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Student</label>
                <select
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    required
                >
                    <option value="">Select a student</option>
                    {students.map(student => (
                        <option key={student.id} value={student.id}>{student.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <select
                    value={description}
                    onChange={(e) => setDescription(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                >
                    <option value="class">Class</option>
                    <option value="quiz">Quiz</option>
                    <option value="vocabulary">Vocabulary</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Weight</label>
                <select
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value) as 25 | 50 | 100)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>
            <div className="flex justify-end gap-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">Save</button>
            </div>
        </form>
    );
};

export default TasksPage;


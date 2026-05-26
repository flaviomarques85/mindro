import React, { useState, useEffect, useCallback } from 'react';
import { fetchLessonsByTeacherId, createLesson, updateLesson, deleteLesson, Lesson, fetchStudentLanguages } from '../services/lessonsService';
import { useAuth } from '../hooks/useAuth';
import { useStudents } from '../hooks/useStudents';
import { Search, Plus, RefreshCw, Trash2, AlertTriangle, Pencil } from 'lucide-react';
import Modal from '../components/Modal';
import dayjs from 'dayjs';

const LessonsPage: React.FC = () => {
    const { userId } = useAuth();
    const { students } = useStudents();
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [lessonToDelete, setLessonToDelete] = useState<string | null>(null);

    const getLessons = useCallback(async () => {
        if (userId) {
            setLoading(true);
            try {
                const data = await fetchLessonsByTeacherId(userId);
                setLessons(data);
                setFilteredLessons(data);
            } catch (err) {
                setError('Failed to fetch lessons.');
            } finally {
                setLoading(false);
            }
        }
    }, [userId]);

    useEffect(() => {
        getLessons();
    }, [getLessons]);

    useEffect(() => {
        const results = lessons.filter(lesson =>
            lesson.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lesson.language.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            new Date(lesson.date).toLocaleDateString().includes(searchTerm)
        );
        setFilteredLessons(results);
    }, [searchTerm, lessons]);

    const handleCreate = () => {
        setSelectedLesson(null);
        setIsFormModalOpen(true);
    };

    const handleEdit = (lesson: Lesson) => {
        if (lesson.status === 'Finished') {
            setError('Cannot edit finished lessons.');
            return;
        }
        setSelectedLesson(lesson);
        setIsFormModalOpen(true);
    };

    const handleDeleteRequest = (lessonId: string) => {
        setLessonToDelete(lessonId);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (lessonToDelete) {
            try {
                await deleteLesson(lessonToDelete);
                await getLessons(); // Refresh list
            } catch (err) {
                setError('Failed to delete lesson.');
            } finally {
                setIsDeleteModalOpen(false);
                setLessonToDelete(null);
            }
        }
    };

    const handleSave = async (lesson: Omit<Lesson, 'id'> | Lesson) => {
        try {
            // Combinar data e hora em um timestamp ISO-8601
            const dateTime = dayjs(`${lesson.date} ${lesson.time}`).toISOString();

            if ('id' in lesson && lesson.id) {
                const updatePayload = {
                    userId: lesson.user.id,
                    languageId: lesson.language.id,
                    date: dateTime,
                    time: lesson.time, // Enviar a hora como string HH:mm
                    status: lesson.status,
                };
                await updateLesson(lesson.id, updatePayload);
            } else {
                const createPayload = {
                    userId: lesson.user.id,
                    languageId: lesson.language.id,
                    teacherId: userId || '',
                    date: dateTime,
                    time: lesson.time, // Enviar a hora como string HH:mm
                    status: lesson.status,
                };
                await createLesson(createPayload);
            }
            setIsFormModalOpen(false);
            await getLessons(); // Refresh list
        } catch (err) {
            setError('Failed to save lesson.');
        }
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-gray-800">My Lessons - class </h1>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by student, date, topic..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-72 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow shadow-sm"
                        />
                    </div>
                    <button onClick={handleCreate} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors shadow-sm">
                        <Plus size={18} />
                        <span>Create Lesson</span>
                    </button>
                    <button onClick={getLessons} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Refresh lessons">
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date and Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredLessons.map((lesson) => (
                                <tr key={lesson.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lesson.user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{lesson.language.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {dayjs(lesson.date).format('DD/MM/YYYY')} {lesson.time}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${lesson.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                                            lesson.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                                lesson.status === 'Finished' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {lesson.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(lesson)}
                                            className="text-primary hover:text-primary-dark mr-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={lesson.status === 'Finished'}
                                            title={lesson.status === 'Finished' ? 'Cannot edit finished lessons' : 'Edit lesson'}
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteRequest(lesson.id)}
                                            className="text-red-600 hover:text-red-800"
                                            title="Delete lesson"
                                        >
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
                    <LessonForm
                        lesson={selectedLesson}
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
                            Are you sure you want to delete this lesson? This action is irreversible and the lesson will be permanently removed.
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

interface LessonFormProps {
    lesson: Lesson | null;
    students: any[];
    onSave: (lesson: Omit<Lesson, 'id'> | Lesson) => void;
    onClose: () => void;
}

const LessonForm: React.FC<LessonFormProps> = ({ lesson, students, onSave, onClose }) => {
    const [studentId, setStudentId] = useState(lesson?.user.id || '');
    const [languageId, setLanguageId] = useState(lesson?.language.id || '');
    const [studentLanguages, setStudentLanguages] = useState<{ id: string; name: string; }[]>([]);
    const [loadingLanguages, setLoadingLanguages] = useState(false);
    const [date, setDate] = useState(lesson?.date ? dayjs(lesson.date).format('YYYY-MM-DD') : '');
    const [time, setTime] = useState(lesson?.time || '');
    const [status, setStatus] = useState(lesson?.status || 'Scheduled');
    const [topic, setTopic] = useState(lesson?.topic || '');

    // Buscar idiomas quando o estudante é selecionado
    useEffect(() => {
        if (studentId) {
            setLoadingLanguages(true);
            fetchStudentLanguages(studentId)
                .then(languages => {
                    setStudentLanguages(languages);
                    // Se estamos editando e o idioma atual não está na lista do novo estudante, limpar a seleção
                    if (lesson && !languages.find(l => l.id === languageId)) {
                        setLanguageId('');
                    }
                })
                .catch(err => {
                    console.error('Failed to fetch student languages:', err);
                    setStudentLanguages([]);
                })
                .finally(() => {
                    setLoadingLanguages(false);
                });
        } else {
            setStudentLanguages([]);
            setLanguageId('');
        }
    }, [studentId, lesson, languageId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const selectedStudent = students.find(s => s.id === studentId);
        const selectedLanguage = studentLanguages.find(l => l.id === languageId);

        if (!selectedStudent || !selectedLanguage) {
            return;
        }

        const lessonData = {
            ...(lesson || {}),
            user: {
                id: studentId,
                name: selectedStudent.name,
            },
            language: {
                id: languageId,
                name: selectedLanguage.name,
            },
            date,
            time,
            status,
            topic,
        };

        onSave(lessonData as Lesson);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">{lesson ? 'Edit Lesson' : 'Create Lesson'}</h2>

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
                <label className="block text-sm font-medium text-gray-700">Language</label>
                <select
                    value={languageId}
                    onChange={(e) => setLanguageId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    required
                    disabled={!studentId || loadingLanguages}
                >
                    <option value="">
                        {!studentId ? 'Select a student first' :
                            loadingLanguages ? 'Loading languages...' :
                                'Select a language'}
                    </option>
                    {studentLanguages.map(language => (
                        <option key={language.id} value={language.id}>{language.name}</option>
                    ))}
                </select>
                {studentId && studentLanguages.length === 0 && !loadingLanguages && (
                    <p className="text-sm text-red-600 mt-1">This student has no active courses available for lessons.</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    required
                >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Finished">Finished</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Topic (Optional)</label>
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Lesson topic or notes"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
            </div>

            <div className="flex justify-end gap-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">Save</button>
            </div>
        </form>
    );
};

export default LessonsPage;

import React, { useState, useEffect } from 'react';
import { useStudents } from '../hooks/useStudents';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { Search, Plus } from 'lucide-react';
import Modal from '../components/Modal';
import StudentForm from '../components/StudentForm';
import { createStudent, CreateStudentData } from '../services/studentsService';
import '../App.css';

const StudentsPage: React.FC = () => {
    const { students, loading, error, refetchStudents } = useStudents();
    const navigate = useNavigate();

    const [filteredStudents, setFilteredStudents] = useState(students);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);

    useEffect(() => {
        setFilteredStudents(
            students.filter(student =>
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, students]);

    useEffect(() => {
        if (!loading) {
            setFilteredStudents(students);
        }
    }, [students, loading]);

    const formatDate = (iso: string) => dayjs(iso).format('DD/MM/YYYY');

    const handleCreate = () => {
        setIsFormModalOpen(true);
    };

    const handleSave = async (studentData: CreateStudentData) => {
        try {
            await createStudent(studentData);
            setIsFormModalOpen(false);
            refetchStudents();
        } catch (err) {
            console.error("Failed to create student", err);
        }
    };

    if (loading) return <div className="text-gray-600 p-4">Loading...</div>;
    if (error) return <div className="text-red-600 p-4">Error: {error}</div>;

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-gray-800">My Students</h1>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-72 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow shadow-sm"
                        />
                    </div>
                    <button onClick={handleCreate} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors shadow-sm">
                        <Plus size={18} />
                        <span>Create Student</span>
                    </button>
                </div>
            </div>

            {filteredStudents.length === 0 ? (
                <p className="text-gray-600">No students found.</p>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Fee</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredStudents.map((s) => (
                                <tr
                                    key={s.id}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                    onClick={() => navigate(`/students/${s.id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{s.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(s.joinedDate)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">$ {s.monthlyFee}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            s.status === 'active' ? 'bg-green-100 text-green-800' :
                                            s.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isFormModalOpen && (
                <Modal onClose={() => setIsFormModalOpen(false)}>
                    <StudentForm
                        student={null}
                        onSave={handleSave}
                        onClose={() => setIsFormModalOpen(false)}
                    />
                </Modal>
            )}
        </div>
    );
};

export default StudentsPage;

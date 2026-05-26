import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStudentDetail } from '../hooks/useStudentDetail';
import dayjs from 'dayjs';
import PaymentsTab from '../components/PaymentsTab';
import CoursesTab from '../components/CoursesTab';
import WeeklyProgressTab from '../components/WeeklyProgressTab';
import '../App.css';

const TABS = ['Weekly Progress', 'Courses', 'Payments'];

const StudentDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { student, loading, error } = useStudentDetail(id);
    const [activeTab, setActiveTab] = useState(TABS[0]);

    if (loading) return <div className="text-gray-600 p-4">Loading details...</div>;
    if (error) return <div className="text-red-600 p-4">Error: {error}</div>;
    if (!student) return <div className="text-gray-600 p-4">Student not found.</div>;

    return (
        <div className="container">
            <h1 className="text-xl font-semibold text-gray-800 mb-8">Student Details</h1>

            <div className="card space-y-4 mb-8">
                <div>
                    <span className="text-gray-500 text-sm block">Name</span>
                    <span className="text-base font-medium text-gray-800">{student.name}</span>
                </div>
                <div>
                    <span className="text-gray-500 text-sm block">Email</span>
                    <span className="text-base text-gray-800">{student.email}</span>
                </div>
                <div>
                    <span className="text-gray-500 text-sm block">Start Date</span>
                    <span className="text-base text-gray-800">
                        {dayjs(student.joinedDate).format('DD/MM/YYYY')}
                    </span>
                </div>
                <div>
                    <span className="text-gray-500 text-sm block">Monthly Fee</span>
                    <span className="text-base text-gray-800">$ {student.monthlyFee}</span>
                </div>
                <div>
                    <span className="text-gray-500 text-sm block">Status</span>
                    <span className={`text-base font-medium ${student.status === 'active' ? 'text-green-600' : 'text-gray-600'}`}>
                        {student.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 border-b border-gray-200 mb-6">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 font-medium text-sm border-b-2 transition ${activeTab === tab
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div className="card space-y-4">
                {activeTab === 'Weekly Progress' && <WeeklyProgressTab studentId={id} />}

                {activeTab === 'Courses' && <CoursesTab studentId={id} />}

                {activeTab === 'Payments' && <PaymentsTab studentId={id} />}
            </div>
        </div>
    );
};

export default StudentDetailPage;

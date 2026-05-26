import React from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import dayjs from 'dayjs';
import '../App.css';

const DashboardPage: React.FC = () => {
    const { students, tasks, payments, lessons, loading, error, totalPayments } = useDashboardData();

    if (loading) return <div className="text-gray-600 p-4">Loading dashboard...</div>;
    if (error) return <div className="text-red-600 p-4">Error: {error}</div>;

    // Find student name by userId
    const getStudentName = (userId: string) => {
        const student = students.find(s => s.id === userId);
        return student ? student.name : 'Unknown Student';
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <main className="flex-1 overflow-y-auto p-6 container">
                <h1 className="text-xl font-semibold text-gray-800 mb-8">Teacher Dashboard</h1>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="card text-center">
                        <div className="text-4xl font-bold text-indigo-600 mb-1">{students.length}</div>
                        <div className="text-gray-600 text-sm">Active Students</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-4xl font-bold text-indigo-600 mb-1">
                            {tasks.length}
                        </div>
                        <div className="text-gray-600 text-sm">Total Tasks</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-4xl font-bold text-indigo-600 mb-1">
                            $ {totalPayments.toFixed(2)}
                        </div>
                        <div className="text-gray-600 text-sm">Recent Payments</div>
                    </div>
                </div>

                {/* Upcoming Lessons */}
                <div className="card mb-10">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Lessons</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Language</th>
                                <th>Date</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(() => {
                                const upcomingLessons = lessons
                                    .filter(l => dayjs(l.date).isAfter(dayjs().subtract(1, 'day')))
                                    .slice(0, 5);

                                if (upcomingLessons.length === 0) {
                                    return (
                                        <tr>
                                            <td colSpan={4} className="text-center text-gray-500 py-4">
                                                No lessons in the coming days
                                            </td>
                                        </tr>
                                    );
                                }

                                return upcomingLessons.map((l) => (
                                    <tr key={l.id}>
                                        <td>{l.user.name}</td>
                                        <td>{l.language.name}</td>
                                        <td>{dayjs(l.date).format('DD/MM/YYYY')}</td>
                                        <td>{l.time}</td>
                                    </tr>
                                ));
                            })()}
                        </tbody>
                    </table>
                </div>

                {/* Recent Payments */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Payments</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.slice(0, 5).map((p) => ( // Show only top 5 recent payments
                                <tr key={p.id}>
                                    <td>{getStudentName(p.userId)}</td>
                                    <td>$ {p.finalAmount.toFixed(2)}</td>
                                    <td className={p.status === 'succeeded' ? 'text-green-600' : 'text-yellow-600'}>
                                        {p.status}
                                    </td>
                                    <td>{dayjs(p.date).format('DD/MM/YYYY')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;

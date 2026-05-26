import React, { useState, useEffect } from 'react';
import { useTeacherPayments } from '../hooks/useTeacherPayments';
import { useStudents } from '../hooks/useStudents';
import dayjs from 'dayjs';
import { Search } from 'lucide-react';
import '../App.css';

const PaymentsPage: React.FC = () => {
    const { payments, loading, error } = useTeacherPayments();
    const { students } = useStudents(); // To get student names
    const [filteredPayments, setFilteredPayments] = useState(payments);
    const [searchTerm, setSearchTerm] = useState('');

    const getStudentName = (userId: string) => {
        const student = students.find(s => s.id === userId);
        return student ? student.name : 'Unknown Student';
    };

    useEffect(() => {
        setFilteredPayments(
            payments.filter(payment =>
                getStudentName(payment.userId).toLowerCase().includes(searchTerm.toLowerCase()) ||
                (payment.transactionId && payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        );
    }, [searchTerm, payments, students]);
    
    useEffect(() => {
        if (!loading) {
            setFilteredPayments(payments);
        }
    }, [payments, loading]);

    if (loading) return <div className="text-gray-600 p-4">Loading payments...</div>;
    if (error) return <div className="text-red-600 p-4">Error: {error}</div>;

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-gray-800">Payments</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by student or transaction..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-72 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow shadow-sm"
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredPayments.map((payment) => (
                            <tr key={payment.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getStudentName(payment.userId)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">$ {payment.finalAmount.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        payment.status === 'succeeded' ? 'bg-green-100 text-green-800' :
                                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {payment.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{dayjs(payment.date).format('DD/MM/YYYY')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{payment.method}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.transactionId || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentsPage;
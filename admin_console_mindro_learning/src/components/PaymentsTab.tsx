import React from 'react';
import { usePayments } from '../hooks/usePayments';
import dayjs from 'dayjs';

interface PaymentsTabProps {
    studentId: string | undefined;
}

const PaymentsTab: React.FC<PaymentsTabProps> = ({ studentId }) => {
    const { payments, loading, error } = usePayments(studentId);

    if (loading) return <p>Loading payments...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Payment History</h2>
            {payments.length === 0 ? (
                <p className="text-gray-600">No payment history found.</p>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Paid</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {payments.map((payment) => (
                                <tr key={payment.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{dayjs(payment.date).format('DD/MM/YYYY')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">$ {payment.fee.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">$ {payment.finalAmount.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.status === 'succeeded' ? 'bg-green-100 text-green-800' :
                                                payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{payment.method}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PaymentsTab;

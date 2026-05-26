import React, { useState } from 'react';
import { CreateStudentData, Student } from '../services/studentsService';
import { useAuth } from '../hooks/useAuth';

interface StudentFormProps {
    student: Student | null;
    onSave: (student: CreateStudentData) => void;
    onClose: () => void;
}

const countryCodes = [
    { code: '+55', country: 'Brazil' },
    { code: '+1', country: 'USA' },
    { code: '+44', country: 'UK' },
    { code: '+351', country: 'Portugal' },
    { code: '+49', country: 'Germany' },
    { code: '+33', country: 'France' },
];

const StudentForm: React.FC<StudentFormProps> = ({ student, onSave, onClose }) => {
    const { userId } = useAuth();
    const [name, setName] = useState(student?.name || '');
    const [email, setEmail] = useState(student?.email || '');
    const [countryCode, setCountryCode] = useState('+55');
    const [mobilePhone, setMobilePhone] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [cpf, setCpf] = useState('');
    const [monthlyFee, setMonthlyFee] = useState(student?.monthlyFee.toString() || '');
    const [status, setStatus] = useState(student?.status || 'pending');

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) {
            value = value.substring(0, 11);
        }

        let maskedValue = '';
        if (value.length > 0) {
            maskedValue = `(${value.substring(0, 2)}`;
        }
        if (value.length > 2) {
            maskedValue = `${maskedValue}) ${value.substring(2, 7)}`;
        }
        if (value.length > 7) {
            maskedValue = `${maskedValue}-${value.substring(7, 11)}`;
        }

        setMobilePhone(maskedValue);
    };

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) {
            value = value.substring(0, 11);
        }

        let maskedValue = value;
        if (value.length > 9) {
            maskedValue = `${value.substring(0, 3)}.${value.substring(3, 6)}.${value.substring(6, 9)}-${value.substring(9, 11)}`;
        } else if (value.length > 6) {
            maskedValue = `${value.substring(0, 3)}.${value.substring(3, 6)}.${value.substring(6)}`;
        } else if (value.length > 3) {
            maskedValue = `${value.substring(0, 3)}.${value.substring(3)}`;
        }
        setCpf(maskedValue);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) {
            // Handle error: user not logged in
            return;
        }
        const fullPhoneNumber = `${countryCode}${mobilePhone.replace(/\D/g, '')}`;
        const rawCpf = cpf.replace(/\D/g, '');
        const studentData: CreateStudentData = {
            name,
            email,
            mobilePhone: fullPhoneNumber,
            cpf: rawCpf,
            birthDate,
            monthlyFee: parseFloat(monthlyFee) || 0,
            status: status as any,
            teacherId: userId,
            joinedDate: new Date().toISOString(),
        };
        onSave(studentData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <h2 className="text-2xl font-bold text-gray-800">{student ? 'Edit Student' : 'Create Student'}</h2>
            <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Mobile Phone</label>
                <div className="flex">
                    <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-2/4 mr-2 px-4 py-2 border border-r-0 border-gray-300 rounded-l-md focus:ring-primary focus:border-primary bg-gray-50"
                    >
                        {countryCodes.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                    </select>
                    <input
                        type="text"
                        value={mobilePhone}
                        onChange={handlePhoneChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-r-md focus:ring-primary focus:border-primary"
                        required
                        placeholder="(XX) XXXXX-XXXX"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">CPF</label>
                <input
                    type="text"
                    value={cpf}
                    onChange={handleCpfChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    required
                    placeholder="XXX.XXX.XXX-XX"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Birth Date</label>
                <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Monthly Fee</label>
                <input
                    type="number"
                    value={monthlyFee}
                    onChange={(e) => setMonthlyFee(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    disabled={!student}
                >
                    <option value="pending">pending</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>
            <div className="flex justify-end gap-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">Save</button>
            </div>
        </form>
    );
};

export default StudentForm;

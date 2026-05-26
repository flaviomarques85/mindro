import React, { useMemo } from 'react';
import { useTasks } from '../hooks/useTasks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface WeeklyProgressTabProps {
    studentId: string | undefined;
}

const COLORS: { [key: string]: string } = {
    'Completed': '#8B5CF6', // Primária
    'In Progress': '#FACC15', // Destaques
    'Not Started': '#9ca3af', // gray-400 (Neutral)
    'Overdue': '#f87171', // red-400 (Warning)
};

const WeeklyProgressTab: React.FC<WeeklyProgressTabProps> = ({ studentId }) => {
    const { tasks, loading, error } = useTasks(studentId);

    const progressData = useMemo(() => {
        if (!tasks || tasks.length === 0) return { overallProgress: 0, statusDistribution: [], taskProgress: [] };

        const totalWeight = tasks.reduce((acc, task) => acc + task.weight, 0);
        const weightedProgress = tasks.reduce((acc, task) => acc + (task.progress * task.weight), 0);
        const overallProgress = totalWeight > 0 ? weightedProgress / totalWeight : 0;

        const statusCounts = tasks.reduce((acc, task) => {
            const status = task.status || 'Not Started';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const statusDistribution = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

        const taskProgress = tasks.map(task => ({
            name: task.title,
            progress: task.progress,
        }));

        return { overallProgress, statusDistribution, taskProgress };
    }, [tasks]);

    if (loading) return <p>Loading progress...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Weekly Progress</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="card p-6 col-span-1 lg:col-span-2">
                    <h3 className="font-semibold text-gray-700 mb-2">Tasks Progress</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={progressData.taskProgress}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="progress" fill="#8B5CF6" name="Progress (%)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="card p-6">
                    <h3 className="font-semibold text-gray-700 mb-2">Tasks Status</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={progressData.statusDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label
                            >
                                {progressData.statusDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#cccccc'} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="card p-6">
                <h3 className="font-semibold text-gray-700">Overall Progress</h3>
                <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                    <div
                        className="bg-blue-800 h-4 rounded-full"
                        style={{ width: `${progressData.overallProgress.toFixed(2)}%` }}
                    ></div>
                </div>
                <p className="text-right font-bold mt-1">{progressData.overallProgress.toFixed(2)}%</p>
            </div>
        </div>
    );
};

export default WeeklyProgressTab;

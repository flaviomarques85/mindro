import React from 'react';
import { useCourses } from '../hooks/useCourses';

// Helper to dynamically import flags
const getFlagIcon = (languageId: string) => {
    try {
        return require(`../assets/flags/${languageId}.png`);
    } catch (e) {
        // Return a default icon or null if not found
        return null;
    }
};

interface CoursesTabProps {
    studentId: string | undefined;
}

const CoursesTab: React.FC<CoursesTabProps> = ({ studentId }) => {
    const { courses, loading, error } = useCourses(studentId);

    if (loading) return <p>Loading courses...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Student's Courses</h2>
            {courses.length === 0 ? (
                <p className="text-gray-600">No courses found for this student.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.map((course) => {
                        const flagIcon = getFlagIcon(course.languageId);
                        return (
                            <div key={course.id} className="card flex items-center p-4 space-x-4">
                                {flagIcon && <img src={flagIcon} alt={`${course.languageId} flag`} className="w-10 h-10 rounded-full" />}
                                <div className="flex-1">
                                    <p className="font-bold text-gray-800">{course.title}</p>
                                    <p className="text-sm text-gray-600">Level: {course.level}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    course.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                    course.status === 'FINISHED' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {course.status}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CoursesTab;

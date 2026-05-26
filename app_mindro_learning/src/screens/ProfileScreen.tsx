import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { getUserFinishedCourses, Milestone } from '../services/courseService';
import { getTeacherById } from '../services/teacherService';

const ProfileScreen = () => {
    const navigation = useNavigation<any>();
    const { user, setUser } = useUser();
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [showAllMilestones, setShowAllMilestones] = useState(false);
    const [teacher, setTeacher] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;
            const finished = await getUserFinishedCourses(user.id);
            setMilestones(finished);

            if (user.teacherId) {
                const teacherData = await getTeacherById(user.teacherId);
                setTeacher(teacherData);
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        setUser(null);
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="px-6 pt-10 pb-8 rounded-b-3xl items-center">
                <Image
                    source={require('../assets/profile/man-black.png')}
                    className="w-20 h-20 rounded-full mb-4"
                    resizeMode="contain"
                />
                <Text className="text-gray-800 text-lg font-bold">{user?.name}</Text>
                <Text className="text-gray-600">{user?.email}</Text>
                <Text className="text-gray-500">
                    Joined {user?.joinedDate && new Date(user.joinedDate).toLocaleDateString('pt-BR')}
                </Text>

                <TouchableOpacity
                    className="mt-4 px-4 py-2 border border-gray rounded-full"
                    onPress={() => navigation.navigate('LanguageSelector')}
                >
                    <Text className="text-gray-700 font-medium">Add Language +</Text>
                </TouchableOpacity>
            </View>

            <View className="px-6 py-4">
                {/* Seção Your Teacher */}
                {teacher && (
                    <>
                        <Text className="text-lg font-semibold text-gray-800 mb-2">Your Teacher</Text>
                        <View className="bg-gray-100 rounded-xl p-4 mb-6">
                            <Text className="text-gray-800 font-semibold mb-1">{teacher.name}</Text>
                            <Text className="text-gray-700 mb-1">Email: {teacher.email}</Text>
                            {teacher.phone && (
                                <Text className="text-gray-700 mb-1">WhatsApp: {teacher.phone}</Text>
                            )}
                            <Text className="text-gray-700">Teaches: {teacher.languages?.length ?? 0} language(s)</Text>
                        </View>
                    </>
                )}

                {/* Seção Milestones */}
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-lg font-semibold text-gray-800">Milestones</Text>
                    <TouchableOpacity onPress={() => setShowAllMilestones(true)}>
                        <Text className="text-indigo-600 font-medium">View All</Text>
                    </TouchableOpacity>
                </View>
                <View className="flex-row justify-between flex-wrap gap-y-4">
                    {milestones.slice(0, 2).map((item) => (
                        <View key={item.id} className="bg-gray-100 p-4 rounded-xl items-center w-[48%]">
                            <Image source={item.flag} className="w-10 h-10 mb-2" resizeMode="contain" />
                            <Text className="text-base font-medium text-gray-700">{item.language}</Text>
                            <Text className="text-sm text-gray-500">{item.level}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Modal com todos os cursos */}
            <Modal visible={showAllMilestones} transparent animationType="slide">
                <View className="flex-1 bg-white pt-20 p-6">
                    <Text className="text-xl font-bold text-gray-800 mb-4">All Courses Completed</Text>
                    <ScrollView>
                        {milestones.map((item) => (
                            <View key={item.id} className="bg-gray-100 p-4 rounded-xl items-center mb-3">
                                <Image source={item.flag} className="w-10 h-10 mb-2" resizeMode="contain" />
                                <Text className="text-base font-medium text-gray-700">{item.language}</Text>
                                <Text className="text-sm text-gray-500">{item.level}</Text>
                            </View>
                        ))}
                    </ScrollView>
                    <TouchableOpacity className="mt-4 bg-gray-200 py-3 rounded-xl" onPress={() => setShowAllMilestones(false)}>
                        <Text className="text-center text-gray-700 font-medium">Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* Botão Logout */}
            <View className="px-6 mt-auto mb-10">
                <TouchableOpacity className="bg-indigo-600 py-3 rounded-xl" onPress={handleLogout}>
                    <Text className="text-white text-center font-semibold text-lg">Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default ProfileScreen;

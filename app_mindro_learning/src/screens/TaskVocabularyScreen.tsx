// src/screens/TaskVocabularyScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getVocabularyPhrases, VocabularyPhrase } from '../services/taskVocabularyService';
import { Task, updateUserTaskProgress } from '../services/taskService';

const TaskVocabularyScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { task, language, level } = route.params as { task: Task; language: string; level: string };

    const [phrases, setPhrases] = useState<VocabularyPhrase[]>([]);
    const [loading, setLoading] = useState(true);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [input, setInput] = useState('');
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        getVocabularyPhrases(level, language)
            .then(setPhrases)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = () => {
        if (submitting) return;
        setSubmitting(true);

        const normalized = input.trim().toLowerCase();
        const correct = phrases[currentIndex].answer.toLowerCase();

        if (normalized === correct) {
            setCorrectCount((prev) => prev + 1);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }

        const delay = normalized === correct ? 800 : 4000;

        setTimeout(() => {
            if (currentIndex + 1 < phrases.length) {
                setCurrentIndex((prev) => prev + 1);
                setInput('');
                setFeedback(null);
                setSubmitting(false);
            } else {
                updateProgressAndFinish();
            }
        }, delay);
    };

    const updateProgressAndFinish = async () => {
        try {
            const newProgress = Math.min(task.progress + task.weight, 100);
            await updateUserTaskProgress(task.id, newProgress);
        } catch (error) {
            console.error('Erro ao atualizar progresso da tarefa:', error);
        } finally {
            setFinished(true);
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center items-center">
                <ActivityIndicator size="large" color="#4f46e5" />
                <Text className="mt-4 text-gray-600">Loading phrases...</Text>
            </SafeAreaView>
        );
    }

    if (finished) {
        const passed = correctCount >= 3;
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
                <Ionicons
                    name={passed ? 'checkmark-circle-outline' : 'close-circle-outline'}
                    size={96}
                    color={passed ? '#16a34a' : '#dc2626'}
                    className="mb-4"
                />
                <Text className="text-4xl font-bold text-gray-800 mb-2">{passed ? 'YOU WIN!' : 'YOU LOST'}</Text>
                <Text className="text-base text-gray-500 mb-6">
                    You translated {correctCount} of {phrases.length} correctly.
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="bg-indigo-600 px-6 py-3 rounded-xl"
                >
                    <Text className="text-white font-semibold">{passed ? 'Back to Tasks' : 'Try Again'}</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const current = phrases[currentIndex];

    return (
        <SafeAreaView className="flex-1 bg-white px-4 pt-6">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mb-4">
                <Ionicons name="chevron-back" size={24} color="#4f46e5" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-800 mb-4">{task.title}</Text>
            <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-700 mb-4">{current.text}</Text>
                <TextInput
                    value={input}
                    onChangeText={setInput}
                    placeholder="Digite a tradução em português"
                    className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
                />
                {feedback === 'correct' && (
                    <Text className="text-center font-medium text-green-600 mb-2">Correct!</Text>
                )}
                {feedback === 'incorrect' && (
                    <View className="mb-2">
                        <Text className="text-center font-medium text-red-600">Incorrect!</Text>
                        <Text className="text-sm text-center text-gray-600 mt-1">
                            Correct answer: <Text className="font-bold text-gray-800">{current.answer}</Text>
                        </Text>
                    </View>
                )}
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={submitting}
                    className={`bg-indigo-600 py-3 rounded-xl mt-2 ${submitting ? 'opacity-50' : ''}`}
                >
                    <Text className="text-white text-center font-semibold">Submit</Text>
                </TouchableOpacity>
            </View>
            <Text className="text-sm text-gray-500">
                Phrase {currentIndex + 1} of {phrases.length}
            </Text>
        </SafeAreaView>
    );
};

export default TaskVocabularyScreen;

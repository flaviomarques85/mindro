// src/screens/FinanceScreen.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { getUserPayments, createStripeSession, Payment, saveStripePayment } from '../services/paymentService';
import { useStripe } from '@stripe/stripe-react-native';

const FinanceScreen = () => {
    const { user } = useUser();
    const [showModal, setShowModal] = useState(false);
    const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const pixCode = 'b1a90788-ca1f-4953-84a8-dd431c9cb3c1';
    const stripe = useStripe();

    const fetchPayments = useCallback(
        async (options?: { refresh?: boolean }) => {
            const isRefresh = options?.refresh;
            if (!user?.id) {
                setInitialLoading(false);
                return;
            }

            if (isRefresh) {
                setRefreshing(true);
            } else {
                setInitialLoading(true);
            }

            try {
                const payments = await getUserPayments(user.id);
                setPaymentHistory(payments);
            } catch (err) {
                console.error('[FinanceScreen] Failed to fetch payments:', err);
            } finally {
                if (isRefresh) {
                    setRefreshing(false);
                } else {
                    setInitialLoading(false);
                }
            }
        },
        [user?.id]
    );

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    const handleCopy = async () => {
        await Clipboard.setStringAsync(pixCode);
        Toast.show({
            type: 'success',
            text1: 'Pix code copied to clipboard!',
            position: 'bottom',
            visibilityTime: 3000,
        });
    };
    //for only credit card payment
    const handleStripePayment = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const session = await createStripeSession(user.id);
            const clientSecret = session.clientSecret;

            const { error } = await stripe.initPaymentSheet({
                paymentIntentClientSecret: clientSecret,
                merchantDisplayName: 'Learn English',
            });
            if (error) throw error;

            const { error: paymentError } = await stripe.presentPaymentSheet();
            if (paymentError) throw paymentError;

            const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
            if (!paymentIntent?.id) throw new Error('Unable to retrieve payment intent');

            Toast.show({
                type: 'success',
                text1: 'Payment successful!',
                position: 'bottom',
            });
            setShowModal(false);
            await saveStripePayment(user.id, paymentIntent.id);
            await fetchPayments();
        } catch (err: any) {
            console.error('[handleStripePayment] Error:', err);
            Toast.show({
                type: 'error',
                text1: 'Payment failed',
                text2: err.message,
                position: 'bottom',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white px-4 py-6">
            <Text className="text-2xl font-bold text-gray-800 mb-6">Financial</Text>

            <View className="bg-indigo-100 p-6 rounded-xl mb-6">
                <Text className="text-gray-500 mb-1">Monthly Fee</Text>
                <Text className="text-3xl font-bold text-gray-800 mb-4">
                    {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(user?.monthlyFee ?? 0)}
                </Text>

                <Text className="text-gray-500 mb-1">Next Due Date</Text>
                <Text className="text-lg font-semibold text-gray-800 mb-4">
                    {user?.nextDueDate ? new Date(user.nextDueDate).toLocaleDateString('pt-BR') : ''}
                </Text>

                <TouchableOpacity className="bg-indigo-600 py-3 rounded-xl" onPress={() => setShowModal(true)}>
                    <Text className="text-white text-center font-semibold">Pay Now</Text>
                </TouchableOpacity>
            </View>

            <Text className="text-xl font-bold text-gray-800 mb-4">Payment History</Text>
            {initialLoading ? (
                <View className="flex-1 justify-center items-center py-12">
                    <ActivityIndicator size="large" color="#4f46e5" />
                </View>
            ) : (
                <FlatList
                    data={paymentHistory}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View className="flex-row justify-between items-center bg-gray-100 p-4 mb-2 rounded-xl">
                            <View>
                                <Text className="text-gray-800 font-semibold">{item.date}</Text>
                                <Text className="text-gray-500">{item.status}</Text>
                            </View>
                            <Text className="text-gray-800 font-semibold">{item.amount}</Text>
                        </View>
                    )}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchPayments({ refresh: true })} />}
                />
            )}

            {/* Modal de pagamento */}
            <Modal visible={showModal} transparent animationType="fade">
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }} className="justify-center items-center px-6">
                    <View className="bg-white w-full rounded-xl p-6">
                        <Text className="text-xl font-bold text-gray-800 mb-2">Payment awaiting confirmation</Text>
                        <Text className="text-gray-700 mb-4">
                            Copy the code below to pay via Pix using any supported app:
                        </Text>

                        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-3">
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="middle"
                                className="flex-1 text-gray-800 font-mono text-sm"
                            >
                                {pixCode}
                            </Text>
                            <TouchableOpacity onPress={handleCopy}>
                                <Ionicons name="clipboard-outline" size={20} color="#4f46e5" />
                            </TouchableOpacity>
                        </View>

                        <Text className="text-sm text-gray-500 mb-4">
                            If it is a temporary key, you have 45 minutes to make the payment. After that time, the key will be canceled.
                        </Text>

                        <TouchableOpacity onPress={handleCopy} className="bg-indigo-600 py-3 rounded-xl mb-3">
                            <Text className="text-white text-center font-semibold">Copy Pix code</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className={`bg-green-600 py-3 rounded-xl mb-3 ${loading ? 'opacity-50' : ''}`}
                            disabled={loading}
                            onPress={handleStripePayment}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text className="text-white text-center font-semibold">Pay with Card</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity className="bg-gray-200 py-3 rounded-xl" onPress={() => setShowModal(false)}>
                            <Text className="text-gray-700 text-center font-medium">Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Toast />
        </SafeAreaView>
    );
};

export default FinanceScreen;

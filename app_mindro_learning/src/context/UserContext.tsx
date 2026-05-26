import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type User = {
    id: string;
    name: string;
    email: string;
    profilePicture: string;
    joinedDate: string;
    monthlyFee: number;
    status: string;
    teacherId: string;
    nextDueDate: Date;
};

type UserContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => { },
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userState, setUserState] = useState<User | null>(null);

    useEffect(() => {
        const loadUserFromStorage = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('user');
                if (storedUser) {
                    setUserState(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('[UserProvider] Failed to load user from storage:', error);
            }
        };

        loadUserFromStorage();
    }, []);

    const setUser = async (newUser: User | null) => {
        try {
            if (newUser) {
                await AsyncStorage.setItem('user', JSON.stringify(newUser));
            } else {
                await AsyncStorage.removeItem('user');
            }
            setUserState(newUser);
        } catch (error) {
            console.error('[UserProvider] Failed to set user:', error);
        }
    };

    return (
        <UserContext.Provider value={{ user: userState, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);

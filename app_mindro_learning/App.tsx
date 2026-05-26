// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StripeProvider } from '@stripe/stripe-react-native';
import Toast from 'react-native-toast-message';
import RootNavigator from './src/navigation';
import { UserProvider } from './src/context/UserContext';
import "./global.css";
import Constants from 'expo-constants';

export default function App() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      await SplashScreen.preventAutoHideAsync();
      //await loadDatabase();
      setAppReady(true);
      await SplashScreen.hideAsync();
    };
    prepare();
  }, []);

  if (!appReady) return null;

  return (
    <StripeProvider publishableKey={Constants.expoConfig?.extra?.STRIPE_PUBLISHABLE_KEY}>
      <SafeAreaProvider>
        <UserProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <RootNavigator />
            <Toast />
          </NavigationContainer>
        </UserProvider>
      </SafeAreaProvider>
    </StripeProvider>
  );
}



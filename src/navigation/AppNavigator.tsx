import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';
import {useAuth} from '../hooks/use-auth';

// Import Screens
import {LoginScreen} from '../screens/LoginScreen';
import {RegisterScreen} from '../screens/RegisterScreen';
import {ForgotPasswordScreen} from '../screens/ForgotPasswordScreen';
import {HomeScreen} from '../screens/HomeScreen';
import {AccountScreen} from '../screens/AccountScreen';
import {SplashScreen} from '../screens/SplashScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const {user, isInitializing} = useAuth();

  if (isInitializing) {
    return <SplashScreen />;
  }

  return (
    <>
      <NavigationContainer>
        {user ? (
          // User is authenticated - Show Home screen
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: 'fade',
            }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="Account"
              component={AccountScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
          </Stack.Navigator>
        ) : (
          // User is NOT authenticated - Show Auth screens
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </>
  );
};

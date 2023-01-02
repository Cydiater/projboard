import { MantineProvider } from '@mantine/core';
import { Header } from './Header';
import LoginOrSignup from './LoginOrSignup';
import { initUser, UserContext, userReducer } from './context';
import { useReducer } from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import { NotificationsProvider } from '@mantine/notifications';
import { AuthProvider } from './auth';

const queryClient = new QueryClient();

export default function App() {
    const [user, dispatchUser] = useReducer(userReducer, initUser);

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <NotificationsProvider>
                <UserContext.Provider value={[user, dispatchUser]}>
                    <QueryClientProvider client={queryClient}>
                        <AuthProvider>
                            <Header />
                            <Routes>
                                <Route path="login" element={<LoginOrSignup login={true} />}/>
                                <Route path="signup" element={<LoginOrSignup login={false} />}/>
                            </Routes>
                        </AuthProvider>
                    </QueryClientProvider>
                </UserContext.Provider>
            </NotificationsProvider>
        </MantineProvider>
    );
}

import { MantineProvider } from '@mantine/core';
import { Header } from './Header';
import LoginOrSignup from './LoginOrSignup';
import Home from './Home';
import User from './User';
import Project from './Project';
import { initUser, UserContext, userReducer } from './context';
import { useReducer } from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import { NotificationsProvider } from '@mantine/notifications';
import { AuthProvider } from './auth';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)

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
                                <Route 
                                    path="/login" 
                                    element={<LoginOrSignup login={true} />}
                                />
                                <Route 
                                    path="/signup" 
                                    element={<LoginOrSignup login={false} />}
                                />
                                <Route 
                                    path="/users/:user_id" 
                                    element={<User />}
                                />
                                <Route 
                                    path="/users/:user_id/projects/:project_id"
                                    element={<Project />}
                                />
                                <Route 
                                    path="/" 
                                    element={<Home />}
                                />
                            </Routes>
                        </AuthProvider>
                    </QueryClientProvider>
                </UserContext.Provider>
            </NotificationsProvider>
        </MantineProvider>
    );
}

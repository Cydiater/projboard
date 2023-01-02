import { MantineProvider } from '@mantine/core';
import { Header } from './Header';
import LoginOrSignup from './LoginOrSignup';
import { initUser, UserContext, userReducer } from './context';
import { useReducer } from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import { NotificationsProvider } from '@mantine/notifications';


const queryClient = new QueryClient();

export default function App() {
    const [user, dispatchUser] = useReducer(userReducer, initUser);

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <NotificationsProvider>
                <UserContext.Provider value={[user, dispatchUser]}>
                    <QueryClientProvider client={queryClient}>
                        <Header />
                        <Routes>
                            <Route path="login" element={<LoginOrSignup login={true} />}/>
                            <Route path="signup" element={<LoginOrSignup login={false} />}/>
                        </Routes>
                    </QueryClientProvider>
                </UserContext.Provider>
            </NotificationsProvider>
        </MantineProvider>
    );
}

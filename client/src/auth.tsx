import axios, { AxiosRequestConfig } from 'axios';
import { configure } from 'axios-hooks';
import React, { useContext, useEffect } from 'react';
import { QueryClient, useMutation, useQuery, useQueryClient } from 'react-query';
import { login, auth_refresh_url } from './api';
import { UserContext } from './context';
import { showNotification } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';

interface LoginReq {
    username: string;
    password: string;
}

interface TokenInfo {
    token: string;
    name: string;
    is_student: boolean;
    exp: string;
    id: number,
}

const AuthContext = React.createContext<any>({});

const loginRequest = async ({username, password}: LoginReq): Promise<TokenInfo> => {
    const { token, exp, name, is_student, id } = await login(
        username,
        password
    );
    return { token, exp, name, is_student, id };
};

const refreshRequest = async (): Promise<TokenInfo> => {
    const resp = await axios.get<TokenInfo>(
        auth_refresh_url
    );
    const { token, exp, name, is_student, id } = resp.data;
    return { token, exp, name, is_student, id };
};

function AuthProvider(props: any) {
    const token = localStorage.getItem('token');
    const accessTokenRef = React.useRef<string>();
    if (token !== null) {
        accessTokenRef.current = token;
    }
    const [_tokenExpires, setTokenExpires] = React.useState<string>();
    const navigate = useNavigate();
    const [user, dispatchUser] = useContext(UserContext);
    const queryClient = useQueryClient();

    const authed = (data: TokenInfo) => {
        accessTokenRef.current = data.token;
        localStorage.setItem('token', data.token);
        setTokenExpires(data.exp);
        if (user.name.length === 0) {
            dispatchUser({
                type: "set",
                payload: {
                    name: data.name,
                    is_student: data.is_student,
                    id: data.id,
                }
            });
            setTimeout(() => {
                queryClient.invalidateQueries("projects");
            }, 1000);
        }
    }

    const loginQuery = useMutation(loginRequest, {
        onSuccess: (d) => {
            authed(d);
            showNotification({
                message: "Login succeed",
            });
            navigate("/");
        },
        onError: (error: Error) => {
            showNotification({
                color: 'red',
                title: "Login failed",
                message: error.message,
            })
        }
    });

    useEffect(() => {
        axios.interceptors.request.use(
            (config: AxiosRequestConfig): AxiosRequestConfig => {
                config.headers!.Authorization = `Bearer ${accessTokenRef.current}`;
                config.withCredentials = true;
                return config;
            }
        );

        axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                return Promise.reject(error);
            }
        );

        configure({ axios });
    }, []);

    useQuery({
        queryFn: refreshRequest,
        queryKey: ["refresh"],
        onSuccess: authed,
        refetchOnWindowFocus: false,
        refetchInterval: 1 * 60 * 60 * 1000, // refetch after one hour 
        enabled: accessTokenRef.current != undefined && accessTokenRef.current.length > 0,
    });

    const logout = () => {
        localStorage.removeItem("token");
        dispatchUser({ 'type': 'logout' });
        navigate("/");
        accessTokenRef.current = '';
    }

    return (
        <AuthContext.Provider
            value={{
                do_login: loginQuery,
                    logout,
            }}
            {...props}
        ></AuthContext.Provider>
    );
}

const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error("AuthContext must be within AuthProvider");
    }

    return context;
};

export { useAuth, AuthProvider };

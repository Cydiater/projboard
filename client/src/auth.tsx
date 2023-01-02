import axios, { AxiosRequestConfig } from 'axios';
import { configure } from 'axios-hooks';
import React, { useEffect } from 'react';
import { useMutation, useQuery } from 'react-query';
import { login, auth_refresh_url } from './api';
import { showNotification } from '@mantine/notifications';

interface LoginReq {
    username: string;
    password: string;
}

interface TokenInfo {
    token: string;
    exp: string;
}

const AuthContext = React.createContext<any>({});

const loginRequest = async ({username, password}: LoginReq): Promise<TokenInfo> => {
    const { token, exp } = await login(
        username,
        password
    );
    return { token, exp };
};

const refreshRequest = async (): Promise<TokenInfo> => {
    // it is important that you use axios when fetching the refresh-token, that way we know the cookie
    // with the refresh-token is included
    interface AuthRefreshResp {
        token: string;
        exp: string,
    }
    const resp = await axios.get<AuthRefreshResp>(
        auth_refresh_url
    );
    const { token, exp } = resp.data;
    return { token, exp };
};

function AuthProvider(props: any) {
    const accessTokenRef = React.useRef<string>();
    const [_, setTokenExpires] = React.useState<string>();

    const loginQuery = useMutation(loginRequest, {
        onSuccess: (data) => {
            accessTokenRef.current = data.token;
            setTokenExpires(data.exp);
            showNotification({
                message: "Login succeed",
            });
        },
        onError: (error: Error) => {
            showNotification({
                color: 'red',
                title: "Login failed",
                message: error.message,
            })
        }
    });

    const enableRefresh: boolean = accessTokenRef.current != undefined && accessTokenRef.current.length > 0;

    const refreshQuery = useQuery({
        queryFn: refreshRequest,
        queryKey: ["refresh"],
        onSuccess: (data: TokenInfo) => {
            accessTokenRef.current = data.token;
            setTokenExpires(data.exp);
        },
        refetchInterval: 300000,
        enabled: enableRefresh,
    });

    useEffect(() => {
        // add authorization token to each request
        axios.interceptors.request.use(
            (config: AxiosRequestConfig): AxiosRequestConfig => {
                config.headers!.authorization = `Bearer ${accessTokenRef.current}`;
                // this is important to include the cookies when we are sending the requests to the backend.
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

        // configure axios-hooks to use this instance of axios
        configure({ axios });
    }, []);

    const isSuccess = loginQuery.isSuccess || refreshQuery.isSuccess;
    const isAuthenticated = isSuccess && !!accessTokenRef.current;
    // if you need a user object you can do something like this.
    // const user = refreshQuery.data.user || loginQuery.data.user;


    // example on provider
    return (
        <AuthContext.Provider
            value={{
                isAuthenticated, do_login: loginQuery,
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

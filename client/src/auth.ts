import axios from 'axios';
import React from 'react';
import { useMutation } from 'react-query';

const loginRequest = async (username: string, password: string) => {
    const { token, ...otherDataYouMightNeed } = await yourBackendLoginRequest(
    username,
    password
  );
  return { token, otherDataYouMightNeed };
};

const refreshRequest = async () => {
  // it is important that you use axios when fetching the refresh-token, that way we know the cookie
  // with the refresh-token is included
  const { token, ...otherDataYouMightNeed } = await axios.get(
    "/your-refresh-token-endpoint"
  );
  return { token, otherDataYouMightNeed };
};

function AuthProvider(props: any) {
  const accessTokenRef = React.useRef<string>();
  const [tokenExpires, setTokenExpires] = React.useState<string>();

  const loginQuery = useMutation(loginRequest, {
    onSuccess: (data) => {
      // here we rely on the returned data contains the user, the token and its expiration date.
      accessTokenRef.current = data.token;
      setTokenExpires(data.tokenExpires);
    },
  });

  // this request should not have to include any logic as we are sending the token value with the cookies.
  const refreshQuery = useMutation(refreshRequest, {
    onSuccess: (data) => {
      // the refresh-token request should return similiar data as the loginRequest.
      accessTokenRef.current = data.token;
      setTokenExpires(data.tokenExpires);
    },
    // here we set a refetch-interval to avoid us sending a request without a valid access token.
    // you can either hardcode this value or calculate the diff until your token expires.
    refetchInterval: 300000,
  });

  const login = async (username: string, password: string) => {
    await loginQuery.mutateAsync(username, password);
    // you might want to wrap this in try / catch to handle errors and alert the user
    // if the username/password is incorrect.
  };

  useEffect(() => {
    // add authorization token to each request
    axios.interceptors.request.use(
      (config: AxiosRequestConfig): AxiosRequestConfig => {
        config.baseURL = BASE_URL;
        config.headers.authorization = `Bearer ${accessTokenRef.current}`;
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

  const isSuccess = loginQuery.isSuccess || refetchQuery.isSuccess;
  const isAuthenticated = isSuccess && !!accessTokenRef.current;
  // if you need a user object you can do something like this.
  const user = refetchQuery.data.user || loginQuery.data.user;

  // example on provider
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
      }}
      {...props}
    ></AuthContext.Provider>
  );
}

import axios, { isAxiosError } from 'axios';

const signup_uri = "/api/users/";
const login_url = "/api/auth/login/";
const auth_refresh_url = "/api/auth/refresh";

async function create_user(username: string, password: string, is_student: boolean) {
    const params = new URLSearchParams();
    params.append('user[name]', username);
    params.append('user[password]', password);
    params.append('user[is_student]', is_student ? 'true' : 'false');
    try {
        return await axios.post(signup_uri, params);
    } catch(e: any) {
        if (isAxiosError(e)) {
            if (e.response!.status < 500) {
                throw Error(e.response!.data.msg);
            }
        }
        throw Error("Server error");
    }
}

async function login(username: string, password: string) {
    const params = new URLSearchParams();
    params.append('name', username);
    params.append('password', password);
    try {
        const resp = await axios.post(login_url, params);
        return { token: resp.data.token, exp: resp.data.exp };
    } catch (e: any) {
        if (isAxiosError(e)) {
            if (e.response!.status == 401) {
                throw Error("Wrong username or password")
            } else if (e.response!.status < 500) {
                throw Error(e.response!.data.msg);
            }
        }
        throw Error("Server error");
    }
}

export { create_user, login, auth_refresh_url };

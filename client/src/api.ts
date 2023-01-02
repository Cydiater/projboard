import axios, { isAxiosError } from 'axios';

const signup_uri = "/api/users/";

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
            } else {
                throw Error("Server error");
            }
        }
    }
}

export { create_user };

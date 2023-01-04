import axios, { isAxiosError } from 'axios';
import { UserContext } from './context';
import { useContext } from 'react';

const signup_uri = "/api/users/";
const login_url = "/api/auth/login/";
const auth_refresh_url = "/api/auth/refresh";
const projects_url = "/api/projects";
const users_url = "/api/users";

async function delete_project(user_id: number, project_id: number) {
    try {
        const url = users_url + "/" + user_id  + "/projects/" + project_id ;
        return await axios.delete(url);
    } catch(e: any) {
        if (isAxiosError(e)) {
            if (e.response!.status == 401) {
                throw Error("You are not allowed to delete projects of others");
            }
        }
        throw Error("Server error");
    }
}

async function create_project(user_id: number, title: string, info: string) {
    const params = new URLSearchParams();
    params.append("project[title]", title);
    params.append("project[info]", info);
    const url = users_url + "/" + user_id + "/" + "projects";
    try {
        return await axios.post(url, params);
    } catch(e: any) {
        if (isAxiosError(e)) {
            if (e.response!.status == 401) {
                throw Error("You are not allowed to create project for others");
            } 
        }
        throw Error("Server error");
    }
}

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
        return { 
            token: resp.data.token, 
            exp: resp.data.exp, 
            name: resp.data.name, 
            is_student: resp.data.is_student,
            id: resp.data.id,
        };
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

interface ProjectInfo {
    title: string;
    info: string;
    project_id: number;
    user_id: number;
    user_name: string;
    user_is_student: boolean;
    project_created_at: string;
    attention_count: number;
    attention_id: number;
    discussion_count: number;
};

async function get_projects(user_id: any): Promise<ProjectInfo[]> {
    const resp = await axios.get(user_id.current == 0 ? projects_url : projects_url + `?user_id=${user_id.current}`)
    return resp.data
}

async function get_projects_for(user_id: number): Promise<ProjectInfo[]> {
    const url = users_url + "/" + user_id + "/projects";
    const resp = await axios.get(url);
    return resp.data;
}

async function update_project_for(user_id: number, project_id: number, title: string, info: string): Promise<void> {

    const url = users_url + "/" + user_id + "/projects/" + project_id;
    try {
        const params = new URLSearchParams();
        params.append("project[title]", title);
        params.append("project[info]", info);
        return await axios.patch(url, params);
    } catch(e: any) {
        if (isAxiosError(e)) {
            if (e.response!.status == 401) {
                throw Error("You are not allowed to update project for others");
            } 
        }
        throw Error("Server error");
    }
}

async function get_project_for(user_id: number, project_id: number): Promise<ProjectInfo> {
    const url = users_url + "/" + user_id + "/projects/" + project_id;
    const resp = await axios.get(url);
    return resp.data;
}

interface DiscussionInfo {
    id: number;
    user_id: number;
    user_name: string;
    user_is_student: boolean;
    content: string;
    created_at: string;
}

async function get_discussions_for(user_id: number, project_id: number): Promise<DiscussionInfo[]> {
    const url = users_url + "/" + user_id + "/projects/" + project_id + "/discussions";
    const resp = await axios.get(url);
    return resp.data;

}

async function create_discussion_for(
    user_id: number, 
    project_id: number,
    content: string,
): Promise<void> {
    const url = users_url + "/" + user_id + "/discussions/";
    const params = new URLSearchParams();
    params.append("discussion[content]", content);
    params.append("discussion[project_id]", project_id.toString());
    try {
        return await axios.post(url, params);
    } catch(e: any) {
        if (isAxiosError(e)) {
            if (e.response!.status == 401)
                throw Error("You are not allowed to create discussion for other user")
        }
        throw Error("Server error");
    }
}

async function delete_discussion(user_id: number, id: number): Promise<void> {
    const url = users_url + "/" + user_id + "/discussions/" + id;
    try {
        return await axios.delete(url);
    } catch(e: any) {
        if (isAxiosError(e)) {
            if (e.response!.status == 401)
                throw Error("You are not allowed to delete discussion of other user")
        }
        throw Error("Server error");
    }
}

async function delete_attention(user_id: number, attention_id: number): Promise<void> {
    const url = users_url + "/" + user_id + "/attentions/" + attention_id;
    try {
        return await axios.delete(url);
    } catch(e: any) {
        if (isAxiosError(e)) {
            if (e.response!.status == 401)
                throw Error("You are not allowed to follow project for other user")
        }
        throw Error("Server error");
    }
}

async function create_attention(user_id: number, project_id: number): Promise<void> {
    const url = users_url + "/" + user_id + "/attentions";
    const params = new URLSearchParams();
    params.append("attention[project_id]", project_id.toString());
    try {
        return await axios.post(url, params);
    } catch(e: any) {
        if (isAxiosError(e)) {
            if (e.response!.status == 401)
                throw Error("You are not allowed to unfollow project for other user")
        }
        throw Error("Server error");
    }
}

export { 
    create_user, 
    login, 
    auth_refresh_url, 
    get_projects, 
    get_project_for,
    update_project_for,
    get_projects_for, 
    get_discussions_for,
    type ProjectInfo, 
    type DiscussionInfo,
    create_project, 
    create_discussion_for,
    delete_project,
    delete_discussion,
    create_attention,
    delete_attention,
};

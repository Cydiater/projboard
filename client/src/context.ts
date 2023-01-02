import { createContext, Dispatch } from 'react';

interface User {
    name: string;
    is_student: boolean;
}

function userReducer(state: User, action: any): User {
    return {
        ...state,
        name: state.name + 'x'
    }
}

const initUser: User = {
    name: 'cydiater',
    is_student: false,
}

const UserContext = createContext<[User, Dispatch<any>]>([initUser, () => null]);

export { type User, initUser, userReducer, UserContext};

import { createContext, Dispatch } from 'react';

interface User {
    name: string;
    is_student: boolean;
    id: number;
}

function userReducer(state: User, action: any): User {
    switch (action.type) {
        case "set": {
            return {
                ...state,
                ...action.payload,
            } as User;
        }
        case "logout": {
            return initUser;
        }
        default:
            throw Error("Wrong reducer");
    }
}

const initUser: User = {
    name: '',
    is_student: false,
    id: 0,
}

const UserContext = createContext<[User, Dispatch<any>]>([initUser, () => null]);

export { type User, initUser, userReducer, UserContext};

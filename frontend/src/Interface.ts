export interface IUser {
    name: string;
    email: string
}

export interface IChat {
    chatName: string;
    isGroupChat: boolean;
    users: [IUser];
    _id: string
}

export interface IFullUser extends IUser {
    pic: string;
    token: string;
    _id: string
}



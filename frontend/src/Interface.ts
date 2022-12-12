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
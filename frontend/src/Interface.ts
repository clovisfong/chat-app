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

export interface IMessages {
    chat: {
        chatName: string;
        groupAdmin: string;
        isGroupChat: boolean;
        latestMessage: string;
        users: IUserMSg[]
        _id: string
    };
    content: string;
    sender: {
        name: string;
        pic: string;
        _id: string
    }
    _id: string
}

export interface IUserMSg {
    email: string;
    name: string;
    pic: string;
    _id: string;
}


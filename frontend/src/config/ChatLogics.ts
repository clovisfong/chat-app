import { IFullUser, IUser } from "../Interface"


export const getSender = (loggedUser: IFullUser | any, users: IFullUser[] | any) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name
}

export const getSenderFull = (loggedUser: IFullUser | any, users: IFullUser[] | any) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0]
}

export const isSameSender = (messages: any, m: any, i: any, userId: any) => {
    return (
        i < messages.length - 1 && // is correct, true
        (messages[i + 1].sender._id !== m.sender._id || // next msg is not same sender, true
            messages[i + 1].sender._id === undefined) &&
        messages[i].sender._id !== userId //is third party, true
    );
};

export const isLastMessage = (messages: any, i: any, userId: any) => {
    return (
        i === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id
    );
};



export const isSameSenderMargin = (messages: any, m: any, i: any, userId: any) => {
    // console.log(i === messages.length - 1);

    if (
        // current msg and next msg is third party  
        i < messages.length - 1 &&
        messages[i + 1].sender._id === m.sender._id &&
        messages[i].sender._id !== userId
    )
        return 33;
    else if (
        // next msg's sender is equal to current msg's sender 
        (i < messages.length - 1 &&
            messages[i + 1].sender._id !== m.sender._id &&
            messages[i].sender._id !== userId) ||

        // is last message and is third party
        (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
        return 0;
    else return "auto";
};

export const isSameUser = (messages: any, m: any, i: any) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id
}
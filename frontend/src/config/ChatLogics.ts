import { IFullUser, IUser } from "../Interface"


export const getSender = (loggedUser: IFullUser | any, users: IFullUser[] | any) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name
}

export const getSenderFull = (loggedUser: IFullUser | any, users: IFullUser[] | any) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0]
}
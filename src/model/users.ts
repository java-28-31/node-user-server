
export type User = {
    id: number,
    userName: string
}

const users:User[] = [
    {id:7, userName: "Bond"}
]

export const addUser = (user:User):boolean => {
    if(users.findIndex(item => item.id === user.id)!==-1)
        return false;
    users.push(user);
    return true;
}

export const getAllUsers = () => [...users]
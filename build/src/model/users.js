let users = [
    { id: 7, userName: "Bond" }
];
export const addUser = (user) => {
    if (users.findIndex(item => item.id === user.id) !== -1)
        return false;
    users.push(user);
    return true;
};
export const getAllUsers = () => [...users];
export const getUserById = (id) => {
    const result = users.find(item => item.id === id);
    return result;
};
export const deleteUser = (id) => {
    const result = users.find(item => item.id === id);
    users = users.filter(item => item.id !== id);
    return result;
};
export const updateUser = (id, newName) => {
    let result = false;
    const temp = users.find(item => item.id === id);
    if (temp) {
        temp.userName = newName;
        result = true;
    }
    return result;
};

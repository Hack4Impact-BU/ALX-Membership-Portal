import api from ".";

const endpoints = {
    getUsers: async () => {
        return await api('users')
    }
}

export default endpoints
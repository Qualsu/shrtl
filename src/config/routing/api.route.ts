export const API = {
    ROOT: "/",
    USERS: {
        GET: (account_id: string) => `/users/get/${account_id}`
    },
    URLS: {
        GET_ALL: (account_id: string) => `/urls/get_all/${account_id}`,
        GET: (short_id: string) => `/urls/get/${short_id}`,
        CREATE: "/urls/create",
        DELETE: "/urls/delete"
    },
    FILES: {
        GET_ALL: (account_id: string) => `/files/get_all/${account_id}`,
        GET: (short_id: string) => `/files/${short_id}`,
        UPLOAD: "/files/upload",
        DELETE: "/files/delete"
    }
}
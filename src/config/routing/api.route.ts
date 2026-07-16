export const API = {
    ROOT: "/",
    USERS: {
        GET: "/users/me"
    },
    URLS: {
        GET_ALL: "/urls/get_all",
        GET: (short_id: string) => `/urls/get/${short_id}`,
        CREATE: "/urls/create",
        DELETE: "/urls/delete"
    },
    FILES: {
        GET_ALL: "/files/get_all",
        GET: (short_id: string) => `/files/get/${short_id}`,
        UPLOAD: "/files/upload",
        DELETE: "/files/delete"
    }
}

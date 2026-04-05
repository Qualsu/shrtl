export const pages = {
    ROOT: "/",
    AUTH: "/auth/sign-in",
    URL: (base: string, shortId: string) => `${base}/${shortId}`,
    FILE: (base: string, shortId: string) => `${base}/files/${shortId}`
}
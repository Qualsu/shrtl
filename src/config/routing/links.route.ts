import { API_URL } from "../const/api.const";

const origin = typeof window !== "undefined" ? window.location.origin : "";

export const links = {
    QUALSU: "https://qual.su",
    GET_FILELINK: (short_id: string) => `${API_URL}/files/${short_id}`,
    GET_URL: (shortId: string) => `${origin}/${shortId}`,
    GET_FILE: (shortId: string) => `${origin}/file/${shortId}`,
    NORMALIZE: (url: string) => {
        const trimmedUrl = url.trim();
        const normalizedUrl = /^https?:\/\//i.test(trimmedUrl)
            ? trimmedUrl
            : `https://${trimmedUrl}`;

        return new URL(normalizedUrl).toString();
    },
}
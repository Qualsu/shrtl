export const links = {
    QUALSU: "https://qual.su",
    NORMALIZE: (url: string) => {
        const trimmedUrl = url.trim();
        const normalizedUrl = /^https?:\/\//i.test(trimmedUrl)
            ? trimmedUrl
            : `https://${trimmedUrl}`;

        return new URL(normalizedUrl).toString();
    },
}
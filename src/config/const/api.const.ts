import axios, { InternalAxiosRequestConfig } from "axios";

export const API_URL = process.env.NEXT_PUBLIC_QUALSU_API || "";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10_000,
});

let clerkTokenGetter: (() => Promise<string | null>) | null = null;

export function setClerkTokenGetter(getter: () => Promise<string | null>) {
  clerkTokenGetter = getter;
}

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (!clerkTokenGetter || config.headers.Authorization) {
    return config;
  }

  try {
    const token = await clerkTokenGetter();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
  }

  return config;
});

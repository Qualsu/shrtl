import axios from "axios";

export interface URLItem {
  short_id: string;
  url: string;
  views: number;
  account_id?: string;
}

export interface URLCreate {
  url: string;
}

const API_BASE = process.env.NEXT_PUBLIC_QUALSU_API || "";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getAll(account_id: string) {
  const res = await api.get("/urls/", { params: { account_id } });
  return res.data;
}

export async function createUrl(account_id: string, url: string) {
  const payload: URLCreate = { url };
  const res = await api.post("/urls/", payload, { params: { account_id } });
  return res.data;
}

export async function getUrl(short_id: string) {
  const res = await api.get(`/urls/${encodeURIComponent(short_id)}`);
  return res.data;
}

export async function deleteUrl(short_id: string) {
  const res = await api.delete(`/urls/${encodeURIComponent(short_id)}`);
  return res.data;
}

export async function incrementViews(short_id: string, increment = 1) {
  const res = await api.post(`/urls/${encodeURIComponent(short_id)}/views`, null, {
    params: { increment },
  });
  return res.data;
}

export default {
  getAll,
  createUrl,
  getUrl,
  deleteUrl,
  incrementViews,
};

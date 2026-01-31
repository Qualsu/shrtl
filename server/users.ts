import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_QUALSU_API || "";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getUser(account_id: string) {
  const res = await api.get(`/users/${encodeURIComponent(account_id)}`);
  return res.data;
}

export default {
  getUser
};

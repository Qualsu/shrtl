import { api } from "@/config/const/api.const";
import { API } from "@/config/routing/api.route";

export async function getAll() {
  const res = await api.get(API.URLS.GET_ALL);
  return res.data;
}

export async function getUrl(short_id: string) {
  const res = await api.get(API.URLS.GET(short_id));
  return res.data;
}

export async function createUrl(url: string) {
  const res = await api.post(API.URLS.CREATE, { url });
  return res.data;
}

export async function deleteUrl(short_id: string) {
  const res = await api.delete(API.URLS.DELETE, { data: { short_id } });
  return res.data;
}

export default {
  getAll,
  createUrl,
  getUrl,
  deleteUrl
};

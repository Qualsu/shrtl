import { api } from "@/config/const/api.const";
import { API } from "@/config/routing/api.route";

export async function getAll(account_id: string) {
  const res = await api.get(API.URLS.GET_ALL(account_id));
  return res.data;
}

export async function getUrl(short_id: string) {
  const res = await api.get(API.URLS.GET(short_id));
  return res.data;
}

export async function createUrl(account_id: string, url: string) {
  const res = await api.post(API.URLS.CREATE, { account_id, url });
  return res.data;
}

export async function deleteUrl(account_id: string, short_id: string) {
  const res = await api.delete(API.URLS.DELETE, { data: {account_id, short_id} });
  return res.data;
}

export default {
  getAll,
  createUrl,
  getUrl,
  deleteUrl
};

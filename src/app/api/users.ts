import { api } from "@/config/const/api.const";
import { API } from "@/config/routing/api.route";

export async function getUser(account_id: string) {
  const res = await api.get(API.USERS.GET(account_id));
  return res.data;
}

export default getUser
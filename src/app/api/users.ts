import { api } from "@/config/const/api.const";
import { API } from "@/config/routing/api.route";

export async function getUser() {
  const res = await api.get(API.USERS.GET);
  return res.data;
}

export default getUser

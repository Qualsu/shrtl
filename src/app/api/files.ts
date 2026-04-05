import { api } from "@/config/const/api.const";
import { API } from "@/config/routing/api.route";

export async function getAllFiles(account_id: string) {
  const res = await api.get(API.FILES.GET_ALL(account_id));
  return res.data;
}

export async function getFile(short_id: string) {
  const res = await api.get(API.FILES.GET(short_id));
  return res;
}

export async function uploadFile(account_id: string, file: File) {
  const formData = new FormData();
  formData.append("account_id", account_id);
  formData.append("file", file);
  const res = await api.post(API.FILES.UPLOAD, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function deleteFile(account_id: string, short_id: string) {
  const res = await api.delete(API.FILES.DELETE, { data: { account_id, short_id } });
  return res.data;
}

export default { getAllFiles, getFile, uploadFile, deleteFile };

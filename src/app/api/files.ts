import { api } from "@/config/const/api.const";
import { API } from "@/config/routing/api.route";
import { FileResponse } from "@/config/types/api.types";

export async function getAllFiles() {
  const res = await api.get(API.FILES.GET_ALL);
  return res.data;
}

export async function getFile(short_id: string) {
  const res = await api.get<FileResponse>(API.FILES.GET(short_id));
  return res.data;
}

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post(API.FILES.UPLOAD, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function deleteFile(short_id: string) {
  const res = await api.delete(API.FILES.DELETE, { data: { short_id } });
  return res.data;
}

export default { getAllFiles, getFile, uploadFile, deleteFile };

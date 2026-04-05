export interface URLItem {
  short_id: string;
  url: string;
  views: number;
  account_id?: string;
}

export interface URLCreate {
  url: string;
}

export interface FileItem {
  short_id: string;
  file_name: string;
  file_size: number;
  account_id?: string;
  downloads: number;
  expires_in_seconds: number
}
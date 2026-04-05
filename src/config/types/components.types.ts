export interface UrlCardProps {
  url: string;
  views: number;
  shortId: string;
  onCopy?: () => void;
  onDelete?: (shortId: string) => void;
}

export interface FileCardProps {
  shortId: string;
  file_name: string;
  file_size: number;
  downloads: number;
  expired: number;
  onDelete?: (shortId: string) => void;
}
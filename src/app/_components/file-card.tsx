"use client";

import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Copy, Download, X, Loader2, File } from "lucide-react";
import { toast } from "react-hot-toast";
import { deleteFile } from "../api/files";
import { toastConfig } from "@/config/const/toast.const";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { FileCardProps } from "@/config/types/components.types";
import { pages } from "@/config/routing/pages.route";
import { links } from "@/config/routing/links.route";

const formatRemaining = (secs: number) => {
  if (secs <= 0) return "Истёк";
  const days = Math.floor(secs / 86400);
  const hours = Math.floor((secs % 86400) / 3600);
  const minutes = Math.floor((secs % 3600) / 60);
  const seconds = secs % 60;
  if (days > 0) return `${days}д ${hours}ч ${minutes}м`;
  if (hours > 0) return `${hours}ч ${minutes}м`;
  if (minutes > 0) return `${minutes}м ${seconds}с`;
  return `${seconds}с`;
};

export default function FileCard({ shortId, file_name, file_size: _size, downloads, expired, onDelete }: FileCardProps) {
  const { userId } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [remaining, setRemaining] = useState<number>(expired);

  useEffect(() => {
    setRemaining(expired);
  }, [expired]);

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [remaining]);

  const fileUrl = links.GET_FILE(shortId);

  const openFile = () => {
    if (showDeleteDialog) return;
    window.open(fileUrl, "_blank");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fileUrl);
    toast.success("Ссылка скопирована!", toastConfig);
  };

  const handleDelete = async () => {
    if (!userId) {
      toast.error("Нужно войти в аккаунт", toastConfig);
      return;
    }

    setIsDeleting(true);
    try {
      await deleteFile(userId, shortId);
      toast.success("Файл удалён!", toastConfig);
      setShowDeleteDialog(false);
      onDelete?.(shortId);
    } catch (error) {
      console.error("Ошибка при удалении файла:", error);
      toast.error("Ошибка при удалении файла", toastConfig);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`rounded-2xl border border-border/90 bg-background/60 p-3 ${showDeleteDialog ? 'pointer-events-none opacity-80' : ''}`}>
      <div
        role="button"
        tabIndex={0}
        onClick={openFile}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openFile();
          }
        }}
        className="flex cursor-pointer flex-row items-center justify-between gap-3 max-[480px]:flex-col max-[480px]:items-start"
      >
        <div className="flex items-center gap-2 min-w-0">
        <File size={15} className="shrink-0 text-muted-foreground" />
        <Link
          href={fileUrl}
          target="_blank"
          onClick={(e) => e.stopPropagation()}
          className="truncate text-sm font-medium text-primary/90 max-w-[200px] transition-colors hover:text-primary hover:underline"
          title={file_name}
        >
          {file_name}
        </Link>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <button
          type="button"
          aria-label="Скопировать ссылку на файл"
          className="rounded-full h-8 w-8 flex items-center justify-center transition-colors hover:bg-accent/60 hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation();
            handleCopyLink();
          }}
        >
          <Copy size={15} />
        </button>
        
        <div className="flex flex-row items-center gap-1 whitespace-nowrap">
          <Link
            href={fileUrl}
            target="_blank"
            aria-label="Скачать файл"
            onClick={(e) => e.stopPropagation()}
            className="rounded-full h-8 w-8 flex items-center justify-center transition-colors hover:bg-accent/60 hover:text-foreground"
          >
            <Download size={15} /> 
          </Link>
          {downloads} <span>Скачиваний</span>
        </div>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              aria-label="Удалить файл"
                className="rounded-full h-8 w-8 flex items-center justify-center text-destructive transition-colors hover:bg-destructive/15"
              onClick={(e) => e.stopPropagation()}
            >
              <X size={16} />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Удалить файл?</AlertDialogTitle>
              <AlertDialogDescription>
                Вы уверены, что хотите удалить этот файл? Это действие
                невозможно отменить.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex justify-end gap-3">
              <AlertDialogCancel disabled={isDeleting}>Отмена</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin inline" />
                    Удаление...
                  </>
                ) : (
                  "Удалить"
                )}
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
        </div>
      </div>

      <div className="w-full text-xs text-muted-foreground mt-2">Осталось: {formatRemaining(remaining)}</div>
    </div>
  );
}

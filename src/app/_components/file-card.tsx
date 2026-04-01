"use client";

import { useState } from "react";
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
import { API } from "@/config/routing/api.route";
import { API_URL } from "@/config/const/api.const";
import Link from "next/link";
import { FileCardProps } from "@/config/types/components.types";

export default function FileCard({ shortId, file_name, file_size: _size, onDelete }: FileCardProps) {
  const { userId } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileUrl = `${API_URL}${API.FILES.GET(shortId)}`;

  const openFile = () => {
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
      className="flex cursor-pointer flex-row items-center justify-between gap-3 rounded-2xl border border-border/90 bg-background/60 p-3 max-[480px]:flex-col max-[480px]:items-start"
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
          className="rounded-full p-1.5 transition-colors hover:bg-accent/60 hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation();
            handleCopyLink();
          }}
        >
          <Copy size={15} />
        </button>

        <Link
          href={fileUrl}
          target="_blank"
          aria-label="Скачать файл"
          onClick={(e) => e.stopPropagation()}
          className="rounded-full p-1.5 transition-colors hover:bg-accent/60 hover:text-foreground"
        >
          <Download size={15} />
        </Link>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              aria-label="Удалить файл"
              className="rounded-full p-1.5 text-destructive transition-colors hover:bg-destructive/15"
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
  );
}

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
import { Copy, Eye, X, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { deleteUrl } from "../api/urls";
import Link from "next/link";
import { pages } from "@/config/routing/pages.route";
import { toastConfig } from "@/config/const/toast.const";
import { useAuth } from "@clerk/nextjs";
import { UrlCardProps } from "@/config/types/components.types";

export default function UrlCard({
  url,
  views,
  shortId,
  onCopy,
  onDelete,
}: UrlCardProps) {
  const { userId } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pages.SHRTL(baseUrl, shortId));
    toast.success("Ссылка скопирована!", toastConfig);
    onCopy?.();
  };

  const handleDeleteLink = async () => {
    if (!userId) {
      toast.error("Нужно войти в аккаунт", toastConfig);
      return;
    }

    setIsDeleting(true);
    try {
      await deleteUrl(userId, shortId);
      toast.success("Ссылка удалена!", toastConfig);
      setShowDeleteDialog(false);
      onDelete?.(shortId);
    } catch (error) {
      console.error("Ошибка при удалении ссылки:", error);
      toast.error("Ошибка при удалении ссылки", toastConfig);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-row items-center justify-between gap-3 rounded-2xl border border-border/90 bg-background/60 p-3 max-[480px]:flex-col max-[480px]:items-start">
      <Link href={pages.SHRTL(baseUrl, shortId)} target="_blank" className="text-sm font-medium text-primary/90 transition-colors hover:text-primary hover:underline">
        {baseUrl ? `${baseUrl}/${shortId}` : `/${shortId}`}
      </Link>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <button
          type="button"
          aria-label="Скопировать короткую ссылку"
          className="rounded-full p-1.5 transition-colors hover:bg-accent/60 hover:text-foreground"
          onClick={handleCopyLink}
        >
          <Copy size={15} />
        </button>

        <span className="flex flex-row items-center gap-x-1.5">
          <Eye size={15} /> {views} views
        </span>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              aria-label="Удалить ссылку"
              className="rounded-full p-1.5 text-destructive transition-colors hover:bg-destructive/15"
            >
              <X size={16} />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Удалить ссылку?</AlertDialogTitle>
              <AlertDialogDescription>
                Вы уверены, что хотите удалить эту ссылку? Это действие
                невозможно отменить.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex justify-end gap-3">
              <AlertDialogCancel disabled={isDeleting}>Отмена</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteLink} disabled={isDeleting}>
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

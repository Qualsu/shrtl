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
import { deleteUrl } from "../../../server/urls";

interface UrlCardProps {
  url: string;
  views: number;
  shortId: string;
  onCopy?: () => void;
  onDelete?: (shortId: string) => void;
}

export default function UrlCard({
  url,
  views,
  shortId,
  onCopy,
  onDelete,
}: UrlCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${baseUrl}/${shortId}`);
    toast.success("Ссылка скопирована!", {
      iconTheme: {
        primary: "#09090b",
        secondary: "#FFF",
      },
    });
    onCopy?.();
  };

  const handleDeleteLink = async () => {
    setIsDeleting(true);
    try {
      await deleteUrl(shortId);
      toast.success("Ссылка удалена!", {
        iconTheme: {
          primary: "#09090b",
          secondary: "#FFF",
        },
      });
      setShowDeleteDialog(false);
      onDelete?.(shortId);
    } catch (error) {
      console.error("Ошибка при удалении ссылки:", error);
      toast.error("Ошибка при удалении ссылки", {
        iconTheme: {
          primary: "#09090b",
          secondary: "#FFF",
        },
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-2.5 border-black dark:border-white border-2 dark:border-opacity-10 border-opacity-10 rounded flex-row max-[400px]:flex-col">
      <a href={`${baseUrl}/${shortId}`} target="_blank" className="text-blue-500 hover:underline text-sm">
        {baseUrl}/{shortId}
      </a>
      <div className="flex gap-3 items-center text-xs">
        <Copy
          size={16}
          className="cursor-pointer hover:scale-105"
          onClick={handleCopyLink}
        />

        <span className="flex flex-row gap-x-1">
          <Eye size={16} /> {views} views
        </span>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogTrigger asChild>
            <X size={20} className="cursor-pointer hover:scale-110 text-red-500" />
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

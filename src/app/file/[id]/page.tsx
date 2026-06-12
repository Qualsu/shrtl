"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getFile } from "@/app/api/files";
import NotFound from "@/app/not-found";
import { links } from "@/config/routing/links.route";
import { FileResponse } from "@/config/types/api.types";

const formatSize = (len: number) => {
  if (len >= 10 ** 6) return `${(len / 10 ** 6).toFixed(2)} MB`;
  return `${(len / 1000).toFixed(2)} KB`;
};

const resolveFileLink = (file: FileResponse, shortId: string) =>
  file.s3_url || file.file_url || file.download_url || file.url || links.GET_FILELINK(shortId);

export default function RedirectPage() {
  const params = useParams();
  const [notFound, setNotFound] = useState(false);
  const hasExecuted = useRef(false);
  const id = params?.id as string;

  const [size, setSize] = useState("");
  const [fileName, setFileName] = useState("");
  const [isImage, setIsImage] = useState(false);
  const [fileLink, setFileLink] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    if (!id || hasExecuted.current) return;
    hasExecuted.current = true;

    const loadFile = async () => {
      try {
        const file = await getFile(id);
        const nextIsImage = file.file_type?.startsWith("image/") ?? false;

        setFileName(file.filename || file.file_name || id);
        setSize(formatSize(file.file_size));
        setIsImage(nextIsImage);
        setIsImageLoading(nextIsImage);
        setFileLink(resolveFileLink(file, id));
      } catch (error) {
        console.error("Ошибка при получении файла:", error);
        setNotFound(true);
      }
    };

    loadFile();
  }, [id]);

  if (notFound) {
    return <NotFound text="Файл не найден" />;
  }

  return (
    <div className="m-3 flex min-h-screen flex-col items-center justify-center">
      {!fileName ? (
        <Loader2 className="h-8 w-8 animate-spin" />
      ) : (
        <section className="mx-auto w-full max-w-3xl rounded-3xl border border-border/90 bg-background/60 p-6 shadow-[0_16px_80px_-45px_rgba(0,0,0,0.7)]">
          <div className="flex flex-col items-start gap-6 md:flex-row">
            <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-muted/10 md:w-1/3">
              {isImage ? (
                <div className="relative flex h-full w-full items-center justify-center">
                  {isImageLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/10">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : null}

                  <img
                    src={fileLink}
                    alt={fileName}
                    onLoad={() => setIsImageLoading(false)}
                    onError={() => setIsImageLoading(false)}
                    className={`h-full w-full object-contain transition-opacity duration-300 ${
                      isImageLoading ? "opacity-0" : "opacity-100"
                    }`}
                  />
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Предпросмотр недоступен</div>
              )}
            </div>

            <div className="flex w-full flex-1 flex-col justify-between gap-4">
              <div>
                <h1 className="truncate text-2xl font-semibold">{fileName}</h1>
                <p className="mt-1 text-sm text-muted-foreground">Размер: {size}</p>
              </div>

              <div className="flex items-center gap-3">
                <Link href={fileLink} download={fileName} className="inline-block">
                  <Button>Скачать</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

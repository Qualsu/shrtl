"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { pages } from "@/config/routing/pages.route";
import { getFile } from "@/app/api/files";
import { links } from "@/config/routing/links.route";

const formatSize = (len: number) => {
    if (len >= 10 ** 6) return `${(len / 10 ** 6).toFixed(2)} MB`
    return `${(len / 1000).toFixed(2)} KB`
}

export default function RedirectPage() {
  const params = useParams();
  const [notFound, setNotFound] = useState(false);
  const hasExecuted = useRef(false);
  const id = params?.id as string;

  const [size, setSize] = useState("");
  const [fileName, setFileName] = useState("");
  const [isImage, setIsImage] = useState(false);
  
  useEffect(() => {
    if (!id || hasExecuted.current) return;
    hasExecuted.current = true;

    const redirect = async () => {
      try {
        const response = await getFile(id);
        const file = response.data

        const size = formatSize(file.file_size)
        const isImage = (file.file_type).startsWith("image/")

        setFileName(file.filename);
        setSize(size);
        setIsImage(isImage);

      } catch (error) {
        console.error("Ошибка при получении файла:", error);
        setNotFound(true);
      }
    };

    redirect();
  }, [id]);

  if (notFound) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-border/90 bg-card/80 p-8 text-center shadow-[0_16px_80px_-45px_rgba(0,0,0,0.7)] backdrop-blur">
          <h1 className="text-4xl font-semibold">404 ://</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">Файл не найден</p>
          <Link href={pages.ROOT}>
                <Button className="mt-6">Вернуться на главную</Button>
          </Link>
        </div>
      </div>
    );
  }

  const fileLink = links.GET_FILELINK(id);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center m-3">
      {!fileName ? (
        <Loader2 className="w-8 h-8 animate-spin" />
        ) : (
        <section className="w-full max-w-3xl mx-auto p-6 bg-background/60 border border-border/90 rounded-3xl shadow-[0_16px_80px_-45px_rgba(0,0,0,0.7)]">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-full md:w-1/3 flex items-center justify-center bg-muted/5 rounded-2xl">
              {isImage ? (
                <Image
                  src={fileLink}
                  alt={fileName}
                  width={400}
                  height={400}
                  className="max-h-48 w-full object-contain rounded-xl"
                />
              ) : (
                <div className="text-sm text-muted-foreground">Предпросмотр недоступен</div>
              )}
            </div>

            <div className="flex-1 flex flex-col justify-between w-full gap-4">
              <div>
                <h1 className="text-2xl font-semibold truncate">{fileName}</h1>
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

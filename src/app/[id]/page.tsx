"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { getUrl, incrementViews } from "../../../server/urls";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RedirectPage() {
  const router = useRouter();
  const params = useParams();
  const [notFound, setNotFound] = useState(false);
  const hasExecuted = useRef(false);
  const id = params?.id as string;

  useEffect(() => {
    if (!id || hasExecuted.current) return;
    hasExecuted.current = true;

    const redirect = async () => {
      try {
        const urlData = await getUrl(id);
        
        if (urlData.url) {
          await incrementViews(id);
          
          router.push(urlData.url);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Ошибка при получении ссылки:", error);
        setNotFound(true);
      }
    };

    redirect();
  }, [id]);

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <h1 className="text-4xl font-bold">404 ://</h1>
        <p className="text-xl opacity-50">Ссылка не найдена</p>
        <Link href="/">
            <Button>Вернуться на главную</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin" />
      <p className="mt-4 opacity-70">Перенаправление...</p>
    </div>
  );
}

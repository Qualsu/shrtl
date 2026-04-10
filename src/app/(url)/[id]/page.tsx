"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { pages } from "@/config/routing/pages.route";
import { getUrl } from "@/app/api/urls";
import NotFound from "@/app/not-found";

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
    return <NotFound text="Ссылка не найдена" />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin" />
      <p className="mt-4 text-sm text-muted-foreground">Перенаправление...</p>
    </div>
  );
}

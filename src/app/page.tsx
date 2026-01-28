"use client";

import Image from "next/image";
import Header from "./_components/header";
import Footer from "./_components/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import UrlCard from "./_components/card";
import { createUrl, getAll, URLItem } from "../../server/urls";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { isSignedIn, userId } = useAuth();
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [urls, setUrls] = useState<URLItem[]>([]);
  const [isLoadingUrls, setIsLoadingUrls] = useState(true);

  useEffect(() => {
    if (isSignedIn && userId) {
      loadUrls();
    } else {
      setIsLoadingUrls(false);
    }
  }, [isSignedIn, userId]);

  const loadUrls = async () => {
    try {
      setIsLoadingUrls(true);
      const data = await getAll(userId!);
      setUrls(data.urls || []);
    } catch (error) {
      console.error("Ошибка при загрузке ссылок:", error);
    } finally {
      setIsLoadingUrls(false);
    }
  };

  const handleShorten = async () => {
    if (!isSignedIn) {
      router.push("/auth/sign-in");
      return;
    }

    if (!url.trim()) {
      toast.error("Введите ссылку", {
        iconTheme: {
          primary: '#09090b',
          secondary: '#FFF',
        },
      });
      return;
    }

    if (!url.includes(".")) {
      toast.error("Введите корректную ссылку", {
        iconTheme: {
          primary: '#09090b',
          secondary: '#FFF',
        },
      });
      return;
    }

    setIsLoading(true);
    try {
      let finalUrl = url;
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        finalUrl = `https://${url}`;
      }

      try {
        new URL(finalUrl);
      } catch {
        toast.error("Введите корректную ссылку", {
          iconTheme: {
            primary: '#09090b',
            secondary: '#FFF',
          },
        });
        setIsLoading(false);
        return;
      }

      const result = await createUrl(userId!, finalUrl);
      toast.success("Ссылка сокращена!", {
        iconTheme: {
          primary: '#09090b',
          secondary: '#FFF',
        },
      });
      setUrl("");
      loadUrls();
    } catch (error) {
      toast.error("Ошибка при сокращении ссылки", {
        iconTheme: {
          primary: '#09090b',
          secondary: '#FFF',
        },
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="bg-white dark:bg-zinc-950 rounded-lg p-8 w-full max-w-md border-2 border-black dark:border-white dark:border-opacity-10 border-opacity-10">
          <Image src="/logo.svg" alt="Shortul Logo" width={160} height={40} className="mb-3"/>
          <p className="mb-6">Сокращайте и еще раз сокращайте</p>
          
          <Input 
            placeholder="Введите ссылку" 
            className="mb-4"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button 
            className="w-full mb-6"
            onClick={handleShorten}
            disabled={isLoading}
          >
            {isLoading ? "Сокращение..." : "Сократить"}
          </Button>
          
          <h2 className="text-lg font-bold mb-4">Недавние ссылки</h2>
          
          <div className="space-y-3">
            {isLoadingUrls ? (
              <Loader2 className="animate-spin mx-auto"/>
            ) : urls.length > 0 ? (
              urls.map((urlItem) => (
                <UrlCard 
                  key={urlItem.short_id}
                  url={urlItem.url}
                  shortId={urlItem.short_id}
                  views={urlItem.views}
                  onDelete={(id) => setUrls(urls.filter(u => u.short_id !== id))}
                />
              ))
            ) : isSignedIn ? (
              <p className="text-center opacity-50">Ссылок пока нет</p>
            ) : (
              <div className="text-center">
                <p className="opacity-70">Войдите чтобы начать сокращать ссылки</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

"use client";

import Image from "next/image";
import Header from "./_components/header";
import Footer from "./_components/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Eye } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [url, setUrl] = useState("");

  const handleShorten = () => {
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

    try {
      new URL(url);
    } catch {
      toast.error("Введите корректную ссылку", {
        iconTheme: {
          primary: '#09090b',
          secondary: '#FFF',
        },
      });
      return;
    }
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success("Ссылка скопирована!", {
      iconTheme: {
        primary: '#09090b',
        secondary: '#FFF',
      },
    });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="bg-white dark:bg-zinc-950 rounded-lg p-8 w-full max-w-md border-2 border-black dark:border-white dark:border-opacity-10 border-opacity-10">
          <Image src="/logo.svg" alt="Shortul Logo" width={160} height={40} className="mb-3"/>
          <p className="mb-6">Сокрщайте и еще раз сокращайте</p>
          
          <Input 
            placeholder="Введите ссылку" 
            className="mb-4"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button 
            className="w-full mb-6"
            onClick={handleShorten}
          >
            Сократить
          </Button>
          
          <h2 className="text-lg font-bold mb-4">Недавние ссылки</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border-black dark:border-white border-2 dark:border-opacity-10 border-opacity-10 rounded">
              <a href="#" className="text-blue-500 hover:underline text-sm">https://shrtl.ru/12345</a>
              <div className="flex gap-3 items-center text-xs">
              <Copy 
                size={16} 
                className="cursor-pointer hover:scale-105" 
                onClick={() => handleCopyLink("https://shrtl.ru/12345")}
              />
              <Eye size={16} />
              <span>1 views</span>
            </div>
          </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

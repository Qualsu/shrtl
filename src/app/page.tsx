"use client";

import { Suspense } from "react";
import Image from "next/image";
import Header from "./_components/header";
import Footer from "./_components/footer";
import UrlCard from "./_components/card";
import FileCard from "./_components/file-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { createUrl, getAll } from "./api/urls";
import { getAllFiles, uploadFile } from "./api/files";
import { getUser } from "./api/users";
import { URLItem, FileItem } from "@/config/types/api.types";
import { images } from "@/config/routing/images.route";
import { toastConfig } from "@/config/const/toast.const";
import { links } from "@/config/routing/links.route";
import { Upload } from "lucide-react";
import { pages } from "@/config/routing/pages.route";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

function HomeContent() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "urls"

  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [urls, setUrls] = useState<URLItem[]>([]);
  const [isLoadingUrls, setIsLoadingUrls] = useState(true);
  const [exceeded, setExceeded] = useState(false);
  const [exceededFiles, setExceededFiles] = useState(false);

  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn && userId) {
      loadUrls(userId);
      loadFiles(userId);
    } else {
      setUrls([]);
      setExceeded(false);
      setExceededFiles(false);
      setIsLoadingUrls(false);
      setFiles([]);
      setIsLoadingFiles(false);
    }
  }, [isLoaded, isSignedIn, userId]);

  const loadUrls = async (accountId: string) => {
    try {
      setIsLoadingUrls(true);
      const data = await getAll(accountId);
      setUrls(data.urls || []);
      
      const userData = await getUser(accountId);
      setExceeded(userData.exceeded || false);
      setExceededFiles(userData.exceeded_files || false);
    } catch (error) {
      console.error("Ошибка при загрузке ссылок:", error);
    } finally {
      setIsLoadingUrls(false);
    }
  };

  const loadFiles = async (accountId: string) => {
    try {
      setIsLoadingFiles(true);
      const data = await getAllFiles(accountId);
      setFiles(data.files || []);
    } catch (error) {
      console.error("Ошибка при загрузке файлов:", error);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleShorten = async () => {
    if (!isSignedIn) {
      router.push(pages.AUTH);
      return;
    }

    if (exceeded || exceededFiles) {
      toast.error("Лимит превышен", toastConfig);
      return;
    }

    if (!url.trim()) {
      toast.error("Введите ссылку", toastConfig);
      return;
    }

    if (!url.includes(".")) {
      toast.error("Введите корректную ссылку", toastConfig);
      return;
    }

    setIsLoading(true);
    try {
      const finalUrl = links.NORMALIZE(url);
      await createUrl(userId!, finalUrl);
      toast.success("Ссылка сокращена!", toastConfig);
      setUrl("");
      await loadUrls(userId!);
    } catch (error) {
      if (error instanceof TypeError) {
        toast.error("Введите корректную ссылку", toastConfig);
      } else {
        toast.error("Ошибка при сокращении ссылки", toastConfig);
      }

      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!isSignedIn) {
      router.push(pages.AUTH);
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error("Размер файла не должен превышать 10 МБ", toastConfig);
      return;
    }

    setIsUploading(true);
    try {
      await uploadFile(userId!, file);
      toast.success("Файл загружен!", toastConfig);
      await loadFiles(userId!);
    } catch (error) {
      toast.error("Ошибка при загрузке файла", toastConfig);
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const showSkeleton = !isLoaded || (isSignedIn && isLoadingUrls);
  const showFileSkeleton = !isLoaded || (isSignedIn && isLoadingFiles);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
        <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-border/80 bg-card/85 p-6 shadow-[0_16px_80px_-40px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-9">
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-accent/30 blur-3xl" />
          <div className="pointer-events-none absolute -left-24 -bottom-28 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative">
            <Image src={images.LOGO} alt="Shortul Logo" width={164} height={42} className="mb-4" />
            <p className="mb-7 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Быстро сокращайте ссылки и держите всё под рукой без лишнего шума
            </p>

            <Tabs value={tab} onValueChange={(v) => {router.replace(`/?tab=${v}`)}}>
              <TabsList className="mb-6 w-full">
                  <TabsTrigger value="urls" className="flex-1">Ссылки</TabsTrigger>
                  <TabsTrigger value="files" className="flex-1">Файлы</TabsTrigger>
              </TabsList>

              {tab !== "files" ? (
                <TabsContent value="urls">
                  <Input
                    placeholder="Введите ссылку"
                    className="mb-3 h-11 rounded-xl border-border/90 bg-background/65 px-4 text-sm shadow-none placeholder:text-muted-foreground/80 focus-visible:ring-2"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleShorten()}
                  />
                  <Button
                    className="mb-8 h-11 w-full rounded-xl text-sm font-semibold"
                    onClick={handleShorten}
                    disabled={isLoading}
                  >
                    {isLoading ? "Сокращение..." : "Сократить"}
                  </Button>

                  <h2 className="mb-4 flex items-center justify-between text-base font-semibold sm:text-lg">
                    <span>Недавние ссылки</span>
                    {exceeded && (
                      <span className="rounded-full px-2 py-1 text-xs font-medium text-red-400 text-right md:text-center">
                        лимит превышен {urls.length}/100
                      </span>
                    )}
                  </h2>

                  <div className="space-y-2.5">
                    {showSkeleton ? (
                      Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={index}
                          className="animate-pulse rounded-2xl border border-border/90 bg-background/50 p-3"
                        >
                          <div className="flex items-center justify-between gap-4 max-[400px]:flex-col max-[400px]:items-start">
                            <div className="h-4 w-40 rounded bg-muted" />
                            <div className="flex items-center gap-3">
                              <div className="h-4 w-4 rounded-full bg-muted" />
                              <div className="h-4 w-16 rounded bg-muted" />
                              <div className="h-5 w-5 rounded-full bg-muted" />
                            </div>
                          </div>
                        </div>
                      ))
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
                      <p className="rounded-2xl border border-dashed border-border/80 px-4 py-6 text-center text-sm text-muted-foreground">
                        Ссылок пока нет
                      </p>
                    ) : (
                      <p className="rounded-2xl border border-dashed border-border/80 px-4 py-6 text-center text-sm text-muted-foreground">
                        Войдите, чтобы начать сокращать ссылки
                      </p>
                    )}
                  </div>
                </TabsContent>
              ) : (
                <TabsContent value="files">
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileInputChange}
                  />
                  <div
                    className={`mb-8 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-4 py-10 transition-colors ${dragOver ? "border-primary/70 bg-primary/5" : "border-border/70 bg-background/40 hover:border-primary/50 hover:bg-background/60"}`}
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                        <span className="text-sm">Загрузка...</span>
                      </div>
                    ) : (
                      <>
                        <Upload size={28} className="text-muted-foreground/70" />
                        <div className="text-center">
                          <p className="text-sm font-medium text-foreground/80">Нажмите или перетащите файл</p>
                          <p className="mt-1 text-xs text-muted-foreground">Любой формат, до 10 МБ</p>
                        </div>
                      </>
                    )}
                  </div>

                  <h2 className="mb-4 text-base flex items-center justify-between font-semibold sm:text-lg">
                    Загруженные файлы
                    {exceededFiles && (
                      <span className="rounded-full px-2 py-1 text-xs font-medium text-red-400 text-right md:text-center">
                        лимит превышен {urls.length}/50
                      </span>
                    )}
                  </h2>

                  <div className="space-y-2.5">
                    {showFileSkeleton ? (
                      Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={index}
                          className="animate-pulse rounded-2xl border border-border/90 bg-background/50 p-3"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="h-4 w-48 rounded bg-muted" />
                            <div className="flex items-center gap-3">
                              <div className="h-4 w-4 rounded-full bg-muted" />
                              <div className="h-4 w-4 rounded-full bg-muted" />
                              <div className="h-5 w-5 rounded-full bg-muted" />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : files.length > 0 ? (
                      files.map((file) => (
                        <FileCard
                          key={file.short_id}
                          shortId={file.short_id}
                          file_name={file.file_name}
                          file_size={file.file_size}
                          onDelete={(id) => setFiles(files.filter(f => f.short_id !== id))}
                          downloads={file.downloads}
                          expired={file.expires_in_seconds}
                        />
                      ))
                    ) : isSignedIn ? (
                      <p className="rounded-2xl border border-dashed border-border/80 px-4 py-6 text-center text-sm text-muted-foreground">
                        Файлов пока нет
                      </p>
                    ) : (
                      <p className="rounded-2xl border border-dashed border-border/80 px-4 py-6 text-center text-sm text-muted-foreground">
                        Войдите, чтобы загружать файлы
                      </p>
                    )}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}

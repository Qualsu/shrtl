import { Button } from "@/components/ui/button";
import { pages } from "@/config/routing/pages.route";
import Link from "next/link";

type NotFoundProps = {
  text?: string
}

export default function NotFound({ text = "Страница не найдена" }: NotFoundProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-border/90 bg-card/80 p-8 text-center shadow-[0_16px_80px_-45px_rgba(0,0,0,0.7)] backdrop-blur">
          <h1 className="text-4xl font-semibold">404 ://</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">{text}</p>
          <Link href={pages.ROOT}>
              <Button className="mt-6">Вернуться на главную</Button>
          </Link>
        </div>
      </div>
  );
};
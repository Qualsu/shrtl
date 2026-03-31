import { links } from "@/config/routing/links.route";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mx-auto mb-5 mt-3 flex w-[min(960px,calc(100%-1rem))] items-center justify-between rounded-2xl border border-border/70 bg-card/60 px-4 py-3 text-xs text-muted-foreground backdrop-blur">
        <span>© 2021-2026</span>
        <Link href={links.QUALSU} className="font-medium text-foreground/80 transition-colors hover:text-foreground">
          Qualsu
        </Link>
    </footer>
  )
}

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { images } from "@/config/routing/images.route";
import { pages } from "@/config/routing/pages.route";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
        <nav className="sticky top-0 z-20 mx-auto mt-4 flex w-[min(960px,calc(100%-1rem))] items-center justify-between rounded-2xl border border-border/80 bg-card/75 px-3 py-2 backdrop-blur-xl sm:px-4">
        <Link href={pages.ROOT} className="flex items-center gap-2 rounded-xl px-2 py-1 transition-colors hover:bg-accent/40">
            <Image src={images.ICON} alt="Shortul icon" width={32} height={32} />
            <span className="text-sm font-semibold tracking-wide">Shrtl</span>
        </Link>
        <section className="flex items-center gap-4">
            <SignedIn>
                <UserButton/>
            </SignedIn>

            <SignedOut>
                <SignInButton>
                    <Button variant="ghost" className="h-9 px-3">Войти</Button>
                </SignInButton>
            </SignedOut>

            <ModeToggle />
        </section>
    </nav>
  )
}

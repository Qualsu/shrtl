import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="flex items-center justify-between p-4 border-b-black dark:border-b-white border-b-2 dark:border-opacity-10 border-opacity-10 dark:bg-zinc-950">
        <Link href="/">
            <Image src="/mini-logo.svg" alt="Shortul Logo" width={40} height={40} />
        </Link>
        <section className="flex items-center gap-4">
            <SignedIn>
                <UserButton/>
            </SignedIn>

            <SignedOut>
                <SignInButton>
                    <a href="/auth/sign-in">
                        <Button variant="ghost">Войти</Button>
                    </a>
                </SignInButton>
            </SignedOut>

            <ModeToggle />
        </section>
    </nav>
  )
}

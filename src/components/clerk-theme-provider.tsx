"use client"

import { useTheme } from "next-themes"
import { ClerkProvider } from "@clerk/nextjs"
import { ReactNode } from "react"
import { dark } from "@clerk/themes"

export function ClerkThemeProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme()

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      appearance={{
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
        variables: {
          colorPrimary: "hsl(var(--primary))",
          colorBackground: "hsl(var(--background))",
          colorInputBackground: "hsl(var(--input))",
          colorInputText: "hsl(var(--foreground))",
          colorText: "hsl(var(--foreground))",
          colorTextSecondary: "hsl(var(--muted-foreground))",
          colorDanger: "hsl(var(--destructive))",
          borderRadius: "var(--radius)",
        },
        elements: {
          card: "shadow-xl border border-border",
        },
      }}
    >
      {children}
    </ClerkProvider>
  )
}

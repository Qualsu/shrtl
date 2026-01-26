"use client"

import { useTheme } from "next-themes"
import { ClerkProvider } from "@clerk/nextjs"
import { ReactNode, useEffect, useState } from "react"
import { dark } from "@clerk/themes"

export function ClerkThemeProvider({ children }: { children: ReactNode }) {
  const [baseTheme, setBaseTheme] = useState<undefined | typeof dark>(undefined)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark' || savedTheme === null) {
      setBaseTheme(dark)
    } else {
      setBaseTheme(undefined)
    }
  }, [])

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      appearance={{
        baseTheme: baseTheme,
      }}
    >
      {children}
    </ClerkProvider>
  )
}

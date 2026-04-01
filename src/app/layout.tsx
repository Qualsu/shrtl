import type { Metadata } from "next";
import { Manrope } from 'next/font/google'
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkThemeProvider } from "@/components/clerk-theme-provider";
import { Toaster } from "react-hot-toast";

const font = Manrope({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: "Shrtl",
  description: "Сокращай и еще раз сокращай",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkThemeProvider>
        <html lang="ru">
          <body className={`${font.className} antialiased`}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
            <Toaster
              position="bottom-center"
              reverseOrder={false}
            />
            {children}
            </ThemeProvider>
          </body>
        </html>
    </ClerkThemeProvider>
  );
}

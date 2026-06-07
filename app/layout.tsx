import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

// Load Vazirmatn font with Arabic/Persian subsets and map it to our --font-sans variable
const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-sans",
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "کارگاه پاستاسازی لوزی",
  description: "یک بازی کوچک و سرگرم‌کننده برای حدس زدن انواع پاستا",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="fa-IR" 
      dir="rtl" 
      suppressHydrationWarning 
      className={vazirmatn.variable}
    >
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className={cn("min-h-screen bg-background text-foreground antialiased flex flex-col")}>
        {/* ThemeProvider manages the light/dark/system state */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Main container centers the game and gives it a max-width for a mobile-app feel */}
          <main className="flex-1 flex flex-col items-center justify-center p-4 w-full max-w-md mx-auto">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
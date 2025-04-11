
import { Geist } from "next/font/google";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { ThemeProvider } from "next-themes";
import "./globals.css"

export const metadata = {
  title: "Rinde App",
  description: "Aplicacion de Rendicion de Gastos",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  
  <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col">
            {/* Main Content */}
            <div className="flex-1">
              {children}
            </div>

            {/* Footer */}
            <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-8">
              <p>
                Powered by{" "}
                <a
                  href="https://www.klv.cl"
                  target="_blank"
                  className="font-bold hover:underline"
                  rel="noreferrer"
                >
                  KLV
                </a>
              </p>
              <ThemeSwitcher />
            </footer>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

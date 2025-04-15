
import { Lato } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/Navbar";



const lato = Lato({
  variable: "--font-geist-sans",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Rinde App",
  description: "Aplicacion de Rendicion de Gastos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={lato.variable}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col">
            {/* Main Content */}
            <Navbar />
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
              
            </footer>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

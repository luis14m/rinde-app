import { Lato } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/Navbar'
  


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
      <div className="flex flex-col min-h-screen">
            <div className="container max-w-4xl mx-auto px-4">
              <Navbar />
            </div>
            <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
              {children}
            </main>
            
          </div>
      </body>
    </html>
  );
}

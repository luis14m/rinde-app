import { Lato } from "next/font/google";
import "./globals.css";
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
       
        <main>{children}</main>
      </body>
    </html>
  );
}

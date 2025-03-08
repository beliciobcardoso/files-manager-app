import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// PrimeReact imports
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import 'primereact/resources/themes/lara-dark-indigo/theme.css';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Gerenciador de Arquivos",
  description: "Aplicativo para gerenciamento de arquivos usando Next.js e PrimeReact",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PrimeReactProvider value={{ 
          ripple: true,
          pt: {
            // Configurações globais para componentes PrimeReact
            card: {
              root: { className: 'bg-slate-800' },
              title: { className: 'text-white' },
              content: { className: 'text-white' }
            },
            dialog: {
              mask: { className: 'bg-black/60' }
            },
            datatable: {
              bodyRow: { className: 'text-white' }
            }
          }
        }}>
          {children}
        </PrimeReactProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ngekost — Tambah Kamar Massal & Duplikat Kamar',
  description: 'Aplikasi pengelolaan kamar kost modern untuk penambahan massal dan duplikasi unit kamar.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}

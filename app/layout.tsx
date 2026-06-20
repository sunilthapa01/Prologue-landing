import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://prologuelearn.com'),
  title: 'Prologue — Understand Anything by Touching It',
  description: 'Prologue is an interactive visual learning platform. Type any complex concept and interact with real-time simulations to build intuitive understanding.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

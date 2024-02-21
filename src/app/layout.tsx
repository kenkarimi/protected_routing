import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import AccountProvider from './_context/AccountProvider';
import Header from './_components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = { //only works in a server component.
  title: 'Protected Routing',
  description: 'Explores how protected routing is accomplished in NextJS 13 using middleware.',
}

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <AccountProvider>
          <Header/>
          <main>{children}</main>
        </AccountProvider>
      </body>
    </html>
  )
}

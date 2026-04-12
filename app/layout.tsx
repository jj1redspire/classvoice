import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'ClassVoice — Daily Reports Parents Love',
  description:
    'ClassVoice turns your 30-second voice note into a beautiful daily report for parents. Powered by AI, built for daycare teachers.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://classvoice.co'),
  openGraph: {
    title: 'ClassVoice — Daily Reports Parents Love. In 30 Seconds.',
    description:
      'Stop writing reports by hand. Talk about each child\'s day and AI creates beautiful, structured reports parents love.',
    url: 'https://classvoice.co',
    siteName: 'ClassVoice',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 600,
              borderRadius: '12px',
            },
          }}
        />
      </body>
    </html>
  )
}

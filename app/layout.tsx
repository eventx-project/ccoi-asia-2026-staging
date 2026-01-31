import './globals.css';
import BottomNav from './components/BottomNav';
import { BASE_PATH } from '../lib/utils';

export const metadata = {
  title: 'CCOI Asia 2026',
  description: 'Conference PWA for CCOI Asia 2026',
  icons: {
    icon: [
      { url: `${BASE_PATH}/favicon-32x32.png`, sizes: '32x32', type: 'image/png' },
      { url: `${BASE_PATH}/favicon-192x192.png`, sizes: '192x192', type: 'image/png' },
    ],
    apple: `${BASE_PATH}/apple-touch-icon.png`,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href={`${BASE_PATH}/manifest.json`} />
        <meta name="theme-color" content="#2E5B8D" />
      </head>
      <body className="flex flex-col h-screen bg-bgLight overflow-hidden">
        <div className="flex-1 overflow-y-auto pb-24 relative" id="main-content">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}

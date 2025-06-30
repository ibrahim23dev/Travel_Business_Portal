import './globals.css';
import { Providers } from './providers';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'FlightSearch - Book Your Flights',
  description: 'Search and book flights with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
'use client';

import Link from 'next/link';

export default function ConfirmationPage() {
  return (
    <div className="container mx-auto py-12 text-center">
      <h1 className="text-3xl font-bold mb-8">Booking Confirmed!</h1>
      <p className="text-lg mb-4">Thank you for your booking. You'll receive a confirmation email soon.</p>
      <Link
        href="/"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
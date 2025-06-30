// app/booking/[flightId]/page.tsx
import BookingForm from './BookingForm'; // নতুন ক্লায়েন্ট কম্পোনেন্ট

interface BookingPageProps {
  params: Promise<{ flightId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { flightId } = await params; // params কে await করা হলো

  return <BookingForm flightId={flightId} />;
}
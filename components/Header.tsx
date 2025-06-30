'use client';

import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { logout } from '../app/features/authSlice';

export default function Header() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  return (
    <header className="bg-blue-600 text-white p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          FlightSearch
        </Link>
        <nav>
          {isAuthenticated ? (
            <button
              onClick={() => dispatch(logout())}
              className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <Link href="/login" className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 transition">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}